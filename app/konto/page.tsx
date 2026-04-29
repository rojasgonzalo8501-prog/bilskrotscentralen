import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { logoutAction } from "../logga-in/actions";

export const metadata: Metadata = {
  title: "Mitt konto",
};

export const dynamic = "force-dynamic";

function fmtDate(d: Date) {
  return d.toLocaleDateString("sv-SE", { year: "numeric", month: "short", day: "numeric" });
}

const PAYMENT_PILL: Record<string, string> = {
  PAID: "bg-emerald-500/10 text-emerald-400",
  PENDING: "bg-amber-500/10 text-amber-400",
  FAILED: "bg-red-500/10 text-red-400",
  REFUNDED: "bg-sky-500/10 text-sky-400",
};

export default async function KontoPage() {
  const session = await getSession();
  if (!session) redirect("/logga-in?portal=customer");

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { email: true, name: true, createdAt: true },
  });

  // Real stats — only fetch if user has email on file
  const [recentOrders, totalOrderCount, paidStats] = user?.email
    ? await Promise.all([
        db.order.findMany({
          where: { email: user.email },
          orderBy: { createdAt: "desc" },
          take: 3,
          include: { items: true },
        }),
        db.order.count({ where: { email: user.email } }),
        db.order.aggregate({
          where: { email: user.email, paymentStatus: "PAID" },
          _sum: { totalSek: true },
          _count: true,
        }),
      ])
    : [[], 0, { _sum: { totalSek: 0 }, _count: 0 }];

  const totalSpent = paidStats._sum.totalSek ?? 0;

  return (
    <section className="max-w-5xl mx-auto px-4 pt-10 pb-20">
      {/* Header */}
      <div className="flex items-start justify-between gap-6 mb-8 flex-wrap">
        <div>
          <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-2">
            Kundportal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">
            Välkommen, <span className="gradient-text">{session.name}</span>
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            {user?.email
              ? `Inloggad som ${user.email}`
              : "Lägg till en e-post i profilen för att koppla dina ordrar."}
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg border border-[var(--color-dark-500)] text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange)] transition-all"
          >
            Logga ut
          </button>
        </form>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatTile value={totalOrderCount} label="Ordrar" href="/konto/ordrar" />
        <StatTile value={paidStats._count} label="Betalda" href="/konto/ordrar" />
        <StatTile value={`${totalSpent.toLocaleString("sv-SE")} kr`} label="Totalt handlat" />
        <StatTile
          value={user ? fmtDate(user.createdAt) : "—"}
          label="Medlem sedan"
          small
        />
      </div>

      {/* Recent orders preview */}
      <div className="mb-8">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-lg font-bold">Senaste ordrar</h2>
          {totalOrderCount > 0 && (
            <Link
              href="/konto/ordrar"
              className="text-sm font-semibold text-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange-light)]"
            >
              Visa alla →
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border border-[var(--color-dark-500)] bg-[var(--color-dark-700)]/40">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              Du har inga ordrar än.
            </p>
            <Link href="/bildelar" className="btn-primary inline-block">
              Bläddra bland bildelar →
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/konto/ordrar/${order.orderNumber}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-[var(--color-dark-500)] bg-[var(--color-dark-700)]/60 p-4 hover:border-[var(--color-brand-orange)]/50 transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm">#{order.orderNumber}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${PAYMENT_PILL[order.paymentStatus] ?? "bg-[var(--color-dark-500)] text-[var(--color-text-muted)]"}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)] truncate">
                      {fmtDate(order.createdAt)} · {order.items.length} artikel
                      {order.items.length !== 1 ? "" : ""}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-[var(--color-brand-orange)] shrink-0">
                    {order.totalSek.toLocaleString("sv-SE")} kr
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Portal cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <PortalCard
          icon="📦"
          title="Mina ordrar"
          desc="Se alla beställningar, statusar och kvitton."
          cta="Visa ordrar"
          href="/konto/ordrar"
        />
        <PortalCard
          icon="👤"
          title="Min profil"
          desc="Kontouppgifter och sparade leveransadresser."
          cta="Visa profil"
          href="/konto/profil"
        />
        <PortalCard
          icon="🛒"
          title="Bläddra bildelar"
          desc="Hitta nästa del till din bil — begagnat eller fabriksnytt."
          cta="Till butiken"
          href="/bildelar"
        />
        <PortalCard
          icon="🔍"
          title="Eftersökning"
          desc="Säg vilken del du letar efter — vi hör av oss när vi hittar den."
          cta="Skicka förfrågan"
          href="/eftersok"
        />
        <PortalCard
          icon="💬"
          title="WhatsApp"
          desc="Snabba frågor om en order eller del — chatta direkt med oss."
          cta="Öppna WhatsApp"
          href="https://wa.me/4617121002"
          external
        />
        <PortalCard
          icon="📞"
          title="Ring oss"
          desc="0171-210 02 · vardagar 8–17."
          cta="Ring nu"
          href="tel:+46171210002"
          external
        />
      </div>
    </section>
  );
}

function StatTile({
  value,
  label,
  href,
  small = false,
}: {
  value: string | number;
  label: string;
  href?: string;
  small?: boolean;
}) {
  const inner = (
    <>
      <div className={`font-black gradient-text ${small ? "text-base sm:text-lg" : "text-2xl sm:text-3xl"}`}>
        {value}
      </div>
      <div className="text-[10px] sm:text-xs text-[var(--color-text-muted)] uppercase tracking-wider mt-1">
        {label}
      </div>
    </>
  );
  if (href) {
    return (
      <Link
        href={href}
        className="rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] p-4 hover:border-[var(--color-brand-orange)]/50 transition-all"
      >
        {inner}
      </Link>
    );
  }
  return (
    <div className="rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] p-4">
      {inner}
    </div>
  );
}

function PortalCard({
  icon,
  title,
  desc,
  cta,
  href,
  external = false,
}: {
  icon: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  external?: boolean;
}) {
  const cls =
    "card-hover p-6 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] block hover:border-[var(--color-brand-orange)]/50 transition-all";
  const inner = (
    <>
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">{desc}</p>
      <span className="text-sm font-semibold text-[var(--color-brand-orange)]">
        {cta} →
      </span>
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
