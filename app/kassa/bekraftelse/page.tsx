import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Orderbekräftelse — Bilskrotscentralen",
};

export const dynamic = "force-dynamic";

export default async function BekraftelsePage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; klarna_order_id?: string }>;
}) {
  const params = await searchParams;
  const orderNumber = params.order;
  const klarnaOrderId = params.klarna_order_id;

  // Look up order by number or by klarna ID
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
            Frågor? Ring oss på 0171-210 02 eller skriv på WhatsApp
          </li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/bildelar" className="btn-secondary text-center">Fortsätt handla</Link>
        <a
          href={`https://wa.me/4617121002?text=${encodeURIComponent(`Hej! Jag har en fråga om min order #${order.orderNumber}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-bold transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Frågor? WhatsApp
        </a>
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
