import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { getPayment, isPaymentSuccessful } from "@/lib/nets";
import { createInvoiceFromOrder } from "@/lib/invoice-utils";
import { sendOrderConfirmationEmail } from "@/lib/order-emails";
import { ChatTrigger } from "@/components/ChatTrigger";
import { signOrderToken } from "@/lib/order-token";

export const metadata: Metadata = {
  title: "Orderbekräftelse — Bilskrotscentralen",
};

export const dynamic = "force-dynamic";

export default async function BekraftelsePage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; klarna_order_id?: string; nets_payment_id?: string; paymentId?: string }>;
}) {
  const params = await searchParams;
  const orderNumber = params.order;
  const klarnaOrderId = params.klarna_order_id;
  const netsPaymentId = params.nets_payment_id ?? params.paymentId;

  // Look up order by number, klarna ID, or nets paymentId
  let order = null;
  if (orderNumber) {
    order = await db.order.findFirst({
      where: { orderNumber },
      include: { items: true },
    });
  } else if (klarnaOrderId) {
    order = await db.order.findFirst({
      where: { klarnaOrderId },
      include: { items: true },
    });
  } else if (netsPaymentId) {
    order = await db.order.findFirst({
      where: { netsPaymentId },
      include: { items: true },
    });

    // If the webhook hasn't fired yet, verify directly against Nets so the
    // user sees the correct status as soon as the redirect lands.
    if (order && order.paymentStatus !== "PAID") {
      try {
        const remote = await getPayment(netsPaymentId);
        if (isPaymentSuccessful(remote)) {
          // Atomic transition: only the caller that flips PENDING→PAID
          // runs the side-effects (parts/invoice/email). Webhook may race
          // with this page; whoever wins owns the work.
          const transition = await db.order.updateMany({
            where: { id: order.id, paymentStatus: { not: "PAID" } },
            data: { paymentStatus: "PAID", status: "CONFIRMED" },
          });

          if (transition.count > 0) {
            await Promise.all(
              order.items.map((it) =>
                db.part.update({ where: { id: it.partId }, data: { status: "RESERVED" } })
              )
            );
            try {
              await createInvoiceFromOrder(order.id);
            } catch (e) {
              console.error("[bekraftelse] invoice creation failed:", e);
            }
            try {
              await sendOrderConfirmationEmail(order);
            } catch (e) {
              console.error("[bekraftelse] email send failed:", e);
            }
          }

          order = await db.order.findFirst({
            where: { id: order.id },
            include: { items: true },
          });
        }
      } catch (e) {
        console.error("[bekraftelse] Nets status check failed:", e);
      }
    }
  }

  if (!order) {
    return (
      <section className="max-w-2xl mx-auto px-4 pt-10 pb-20 text-center">
        <div className="text-5xl mb-4">🤔</div>
        <h1 className="text-2xl font-bold mb-2">Order hittades inte</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          Kontrollera att länken är korrekt eller kontakta oss.
        </p>
        <Link href="/" className="btn-primary">Tillbaka till startsidan</Link>
      </section>
    );
  }

  const isPaid = order.paymentStatus === "PAID";

  return (
    <section className="max-w-2xl mx-auto px-4 pt-10 pb-20">
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">{isPaid ? "✅" : "⏳"}</div>
        <h1 className="text-3xl font-black mb-2">
          {isPaid ? "Tack för din beställning!" : "Beställning mottagen"}
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          {isPaid
            ? "Din betalning är bekräftad. Vi hör av oss så snart ordern är packad."
            : "Din order är registrerad och väntar på betalningsbekräftelse."}
        </p>
      </div>

      <div className="glass rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Order #{order.orderNumber}</h2>
          <StatusPill status={order.paymentStatus} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Kund</div>
            <div>{order.firstName} {order.lastName}</div>
            <div className="text-[var(--color-text-secondary)]">{order.email}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Leveransadress</div>
            <div>{order.address}</div>
            <div className="text-[var(--color-text-secondary)]">{order.postalCode} {order.city}</div>
          </div>
        </div>

        <div className="border-t border-[var(--color-dark-500)] pt-4 space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-[var(--color-text-secondary)] truncate mr-4">
                {item.partName} <span className="text-[var(--color-text-muted)]">×{item.quantity}</span>
              </span>
              <span className="shrink-0">{(item.priceSek * item.quantity).toLocaleString("sv-SE")} kr</span>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--color-dark-500)] mt-4 pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-[var(--color-text-secondary)]">
            <span>Delsumma</span>
            <span>{order.subtotalSek.toLocaleString("sv-SE")} kr</span>
          </div>
          <div className="flex justify-between text-[var(--color-text-secondary)]">
            <span>Frakt</span>
            <span>{order.shippingSek === 0 ? "Gratis" : `${order.shippingSek} kr`}</span>
          </div>
          <div className="flex justify-between text-[var(--color-text-secondary)]">
            <span>Moms (25 %)</span>
            <span>{order.vatSek.toLocaleString("sv-SE")} kr</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t border-[var(--color-dark-500)]">
            <span>Totalt</span>
            <span className="text-[var(--color-brand-orange)]">{order.totalSek.toLocaleString("sv-SE")} kr</span>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-6 mb-8">
        <h3 className="font-bold mb-3">Vad händer nu?</h3>
        <ol className="space-y-3 text-sm text-[var(--color-text-secondary)]">
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[var(--color-brand-orange)] text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
            Vi packar din order och meddelar dig via e-post på <strong>{order.email}</strong>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[var(--color-dark-500)] text-[var(--color-text-muted)] flex items-center justify-center text-xs font-bold shrink-0">2</span>
            Leverans sker normalt inom 1–3 arbetsdagar
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[var(--color-dark-500)] text-[var(--color-text-muted)] flex items-center justify-center text-xs font-bold shrink-0">3</span>
            Frågor? Ring oss på 0171-210 02 eller öppna chatten
          </li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href={`/min-order/${order.orderNumber}?t=${signOrderToken(order.orderNumber)}`}
          className="btn-primary text-center"
        >
          📦 Spåra min order
        </Link>
        <Link href="/bildelar" className="btn-secondary text-center">Fortsätt handla</Link>
        <ChatTrigger
          context={{ topic: "Orderfråga (bekräftelse)", orderNumber: order.orderNumber }}
          prefill={`Hej! Jag har en fråga om min order #${order.orderNumber}.`}
          fallbackHref={`https://wa.me/4617121002?text=${encodeURIComponent(`Hej! Jag har en fråga om min order #${order.orderNumber}.`)}`}
          ariaLabel="Öppna chatten med frågor om ordern"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-dark)] text-white text-sm font-bold transition-colors"
        >
          💬 Frågor? Öppna chatten
        </ChatTrigger>
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID: "bg-[var(--color-success)]/10 text-[var(--color-success-bright)]",
    PENDING: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
    FAILED: "bg-red-500/10 text-red-400",
  };
  const labels: Record<string, string> = {
    PAID: "✓ Betald",
    PENDING: "⏳ Väntar",
    FAILED: "✗ Misslyckad",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${styles[status] ?? "bg-[var(--color-dark-500)] text-[var(--color-text-muted)]"}`}>
      {labels[status] ?? status}
    </span>
  );
}
