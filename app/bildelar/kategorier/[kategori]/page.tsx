import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getAllCategorySlugs, getCategory } from "@/lib/categories";
import { db } from "@/lib/db";
import { getBrand } from "@/lib/codelist";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getAllCategorySlugs().map((kategori) => ({ kategori }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kategori: string }>;
}): Promise<Metadata> {
  const { kategori } = await params;
  const cat = getCategory(kategori);
  if (!cat) return {};
  return {
    title: `${cat.name} — begagnade bildelar`,
    description: `${cat.name}: ${cat.blurb} ${cat.estimatedCount.toLocaleString("sv-SE")} delar i lager.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ kategori: string }>;
}) {
  const { kategori } = await params;
  const cat = getCategory(kategori);
  if (!cat) notFound();

  const parts = await db.part.findMany({
    where: {
      status: "AVAILABLE",
      OR: cat.partCodePrefixes.map((prefix) => ({
        partCode: { startsWith: prefix },
      })),
    },
    include: { vehicle: true, images: { take: 1 } },
    take: 60,
    orderBy: { priceSek: "desc" },
  });

  return (
    <>
      <section className="relative overflow-hidden pt-10 pb-12">
        <img src="/images/motor.jpeg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--color-brand-orange)] opacity-[0.05] rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4">
          <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--color-brand-orange)]">Hem</Link>
            <span>›</span>
            <Link href="/bildelar" className="hover:text-[var(--color-brand-orange)]">Bildelar</Link>
            <span>›</span>
            <Link href="/bildelar/kategorier" className="hover:text-[var(--color-brand-orange)]">Kategorier</Link>
            <span>›</span>
            <span className="text-[var(--color-text-secondary)]">{cat.name}</span>
          </nav>

          <div className="flex items-center gap-4 mb-3">
            <span className="text-5xl">{cat.icon}</span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              {cat.name.split(" ")[0]}{" "}
              <span className="gradient-text">{cat.name.split(" ").slice(1).join(" ") || "delar"}</span>
            </h1>
          </div>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl">{cat.blurb}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        {parts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-dark-500)] p-12 text-center">
            <div className="text-5xl mb-4">{cat.icon}</div>
            <h2 className="text-xl font-bold mb-2">Kategorin håller på att fyllas</h2>
            <p className="text-[var(--color-text-secondary)] text-sm mb-6 max-w-md mx-auto">
              Vi har {cat.estimatedCount.toLocaleString("sv-SE")} delar i fysiskt lager men bara en del är digitaliserade än.
              Skicka en eftersökning så hittar vi exakt det du letar efter.
            </p>
            <a href="/eftersok" className="btn-primary">Skicka eftersökning →</a>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {parts.map((p) => {
              const brand = getBrand(p.vehicle.brandSlug);
              return (
                <a
                  key={p.id}
                  href={`/bildelar/${p.sku}`}
                  className="card-hover rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] overflow-hidden group"
                >
                  <div className="h-44 bg-gradient-to-br from-[var(--color-dark-600)] to-[var(--color-dark-800)] flex items-center justify-center text-5xl">
                    {p.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      cat.icon
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-[var(--color-text-muted)] mb-1">
                      {brand?.name ?? p.vehicle.brandSlug} · {p.vehicle.model}
                    </div>
                    <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2">{p.name}</h3>
                    <div className="text-xl font-black text-[var(--color-brand-orange)]">
                      {p.priceSek?.toLocaleString("sv-SE") ?? "—"} kr
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* Other categories */}
        <div className="mt-16">
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
            Andra kategorier
          </h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.filter((c) => c.slug !== cat.slug).map((c) => (
              <a
                key={c.slug}
                href={`/bildelar/kategorier/${c.slug}`}
                className="px-3 py-1.5 rounded-full text-sm border border-[var(--color-dark-500)] text-[var(--color-text-secondary)] hover:border-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange)] transition-all"
              >
                {c.icon} {c.name}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
