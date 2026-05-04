/**
 * Guider — knowledge-base content registry.
 *
 * Each guide is a self-contained article with rich metadata for SEO.
 * Content is stored as inline JSX in app/guider/[slug]/page.tsx so we
 * keep markup flexibility. This registry is the single source of
 * truth for listings, sitemap, and navigation.
 */

export type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Bildelar" | "Mercedes" | "Skrota bil" | "Verkstad";
  readTimeMin: number;
  publishedAt: string; // YYYY-MM-DD
  updatedAt?: string;
  /** Comma-joined keywords for meta */
  keywords: string[];
};

export const GUIDES: Guide[] = [
  {
    slug: "hitta-ratt-oe-nummer",
    title: "Så hittar du rätt OE-nummer på reservdelen",
    excerpt:
      "OE-numret är nyckeln till att hitta exakt rätt del. Här visar vi var du hittar det på olika platser i bilen och hur du dubbelkollar att numret stämmer.",
    category: "Bildelar",
    readTimeMin: 4,
    publishedAt: "2026-04-15",
    keywords: ["OE-nummer", "originaldelar", "reservdel sökning", "Mercedes OE"],
  },
  {
    slug: "felsokning-luftfjadring-mercedes",
    title: "Felsökning av luftfjädring på Mercedes — komplett guide",
    excerpt:
      "Hänger din Mercedes på fälgarna på morgonen? Vi går igenom de vanligaste felen på Airmatic, hur du diagnosticerar problemet och vad det kostar att laga.",
    category: "Mercedes",
    readTimeMin: 8,
    publishedAt: "2026-03-20",
    keywords: [
      "Airmatic problem",
      "luftfjäder Mercedes",
      "Mercedes E-klass luftfjädring",
      "luftfjädring felsökning",
    ],
  },
  {
    slug: "skrota-bilen-sa-gar-det-till",
    title: "Så går det till att skrota bilen — steg för steg",
    excerpt:
      "Från första samtalet till att bilen är avregistrerad och du fått pengarna på Swish. Vad du behöver förbereda, vad det kostar och vad du får betalt.",
    category: "Skrota bil",
    readTimeMin: 5,
    publishedAt: "2026-02-10",
    keywords: [
      "skrota bilen",
      "skrotpremie",
      "avregistrera bil",
      "skrota bil gratis",
      "bilskrot Mälardalen",
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
