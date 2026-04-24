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

export async function savePartAction(id: string, form: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/logga-in?portal=admin");

  const name = (form.get("name") as string)?.trim();
  if (!name) throw new Error("Namn krävs");

  const priceRaw = (form.get("priceSek") as string)?.trim();
  const price = priceRaw ? Number.parseInt(priceRaw, 10) : null;
  if (priceRaw && (!Number.isFinite(price) || (price ?? 0) < 0)) {
    throw new Error("Ogiltigt pris");
  }

  const condition = form.get("condition") as PartCondition;
  const status = form.get("status") as PartStatus;
  if (!VALID_CONDITIONS.includes(condition)) throw new Error("Ogiltigt skick");
  if (!VALID_STATUSES.includes(status)) throw new Error("Ogiltig status");

  const partCode = ((form.get("partCode") as string) ?? "").trim() || null;
  const oeNumber = ((form.get("oeNumber") as string) ?? "").trim() || null;
  const positionRaw = ((form.get("position") as string) ?? "").trim();
  const position = positionRaw ? Number.parseInt(positionRaw, 10) : null;
  const notes = ((form.get("notes") as string) ?? "").trim() || null;

  await db.part.update({
    where: { id },
    data: { name, priceSek: price, condition, status, partCode, oeNumber, position, notes },
  });

  revalidatePath("/admin/delar");
  revalidatePath(`/admin/delar/${id}`);
}

export async function deletePartAction(id: string) {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/logga-in?portal=admin");

  await db.part.delete({ where: { id } });
  revalidatePath("/admin/delar");
  redirect("/admin/delar");
}
