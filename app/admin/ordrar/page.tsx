import type { Metadata } from "next";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Ordrar — Admin" };
export const dynamic = "force-dynamic";

export default async function OrdrarPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status ?? "";
  const page = parseInt(params.page ?? "1", 10);
  const pageSize = 25;

  const where = statusFilter
    ? { paymentStatus: statusFilter as "PENDING" | "PAID" | "FAILED" | "REFUNDED" }
    : {};

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { items: true },
    }),
    db.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  // Summary counts
  const counts = await db.order.groupBy({
    by: ["paymentStatus"],
    _count: true,
  });
  const countMap = Object.fromEntries(counts.map((c) => [c.paymentStatus, c._count]));

  return (
    <section>
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <a href="/admin" className="hover:text-[var(--color-brand-orange)] transition-colors">Admin</a>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Ordrar</span>
      </nav>

      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            <span className="gradient-text">Ordrar</span>
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {total} order{total !== 1 ? "ar" : ""} totalt
          </p>
        </div>
        <a
          href="/api/admin/export/ordrar"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)] transition-colors"
        >
          ⬇ Exportera CSV
        </a>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          ["", "Alla", total],
          ["PAID", "Betalda", countMap["PAID"] ?? 0],
          ["PENDING", "Väntande", countMap["PENDING"] ?? 0],
          ["FAILED", "Misslyckade", countMap["FAILED"] ?? 0],
        ].map(([val, label, count]) => (
          <a
            key={String(val)}
            href={`/admin/ordrar${val ? `?status=${val}` : ""}`}
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

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-dark-500)] p-16 text-center max-w-lg mx-auto">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-xl font-bold mb-2">Inga ordrar</h2>
          <p className="text-[var(--color-text-secondary)] text-sm max-w-sm mx-auto">
            {statusFilter ? "Inga ordrar med detta filter." : "Ordrar dyker upp här automatiskt när kunder handlar."}
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-[var(--color-dark-500)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[var(--color-dark-700)] text-xs uppercase text-[var(--color-text-muted)] tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">Order</th>
                    <th className="px-4 py-3 text-left">Kund</th>
                    <th className="px-4 py-3 text-left">Metod</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-right">Totalt</th>
                    <th className="px-4 py-3 text-left">Datum</th>
                    <th className="px-4 py-3 text-left">Delar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-dark-600)]">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-[var(--color-dark-700)] transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-[var(--color-brand-orange)] font-semibold">
                          {order.orderNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>{order.firstName} {order.lastName}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">{order.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <MethodPill method={order.paymentMethod} />
                      </td>
                      <td className="px-4 py-3">
                        <PayStatusPill status={order.paymentStatus} />
                        {order.status !== "PENDING" && (
                          <div className="mt-1">
                            <OrderStatusPill status={order.status} />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                        {order.totalSek.toLocaleString("sv-SE")} kr
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text-secondary)] whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("sv-SE", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)] text-xs">
                        {order.items.map((i) => (
                          <div key={i.id}>{i.partName} ×{i.quantity}</div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 text-sm">
              <p className="text-[var(--color-text-muted)]">
                Sida {page} av {totalPages} ({total} ordrar)
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <a
                    href={`/admin/ordrar?${statusFilter ? `status=${statusFilter}&` : ""}page=${page - 1}`}
                    className="px-4 py-2 rounded-lg bg-[var(--color-dark-600)] hover:bg-[var(--color-dark-500)] transition-colors"
                  >
                    ← Föregående
                  </a>
                )}
                {page < totalPages && (
                  <a
                    href={`/admin/ordrar?${statusFilter ? `status=${statusFilter}&` : ""}page=${page + 1}`}
                    className="px-4 py-2 rounded-lg bg-[var(--color-dark-600)] hover:bg-[var(--color-dark-500)] transition-colors"
                  >
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

function MethodPill({ method }: { method: string }) {
  const labels: Record<string, string> = {
    KLARNA: "🟡 Klarna",
    STRIPE_CARD: "💳 Kort",
    SWISH: "📱 Swish",
  };
  return (
    <span className="text-xs px-2 py-0.5 rounded-md bg-[var(--color-dark-600)] text-[var(--color-text-secondary)]">
      {labels[method] ?? method}
    </span>
  );
}

function PayStatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID: "bg-[var(--color-success)]/10 text-[var(--color-success-bright)]",
    PENDING: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
    FAILED: "bg-red-500/10 text-red-400",
    REFUNDED: "bg-blue-500/10 text-blue-300",
  };
  const labels: Record<string, string> = {
    PAID: "✓ Betald",
    PENDING: "⏳ Väntar",
    FAILED: "✗ Misslyckad",
    REFUNDED: "↩ Återbetald",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${styles[status] ?? "bg-[var(--color-dark-500)] text-[var(--color-text-muted)]"}`}>
      {labels[status] ?? status}
    </span>
  );
}

function OrderStatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    CONFIRMED: "bg-blue-500/10 text-blue-300",
    PROCESSING: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
    SHIPPED: "bg-[var(--color-success)]/10 text-[var(--color-success-bright)]",
    DELIVERED: "bg-[var(--color-dark-500)] text-[var(--color-text-secondary)]",
    CANCELLED: "bg-red-500/10 text-red-400",
  };
  const labels: Record<string, string> = {
    CONFIRMED: "Bekräftad",
    PROCESSING: "Packas",
    SHIPPED: "Skickad",
    DELIVERED: "Levererad",
    CANCELLED: "Avbruten",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status] ?? ""}`}>
      {labels[status] ?? status}
    </span>
  );
}
