"use server";

import { revalidatePath } from "next/cache";
import {
  importPartsCsv,
  importVehiclesCsv,
  type ImportResult,
} from "@/lib/inventory-import";

export type ImportActionState =
  | { ok: true; kind: "vehicles" | "parts"; result: ImportResult }
  | { ok: false; error: string }
  | null;

export async function uploadInventoryAction(
  _prev: ImportActionState,
  formData: FormData,
): Promise<ImportActionState> {
  const kind = formData.get("kind");
  const file = formData.get("file");

  if (kind !== "vehicles" && kind !== "parts") {
    return { ok: false, error: "Välj filtyp (fordon eller delar)" };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Ingen fil vald" };
  }

  let text: string;
  try {
    text = await file.text();
  } catch (err) {
    return {
      ok: false,
      error: `Kunde inte läsa fil: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  try {
    const result =
      kind === "vehicles"
        ? await importVehiclesCsv(file.name, text)
        : await importPartsCsv(file.name, text);

    revalidatePath("/admin/import");
    revalidatePath("/admin/inventory");

    return { ok: true, kind, result };
  } catch (err) {
    return {
      ok: false,
      error: `Import misslyckades: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
