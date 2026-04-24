"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

/* ─── Reg.nr lookup ─────────────────────────────────────────────────── */

export type VehicleData = {
  brandSlug: string;
  brandName: string;
  model: string;
  year: number | null;
  vin: string | null;
  registration: string;
  color: string | null;
  // Status
  körförbud: boolean;
  avställd: boolean;
  statusLabel: string;
  // Inspection dates
  senastBesiktad: string | null;
  besiktningGiltigTill: string | null;
  körförbudDeadline: string | null;
  vehicleType: string | null;
  city: string | null;
};

export type LookupState =
  | { ok: true; data: VehicleData }
  | { ok: false; error: string }
  | null;

/**
 * Maps Transportstyrelsen fabrikat strings → our internal slug.
 * Upper-cased input, prefix-match if needed.
 */
const FABRIKAT_TO_SLUG: Record<string, string> = {
  "MERCEDES-BENZ": "mercedes-benz",
  "MERCEDES": "mercedes-benz",
  "VOLVO": "volvo",
  "BMW": "bmw",
  "AUDI": "audi",
  "VOLKSWAGEN": "volkswagen",
  "VW": "volkswagen",
  "TOYOTA": "toyota",
  "FORD": "ford",
  "PEUGEOT": "peugeot",
  "OPEL": "opel",
  "SAAB": "saab",
  "RENAULT": "renault",
  "SKODA": "skoda",
  "ŠKODA": "skoda",
  "KIA": "kia",
  "HYUNDAI": "hyundai",
  "NISSAN": "nissan",
  "MAZDA": "mazda",
  "HONDA": "honda",
  "MITSUBISHI": "mitsubishi",
  "SUBARU": "subaru",
  "SUZUKI": "suzuki",
  "FIAT": "fiat",
  "ALFA ROMEO": "alfa-romeo",
  "ALFA": "alfa-romeo",
  "LANCIA": "lancia",
  "CITROEN": "citroen",
  "CITROËN": "citroen",
  "DS": "ds",
  "DACIA": "dacia",
  "SEAT": "seat",
  "CUPRA": "cupra",
  "MINI": "mini",
  "JAGUAR": "jaguar",
  "LAND ROVER": "land-rover",
  "LANDROVER": "land-rover",
  "PORSCHE": "porsche",
  "TESLA": "tesla",
  "POLESTAR": "polestar",
  "JEEP": "jeep",
  "CHEVROLET": "chevrolet",
  "CHRYSLER": "chrysler",
  "DODGE": "dodge",
  "LEXUS": "lexus",
  "INFINITI": "infiniti",
  "SMART": "smart",
  "MG": "mg",
  "BYD": "byd",
};

function fabrikatToSlug(fabrikat: string): string {
  const up = fabrikat.toUpperCase().trim();
  return FABRIKAT_TO_SLUG[up] ?? up.toLowerCase().replace(/\s+/g, "-");
}

export async function lookupRegAction(
  _prev: LookupState,
  formData: FormData,
): Promise<LookupState> {
  const raw = String(formData.get("regnr") ?? "").trim();
  const regnr = raw.toUpperCase().replace(/\s|-/g, "");
  if (!regnr) return { ok: false, error: "Ange ett registreringsnummer." };

  try {
    // Use our internal proxy route which adds browser-like headers
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(
      `${base}/api/fordon?regnr=${encodeURIComponent(regnr)}`,
      { cache: "no-store" },
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json: any = await res.json();

    if (res.status === 404 || json.error === "not_found") {
      return { ok: false, error: `Fordon med reg.nr "${raw}" hittades inte.` };
    }
    if (res.status === 422 || json.error === "empty_response") {
      return {
        ok: false,
        error: "Fordonsdatabasen gav inget svar. Fyll i uppgifterna manuellt.",
      };
    }
    if (!res.ok) {
      return {
        ok: false,
        error: "Kunde inte nå fordonsdatabasen. Fyll i uppgifterna manuellt.",
      };
    }

    return {
      ok: true,
      data: {
        brandSlug: fabrikatToSlug(json.fabrikat),
        brandName: json.fabrikat,
        model: json.model,
        year: typeof json.year === "number" ? json.year : null,
        vin: json.vin || null,
        registration: raw,
        color: json.color ?? null,
        körförbud: json.körförbud ?? false,
        avställd: json.avställd ?? false,
        statusLabel: json.statusLabel ?? "OK",
        senastBesiktad: json.senastBesiktad ?? null,
        besiktningGiltigTill: json.besiktningGiltigTill ?? null,
        körförbudDeadline: json.körförbudDeadline ?? null,
        vehicleType: json.vehicleType ?? null,
        city: json.city ?? null,
      },
    };
  } catch {
    return {
      ok: false,
      error:
        "Kunde inte nå fordonsdatabasen. Kontrollera anslutningen eller fyll i uppgifterna manuellt.",
    };
  }
}

/* ─── Auto-generate stock number ────────────────────────────────────── */

/**
 * Generates next stock number in format M-YYYY-NNNN.
 * Finds the highest existing number for the current year and increments.
 */
export async function nextStockNumberAction(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `M-${year}-`;

  const last = await db.vehicle.findFirst({
    where: { stockNumber: { startsWith: prefix } },
    orderBy: { stockNumber: "desc" },
    select: { stockNumber: true },
  });

  let seq = 1;
  if (last) {
    const parts = last.stockNumber.split("-");
    const n = parseInt(parts[2] ?? "0", 10);
    if (!isNaN(n)) seq = n + 1;
  }

  return `${prefix}${String(seq).padStart(4, "0")}`;
}

/* ─── Create vehicle ────────────────────────────────────────────────── */

export type CreateState =
  | { ok: true; stockNumber: string }
  | { ok: false; error: string }
  | null;

export async function createVehicleAction(
  _prev: CreateState,
  formData: FormData,
): Promise<CreateState> {
  const stockNumber = String(formData.get("stockNumber") ?? "").trim();
  const brandSlug = String(formData.get("brandSlug") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim();
  const yearRaw = formData.get("year");
  const year = yearRaw ? parseInt(String(yearRaw), 10) : null;
  const vin = String(formData.get("vin") ?? "").trim() || null;
  const registration = String(formData.get("registration") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!stockNumber) return { ok: false, error: "Lagernummer saknas." };
  if (!brandSlug) return { ok: false, error: "Välj märke." };
  if (!model) return { ok: false, error: "Ange modell." };

  try {
    await db.vehicle.create({
      data: {
        stockNumber,
        brandSlug,
        model,
        year: year && !isNaN(year) ? year : null,
        vin,
        registration,
        notes,
        status: "DISMANTLING",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Unique constraint") || msg.includes("UNIQUE constraint")) {
      return {
        ok: false,
        error: `Lagernummer "${stockNumber}" finns redan. Ange ett annat nummer.`,
      };
    }
    return { ok: false, error: `Kunde inte spara bilen: ${msg}` };
  }

  revalidatePath("/admin/bilar");
  revalidatePath("/admin/inventory");
  redirect("/admin/bilar");
}
