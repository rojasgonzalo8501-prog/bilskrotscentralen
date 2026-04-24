import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy for vehicle lookup via Bilprovningen's booking API.
 * GET /api/fordon?regnr=ABC123
 *
 * Uses boka.bilprovningen.se which serves live data from Transportstyrelsen,
 * completely free and without authentication.
 *
 * bookingStatus enum (from Bilprovningen source):
 *   0 = ok (normal, ready to book)
 *   1 = notificationBooked
 *   2 = timeForInspection   → besiktning förfallen
 *   3 = inspectionDone
 *   4 = vehicleBanned       → KÖRFÖRBUD
 *   5 = inspectionExemptVehicle
 *   6 = cancelledVehicle    → AVSTÄLLD
 *   7 = notConfirmed
 *   8 = unknown
 *   9 = inspectionUnavailable
 */

// Known brand prefixes (longest first to avoid prefix clashes)
const BRAND_PREFIXES = [
  "MERCEDES-BENZ",
  "ALFA ROMEO",
  "LAND ROVER",
  "VOLKSWAGEN",
  "MITSUBISHI",
  "CHEVROLET",
  "PEUGEOT",
  "RENAULT",
  "HYUNDAI",
  "PORSCHE",
  "POLESTAR",
  "CHRYSLER",
  "INFINITI",
  "CITROEN",
  "CITROËN",
  "TOYOTA",
  "NISSAN",
  "SUBARU",
  "SUZUKI",
  "JAGUAR",
  "LEXUS",
  "MAZDA",
  "HONDA",
  "SKODA",
  "ŠKODA",
  "TESLA",
  "VOLVO",
  "DODGE",
  "LANCIA",
  "SMART",
  "CUPRA",
  "DACIA",
  "MINI",
  "SAAB",
  "FIAT",
  "OPEL",
  "FORD",
  "AUDI",
  "SEAT",
  "JEEP",
  "BMW",
  "KIA",
  "MG",
  "DS",
];

/**
 * Parse vehicleName from Bilprovningen (which mirrors Transportstyrelsen data).
 *
 * TS uses two formats:
 *   "BRAND, ALIAS  TYPECODE"  →  comma present = alias + internal type code, no usable model
 *   "BRAND MODELNAME"         →  no comma = actual consumer model name follows brand
 */
function parseVehicleName(name: string): { brand: string; model: string } {
  const upper = name.toUpperCase().trim();

  for (const prefix of BRAND_PREFIXES) {
    if (upper.startsWith(prefix)) {
      const afterBrand = name.slice(prefix.length);
      if (afterBrand.trimStart().startsWith(",")) {
        return { brand: prefix, model: "" };
      }
      const model = afterBrand.replace(/^\s+/, "").trim();
      return { brand: prefix, model };
    }
  }

  const parts = name.split(/[\s,]+/);
  return { brand: parts[0] ?? name, model: parts.slice(1).join(" ") };
}

function parseStatus(code: number): {
  status: string;
  korförbud: boolean;
  avställd: boolean;
  label: string;
} {
  switch (code) {
    case 4:
      return { status: "vehicleBanned", korförbud: true, avställd: false, label: "Körförbud" };
    case 6:
      return { status: "cancelledVehicle", korförbud: false, avställd: true, label: "Avställd" };
    case 2:
      return { status: "timeForInspection", korförbud: false, avställd: false, label: "Besiktning förfallen" };
    case 5:
      return { status: "inspectionExempt", korförbud: false, avställd: false, label: "Besiktningsbefriat" };
    case 3:
      return { status: "inspectionDone", korförbud: false, avställd: false, label: "Besiktat och klart" };
    case 1:
      return { status: "notificationBooked", korförbud: false, avställd: false, label: "Tid bokad" };
    default:
      return { status: "ok", korförbud: false, avställd: false, label: "OK" };
  }
}

/** Parse a TS date string — returns null for the "epoch zero" sentinel 0001-01-01 */
function parseDate(val: string | null | undefined): string | null {
  if (!val) return null;
  if (val.startsWith("0001-01-01")) return null;
  return val.split("T")[0] ?? val.split(" ")[0] ?? null;
}

export async function GET(req: NextRequest) {
  const regnr = req.nextUrl.searchParams
    .get("regnr")
    ?.toUpperCase()
    .replace(/\s|-/g, "");

  if (!regnr) {
    return NextResponse.json({ error: "regnr saknas" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://boka.bilprovningen.se/api/v1/booking/vehicle?registrationNumber=${encodeURIComponent(regnr)}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
        cache: "no-store",
      },
    );

    if (res.status === 404) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    if (!res.ok) {
      return NextResponse.json({ error: `upstream_${res.status}` }, { status: 502 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json: any = JSON.parse(await res.text());

    if (!json.vehicleName) {
      return NextResponse.json({ error: "empty_response" }, { status: 422 });
    }

    const { brand, model } = parseVehicleName(json.vehicleName);
    const vehicleStatus = parseStatus(json.bookingStatus ?? 0);

    // senastBesiktad: last inspection date
    const senastBesiktad = parseDate(json.lastInspection);

    // besiktningGiltigTill: inspection valid until (null if expired/never)
    const besiktningGiltigTill = parseDate(json.inspectionDateUntil);

    // körförbudDeadline: two-month window to fix and re-inspect after injunction
    const körförbudDeadline = parseDate(json.twoMonthPeriodEndDateAtInjunction);

    return NextResponse.json({
      fabrikat: brand,
      model,
      year: typeof json.vehicleYear === "number" ? json.vehicleYear : null,
      color: json.color ?? null,
      // Status
      statusCode: json.bookingStatus ?? 0,
      status: vehicleStatus.status,
      statusLabel: vehicleStatus.label,
      körförbud: vehicleStatus.korförbud,
      avställd: vehicleStatus.avställd,
      // Inspection dates
      senastBesiktad,
      besiktningGiltigTill,
      körförbudDeadline,
      // Extra
      vehicleType: json.vehicleTypeName ?? null,  // "PB", "LLB" etc.
      city: json.city ?? null,
    });
  } catch {
    return NextResponse.json({ error: "network_error" }, { status: 503 });
  }
}
