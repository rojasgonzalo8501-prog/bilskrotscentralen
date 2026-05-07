/**
 * GDPR Article 20 — right to data portability.
 *
 * Returns a JSON dump of every record we hold for the logged-in user:
 * the User row itself, every Order matched on email, every Lead, plus
 * the line-items for orders. The download is gated to the session
 * owner; admins can't use this to download other users' data.
 *
 * Filename: `bilskrotscentralen-mina-uppgifter-<YYYY-MM-DD>.json`
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Inte inloggad", { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      role: true,
      active: true,
      totpEnabled: true,
      totpVerifiedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    return new NextResponse("Konto saknas", { status: 404 });
  }

  // Orders are not FK'd to User; we match on email like the rest of the
  // portal does. Drop any password-y / secret fields if they ever land
  // on Order in the future — none today.
  const orders = user.email
    ? await db.order.findMany({
        where: { email: user.email },
        include: {
          items: {
            select: {
              partSku: true,
              partName: true,
              priceSek: true,
              quantity: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const leads = user.email
    ? await db.lead.findMany({
        where: { email: user.email },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const exportedAt = new Date();

  const payload = {
    exportedAt: exportedAt.toISOString(),
    note:
      "Det här är all information vi har om dig i vårt system. Behöver du " +
      "den i annat format eller saknar något? Kontakta info@bilskrotscentralen.com.",
    user,
    orders,
    leads,
  };

  const date = exportedAt.toISOString().slice(0, 10);
  const filename = `bilskrotscentralen-mina-uppgifter-${date}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
