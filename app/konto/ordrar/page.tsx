import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Mina ordrar" };
export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  PAID: { label: "✓ Betald", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  PENDING: { label: "⏳ Väntar", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  FAILED: { label: "✗ Misslyckad", cls: "bg-red-500/10 text-red-400 border-red-500/20" },
  REFUNDED: { label: "↩ Återbetald", cls: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
};

function fmtDate(d: Date) {
  return d.toLocaleDateString("sv-SE", { year: "numeric", month: "short", day: "numeric" });
}

export default async function MinaOrdrarPage() {
  const session = await getSession();
  if (!session) redirect("/logga-in?portal=customer");

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { email: true, name: true },
  });

  // Match orders by user email (Order doesn't have a userId column yet).
  // Falls back to empty list if user has no email on file.
  const orders = user?.email
    ? await db.order.findMany({
        where: { email: user.email },
        orderBy: { createdAt: "desc" },
        include: { items: true },
        take: 50,
      })
    : [];

  const totalSpent = orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((s, o) => s + o.totalSek, 0);

  return (
    <section className="max-w-5xl mx-auto px-4 pt-10 pb-20">
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <Link href="/konto" className="hover:text-[var(--color-brand-orange)] transition-colors">
          Mitt konto
        </Link>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Mina ordrar</span>
      </nav>

      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-1">
            <span className="gradient-text">Mina ordrar</span>
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {orders.length === 0
              ? "Du har inga ordrar än."
              : `${orders.length} order${orders.length !== 1 ? "ar" : ""} · totalt ${totalSpent.toLocaleString("sv-SE")} kr`}
          </p>
        </div>
      </div>

      {!user?.email && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-300 mb-6">
          Din användare saknar e-postadress, så vi kan inte koppla tidigare beställningar.
          Lägg till e-post i din profil för att se din orderhistorik.
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-[var(--color-dark-500)] bg-[var(--color-dark-700)]/40">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-lg font-bold mb-2">Inga ordrar än</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            När du har handlat något dyker det upp här.
          </p>
          <Link href="/bildelar" className="btn-primary inline-block">
            Bläddra bland bildelar →
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => {
            const status = STATUS_LABELS[order.paymentStatus] ?? {
              label: order.paymentStatus,
              cls: "bg-[var(--color-dark-500)] text-[var(--color-text-muted)]",
            };
            const itemPreview = order.items
              .slice(0, 2)
              .map((it) => `${it.partName} × ${it.quantity}`)
              .join(" · ");
            const more = order.items.length > 2 ? ` +${order.items.length - 2} till` : "";
            return (
              <li key={order.id}>
                <Link
                  href={`/konto/ordrar/${order.orderNumber}`}
                  className="block rounded-xl border border-[var(--color-dark-500)] bg-[var(--color-dark-700)]/60 p-5 hover:border-[var(--color-brand-orange)]/50 hover:bg-[var(--color-dark-700)] transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="font-bold text-base">Order #{order.orderNumber}</div>
                      <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                        {fmtDate(order.createdAt)}
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${status.cls}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="text-sm text-[var(--color-text-secondary)] truncate mb-2">
                    {itemPreview}
                    {more}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">
                      {order.items.length} artikel{order.items.length !== 1 ? "" : ""}
                    </span>
                    <span className="font-bold text-[var(--color-brand-orange)]">
                      {order.totalSek.toLocaleString("sv-SE")} kr
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
