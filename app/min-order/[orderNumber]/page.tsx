import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { verifyOrderToken } from "@/lib/order-token";
import { ChatTrigger } from "@/components/ChatTrigger";
import { OrderStatusTimeline } from "@/components/OrderStatusTimeline";
import { PrintButton } from "@/components/PrintButton";

export const metadata: Metadata = {
  title: "Min order — Bilskrotscentralen",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const PAYMENT_LABEL: Record<string, { label: string; cls: string }> = {
  PENDING:  { label: "⏳ Väntar betalning", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  PAID:     { label: "✓ Betald",            cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  FAILED:   { label: "✗ Misslyckad",        cls: "bg-rose-50 text-rose-700 border-rose-200" },
  REFUNDED: { label: "↩ Återbetald",        cls: "bg-sky-50 text-sky-700 border-sky-200" },
};

function fmtSek(n: number) {
  return `${n.toLocaleString("sv-SE")} kr`;
}

function fmtDate(d: Date | null | undefined) {
  if (!d) return null;
  return d.toLocaleString("sv-SE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function MinOrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { orderNumber } = await params;
  const { t } = await searchParams;

  // Token gate — without it (or with a wrong one) we 404 to avoid
  // confirming the order number even exists.
  if (!t || !verifyOrderToken(orderNumber, t)) {
    notFound();
  }

  const order = await db.order.findUnique({
    where: { orderNumber },
    include: {
      items: { select: { partSku: true, partName: true, priceSek: true, quantity: true } },
    },
  });
  if (!order) notFound();

  const payment = PAYMENT_LABEL[order.paymentStatus];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-8">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Min order
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
            #{order.orderNumber}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            {payment && (
              <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-bold border ${payment.cls}`}>
                {payment.label}
              </span>
            )}
            <span className="text-xs text-slate-500">
              · Beställd {fmtDate(order.createdAt)}
            </span>
          </div>
        </div>

        {/* Status timeline */}
        <div className="mb-6">
          <OrderStatusTimeline status={order.status} theme="light" />
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
            Beställda delar
          </h2>
          <ul className="divide-y divide-slate-100">
            {order.items.map((it) => (
              <li key={`${it.partSku}-${it.partName}`} className="py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {it.partName}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {it.partSku} · {it.quantity} st
                  </div>
                </div>
                <div className="text-sm font-bold shrink-0">
                  {fmtSek(it.priceSek * it.quantity)}
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-5 pt-5 border-t border-slate-100 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Delsumma</dt>
              <dd>{fmtSek(order.subtotalSek)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Frakt</dt>
              <dd>{order.shippingSek === 0 ? <span className="text-emerald-600 font-semibold">Gratis</span> : fmtSek(order.shippingSek)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Moms (25 %)</dt>
              <dd>{fmtSek(order.vatSek)}</dd>
            </div>
            <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-100 mt-2">
              <dt>Totalt</dt>
              <dd className="text-[var(--color-brand-orange)]">{fmtSek(order.totalSek)}</dd>
            </div>
          </dl>
        </div>

        {/* Delivery */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            Leveransadress
          </h2>
          <address className="not-italic text-sm leading-relaxed text-slate-700">
            <strong className="text-slate-900">{order.firstName} {order.lastName}</strong><br />
            {order.address}<br />
            {order.postalCode} {order.city}<br />
            {order.country}
          </address>
        </div>

        {/* Help */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            Behöver du hjälp?
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Frågor om din order? Vi svarar inom kontorstid.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="tel:017121002"
              className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors"
            >
              📞 Ring 0171-210 02
            </a>
            <ChatTrigger
              context={{ topic: "Orderfråga (gäst)", orderNumber: order.orderNumber }}
              prefill={`Hej! Jag har en fråga om order #${order.orderNumber}.`}
              fallbackHref={`https://wa.me/4617121002?text=${encodeURIComponent(`Hej! Jag har en fråga om order #${order.orderNumber}.`)}`}
              ariaLabel="Öppna chatten"
              className="px-4 py-2.5 rounded-lg border border-slate-300 hover:border-slate-900 text-slate-900 font-bold text-sm transition-colors"
            >
              💬 Öppna chatten
            </ChatTrigger>
            <PrintButton title={`Order ${order.orderNumber} — Bilskrotscentralen`} />
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/bildelar"
            className="text-sm text-[var(--color-brand-orange)] font-semibold hover:underline"
          >
            ← Fortsätt handla
          </Link>
        </div>
      </div>
    </main>
  );
}
