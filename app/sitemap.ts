import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";
import { getBrands } from "@/lib/codelist";
import { GUIDES } from "@/lib/guider";

const BASE = "https://bilskrotscentralen.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                              priority: 1.0,  changeFrequency: "daily"   },
    { url: `${BASE}/bildelar`,                priority: 0.9,  changeFrequency: "daily"   },
    { url: `${BASE}/bildelar/kategorier`,     priority: 0.8,  changeFrequency: "weekly"  },
    { url: `${BASE}/bildelar/marken`,         priority: 0.8,  changeFrequency: "weekly"  },
    { url: `${BASE}/nya-bildelar`,            priority: 0.8,  changeFrequency: "daily"   },
    { url: `${BASE}/mercedes`,                priority: 0.9,  changeFrequency: "weekly"  },
    { url: `${BASE}/mercedes/luftfjadring`,   priority: 0.8,  changeFrequency: "weekly"  },
    { url: `${BASE}/bilrutor`,                priority: 0.7,  changeFrequency: "monthly" },
    { url: `${BASE}/skrota-bilen`,            priority: 0.8,  changeFrequency: "monthly" },
    { url: `${BASE}/verkstad`,                priority: 0.7,  changeFrequency: "monthly" },
    { url: `${BASE}/eftersok`,                priority: 0.7,  changeFrequency: "monthly" },
    { url: `${BASE}/b2b`,                     priority: 0.6,  changeFrequency: "monthly" },
    { url: `${BASE}/om-oss`,                  priority: 0.6,  changeFrequency: "monthly" },
    { url: `${BASE}/kontakt`,                 priority: 0.6,  changeFrequency: "monthly" },
    { url: `${BASE}/garanti`,                 priority: 0.5,  changeFrequency: "monthly" },
    { url: `${BASE}/faq`,                     priority: 0.5,  changeFrequency: "monthly" },
    { url: `${BASE}/omdomen`,                 priority: 0.6,  changeFrequency: "monthly" },
    { url: `${BASE}/guider`,                  priority: 0.8,  changeFrequency: "weekly"  },
    { url: `${BASE}/kopvillkor`,              priority: 0.4,  changeFrequency: "yearly"  },
    { url: `${BASE}/integritetspolicy`,       priority: 0.4,  changeFrequency: "yearly"  },
  ];

  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: `${BASE}/guider/${g.slug}`,
    lastModified: g.updatedAt ? new Date(g.updatedAt) : new Date(g.publishedAt),
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${BASE}/bildelar/kategorier/${c.slug}`,
    priority: 0.7,
    changeFrequency: "weekly" as const,
  }));

  const brandRoutes: MetadataRoute.Sitemap = getBrands().map((b) => ({
    url: `${BASE}/bildelar/marken/${b.slug}`,
    priority: 0.7,
    changeFrequency: "weekly" as const,
  }));

  // Dynamic part pages
  let partRoutes: MetadataRoute.Sitemap = [];
  try {
    const parts = await db.part.findMany({
      where: { status: "AVAILABLE" },
      select: { sku: true, updatedAt: true },
    });
    partRoutes = parts.map((p) => ({
      url: `${BASE}/bildelar/${p.sku}`,
      lastModified: p.updatedAt,
      priority: 0.6,
      changeFrequency: "weekly" as const,
    }));
  } catch {
    // DB unavailable at build time — skip dynamic routes
  }

  return [...staticRoutes, ...guideRoutes, ...categoryRoutes, ...brandRoutes, ...partRoutes];
}
