import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Bildelar per kategori — bläddra alla deltyper",
  description:
    "Sök bildelar per kategori: motor, kaross, luftfjädring, bromsar, elektrik, inredning, hjul och belysning. 30 000+ delar i lager.",
};

export default function CategoriesPage() {
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
            <span className="text-[var(--color-text-secondary)]">Kategorier</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
            Bildelar per <span className="gradient-text">kategori</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl">
            Vet du vilken typ av del du behöver men inte vilken modell? Börja här.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.slug}
              href={`/bildelar/kategorier/${cat.slug}`}
              className="card-hover p-6 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] group"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-[var(--color-brand-orange)] transition-colors">
                    {cat.name} →
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mb-3">
                    {cat.estimatedCount.toLocaleString("sv-SE")} delar
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{cat.blurb}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
