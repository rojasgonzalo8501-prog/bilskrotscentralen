import { readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import SearchBar from "./SearchBar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nya bildelar — Motorer & Spridare | Bilskrotscentralen",
  description:
    "Fabriksrenoverade motorer och spridare från 30+ märken. Direktimport från leverantör med garanti. Leverans 1–3 dagar.",
};

type Product = {
  sku: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  priceCurrency: string;
  image: string | null;
  url: string;
  condition: string;
  mpn: string | null;
  inStock: boolean;
};

type SearchParams = Promise<{
  q?: string;
  marke?: string;
  kategori?: string;
}>;

const CATEGORY_ICONS: Record<string, string> = {
  Motor: "⚙️",
  Spridare: "💉",
};

function loadProducts(): Product[] {
  try {
    const dataFile = path.join(process.cwd(), "data", "abildelar-products.json");
    return JSON.parse(readFileSync(dataFile, "utf-8"));
  } catch {
    return [];
  }
}

function Pill({ label }: { label: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange-light)] border border-[var(--color-brand-orange)]/30 text-xs">
      {label}
    </span>
  );
}

export default async function NyaBildelarPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, marke, kategori } = await searchParams;

  const allProducts = loadProducts();

  // Server-side filtering
  const filtered = allProducts.filter((p) => {
    if (marke && p.brand.toLowerCase() !== marke.toLowerCase()) return false;
    if (kategori && p.category.toLowerCase() !== kategori.toLowerCase()) return false;
    if (q) {
      const ql = q.toLowerCase();
      return (
        p.name.toLowerCase().includes(ql) ||
        p.brand.toLowerCase().includes(ql) ||
        (p.mpn?.toLowerCase().includes(ql) ?? false) ||
        p.sku.toLowerCase().includes(ql) ||
        (p.description?.toLowerCase().includes(ql) ?? false)
      );
    }
    return true;
  });

  const brands = [...new Set(allProducts.map((p) => p.brand))].sort();
  const categories = [...new Set(allProducts.map((p) => p.category))].sort();
  const hasFilters = !!(q || marke || kategori);

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-10 pb-10">
        <img src="/images/motor.jpeg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--color-brand-orange)] opacity-[0.05] rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--color-brand-orange)] transition-colors">Hem</Link>
            <span>›</span>
            <span className="text-[var(--color-text-secondary)]">Nya bildelar</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
            Nya <span className="gradient-text">bildelar</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mb-8">
            {allProducts.length.toLocaleString("sv-SE")} delar tillgängliga · Fabriksrenoverade motorer
            och spridare med garanti.
          </p>

          {/* Search */}
          <SearchBar
            defaultQ={q ?? ""}
            defaultMarke={marke ?? ""}
            defaultKategori={kategori ?? ""}
          />

          {/* Active filter pills */}
          {hasFilters && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[var(--color-text-muted)]">Filter:</span>
              {q && <Pill label={`"${q}"`} />}
              {marke && <Pill label={`Märke: ${marke}`} />}
              {kategori && <Pill label={`Kategori: ${kategori}`} />}
              <Link href="/nya-bildelar" className="ml-2 text-xs text-[var(--color-brand-orange)] hover:underline">
                Rensa
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── MAIN CONTENT: SIDEBAR + GRID ─── */}
      <section className="max-w-7xl mx-auto px-4 py-8 pb-20">
        <div className="flex gap-8">

          {/* ─── SIDEBAR ─── */}
          <aside className="hidden lg:flex flex-col gap-6 w-56 shrink-0">

            {/* Categories */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                Kategori
              </h3>
              <ul className="space-y-0.5">
                {(() => {
                  const allParams = new URLSearchParams();
                  if (q) allParams.set("q", q);
                  if (marke) allParams.set("marke", marke);
                  return (
                    <li>
                      <a
                        href={`/nya-bildelar${allParams.toString() ? `?${allParams.toString()}` : ""}`}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                          !kategori
                            ? "bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)] font-medium"
                            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-700)] hover:text-[var(--color-text-primary)]"
                        }`}
                      >
                        <span>Alla kategorier</span>
                        <span className="text-xs opacity-60">{allProducts.length}</span>
                      </a>
                    </li>
                  );
                })()}
                {categories.map((c) => {
                  const count = allProducts.filter((p) => p.category === c).length;
                  const params = new URLSearchParams();
                  params.set("kategori", c);
                  if (q) params.set("q", q);
                  if (marke) params.set("marke", marke);
                  return (
                    <li key={c}>
                      <a
                        href={`/nya-bildelar?${params.toString()}`}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                          kategori === c
                            ? "bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)] font-medium"
                            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-700)] hover:text-[var(--color-text-primary)]"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{CATEGORY_ICONS[c] ?? "🔧"}</span>
                          <span>{c}</span>
                        </span>
                        <span className="text-xs opacity-60">{count.toLocaleString("sv-SE")}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t border-[var(--color-dark-600)]" />

            {/* Brands */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                Märken
              </h3>
              <ul className="space-y-0.5">
                {(() => {
                  const allParams = new URLSearchParams();
                  if (q) allParams.set("q", q);
                  if (kategori) allParams.set("kategori", kategori);
                  return (
                    <li>
                      <a
                        href={`/nya-bildelar${allParams.toString() ? `?${allParams.toString()}` : ""}`}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                          !marke
                            ? "bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)] font-medium"
                            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-700)] hover:text-[var(--color-text-primary)]"
                        }`}
                      >
                        <span>Alla märken</span>
                        <span className="text-xs opacity-60">{allProducts.length}</span>
                      </a>
                    </li>
                  );
                })()}
                {brands.map((b) => {
                  const count = allProducts.filter((p) => p.brand === b).length;
                  const params = new URLSearchParams();
                  params.set("marke", b);
                  if (q) params.set("q", q);
                  if (kategori) params.set("kategori", kategori);
                  return (
                    <li key={b}>
                      <a
                        href={`/nya-bildelar?${params.toString()}`}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                          marke === b
                            ? "bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)] font-medium"
                            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-700)] hover:text-[var(--color-text-primary)]"
                        }`}
                      >
                        <span>{b}</span>
                        <span className="text-xs opacity-60">{count}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* ─── PRODUCTS GRID ─── */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter pills */}
            <div className="lg:hidden flex gap-2 flex-wrap mb-6">
              {categories.map((c) => {
                const params = new URLSearchParams();
                params.set("kategori", c);
                if (q) params.set("q", q);
                if (marke) params.set("marke", marke);
                return (
                  <a
                    key={c}
                    href={`/nya-bildelar?${params.toString()}`}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      kategori === c
                        ? "bg-[var(--color-brand-orange)] text-white border-[var(--color-brand-orange)]"
                        : "border-[var(--color-dark-500)] text-[var(--color-text-secondary)] hover:border-[var(--color-brand-orange)]"
                    }`}
                  >
                    {CATEGORY_ICONS[c] ?? "🔧"} {c}
                  </a>
                );
              })}
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--color-dark-500)] p-12 text-center">
                <div className="text-5xl mb-4">📦</div>
                <h2 className="text-xl font-bold mb-2">Inga delar matchade din sökning</h2>
                <p className="text-[var(--color-text-secondary)] text-sm mb-6 max-w-md mx-auto">
                  Försök med ett annat sökord eller märke.
                </p>
                <Link href="/nya-bildelar" className="btn-primary">Visa alla delar →</Link>
              </div>
            ) : (
              <>
                <div className="flex items-end justify-between mb-5">
                  <h2 className="text-lg font-bold">
                    {filtered.length.toLocaleString("sv-SE")}{" "}
                    {filtered.length === 1 ? "del" : "delar"}{" "}
                    <span className="text-sm font-normal text-[var(--color-text-muted)]">
                      {hasFilters ? "matchade" : "tillgängliga"}
                    </span>
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.slice(0, 60).map((product) => (
                    <Link
                      key={product.sku}
                      href={`/nya-bildelar/${product.sku}`}
                      className="card-hover rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] overflow-hidden group"
                    >
                      <div className="h-44 bg-gradient-to-br from-[var(--color-dark-600)] to-[var(--color-dark-800)] flex items-center justify-center overflow-hidden relative">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-[var(--color-text-muted)]">
                            <span className="text-4xl">{CATEGORY_ICONS[product.category] ?? "🔧"}</span>
                            <span className="text-xs">{product.category}</span>
                          </div>
                        )}
                        <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${
                          product.condition === "New"
                            ? "bg-[var(--color-success)]/20 text-[var(--color-success-bright)]"
                            : "bg-[var(--color-brand-orange)]/20 text-[var(--color-brand-orange-light)]"
                        }`}>
                          {product.condition === "New" ? "Fabriksny" : "Renoverad"}
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="text-xs text-[var(--color-text-muted)] mb-1">
                          {product.brand} · {product.category}
                        </div>
                        <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        {product.mpn && (
                          <div className="text-xs text-[var(--color-text-muted)] mb-3">
                            OE: {product.mpn}
                          </div>
                        )}
                        <div className="flex items-end justify-between">
                          <div className="text-xl font-black text-[var(--color-brand-orange)]">
                            {product.price?.toLocaleString("sv-SE") ?? "—"} kr
                          </div>
                          <span className={`text-xs ${product.inStock ? "text-[var(--color-success-bright)]" : "text-[var(--color-error)]"}`}>
                            {product.inStock ? "✓ I lager" : "✗ Slutsåld"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {filtered.length > 60 && (
                  <p className="text-center text-sm text-[var(--color-text-muted)] mt-8">
                    Visar 60 av {filtered.length.toLocaleString("sv-SE")} delar — förfina sökningen för att se fler.
                  </p>
                )}
              </>
            )}
          </div>

        </div>
      </section>
    </>
  );
}
