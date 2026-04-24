import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Fakturor — Admin" };
export const dynamic = "force-dynamic";

export default async function FakturorPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status ?? "";
  const page = parseInt(params.page ?? "1", 10);
  const pageSize = 30;

  const where = statusFilter ? { status: statusFilter as "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED" } : {};

  const [invoices, total] = await Promise.all([
    db.invoice.findMany({
      where,
      orderBy: { invoiceNumber: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { items: { select: { id: true } } },
    }),
    db.invoice.count({ where }),
  ]);

  const counts = await db.invoice.groupBy({ by: ["status"], _count: true });
  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count]));
  const totalCount = Object.values(countMap).reduce((s, v) => s + v, 0);

  const totalPages = Math.ceil(total / pageSize);

  // Unpaid total
  const unpaidAgg = await db.invoice.aggregate({
    where: { status: { in: ["SENT", "OVERDUE"] } },
    _sum: { totalSek: true },
  });
  const unpaidTotal = unpaidAgg._sum.totalSek ?? 0;

  return (
    <section>
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <a href="/admin" className="hover:text-[var(--color-brand-orange)] transition-colors">Admin</a>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Fakturor</span>
      </nav>

      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            <span className="gradient-text">Fakturor</span>
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {totalCount} faktura{totalCount !== 1 ? "r" : ""} totalt
          </p>
        </div>
        <Link href="/admin/fakturor/ny" className="btn-primary px-5 py-2.5 text-sm">
          + Ny faktura
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Obetalt" value={`${unpaidTotal.toLocaleString("sv-SE")} kr`} color="orange" />
        <KpiCard label="Skickade" value={String(countMap["SENT"] ?? 0)} color="blue" />
        <KpiCard label="Betalda" value={String(countMap["PAID"] ?? 0)} color="green" />
        <KpiCard label="Förfallna" value={String(countMap["OVERDUE"] ?? 0)} color="red" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          ["", "Alla", totalCount],
          ["DRAFT", "Utkast", countMap["DRAFT"] ?? 0],
          ["SENT", "Skickade", countMap["SENT"] ?? 0],
          ["PAID", "Betalda", countMap["PAID"] ?? 0],
          ["OVERDUE", "Förfallna", countMap["OVERDUE"] ?? 0],
        ].map(([val, label, count]) => (
          <a
            key={String(val)}
            href={`/admin/fakturor${val ? `?status=${val}` : ""}`}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              statusFilter === val
                ? "bg-[var(--color-brand-orange)] text-white"
                : "bg-[var(--color-dark-600)] text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-500)]"
            }`}
          >
            {String(label)} ({String(count)})
          </a>
        ))}
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-dark-500)] p-16 text-center max-w-lg mx-auto">
          <div className="text-5xl mb-4">🧾</div>
          <h2 className="text-xl font-bold mb-2">Inga fakturor</h2>
          <p className="text-[var(--color-text-secondary)] text-sm mb-6">
            {statusFilter ? "Inga fakturor med detta filter." : "Skapa din första faktura eller så skapas de automatiskt när en order betalas."}
          </p>
          <Link href="/admin/fakturor/ny" className="btn-primary text-sm px-5">+ Ny faktura</Link>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-[var(--color-dark-500)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[var(--color-dark-700)] text-xs uppercase text-[var(--color-text-muted)] tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">Faktura nr</th>
                    <th className="px-4 py-3 text-left">Kund</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-right">Belopp</th>
                    <th className="px-4 py-3 text-left">Datum</th>
                    <th className="px-4 py-3 text-left">Förfaller</th>
                    <th className="px-4 py-3 text-left">Rader</th>
                    <th className="px-4 py-3 text-right">Åtgärder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-dark-600)]">
                  {invoices.map((inv) => {
                    const isOverdue =
                      inv.status === "SENT" && new Date(inv.dueDate) < new Date();
                    return (
                      <tr key={inv.id} className="hover:bg-[var(--color-dark-700)] transition-colors">
                        <td className="px-4 py-3">
                          <a
                            href={`/admin/fakturor/${inv.id}`}
                            className="font-mono font-bold text-[var(--color-brand-orange)] hover:underline"
                          >
                            {inv.invoiceNumber}
                          </a>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{inv.customerName}</div>
                          {inv.customerEmail && (
                            <div className="text-xs text-[var(--color-text-muted)]">{inv.customerEmail}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <StatusPill status={isOverdue ? "OVERDUE" : inv.status} />
                        </td>
                        <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                          {inv.totalSek.toLocaleString("sv-SE", { minimumFractionDigits: 2 })} kr
                        </td>
                        <td className="px-4 py-3 text-[var(--color-text-secondary)] whitespace-nowrap">
                          {new Date(inv.invoiceDate).toLocaleDateString("sv-SE")}
                        </td>
                        <td className={`px-4 py-3 whitespace-nowrap ${isOverdue ? "text-red-400 font-semibold" : "text-[var(--color-text-secondary)]"}`}>
                          {new Date(inv.dueDate).toLocaleDateString("sv-SE")}
                        </td>
                        <td className="px-4 py-3 text-[var(--color-text-muted)]">
                          {inv.items.length} rad{inv.items.length !== 1 ? "er" : ""}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/admin/fakturor/${inv.id}`}
                              className="text-xs px-3 py-1.5 rounded-md bg-[var(--color-dark-600)] hover:bg-[var(--color-dark-500)] transition-colors"
                            >
                              Öppna
                            </a>
                            <a
                              href={`/api/faktura/pdf?id=${inv.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-3 py-1.5 rounded-md bg-[var(--color-dark-600)] hover:bg-[var(--color-dark-500)] transition-colors"
                            >
                              PDF ↓
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 text-sm">
              <p className="text-[var(--color-text-muted)]">Sida {page} av {totalPages}</p>
              <div className="flex gap-2">
                {page > 1 && (
                  <a href={`/admin/fakturor?${statusFilter ? `status=${statusFilter}&` : ""}page=${page - 1}`}
                    className="px-4 py-2 rounded-lg bg-[var(--color-dark-600)] hover:bg-[var(--color-dark-500)] transition-colors">
                    ← Föregående
                  </a>
                )}
                {page < totalPages && (
                  <a href={`/admin/fakturor?${statusFilter ? `status=${statusFilter}&` : ""}page=${page + 1}`}
                    className="px-4 py-2 rounded-lg bg-[var(--color-dark-600)] hover:bg-[var(--color-dark-500)] transition-colors">
                    Nästa →
                  </a>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function KpiCard({ label, value, color }: { label: string; value: string; color: "orange" | "blue" | "green" | "red" }) {
  const colors = {
    orange: "text-[var(--color-brand-orange)]",
    blue: "text-blue-300",
    green: "text-[var(--color-success-bright)]",
    red: "text-red-400",
  };
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-xs text-[var(--color-text-muted)] mb-1">{label}</div>
      <div className={`text-xl font-black ${colors[color]}`}>{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DRAFT: "bg-[var(--color-dark-500)] text-[var(--color-text-secondary)]",
    SENT: "bg-blue-500/15 text-blue-300",
    PAID: "bg-[var(--color-success)]/15 text-[var(--color-success-bright)]",
    OVERDUE: "bg-red-500/15 text-red-400",
    CANCELLED: "bg-[var(--color-dark-500)] text-[var(--color-text-muted)]",
  };
  const labels: Record<string, string> = {
    DRAFT: "Utkast",
    SENT: "Skickad",
    PAID: "✓ Betald",
    OVERDUE: "⚠ Förfallen",
    CANCELLED: "Annullerad",
  };
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${styles[status] ?? ""}`}>
      {labels[status] ?? status}
    </span>
  );
}
