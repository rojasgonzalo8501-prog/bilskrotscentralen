"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const ALLOWED_STATUSES = ["AVAILABLE", "RESERVED", "SOLD", "WITHDRAWN"] as const;
type PartStatus = typeof ALLOWED_STATUSES[number];

export type BulkResult = { ok: true; count: number } | { ok: false; error: string };

const MAX_BULK = 500;

async function requireAdmin() {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return null;
  }
  return session;
}

/**
 * Update many parts' status in one go. Used by the admin bulk-action bar.
 */
export async function bulkUpdateStatus(
  ids: string[],
  status: string
): Promise<BulkResult> {
  const session = await requireAdmin();
  if (!session) return { ok: false, error: "Behörighet saknas." };

  if (!ALLOWED_STATUSES.includes(status as PartStatus)) {
    return { ok: false, error: "Okänd status." };
  }
  const cleanIds = [...new Set(ids.filter((s) => typeof s === "string" && s.length > 0))];
  if (cleanIds.length === 0) return { ok: false, error: "Inga delar valda." };
  if (cleanIds.length > MAX_BULK) {
    return { ok: false, error: `Max ${MAX_BULK} delar per åtgärd.` };
  }

  try {
    const r = await db.part.updateMany({
      where: { id: { in: cleanIds } },
      data: { status: status as PartStatus },
    });
    revalidatePath("/admin/delar");
    revalidatePath("/admin");
    return { ok: true, count: r.count };
  } catch (err) {
    console.error("[bulkUpdateStatus]", err);
    return { ok: false, error: "Något gick fel — kunde inte spara." };
  }
}

/**
 * Set the same price (in whole SEK) on many parts.
 * priceSek = null clears the price ("pris på förfrågan" mode).
 */
export async function bulkUpdatePrice(
  ids: string[],
  priceSek: number | null
): Promise<BulkResult> {
  const session = await requireAdmin();
  if (!session) return { ok: false, error: "Behörighet saknas." };

  if (priceSek != null) {
    if (!Number.isInteger(priceSek) || priceSek < 0 || priceSek > 10_000_000) {
      return { ok: false, error: "Ogiltigt pris." };
    }
  }

  const cleanIds = [...new Set(ids.filter((s) => typeof s === "string" && s.length > 0))];
  if (cleanIds.length === 0) return { ok: false, error: "Inga delar valda." };
  if (cleanIds.length > MAX_BULK) {
    return { ok: false, error: `Max ${MAX_BULK} delar per åtgärd.` };
  }

  try {
    const r = await db.part.updateMany({
      where: { id: { in: cleanIds } },
      data: { priceSek },
    });
    revalidatePath("/admin/delar");
    revalidatePath("/admin");
    return { ok: true, count: r.count };
  } catch (err) {
    console.error("[bulkUpdatePrice]", err);
    return { ok: false, error: "Något gick fel — kunde inte spara." };
  }
}
