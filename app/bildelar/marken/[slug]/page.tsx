import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllBrandSlugs,
  getBrand,
  getModelsForBrand,
} from "@/lib/codelist";

/* ─── Static generation ────────────────────────────────────────────── */

/**
 * Pre-render every brand in the registry at build time. With ~43 brands
 * this is cheap and gives us 43 indexable SEO landing pages for free.
 */
export function generateStaticParams() {
  return getAllBrandSlugs().map((slug) => ({ slug }));
}

/* ─── SEO metadata ─────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return {};
  return {
    title: `${brand.name} bildelar — ${brand.modelCount} modeller i lager`,
    description: `Begagnade ${brand.name}-delar till rätt pris. Bläddra ${brand.modelCount} modeller. Fri frakt över 500 kr · Garanti · Leverans 1–3 dagar.`,
  };
}

/* ─── Page ─────────────────────────────────────────────────────────── */

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const models = getModelsForBrand(slug);
  const isMercedes = slug === "mercedes-benz";

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-10 pb-12">
        <img src="/images/motor.jpeg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--color-brand-orange)] opacity-[0.05] rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--color-brand-orange)] transition-colors">
              Hem
            </Link>
            <span>›</span>
            <Link href="/bildelar" className="hover:text-[var(--color-brand-orange)] transition-colors">
              Bildelar
            </Link>
            <span>›</span>
            <span className="text-[var(--color-text-secondary)]">{brand.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              {isMercedes && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-brand-orange)]/30 bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange-light)] text-xs font-semibold tracking-wider uppercase mb-4">
                  ★ Vår specialitet sedan 1984
                </div>
              )}
              <div className="flex items-center gap-4 mb-3">
                <span className="text-5xl">{brand.logo}</span>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
                  {brand.name} <span className="gradient-text">bildelar</span>
                </h1>
              </div>
              <p className="text-[var(--color-text-secondary)] text-lg">
                {brand.modelCount} modeller · Begagnade delar med garanti
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MODEL GRID ─── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {models.length === 0 ? (
          <div className="text-center py-20 text-[var(--color-text-muted)]">
            Inga modeller hittades för {brand.name}.
          </div>
        ) : (
          <>
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-xl font-bold">
                Välj modell{" "}
                <span className="text-sm font-normal text-[var(--color-text-muted)]">
                  ({models.length})
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {models.map((model) => (
                <a
                  key={model.code}
                  href={`/bildelar/marken/${brand.slug}/${model.code}`}
                  className="card-hover flex items-start justify-between gap-3 p-4 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] group"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-sm leading-snug truncate">
                      {model.name || brand.name}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-1">
                      Kod {model.code}
                    </div>
                  </div>
                  <span className="text-[var(--color-brand-orange)] text-lg shrink-0 group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </a>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ─── BACK ─── */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <Link
          href="/bildelar/marken"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-orange)] transition-colors"
        >
          ← Alla märken
        </Link>
      </section>
    </>
  );
}
