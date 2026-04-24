import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getBrand, getModelsForBrand } from "@/lib/codelist";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string; modelCode: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, modelCode } = await params;
  const brand = getBrand(slug);
  if (!brand) return {};
  const models = getModelsForBrand(slug);
  const model = models.find((m) => m.code === modelCode);
  const modelLabel = model?.name ?? modelCode;
  return {
    title: `${brand.name} ${modelLabel} bildelar — Bilskrotscentralen`,
    description: `Begagnade bildelar till ${brand.name} ${modelLabel}. Originaldelar med garanti · Leverans 1–3 dagar.`,
  };
}

export default async function BrandModelPage({ params }: { params: Params }) {
  const { slug, modelCode } = await params;

  const brand = getBrand(slug);
  if (!brand) notFound();

  const models = getModelsForBrand(slug);
  const model = models.find((m) => m.code === modelCode);

  // Extract the base model name (strip year range in parentheses) for a flexible DB search
  // e.g. "C5 (2001-)" → "C5"
  const modelLabel = model?.name ?? modelCode;
  const baseModelName = modelLabel.replace(/\s*\(.*\)$/, "").trim();

  // Query parts for this brand, trying to match model name
  const parts = await db.part.findMany({
    where: {
      status: "AVAILABLE",
      vehicle: {
        brandSlug: slug,
        ...(baseModelName && { model: { contains: baseModelName } }),
      },
    },
    include: {
      vehicle: true,
      images: { take: 1, orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  // Fallback: if no parts found with model filter, show all parts for the brand
  const fallbackParts =
    parts.length === 0 && baseModelName
      ? await db.part.findMany({
          where: { status: "AVAILABLE", vehicle: { brandSlug: slug } },
          include: { vehicle: true, images: { take: 1, orderBy: { sortOrder: "asc" } } },
          orderBy: { createdAt: "desc" },
          take: 60,
        })
      : null;

  const displayParts = parts.length > 0 ? parts : (fallbackParts ?? []);
  const isFallback = parts.length === 0 && (fallbackParts?.length ?? 0) > 0;

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-10 pb-10">
        <img src="/images/motor.jpeg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--color-brand-orange)] opacity-[0.05] rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4">
          <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-[var(--color-brand-orange)] transition-colors">Hem</Link>
            <span>›</span>
            <Link href="/bildelar" className="hover:text-[var(--color-brand-orange)] transition-colors">Bildelar</Link>
            <span>›</span>
            <Link href="/bildelar/marken" className="hover:text-[var(--color-brand-orange)] transition-colors">Märken</Link>
            <span>›</span>
            <Link href={`/bildelar/marken/${slug}`} className="hover:text-[var(--color-brand-orange)] transition-colors">{brand.name}</Link>
            <span>›</span>
            <span className="text-[var(--color-text-secondary)]">{modelLabel}</span>
          </nav>

          <div className="flex items-center gap-4 mb-3">
            <span className="text-5xl">{brand.logo}</span>
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
                {brand.name} <span className="gradient-text">{modelLabel}</span>
              </h1>
              <p className="text-[var(--color-text-secondary)] text-lg mt-2">
                {isFallback
                  ? `Inga delar specifikt för ${modelLabel} — visar alla ${brand.name}-delar`
                  : displayParts.length > 0
                  ? `${displayParts.length} delar tillgängliga · Begagnade originaldelar med garanti`
                  : `Inga delar i lager just nu för ${brand.name} ${modelLabel}`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── RESULTS ─── */}
      <section className="max-w-7xl mx-auto px-4 py-8 pb-20">
        {displayParts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-dark-500)] p-12 text-center">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-xl font-bold mb-2">Inga delar i lager just nu</h2>
            <p className="text-[var(--color-text-secondary)] text-sm mb-6 max-w-md mx-auto">
              Vi har 30 000+ delar som inte alla är digitaliserade än. Skicka en eftersökning så hittar vi din del.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/eftersok" className="btn-primary">Skicka eftersökning →</a>
              <a href={`/bildelar/marken/${slug}`} className="px-6 py-3 rounded-xl border border-[var(--color-dark-500)] text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-brand-orange)] transition-colors">
                Alla {brand.name}-modeller
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-lg font-bold">
                {displayParts.length} {displayParts.length === 1 ? "del" : "delar"}{" "}
                <span className="text-sm font-normal text-[var(--color-text-muted)]">visas</span>
              </h2>
              <a
                href={`/bildelar?marke=${slug}`}
                className="text-sm text-[var(--color-brand-orange)] hover:underline"
              >
                Visa alla {brand.name}-delar →
              </a>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayParts.map((p) => (
                <a
                  key={p.id}
                  href={`/bildelar/${p.sku}`}
                  className="card-hover rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] overflow-hidden group"
                >
                  <div className="h-44 bg-gradient-to-br from-[var(--color-dark-600)] to-[var(--color-dark-800)] flex items-center justify-center text-5xl overflow-hidden">
                    {p.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0].url} alt={p.images[0].alt ?? p.name} className="w-full h-full object-cover" />
                    ) : (
                      "🔩"
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-[var(--color-text-muted)] mb-1">
                      {brand.name} · {p.vehicle.model}
                    </div>
                    <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2">{p.name}</h3>
                    {p.oeNumber && (
                      <div className="text-xs text-[var(--color-text-muted)] mb-3">OE: {p.oeNumber}</div>
                    )}
                    <div className="text-xl font-black text-[var(--color-brand-orange)]">
                      {p.priceSek?.toLocaleString("sv-SE") ?? "—"} kr
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ─── BACK ─── */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <a
          href={`/bildelar/marken/${slug}`}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-orange)] transition-colors"
        >
          ← Alla {brand.name}-modeller
        </a>
      </section>
    </>
  );
}
