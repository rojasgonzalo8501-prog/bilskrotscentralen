/**
 * Curated part categories shown on the homepage and category pages.
 *
 * These map roughly onto Bildelsbasen part_code groups, but we keep a
 * curated list because end users shop by intuition (“luftfjädring”,
 * “bromsar”) not by 4-digit codes.
 *
 * Once Adam's lager export is loaded, partCount should be derived from
 * Prisma; for now we keep an estimate so the UI isn't empty.
 */

export type Category = {
  slug: string;
  name: string;
  icon: string;
  /** Estimated count until real Prisma data is available. */
  estimatedCount: number;
  /** Short SEO blurb shown at the top of the category page. */
  blurb: string;
  /** Bildelsbasen part_code prefixes that belong to this category. */
  partCodePrefixes: string[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "motor-transmission",
    name: "Motor & Transmission",
    icon: "⚙️",
    estimatedCount: 4820,
    blurb:
      "Motorer, växellådor, turbo, kamremmar och allt däremellan — testade och klara att monteras.",
    partCodePrefixes: ["72", "77", "20", "21"],
  },
  {
    slug: "kaross-plat",
    name: "Kaross & Plåt",
    icon: "🚗",
    estimatedCount: 6340,
    blurb:
      "Skärmar, dörrar, motorhuvar, stötfångare och kompletta karossdelar — orginalfärger när det går.",
    partCodePrefixes: ["11", "30"],
  },
  {
    slug: "luftfjadring",
    name: "Luftfjädring",
    icon: "🔧",
    estimatedCount: 890,
    blurb:
      "Luftfjädringsstrutar, bälgar, kompressorer och nivågivare — specialitet på Mercedes.",
    partCodePrefixes: ["70", "71"],
  },
  {
    slug: "bromsar",
    name: "Bromsar",
    icon: "🛑",
    estimatedCount: 2100,
    blurb:
      "Bromsok, skivor, ABS-pumpar, handbromsmotorer och kompletta sidosatser.",
    partCodePrefixes: ["76"],
  },
  {
    slug: "elektrik",
    name: "Elektrik & Elektronik",
    icon: "⚡",
    estimatedCount: 3450,
    blurb:
      "Styrenheter, kabelhärvor, generatorer, startmotorer och elektroniska moduler.",
    partCodePrefixes: ["74", "78", "80", "73", "75", "34"],
  },
  {
    slug: "inredning",
    name: "Inredning",
    icon: "💺",
    estimatedCount: 5200,
    blurb:
      "Stolar, ratt, instrumentbräda, dörrkort, mattor — komplett interiör per modell.",
    partCodePrefixes: ["31", "32", "45", "46", "47"],
  },
  {
    slug: "hjul-dack",
    name: "Hjul & Däck",
    icon: "🛞",
    estimatedCount: 1780,
    blurb:
      "Aluminiumfälgar, stålfälgar, kompletta hjulsatser och vinterdäck — sortering per fordon.",
    partCodePrefixes: ["35", "36"],
  },
  {
    slug: "belysning",
    name: "Belysning",
    icon: "💡",
    estimatedCount: 2340,
    blurb:
      "Strålkastare, baklyktor, blinkers, dimljus — xenon, LED och halogen, alla testade.",
    partCodePrefixes: ["10", "50"],
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getAllCategorySlugs(): string[] {
  return CATEGORIES.map((c) => c.slug);
}
