"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { PartCondition, PartStatus } from "@/lib/generated/prisma/enums";

const VALID_CONDITIONS: PartCondition[] = [
  "NEW",
  "USED_LIKE_NEW",
  "USED_GOOD",
  "USED_OK",
  "USED_POOR",
];
const VALID_STATUSES: PartStatus[] = ["AVAILABLE", "RESERVED", "SOLD", "WITHDRAWN"];

function randomSuffix(len = 4) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function createPartAction(form: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/logga-in?portal=admin");

  const vehicleId = (form.get("vehicleId") as string)?.trim();
  const name = (form.get("name") as string)?.trim();
  if (!vehicleId) throw new Error("Välj en bil");
  if (!name) throw new Error("Namn krävs");

  const vehicle = await db.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) throw new Error("Bil hittades inte");

  let sku = ((form.get("sku") as string) ?? "").trim();
  if (!sku) sku = `${vehicle.stockNumber}-${randomSuffix()}`;

  const existing = await db.part.findUnique({ where: { sku } });
  if (existing) throw new Error(`SKU "${sku}" används redan`);

  const priceRaw = ((form.get("priceSek") as string) ?? "").trim();
  const price = priceRaw ? Number.parseInt(priceRaw, 10) : null;
  if (priceRaw && (!Number.isFinite(price) || (price ?? 0) < 0)) {
    throw new Error("Ogiltigt pris");
  }

  const condition = (form.get("condition") as PartCondition) || "USED_GOOD";
  const status = (form.get("status") as PartStatus) || "AVAILABLE";
  if (!VALID_CONDITIONS.includes(condition)) throw new Error("Ogiltigt skick");
  if (!VALID_STATUSES.includes(status)) throw new Error("Ogiltig status");

  const partCode = ((form.get("partCode") as string) ?? "").trim() || null;
  const oeNumber = ((form.get("oeNumber") as string) ?? "").trim() || null;
  const positionRaw = ((form.get("position") as string) ?? "").trim();
  const position = positionRaw ? Number.parseInt(positionRaw, 10) : null;
  const notes = ((form.get("notes") as string) ?? "").trim() || null;

  const created = await db.part.create({
    data: {
      sku,
      vehicleId,
      name,
      priceSek: price,
      condition,
      status,
      partCode,
      oeNumber,
      position,
      notes,
    },
  });

  revalidatePath("/admin/delar");
  redirect(`/admin/delar/${created.id}`);
}
