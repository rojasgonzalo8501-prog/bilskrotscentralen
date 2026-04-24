import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { getBrand } from "@/lib/codelist";
import type { PartStatus } from "@/lib/generated/prisma/enums";

export const metadata: Metadata = { title: "Delar — Admin" };
export const dynamic = "force-dynamic";

const CONDITION_LABELS: Record<string, string> = {
  NEW:           "Ny",
  USED_LIKE_NEW: "Begagnad (som ny)",
  USED_GOOD:     "Begagnad (bra)",
  USED_OK:       "Begagnad (ok)",
  USED_POOR:     "Begagnad (sliten)",
};

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE:  "bg-[var(--color-success)]/10 text-[var(--color-success-bright)]",
  RESERVED:   "bg-blue-500/10 text-blue-300",
  SOLD:       "bg-[var(--color-dark-500)] text-[var(--color-text-muted)]",
  WITHDRAWN:  "bg-[var(--color-error)]/10 text-[var(--color-error)]",
};

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE:  "Tillgänglig",
  RESERVED:   "Reserverad",
  SOLD:       "Såld",
  WITHDRAWN:  "Dragen",
};

export default async function DelarPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const status = sp.status ?? "AVAILABLE";
  const q = sp.q ?? "";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const pageSize = 50;

  const VALID_STATUSES = new Set(["AVAILABLE", "RESERVED", "SOLD", "WITHDRAWN"]);
  const where = {
    ...(status !== "all" && VALID_STATUSES.has(status)
      ? { status: status as PartStatus }
      : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { sku: { contains: q } },
            { oeNumber: { contains: q } },
          ],
        }
      : {}),
  };

  const [parts, total] = await Promise.all([
    db.part.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { vehicle: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.part.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <section>
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <Link href="/admin" className="hover:text-[var(--color-brand-orange)] transition-colors">Admin</Link>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Delar</span>
      </nav>

      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            <span className="gradient-text">Delar</span>
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {total.toLocaleString("sv-SE")} delar matchar filter
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/delar/ny" className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm">
            + Ny del
          </Link>
          <Link
            href="/admin/import"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)] transition-colors"
          >
            ⬆ Importera delar
          </Link>
        </div>
      </div>

      {/* Filters */}
      <form method="get" className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Sök SKU, namn, OE-nummer…"
          className="flex-1 min-w-48 bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)]"
        />
        <select
          name="status"
          defaultValue={status}
          className="bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)]"
        >
          <option value="all">Alla statusar</option>
          <option value="AVAILABLE">Tillgängliga</option>
          <option value="RESERVED">Reserverade</option>
          <option value="SOLD">Sålda</option>
          <option value="WITHDRAWN">Dragna</option>
        </select>
        <button type="submit" className="btn-primary px-4 py-2 text-sm rounded-lg">
          Filtrera
        </button>
      </form>

      {parts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-dark-500)] p-12 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-xl font-bold mb-2">Inga delar hittades</h2>
          <p className="text-[var(--color-text-secondary)] text-sm">
            {total === 0
              ? "Importera delar via CSV för att komma igång."
              : "Prova ett annat filter eller sökord."}
          </p>
        </div>
      ) : (
        <>
          <div className="glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                  <tr className="border-b border-[var(--color-dark-500)]">
                    <th className="text-left px-5 py-3 font-semibold">SKU</th>
                    <th className="text-left px-5 py-3 font-semibold">Namn</th>
                    <th className="text-left px-5 py-3 font-semibold">Bil</th>
                    <th className="text-left px-5 py-3 font-semibold">Skick</th>
                    <th className="text-right px-5 py-3 font-semibold">Pris</th>
                    <th className="text-left px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map((p) => {
                    const brand = getBrand(p.vehicle.brandSlug);
                    return (
                      <tr key={p.id} className="border-b border-[var(--color-dark-500)]/50 hover:bg-white/[0.02]">
                        <td className="px-5 py-3 font-mono text-xs">
                          <Link href={`/admin/delar/${p.id}`} className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-orange)]">
                            {p.sku}
                          </Link>
                        </td>
                        <td className="px-5 py-3">
                          <Link href={`/admin/delar/${p.id}`} className="block hover:text-[var(--color-brand-orange)]">
                            <div className="font-semibold">{p.name}</div>
                            {p.oeNumber && (
                              <div className="text-xs text-[var(--color-text-muted)]">OE: {p.oeNumber}</div>
                            )}
                          </Link>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5">
                            <span>{brand?.logo ?? "🚗"}</span>
                            <div className="text-xs">
                              <div className="font-medium">{brand?.name ?? p.vehicle.brandSlug}</div>
                              <div className="text-[var(--color-text-muted)]">{p.vehicle.model} {p.vehicle.year}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-xs text-[var(--color-text-secondary)]">
                          {CONDITION_LABELS[p.condition] ?? p.condition}
                        </td>
                        <td className="px-5 py-3 text-right font-semibold">
                          {p.priceSek != null ? `${p.priceSek.toLocaleString("sv-SE")} kr` : "—"}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[p.status] ?? ""}`}>
                            {STATUS_LABELS[p.status] ?? p.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-[var(--color-text-muted)]">
                Sida {page} av {totalPages} ({total.toLocaleString("sv-SE")} totalt)
              </div>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`?status=${status}&q=${q}&page=${page - 1}`}
                    className="px-3 py-1.5 text-xs rounded-lg border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)] transition-colors"
                  >
                    ← Föregående
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`?status=${status}&q=${q}&page=${page + 1}`}
                    className="px-3 py-1.5 text-xs rounded-lg border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)] transition-colors"
                  >
                    Nästa →
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
