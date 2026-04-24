import { readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = { title: "Dropship — Admin" };
export const dynamic = "force-dynamic";

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

type SearchParams = Promise<{ q?: string; marke?: string; kategori?: string; page?: string }>;

export default async function DropshipPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const marke = sp.marke ?? "";
  const kategori = sp.kategori ?? "";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const pageSize = 60;

  const all = loadProducts();

  const filtered = all.filter((p) => {
    if (marke && p.brand.toLowerCase() !== marke.toLowerCase()) return false;
    if (kategori && p.category.toLowerCase() !== kategori.toLowerCase()) return false;
    if (q) {
      const ql = q.toLowerCase();
      return (
        p.name.toLowerCase().includes(ql) ||
        p.brand.toLowerCase().includes(ql) ||
        (p.mpn?.toLowerCase().includes(ql) ?? false) ||
        p.sku.toLowerCase().includes(ql)
      );
    }
    return true;
  });

  const brands = [...new Set(all.map((p) => p.brand))].sort();
  const categories = [...new Set(all.map((p) => p.category))].sort();
  const inStockCount = all.filter((p) => p.inStock).length;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  function buildUrl(overrides: Record<string, string>) {
    const params = new URLSearchParams();
    const merged = { q, marke, kategori, page: "1", ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v && v !== "1") params.set(k, v);
      else if (k === "page" && v !== "1") params.set(k, v);
    }
    return `/admin/dropship${params.size ? `?${params.toString()}` : ""}`;
  }

  return (
    <section>
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <a href="/admin" className="hover:text-[var(--color-brand-orange)] transition-colors">Admin</a>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Dropship</span>
      </nav>

      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            <span className="gradient-text">Dropship</span>
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Nya reservdelar via Abildelar — leverans direkt till kund
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href="https://www.abildelar.se"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl"
          >
            <ExternalLink size={14} /> Abildelar.se
          </a>
          <Link
            href="/nya-bildelar"
            target="_blank"
            className="btn-secondary inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl"
          >
            <ExternalLink size={14} /> Kundvy
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Produkter totalt" value={all.length.toLocaleString("sv-SE")} accent />
        <StatCard label="I lager" value={inStockCount.toLocaleString("sv-SE")} />
        <StatCard label="Märken" value={brands.length.toString()} />
        <StatCard label="Kategorier" value={categories.length.toString()} />
      </div>

      {/* Partner info */}
      <div className="flex items-center gap-4 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] p-5 mb-8">
        <div className="text-3xl shrink-0">🔧</div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold">Abildelar (via Bildem)</div>
          <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Fabriksrenoverade motorer och spridare. Kund beställer på sajten → Adam lägger order hos Abildelar → leverans direkt till kund.
          </div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success-bright)] font-medium shrink-0">
          Aktiv
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <form method="get" action="/admin/dropship" className="flex flex-1 gap-2 min-w-64">
          {marke && <input type="hidden" name="marke" value={marke} />}
          {kategori && <input type="hidden" name="kategori" value={kategori} />}
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Sök namn, OE-nr, SKU…"
            className="flex-1 bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)]"
          />
          <button type="submit" className="btn-primary px-4 py-2 text-sm rounded-lg">Sök</button>
        </form>
      </div>

      {/* Brand chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        <a
          href={buildUrl({ marke: "", page: "1" })}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            !marke
              ? "bg-[var(--color-brand-orange)] text-white border-[var(--color-brand-orange)]"
              : "border-[var(--color-dark-500)] bg-[var(--color-dark-700)] text-[var(--color-text-secondary)] hover:border-[var(--color-brand-orange)]"
          }`}
        >
          Alla märken ({all.length.toLocaleString("sv-SE")})
        </a>
        {brands.map((b) => {
          const count = all.filter((p) => p.brand === b).length;
          return (
            <a
              key={b}
              href={buildUrl({ marke: b, page: "1" })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                marke === b
                  ? "bg-[var(--color-brand-orange)] text-white border-[var(--color-brand-orange)]"
                  : "border-[var(--color-dark-500)] bg-[var(--color-dark-700)] text-[var(--color-text-secondary)] hover:border-[var(--color-brand-orange)]"
              }`}
            >
              {b} ({count})
            </a>
          );
        })}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => {
          const count = all.filter((p) => p.category === c).length;
          return (
            <a
              key={c}
              href={buildUrl({ kategori: kategori === c ? "" : c, page: "1" })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1 ${
                kategori === c
                  ? "bg-[var(--color-brand-orange)] text-white border-[var(--color-brand-orange)]"
                  : "border-[var(--color-dark-500)] bg-[var(--color-dark-700)] text-[var(--color-text-secondary)] hover:border-[var(--color-brand-orange)]"
              }`}
            >
              {CATEGORY_ICONS[c] ?? "🔧"} {c} ({count.toLocaleString("sv-SE")})
            </a>
          );
        })}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[var(--color-text-secondary)]">
          {filtered.length.toLocaleString("sv-SE")} produkter
          {(q || marke || kategori) && (
            <a href="/admin/dropship" className="ml-3 text-xs text-[var(--color-brand-orange)] hover:underline">
              Rensa filter
            </a>
          )}
        </p>
        <p className="text-xs text-[var(--color-text-muted)]">
          Sida {page} av {totalPages}
        </p>
      </div>

      {/* Product table */}
      {paginated.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-dark-500)] p-12 text-center">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-[var(--color-text-secondary)] text-sm">Inga produkter matchade.</p>
          <a href="/admin/dropship" className="mt-4 inline-block text-sm text-[var(--color-brand-orange)] hover:underline">
            Visa alla
          </a>
        </div>
      ) : (
        <div className="glass rounded-xl overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                <tr className="border-b border-[var(--color-dark-500)]">
                  <th className="text-left px-5 py-3 font-semibold">SKU</th>
                  <th className="text-left px-5 py-3 font-semibold">Namn</th>
                  <th className="text-left px-5 py-3 font-semibold">Märke</th>
                  <th className="text-left px-5 py-3 font-semibold">Kategori</th>
                  <th className="text-left px-5 py-3 font-semibold">OE-nr</th>
                  <th className="text-right px-5 py-3 font-semibold">Pris</th>
                  <th className="text-left px-5 py-3 font-semibold">Lager</th>
                  <th className="text-left px-5 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr key={p.sku} className="border-b border-[var(--color-dark-500)]/50 hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-mono text-xs text-[var(--color-text-muted)]">{p.sku}</td>
                    <td className="px-5 py-3 max-w-xs">
                      <div className="font-medium text-sm leading-tight line-clamp-2">{p.name}</div>
                    </td>
                    <td className="px-5 py-3 text-xs text-[var(--color-text-secondary)]">{p.brand}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-dark-500)] text-[var(--color-text-muted)]">
                        {CATEGORY_ICONS[p.category] ?? "🔧"} {p.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-[var(--color-text-muted)]">
                      {p.mpn ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-[var(--color-brand-orange)]">
                      {p.price?.toLocaleString("sv-SE") ?? "—"} kr
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium ${p.inStock ? "text-[var(--color-success-bright)]" : "text-[var(--color-error)]"}`}>
                        {p.inStock ? "✓ Ja" : "✗ Nej"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/nya-bildelar/${p.sku}`}
                          target="_blank"
                          className="text-xs text-[var(--color-brand-orange)] hover:underline whitespace-nowrap"
                        >
                          Kundvy →
                        </Link>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] whitespace-nowrap"
                        >
                          Abildelar ↗
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-xs text-[var(--color-text-muted)]">
            Visar {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, filtered.length)} av {filtered.length.toLocaleString("sv-SE")}
          </div>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={buildUrl({ page: String(page - 1) })}
                className="px-3 py-1.5 text-xs rounded-lg border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)] transition-colors"
              >
                ← Föregående
              </a>
            )}
            {page < totalPages && (
              <a
                href={buildUrl({ page: String(page + 1) })}
                className="px-3 py-1.5 text-xs rounded-lg border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)] transition-colors"
              >
                Nästa →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Coming soon */}
      <div className="rounded-xl border border-dashed border-[var(--color-dark-500)] p-6 text-center mt-10">
        <div className="text-2xl mb-2">🤖</div>
        <h3 className="font-bold text-sm mb-1">Automatisk ordersynk — kommer snart</h3>
        <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto">
          Nästa fas: inkommande beställningar på sajten skickas direkt som order till Abildelar via API, utan manuellt steg.
        </p>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-2xl font-black ${accent ? "text-[var(--color-brand-orange)]" : ""}`}>
        {value}
      </div>
    </div>
  );
}
