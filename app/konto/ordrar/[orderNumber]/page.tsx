import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ChatTrigger } from "@/components/ChatTrigger";
import { OrderStatusTimeline } from "@/components/OrderStatusTimeline";
import { BuyAgainButton } from "@/components/BuyAgainButton";

export const metadata: Metadata = { title: "Order — Mitt konto" };
export const dynamic = "force-dynamic";

const PAYMENT_LABELS: Record<string, { label: string; cls: string }> = {
  PAID: { label: "✓ Betald", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  PENDING: { label: "⏳ Väntar på betalning", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  FAILED: { label: "✗ Misslyckad", cls: "bg-red-500/10 text-red-400 border-red-500/20" },
  REFUNDED: { label: "↩ Återbetald", cls: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
};

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Väntar",
  CONFIRMED: "Bekräftad",
  PROCESSING: "Packas",
  SHIPPED: "Skickad",
  DELIVERED: "Levererad",
  CANCELLED: "Avbruten",
  REFUNDED: "Återbetald",
};

function fmtDate(d: Date) {
  return d.toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/logga-in?portal=customer");

  const { orderNumber } = await params;
  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { email: true },
  });

  const order = await db.order.findFirst({
    where: { orderNumber },
    include: {
      items: {
        // Pull the live part record so we can tell which lines are still
        // in stock (for "Köp igen"). Salvage parts are unique — sold or
        // withdrawn means it's gone.
        include: { part: { select: { id: true, sku: true, name: true, status: true, priceSek: true } } },
      },
      invoices: true,
    },
  });

  // Authorization: customer can only see their own orders (matched by email).
  // Admins/superadmins can see anything.
  const isAdmin = session.role === "admin" || session.role === "superadmin";
  if (!order) notFound();
  if (!isAdmin && (!user?.email || order.email !== user.email)) {
    notFound();
  }

  const payment = PAYMENT_LABELS[order.paymentStatus] ?? {
    label: order.paymentStatus,
    cls: "bg-[var(--color-dark-500)] text-[var(--color-text-muted)]",
  };

  return (
    <section className="max-w-3xl mx-auto px-4 pt-10 pb-20">
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/konto" className="hover:text-[var(--color-brand-orange)] transition-colors">Mitt konto</Link>
        <span>›</span>
        <Link href="/konto/ordrar" className="hover:text-[var(--color-brand-orange)] transition-colors">Mina ordrar</Link>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">#{order.orderNumber}</span>
      </nav>

      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">
            Order #{order.orderNumber}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">{fmtDate(order.createdAt)}</p>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${payment.cls}`}>
          {payment.label}
        </span>
      </div>

      {/* Status / progress */}
      <div className="mb-6">
        <OrderStatusTimeline status={order.status} theme="dark" />
      </div>

      {/* Items */}
      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="font-bold text-sm uppercase tracking-wider text-[var(--color-text-muted)] mb-4">Artiklar</h2>
        <div className="space-y-3">
          {order.items.map((it) => (
            <div key={it.id} className="flex justify-between items-start gap-4 pb-3 border-b border-[var(--color-dark-500)] last:border-0 last:pb-0">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{it.partName}</div>
                <div className="text-xs text-[var(--color-text-muted)]">
                  {it.partSku} · {it.quantity} st
                </div>
              </div>
              <div className="text-sm font-semibold whitespace-nowrap">
                {(it.priceSek * it.quantity).toLocaleString("sv-SE")} kr
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="glass rounded-xl p-6 mb-6">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-[var(--color-text-secondary)]">
            <span>Delsumma</span>
            <span>{order.subtotalSek.toLocaleString("sv-SE")} kr</span>
          </div>
          <div className="flex justify-between text-[var(--color-text-secondary)]">
            <span>Frakt</span>
            <span>{order.shippingSek === 0 ? "Gratis" : `${order.shippingSek.toLocaleString("sv-SE")} kr`}</span>
          </div>
          <div className="flex justify-between text-[var(--color-text-secondary)]">
            <span>Moms (25 %)</span>
            <span>{order.vatSek.toLocaleString("sv-SE")} kr</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-3 mt-1 border-t border-[var(--color-dark-500)]">
            <span>Totalt</span>
            <span className="text-[var(--color-brand-orange)]">{order.totalSek.toLocaleString("sv-SE")} kr</span>
          </div>
        </div>
      </div>

      {/* Address + contact */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="glass rounded-xl p-6">
          <h2 className="font-bold text-sm uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Leveransadress</h2>
          <div className="text-sm">
            <div className="font-medium">{order.firstName} {order.lastName}</div>
            <div className="text-[var(--color-text-secondary)]">{order.address}</div>
            <div className="text-[var(--color-text-secondary)]">{order.postalCode} {order.city}</div>
          </div>
        </div>
        <div className="glass rounded-xl p-6">
          <h2 className="font-bold text-sm uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Kontakt</h2>
          <div className="text-sm space-y-1">
            <div className="text-[var(--color-text-secondary)]">{order.email}</div>
            {order.phone && <div className="text-[var(--color-text-secondary)]">{order.phone}</div>}
          </div>
        </div>
      </div>

      {/* Invoices */}
      {order.invoices.length > 0 && (
        <div className="glass rounded-xl p-6 mb-6">
          <h2 className="font-bold text-sm uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Fakturor</h2>
          <ul className="space-y-2 text-sm">
            {order.invoices.map((inv) => (
              <li key={inv.id} className="flex justify-between items-center">
                <span>Faktura {inv.invoiceNumber}</span>
                <a
                  href={`/api/faktura/pdf?id=${inv.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-brand-orange)] hover:underline text-xs font-semibold"
                >
                  Ladda ner PDF →
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <Link href="/konto/ordrar" className="btn-secondary text-center">← Tillbaka</Link>
        <BuyAgainButton
          items={order.items
            .filter((it) => it.part?.status === "AVAILABLE" && it.part?.priceSek != null)
            .map((it) => ({
              partId: it.part!.id,
              sku: it.part!.sku,
              name: it.part!.name,
              priceSek: it.part!.priceSek!,
            }))}
          originalCount={order.items.length}
        />
        <ChatTrigger
          context={{ topic: "Orderfråga", orderNumber: order.orderNumber }}
          prefill={`Hej! Jag har en fråga om min order #${order.orderNumber}.`}
          fallbackHref={`https://wa.me/4617121002?text=${encodeURIComponent(`Hej! Jag har en fråga om min order #${order.orderNumber}.`)}`}
          ariaLabel="Öppna chatten med frågor om ordern"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)] text-[var(--color-text-primary)] text-sm font-bold transition-colors"
        >
          💬 Frågor? Öppna chatten
        </ChatTrigger>
      </div>
    </section>
  );
}
