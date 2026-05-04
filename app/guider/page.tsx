import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guider";

export const metadata: Metadata = {
  title: "Guider & kunskapsbank — bildelar, Mercedes, skrota bil",
  description:
    "Praktiska guider och felsökningsartiklar från Bilskrotscentralen. OE-nummer, luftfjädring, skrota bil och mer — gratis kunskap från Mercedes-specialister sedan 1984.",
  alternates: { canonical: "/guider" },
};

const CATEGORY_ICONS: Record<string, string> = {
  Bildelar: "🔧",
  Mercedes: "⭐",
  "Skrota bil": "♻️",
  Verkstad: "🛠️",
};

export default function GuiderIndexPage() {
  // Group by category
  const byCategory = GUIDES.reduce<Record<string, typeof GUIDES>>((acc, g) => {
    (acc[g.category] ||= []).push(g);
    return acc;
  }, {});

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
          <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)] text-xs font-bold uppercase tracking-widest mb-4">
            Kunskapsbank
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight mb-3">
            Guider från Mercedes-specialister
          </h1>
          <p className="text-base text-slate-600 max-w-2xl">
            Praktiska artiklar om bildelar, Mercedes-felsökning och skrotning.
            Vi delar 40 års erfarenhet — gratis.
          </p>
        </div>
      </section>

      {/* Articles grouped by category */}
      <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16 space-y-12">
        {Object.entries(byCategory).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-5 flex items-center gap-2">
              <span className="text-2xl">{CATEGORY_ICONS[category] ?? "📄"}</span>
              {category}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guider/${g.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all flex flex-col"
                >
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <span>{g.readTimeMin} min läsning</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <time>{g.publishedAt}</time>
                  </div>
                  <h3 className="font-bold text-slate-900 leading-tight mb-2 group-hover:text-[var(--color-brand-orange)] transition-colors">
                    {g.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">
                    {g.excerpt}
                  </p>
                  <span className="text-sm font-semibold text-[var(--color-brand-orange)] mt-4 inline-flex items-center gap-1">
                    Läs guiden →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
