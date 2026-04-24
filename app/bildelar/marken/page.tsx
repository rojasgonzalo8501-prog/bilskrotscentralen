import type { Metadata } from "next";
import Link from "next/link";
import { getBrands } from "@/lib/codelist";

export const metadata: Metadata = {
  title: "Alla bilmärken — sök bildelar per märke",
  description:
    "Bläddra alla bilmärken vi har bildelar till. Mercedes-Benz, Volvo, BMW, Audi och 40 andra märken. Begagnade delar med garanti.",
};

export default function AllBrandsPage() {
  const brands = getBrands();
  const totalModels = brands.reduce((sum, b) => sum + b.modelCount, 0);

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
            <span className="text-[var(--color-text-secondary)]">Alla märken</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
            Sök delar per <span className="gradient-text">bilmärke</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl">
            {brands.length} bilmärken · {totalModels.toLocaleString("sv-SE")} modeller totalt.
            Klicka på ditt märke för att se alla generationer vi har delar till.
          </p>
        </div>
      </section>

      {/* ─── BRAND GRID ─── */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {brands.map((brand) => {
            const isMercedes = brand.slug === "mercedes-benz";
            return (
              <a
                key={brand.slug}
                href={`/bildelar/marken/${brand.slug}`}
                className={`card-hover flex flex-col items-center gap-2 p-5 rounded-xl border text-center group ${
                  isMercedes
                    ? "bg-[var(--color-brand-orange)]/5 border-[var(--color-brand-orange)]/40"
                    : "bg-[var(--color-dark-700)] border-[var(--color-dark-500)]"
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    width={56}
                    height={56}
                    className="object-contain max-w-full max-h-full"
                    loading="lazy"
                  />
                </div>
                <span className="font-semibold text-sm">{brand.name}</span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {brand.modelCount.toLocaleString("sv-SE")} modeller
                </span>
                {isMercedes && (
                  <span className="text-[10px] uppercase tracking-wider text-[var(--color-brand-orange-light)] font-semibold">
                    ★ Specialist
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
