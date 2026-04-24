import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { getBrand } from "@/lib/codelist";

export const metadata: Metadata = {
  title: "Lager — Admin",
};

// Don't cache — inventory should reflect latest uploads immediately.
export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const [vehicles, partStats, partCount, batches] = await Promise.all([
    db.vehicle.findMany({
      orderBy: { arrivedAt: "desc" },
      include: {
        _count: { select: { parts: true } },
      },
      take: 100,
    }),
    db.part.groupBy({
      by: ["status"],
      _count: { _all: true },
      _sum: { priceSek: true },
    }),
    db.part.count(),
    db.importBatch.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const totalValue = partStats
    .filter((s) => s.status === "AVAILABLE")
    .reduce((sum, s) => sum + (s._sum.priceSek ?? 0), 0);
  const availableCount =
    partStats.find((s) => s.status === "AVAILABLE")?._count._all ?? 0;
  const soldCount =
    partStats.find((s) => s.status === "SOLD")?._count._all ?? 0;

  return (
    <section>
      {/* ─── Header ─── */}
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--color-brand-orange)] transition-colors">Hem</Link>
        <span>›</span>
        <a href="/admin" className="hover:text-[var(--color-brand-orange)] transition-colors">Admin</a>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Lager</span>
      </nav>

      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">
            <span className="gradient-text">Lager</span>
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            {vehicles.length} fordon · {partCount.toLocaleString("sv-SE")} delar
          </p>
        </div>
        <div className="flex gap-3">
          <a href="/admin/import" className="btn-primary text-sm">
            ⬆ Ladda upp lager
          </a>
        </div>
      </div>

      {/* ─── Stat cards ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Fordon i lager"
          value={vehicles.length.toString()}
        />
        <StatCard
          label="Delar tillgängliga"
          value={availableCount.toLocaleString("sv-SE")}
        />
        <StatCard
          label="Delar sålda"
          value={soldCount.toLocaleString("sv-SE")}
        />
        <StatCard
          label="Lagervärde"
          value={`${totalValue.toLocaleString("sv-SE")} kr`}
          accent
        />
      </div>

      {/* ─── Empty state ─── */}
      {vehicles.length === 0 && (
        <div className="rounded-xl border border-dashed border-[var(--color-dark-500)] p-12 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-xl font-bold mb-2">Lagret är tomt</h2>
          <p className="text-[var(--color-text-secondary)] text-sm mb-6 max-w-md mx-auto">
            Ladda upp Adams lagerexport som CSV för att komma igång. Importera fordonen
            först, sen delarna.
          </p>
          <a href="/admin/import" className="btn-primary">
            ⬆ Ladda upp första filen
          </a>
        </div>
      )}

      {/* ─── Vehicles table ─── */}
      {vehicles.length > 0 && (
        <div className="glass rounded-xl overflow-hidden mb-10">
          <div className="px-6 py-4 border-b border-[var(--color-dark-500)] flex items-center justify-between">
            <h2 className="font-bold">Fordon</h2>
            <span className="text-xs text-[var(--color-text-muted)]">
              Visar {vehicles.length} senaste
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                <tr className="border-b border-[var(--color-dark-500)]">
                  <th className="text-left px-6 py-3 font-semibold">Lagernr</th>
                  <th className="text-left px-6 py-3 font-semibold">Märke / Modell</th>
                  <th className="text-left px-6 py-3 font-semibold">År</th>
                  <th className="text-right px-6 py-3 font-semibold">Delar</th>
                  <th className="text-left px-6 py-3 font-semibold">Status</th>
                  <th className="text-left px-6 py-3 font-semibold">Inkom</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => {
                  const brand = getBrand(v.brandSlug);
                  return (
                    <tr
                      key={v.id}
                      className="border-b border-[var(--color-dark-500)]/50 hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-3 font-mono text-xs">{v.stockNumber}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{brand?.logo ?? "🚗"}</span>
                          <div>
                            <div className="font-semibold">{brand?.name ?? v.brandSlug}</div>
                            <div className="text-xs text-[var(--color-text-muted)]">
                              {v.model}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-[var(--color-text-secondary)]">
                        {v.year ?? "—"}
                      </td>
                      <td className="px-6 py-3 text-right text-[var(--color-brand-orange)] font-semibold">
                        {v._count.parts}
                      </td>
                      <td className="px-6 py-3">
                        <StatusPill status={v.status} />
                      </td>
                      <td className="px-6 py-3 text-xs text-[var(--color-text-muted)]">
                        {v.arrivedAt.toISOString().slice(0, 10)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Recent imports ─── */}
      {batches.length > 0 && (
        <div className="glass rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-dark-500)]">
            <h2 className="font-bold">Senaste importer</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                <tr className="border-b border-[var(--color-dark-500)]">
                  <th className="text-left px-6 py-3 font-semibold">Datum</th>
                  <th className="text-left px-6 py-3 font-semibold">Fil</th>
                  <th className="text-left px-6 py-3 font-semibold">Typ</th>
                  <th className="text-right px-6 py-3 font-semibold">Importerade</th>
                  <th className="text-right px-6 py-3 font-semibold">Hoppade</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-[var(--color-dark-500)]/50 hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-3 text-xs text-[var(--color-text-muted)]">
                      {b.createdAt.toISOString().replace("T", " ").slice(0, 16)}
                    </td>
                    <td className="px-6 py-3 font-mono text-xs">{b.filename}</td>
                    <td className="px-6 py-3 text-[var(--color-text-secondary)]">{b.kind}</td>
                    <td className="px-6 py-3 text-right text-[var(--color-success-bright)]">
                      {b.rowsImported}
                    </td>
                    <td className="px-6 py-3 text-right text-[var(--color-error)]">
                      {b.rowsSkipped > 0 ? b.rowsSkipped : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─── Components ───────────────────────────────────────────────────── */

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
      <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
        {label}
      </div>
      <div
        className={`text-2xl font-black ${
          accent ? "text-[var(--color-brand-orange)]" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DISMANTLING: "bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange-light)]",
    DISMANTLED: "bg-[var(--color-success)]/10 text-[var(--color-success-bright)]",
    SCRAPPED: "bg-[var(--color-dark-500)] text-[var(--color-text-muted)]",
  };
  const labels: Record<string, string> = {
    DISMANTLING: "Demonteras",
    DISMANTLED: "Demonterad",
    SCRAPPED: "Skrotad",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] ?? ""}`}
    >
      {labels[status] ?? status}
    </span>
  );
}
