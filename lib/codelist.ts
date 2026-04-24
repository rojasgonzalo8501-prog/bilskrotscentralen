/**
 * Codelist loader — parses Bildelsbasen's industry-standard CSV codelists
 * (data/codelist) into typed structures for the rest of the app.
 *
 * Source: https://github.com/Bildelsbasen/codelist
 *
 * Read once at module load (server-side); Node caches the module so the
 * 5k-row parse only happens during the first request per process.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

const CODELIST_DIR = path.join(process.cwd(), "data", "codelist");
const SV_DIR = path.join(CODELIST_DIR, "language", "sv");

/* ─── Types ────────────────────────────────────────────────────────── */

export type Brand = {
  /** URL slug, e.g. "mercedes-benz" */
  slug: string;
  /** Display name, e.g. "Mercedes-Benz" */
  name: string;
  /** Emoji fallback (used if image fails to load) */
  logo: string;
  /** Real car manufacturer logo URL (served from jsdelivr CDN) */
  logoUrl: string;
  /** Number of distinct vehicle codes for this brand in the codelist */
  modelCount: number;
};

export type VehicleModel = {
  code: string;
  /** Brand-stripped model name, e.g. "E-KLASS (W212)" */
  name: string;
  /** Original full string from the codelist, e.g. "MB E-KLASS (W212)" */
  rawName: string;
};

export type PartCode = {
  code: string;
  name: string;
};

/* ─── Curated brand registry ───────────────────────────────────────── */

/**
 * Bildelsbasen uses some non-obvious prefixes (MB, VW, ALFA, SSANG YONG…).
 * This registry maps the codelist prefix → display name + slug + logo.
 *
 * Order is meaningful — Mercedes is first because Bilskrotscentralen is a
 * Mercedes specialist. The rest is roughly by Swedish market share.
 */
type BrandSpec = {
  prefix: string; // matches start of vehicle_code name (case-sensitive, codelist is upper)
  slug: string;
  name: string;
  logo: string;
  /** Filename on the jsdelivr car-logos-dataset CDN. Usually === slug. */
  logoKey?: string;
};

/**
 * Real car manufacturer logos are served from the open-source
 * filippofilip95/car-logos-dataset on jsdelivr.
 * Path: /logos/thumb/<key>.png — transparent PNGs, ~100x100.
 */
const LOGO_CDN = "https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/thumb";

const BRAND_REGISTRY: BrandSpec[] = [
  { prefix: "MB",         slug: "mercedes-benz", name: "Mercedes-Benz", logo: "⭐" },
  { prefix: "VOLVO",      slug: "volvo",         name: "Volvo",          logo: "🔷" },
  { prefix: "BMW",        slug: "bmw",           name: "BMW",            logo: "🔵" },
  { prefix: "AUDI",       slug: "audi",          name: "Audi",           logo: "⚪" },
  { prefix: "VW",         slug: "volkswagen",    name: "Volkswagen",     logo: "🔹" },
  { prefix: "TOYOTA",     slug: "toyota",        name: "Toyota",         logo: "🔴" },
  { prefix: "FORD",       slug: "ford",          name: "Ford",           logo: "🟦" },
  { prefix: "PEUGEOT",    slug: "peugeot",       name: "Peugeot",        logo: "🦁" },
  { prefix: "OPEL",       slug: "opel",          name: "Opel",           logo: "⚡" },
  { prefix: "SAAB",       slug: "saab",          name: "Saab",           logo: "🛩️" },
  { prefix: "RENAULT",    slug: "renault",       name: "Renault",        logo: "💎" },
  { prefix: "SKODA",      slug: "skoda",         name: "Škoda",          logo: "🟢" },
  { prefix: "KIA",        slug: "kia",           name: "Kia",            logo: "🅺" },
  { prefix: "HYUNDAI",    slug: "hyundai",       name: "Hyundai",        logo: "🇰🇷" },
  { prefix: "NISSAN",     slug: "nissan",        name: "Nissan",         logo: "🅽" },
  { prefix: "MAZDA",      slug: "mazda",         name: "Mazda",          logo: "🌀" },
  { prefix: "HONDA",      slug: "honda",         name: "Honda",          logo: "🅷" },
  { prefix: "MITSUBISHI", slug: "mitsubishi",    name: "Mitsubishi",     logo: "🔺" },
  { prefix: "SUBARU",     slug: "subaru",        name: "Subaru",         logo: "⭐" },
  { prefix: "SUZUKI",     slug: "suzuki",        name: "Suzuki",         logo: "🏍️" },
  { prefix: "FIAT",       slug: "fiat",          name: "Fiat",           logo: "🇮🇹" },
  { prefix: "ALFA",       slug: "alfa-romeo",    name: "Alfa Romeo",     logo: "🐍" },
  { prefix: "LANCIA",     slug: "lancia",        name: "Lancia",         logo: "🎌" },
  { prefix: "CITROEN",    slug: "citroen",       name: "Citroën",        logo: "⌃" },
  { prefix: "DS",         slug: "ds",            name: "DS",             logo: "💠", logoKey: "ds-automobiles" },
  { prefix: "DACIA",      slug: "dacia",         name: "Dacia",          logo: "🟫" },
  { prefix: "SEAT",       slug: "seat",          name: "SEAT",           logo: "🅂" },
  { prefix: "CUPRA",      slug: "cupra",         name: "Cupra",          logo: "🥉" },
  { prefix: "MINI",       slug: "mini",          name: "Mini",           logo: "🅼" },
  { prefix: "JAGUAR",     slug: "jaguar",        name: "Jaguar",         logo: "🐆" },
  { prefix: "LANDROVER",  slug: "land-rover",    name: "Land Rover",     logo: "🏔️" },
  { prefix: "PORSCHE",    slug: "porsche",       name: "Porsche",        logo: "🏎️" },
  { prefix: "TESLA",      slug: "tesla",         name: "Tesla",          logo: "⚡" },
  { prefix: "POLESTAR",   slug: "polestar",      name: "Polestar",       logo: "✦" },
  { prefix: "JEEP",       slug: "jeep",          name: "Jeep",           logo: "🪖" },
  { prefix: "CHEVROLET",  slug: "chevrolet",     name: "Chevrolet",      logo: "🇺🇸" },
  { prefix: "CHRYSLER",   slug: "chrysler",      name: "Chrysler",       logo: "🇺🇸" },
  { prefix: "DODGE",      slug: "dodge",         name: "Dodge",          logo: "🐏" },
  { prefix: "LEXUS",      slug: "lexus",         name: "Lexus",          logo: "🇯🇵" },
  { prefix: "INFINITI",   slug: "infiniti",      name: "Infiniti",       logo: "♾️" },
  { prefix: "SMART",      slug: "smart",         name: "Smart",          logo: "🤏" },
  { prefix: "MG",         slug: "mg",            name: "MG",             logo: "🅼" },
  { prefix: "BYD",        slug: "byd",           name: "BYD",            logo: "🔋" },
];

/**
 * Common model list per brand — moved to lib/models.ts so client components
 * can import it without pulling the fs-backed codelist loader into the
 * client bundle. Re-exported here for server-side callers that already
 * import from lib/codelist.
 */
export { MODELS } from "./models";


/* ─── CSV parsing ──────────────────────────────────────────────────── */

/**
 * Parse a single line of the form `"<code>";"<name>"`.
 * Codelist files are quoted, semicolon-separated, no escaping.
 */
function parseCodeRow(line: string): { code: string; name: string } | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  // Match "code";"name"
  const match = trimmed.match(/^"([^"]*)";"([^"]*)"$/);
  if (!match) return null;
  return { code: match[1], name: match[2] };
}

function readCodeFile(filePath: string): { code: string; name: string }[] {
  const raw = readFileSync(filePath, "utf-8");
  const rows: { code: string; name: string }[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const parsed = parseCodeRow(line);
    if (parsed) rows.push(parsed);
  }
  return rows;
}

/* ─── Lazy singletons ──────────────────────────────────────────────── */

let vehiclesCache: { code: string; name: string }[] | null = null;
function loadVehicles() {
  if (!vehiclesCache) {
    vehiclesCache = readCodeFile(path.join(SV_DIR, "vehicle_code.csv"));
  }
  return vehiclesCache;
}

let partsCache: PartCode[] | null = null;
function loadParts(): PartCode[] {
  if (!partsCache) {
    partsCache = readCodeFile(path.join(SV_DIR, "part_code.csv"));
  }
  return partsCache;
}

/* ─── Public API ───────────────────────────────────────────────────── */

/**
 * Returns the curated list of car brands with the model count we observed
 * in the codelist. Order = registry order (Mercedes first).
 *
 * "ÖVRIGT" and brand-only entries are counted; only entries that *don't*
 * match any registry brand are excluded.
 */
export function getBrands(): Brand[] {
  const vehicles = loadVehicles();
  return BRAND_REGISTRY.map((spec) => {
    const modelCount = vehicles.filter((v) =>
      matchesBrand(v.name, spec.prefix),
    ).length;
    return {
      slug: spec.slug,
      name: spec.name,
      logo: spec.logo,
      logoUrl: `${LOGO_CDN}/${spec.logoKey ?? spec.slug}.png`,
      modelCount,
    };
  });
}

/**
 * Look up a single brand by slug. Returns undefined if the slug is not in
 * the curated registry (callers should pass to notFound()).
 */
export function getBrand(slug: string): Brand | undefined {
  return getBrands().find((b) => b.slug === slug);
}

/**
 * Slugs of all brands in the registry. Used by generateStaticParams.
 */
export function getAllBrandSlugs(): string[] {
  return BRAND_REGISTRY.map((b) => b.slug);
}

/**
 * Returns all vehicle models for a given brand slug, with the brand prefix
 * stripped from the display name.
 */
export function getModelsForBrand(slug: string): VehicleModel[] {
  const spec = BRAND_REGISTRY.find((b) => b.slug === slug);
  if (!spec) return [];
  const vehicles = loadVehicles();
  return vehicles
    .filter((v) => matchesBrand(v.name, spec.prefix))
    .map((v) => ({
      code: v.code,
      rawName: v.name,
      name: v.name.slice(spec.prefix.length).trim(),
    }));
}

/**
 * All part codes (≈2 100 entries). Used for category pages and search.
 */
export function getPartCodes(): PartCode[] {
  return loadParts();
}

/* ─── Helpers ──────────────────────────────────────────────────────── */

/**
 * Match a vehicle name against a brand prefix.
 *
 * The prefix must be followed by a word boundary (space or end of string)
 * so that "MB" matches "MB E-KLASS" but not "MBK SCOOTER", and "ALFA"
 * matches "ALFA 156" but not "ALFASUD" — wait, actually "ALFA ALFASUD"
 * exists in the data, so we just need prefix + space.
 */
function matchesBrand(vehicleName: string, prefix: string): boolean {
  if (!vehicleName.startsWith(prefix)) return false;
  const next = vehicleName.charAt(prefix.length);
  return next === " " || next === "";
}
