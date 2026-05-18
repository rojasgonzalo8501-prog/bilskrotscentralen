import { NextRequest, NextResponse } from "next/server";

/**
 * Vehicle lookup via Bilprovningen's booking API (mirrors Transportstyrelsen).
 * GET /api/fordon?regnr=ABC123
 *
 * bookingStatus codes:
 *   0 = ok · 1 = notificationBooked · 2 = besiktning förfallen
 *   3 = inspectionDone · 4 = körförbud · 5 = besiktningsbefriat
 *   6 = avställd · 7 = notConfirmed · 8 = unknown
 */

const BRAND_PREFIXES = [
  "MERCEDES-BENZ","ALFA ROMEO","LAND ROVER","VOLKSWAGEN","MITSUBISHI",
  "CHEVROLET","PEUGEOT","RENAULT","HYUNDAI","PORSCHE","POLESTAR",
  "CHRYSLER","INFINITI","CITROEN","CITROËN","TOYOTA","NISSAN","SUBARU",
  "SUZUKI","JAGUAR","LEXUS","MAZDA","HONDA","SKODA","ŠKODA","TESLA",
  "VOLVO","DODGE","LANCIA","SMART","CUPRA","DACIA","MINI","SAAB","FIAT",
  "OPEL","FORD","AUDI","SEAT","JEEP","BMW","KIA","MG","DS",
];

function parseVehicleName(name: string): { brand: string; model: string } {
  const upper = name.toUpperCase().trim();
  for (const prefix of BRAND_PREFIXES) {
    if (upper.startsWith(prefix)) {
      const after = name.slice(prefix.length);
      if (after.trimStart().startsWith(",")) return { brand: prefix, model: "" };
      return { brand: prefix, model: after.replace(/^\s+/, "").trim() };
    }
  }
  const parts = name.split(/[\s,]+/);
  return { brand: parts[0] ?? name, model: parts.slice(1).join(" ") };
}

function parseStatus(code: number) {
  switch (code) {
    case 4: return { körförbud: true,  avställd: false, label: "Körförbud" };
    case 6: return { körförbud: false, avställd: true,  label: "Avställd" };
    case 2: return { körförbud: false, avställd: false, label: "Besiktning förfallen" };
    default: return { körförbud: false, avställd: false, label: "OK" };
  }
}

function parseDate(val: string | null | undefined): string | null {
  if (!val || val.startsWith("0001-01-01")) return null;
  return val.split("T")[0] ?? null;
}

export async function GET(req: NextRequest) {
  const regnr = req.nextUrl.searchParams
    .get("regnr")
    ?.toUpperCase()
    .replace(/\s|-/g, "");

  if (!regnr) return NextResponse.json({ error: "regnr saknas" }, { status: 400 });

  try {
    const res = await fetch(
      `https://boka.bilprovningen.se/api/v1/booking/vehicle?registrationNumber=${encodeURIComponent(regnr)}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
        cache: "no-store",
      },
    );

    if (res.status === 404) return NextResponse.json({ error: "not_found" }, { status: 404 });
    if (!res.ok) return NextResponse.json({ error: `upstream_${res.status}` }, { status: 502 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json: any = JSON.parse(await res.text());
    if (!json.vehicleName) return NextResponse.json({ error: "empty_response" }, { status: 422 });

    const { brand, model } = parseVehicleName(json.vehicleName);
    const status = parseStatus(json.bookingStatus ?? 0);

    return NextResponse.json({
      fabrikat: brand,
      model,
      year: typeof json.vehicleYear === "number" ? json.vehicleYear : null,
      color: json.color ?? null,
      körförbud: status.körförbud,
      avställd: status.avställd,
      statusLabel: status.label,
      vehicleType: json.vehicleTypeName ?? null,
      senastBesiktad: parseDate(json.lastInspection),
    });
  } catch {
    return NextResponse.json({ error: "network_error" }, { status: 503 });
  }
}
