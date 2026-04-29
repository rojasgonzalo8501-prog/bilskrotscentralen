/**
 * Daily scrap metal prices and CO2 savings figures.
 *
 * EDITING PRICES:
 *   1. Update `pricesUpdatedAt` to today's date (YYYY-MM-DD).
 *   2. Edit pricePerKgSek for each metal you want to change.
 *   3. Commit + push — the website updates on deploy.
 *
 * Prices here should mirror the sign at the office. They are indicative
 * and final prices are confirmed at drop-off (after weighing + sorting).
 *
 * CO2 figures are in kg CO2-equivalent saved per kg of recycled metal vs
 * primary (mined/smelted) production. Sources: Stena Recycling, Jernkontoret,
 * European Aluminium, IPCC AR6 industry chapter.
 */

export const pricesUpdatedAt = "2026-04-29";

export type MetalCategory =
  | "ferro"
  | "non-ferro"
  | "ädelmetall-light"
  | "kabel"
  | "elektronik"
  | "batteri";

export type Metal = {
  /** URL-safe id, used as anchor + form value */
  id: string;
  /** Display name in Swedish */
  name: string;
  /** Short subtitle / examples */
  subtitle: string;
  /** Emoji icon for quick visual scan */
  icon: string;
  /** Indicative price in SEK per kg */
  pricePerKgSek: number;
  /** kg CO2 saved per kg recycled vs primary production */
  co2SavedPerKg: number;
  /** Bucket for filtering in UI */
  category: MetalCategory;
  /** Notes about purity / sorting / what counts */
  note?: string;
};

export const metals: Metal[] = [
  // — Järn / stål —
  {
    id: "jarn-stal",
    name: "Järn & stål",
    subtitle: "Maskindelar, balkar, plåt, armering",
    icon: "🔩",
    pricePerKgSek: 2.5,
    co2SavedPerKg: 1.5,
    category: "ferro",
    note: "Pris varierar beroende på renhet och stycke-storlek.",
  },
  {
    id: "rostfritt",
    name: "Rostfritt stål",
    subtitle: "Diskbänkar, beslag, industriutrustning",
    icon: "✨",
    pricePerKgSek: 12,
    co2SavedPerKg: 4.5,
    category: "ferro",
  },
  {
    id: "gjutjarn",
    name: "Gjutjärn",
    subtitle: "Gamla element, motorblock, avloppsrör",
    icon: "⚙️",
    pricePerKgSek: 2.0,
    co2SavedPerKg: 1.5,
    category: "ferro",
  },

  // — Aluminium / koppar / mässing —
  {
    id: "aluminium",
    name: "Aluminium",
    subtitle: "Profiler, fälgar, kastruller, plåt",
    icon: "🪟",
    pricePerKgSek: 18,
    co2SavedPerKg: 9.0,
    category: "non-ferro",
    note: "Aluminium ger störst CO2-besparing av alla metaller.",
  },
  {
    id: "koppar",
    name: "Koppar (ren)",
    subtitle: "Rör, blanka kabelträdar, ledare",
    icon: "🟫",
    pricePerKgSek: 75,
    co2SavedPerKg: 4.5,
    category: "non-ferro",
  },
  {
    id: "koppar-blandad",
    name: "Blandad koppar",
    subtitle: "Oxid, lödd, smutsig",
    icon: "🟤",
    pricePerKgSek: 55,
    co2SavedPerKg: 4.0,
    category: "non-ferro",
  },
  {
    id: "massing",
    name: "Mässing",
    subtitle: "Kranar, beslag, ammunition (kasserad)",
    icon: "🟡",
    pricePerKgSek: 50,
    co2SavedPerKg: 3.5,
    category: "non-ferro",
  },
  {
    id: "bly",
    name: "Bly",
    subtitle: "Avvägningar, takpannor, gamla rör",
    icon: "⚫",
    pricePerKgSek: 18,
    co2SavedPerKg: 1.6,
    category: "non-ferro",
  },
  {
    id: "zink",
    name: "Zink",
    subtitle: "Plåt, takelement, druckna",
    icon: "🔘",
    pricePerKgSek: 18,
    co2SavedPerKg: 3.5,
    category: "non-ferro",
  },

  // — Kablar —
  {
    id: "kabel-ren",
    name: "Kopparkabel utan plast",
    subtitle: "Ren, skalad ledare",
    icon: "⚡",
    pricePerKgSek: 70,
    co2SavedPerKg: 4.5,
    category: "kabel",
  },
  {
    id: "kabel-plast",
    name: "Kabel med plast",
    subtitle: "Vanlig elkabel, blandning",
    icon: "🔌",
    pricePerKgSek: 22,
    co2SavedPerKg: 2.5,
    category: "kabel",
    note: "Pris beror på koppar-andel — vi väger och uppskattar.",
  },

  // — Elektronik / katalysatorer / batterier —
  {
    id: "elektronik",
    name: "Elektronikskrot",
    subtitle: "Datorer, kretskort, servrar (rena)",
    icon: "💻",
    pricePerKgSek: 15,
    co2SavedPerKg: 3.0,
    category: "elektronik",
    note: "Hela enheter — ej krossade. Ring för stora partier.",
  },
  {
    id: "katalysator",
    name: "Katalysator (avgas)",
    subtitle: "Bil-keramikkatalysator",
    icon: "🚗",
    pricePerKgSek: 0,
    co2SavedPerKg: 0,
    category: "elektronik",
    note: "Pris bedöms per styck, ring eller maila för offert.",
  },
  {
    id: "batteri-bly",
    name: "Bilbatteri (bly-syra)",
    subtitle: "Startbatterier, traktorbatterier",
    icon: "🔋",
    pricePerKgSek: 8,
    co2SavedPerKg: 1.6,
    category: "batteri",
  },
  {
    id: "batteri-litium",
    name: "Litiumbatterier",
    subtitle: "El-cykel, verktyg, EV-paket",
    icon: "⚡",
    pricePerKgSek: 0,
    co2SavedPerKg: 0,
    category: "batteri",
    note: "Vi tar emot, pris bedöms per styck. Ring innan du kommer.",
  },
];

export const categoryLabels: Record<MetalCategory, string> = {
  ferro: "Järnhaltigt",
  "non-ferro": "Icke-järn",
  "ädelmetall-light": "Ädelmetall",
  kabel: "Kablar",
  elektronik: "Elektronik & katalysatorer",
  batteri: "Batterier",
};

/** Approx. CO2 saved (kg) per ton of mixed metal recycled — used for hero stats. */
export const avgCo2SavingPerTon = 3500; // kg = 3.5 ton CO2 per ton metall (mix)
