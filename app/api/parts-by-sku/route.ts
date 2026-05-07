/**
 * GET /api/parts-by-sku?skus=A,B,C
 *
 * Returns light part metadata for the SKUs the wishlist client holds
 * in localStorage. Public (no auth) since wishlists are local to the
 * device — anyone could spam this with random SKUs and learn the same
 * thing they'd see by browsing /bildelar.
 *
 * Capped at 100 SKUs per call so a runaway client can't drag the DB.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const MAX_SKUS = 100;

export async function GET(req: NextRequest) {
  const skuParam = req.nextUrl.searchParams.get("skus") ?? "";
  const skus = [
    ...new Set(
      skuParam
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.length < 64)
    ),
  ].slice(0, MAX_SKUS);

  if (skus.length === 0) {
    return NextResponse.json({ parts: [] });
  }

  const parts = await db.part.findMany({
    where: { sku: { in: skus } },
    include: {
      vehicle: { select: { brandSlug: true, model: true, year: true } },
      images: { take: 1, orderBy: { sortOrder: "asc" } },
    },
  });

  // Preserve client's order (newest-first) by sorting on the input array.
  const order = new Map(skus.map((s, i) => [s, i]));
  parts.sort((a, b) => (order.get(a.sku) ?? 0) - (order.get(b.sku) ?? 0));

  return NextResponse.json({
    parts: parts.map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      priceSek: p.priceSek,
      status: p.status,
      brandSlug: p.vehicle.brandSlug,
      model: p.vehicle.model,
      year: p.vehicle.year,
      imageUrl: p.images[0]?.url ?? null,
    })),
  });
}
