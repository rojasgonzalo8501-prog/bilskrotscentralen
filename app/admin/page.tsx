import type { Metadata } from "next";
import Link from "next/link";
import {
  Package,
  Car,
  ShoppingBag,
  Search,
  Plus,
  Upload,
  Megaphone,
  Truck,
  TrendingUp,
  Wallet,
  Clock,
  AlertCircle,
} from "lucide-react";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  PENDING:    "bg-[var(--color-warning)]/15 text-[var(--color-warning)]",
  CONFIRMED:  "bg-blue-500/15 text-blue-300",
  PROCESSING: "bg-amber-500/15 text-amber-300",
  SHIPPED:    "bg-emerald-500/15 text-emerald-300",
  DELIVERED:  "bg-[var(--color-dark-500)] text-[var(--color-text-secondary)]",
  CANCELLED:  "bg-rose-500/15 text-rose-300",
  REFUNDED:   "bg-sky-500/15 text-sky-300",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING:    "Väntar",
  CONFIRMED:  "Bekräftad",
  PROCESSING: "Packas",
  SHIPPED:    "Skickad",
  DELIVERED:  "Levererad",
  CANCELLED:  "Avbruten",
  REFUNDED:   "Återbetald",
};

const fmtSek = (n: number) =>
  `${n.toLocaleString("sv-SE")} kr`;

const fmtDate = (d: Date) =>
  d.toLocaleDateString("sv-SE", { day: "numeric", month: "short" });

export default async function AdminDashboardPage() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const deadStockThreshold = new Date(Date.now() - 180 * 24 * 3600 * 1000);

  const [
    partCount,
    availableCount,
    vehicleCount,
    dismantlingCount,
    todayPaidOrders,
    mtdPaidOrders,
    ordersToPack,
    pendingPayments,
    deadStockCount,
    stockValueAgg,
    recentOrders,
    eftersokInboxCount,
  ] = await Promise.all([
    db.part.count(),
    db.part.count({ where: { status: "AVAILABLE" } }),
    db.vehicle.count(),
    db.vehicle.count({ where: { status: "DISMANTLING" } }),
    db.order.findMany({
      where: { paymentStatus: "PAID", createdAt: { gte: startOfToday } },
      select: { totalSek: true },
    }),
    db.order.findMany({
      where: { paymentStatus: "PAID", createdAt: { gte: startOfMonth } },
      select: { totalSek: true },
    }),
    db.order.count({
      where: {
        paymentStatus: "PAID",
        status: { in: ["CONFIRMED", "PROCESSING"] },
      },
    }),
    db.order.count({ where: { paymentStatus: "PENDING" } }),
    db.part.count({
      where: {
        status: "AVAILABLE",
        createdAt: { lt: deadStockThreshold },
      },
    }),
    db.part.aggregate({
      where: { status: "AVAILABLE", priceSek: { not: null } },
      _sum: { priceSek: true },
    }),
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        orderNumber: true,
        firstName: true,
        lastName: true,
        totalSek: true,
        status: true,
        createdAt: true,
        items: { select: { partName: true }, take: 1 },
      },
    }),
    // Lead table may be missing from prod DBs that haven't run the
    // 20260505_add_leads migration yet. Fall back to 0 so the whole
    // dashboard doesn't 500 — the inbox link still works once the
    // migration runs and the count starts populating.
    (async () => {
      try {
        return await db.lead.count({ where: { status: { in: ["NEW", "IN_PROGRESS"] } } });
      } catch {
        return 0;
      }
    })(),
  ]);

  const todayRevenue = todayPaidOrders.reduce((s, o) => s + o.totalSek, 0);
  const mtdRevenue   = mtdPaidOrders.reduce((s, o) => s + o.totalSek, 0);
  const todayOrderCount = todayPaidOrders.length;
  const stockValue   = stockValueAgg._sum.priceSek ?? 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">
            Dashboard
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            Välkommen tillbaka <span className="gradient-text">Adam</span>
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Idag är det {now.toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long" })}.
          </p>
        </div>
        <Link
          href="/admin/bilar/ny"
          className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
        >
          <Plus size={16} /> Ny bil in
        </Link>
      </div>

      {/* KPI row 1 — money */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <KpiCard
          href="/admin/ordrar"
          icon={<TrendingUp size={20} />}
          label="Idag — försäljning"
          value={fmtSek(todayRevenue)}
          subtext={`${todayOrderCount} ${todayOrderCount === 1 ? "order" : "ordrar"}`}
          accent="green"
        />
        <KpiCard
          href="/admin/ordrar"
          icon={<Wallet size={20} />}
          label="Hittills i månaden"
          value={fmtSek(mtdRevenue)}
          subtext={`${mtdPaidOrders.length} betalda ordrar`}
        />
        <KpiCard
          href="/admin/inventory"
          icon={<Package size={20} />}
          label="Lagervärde"
          value={fmtSek(stockValue)}
          subtext={`${availableCount.toLocaleString("sv-SE")} delar i lager`}
        />
        <KpiCard
          href="/admin/ordrar"
          icon={<ShoppingBag size={20} />}
          label="Att packa"
          value={ordersToPack}
          subtext={ordersToPack > 0 ? "Kräver din uppmärksamhet" : "Inga väntande"}
          accent={ordersToPack > 0 ? "orange" : undefined}
        />
      </div>

      {/* KPI row 2 — operational */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          href="/admin/ordrar?paymentStatus=PENDING"
          icon={<Clock size={20} />}
          label="Väntar betalning"
          value={pendingPayments}
          subtext="Följ upp om mer än 24 h"
          accent={pendingPayments > 0 ? "warning" : undefined}
        />
        <KpiCard
          href="/admin/eftersok"
          icon={<Search size={20} />}
          label="Förfrågningar i kö"
          value={eftersokInboxCount}
          subtext="Pris-förfrågningar att svara på"
        />
        <KpiCard
          href="/admin/delar"
          icon={<AlertCircle size={20} />}
          label="Dödbestånd > 180 dagar"
          value={deadStockCount}
          subtext={deadStockCount > 0 ? "Överväg rea / annons-boost" : "Allt är friskt"}
          accent={deadStockCount > 20 ? "warning" : undefined}
        />
        <KpiCard
          href="/admin/bilar"
          icon={<Car size={20} />}
          label="Bilar under demontering"
          value={dismantlingCount}
          subtext={`${vehicleCount.toLocaleString("sv-SE")} bilar totalt`}
        />
      </div>

      {/* Orders + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-dark-500)]">
            <h2 className="font-bold">Senaste ordrar</h2>
            <Link
              href="/admin/ordrar"
              className="text-xs font-semibold text-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange-light)]"
            >
              Visa alla →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-4xl mb-3">📭</div>
              <div className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
                Inga ordrar ännu
              </div>
              <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto">
                När kassan börjar rulla dyker ordrarna upp här i realtid.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-dark-500)]">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/ordrar?q=${order.orderNumber}`}
                  className="px-5 py-4 flex items-center gap-4 hover:bg-[var(--color-dark-600)] transition-colors"
                >
                  <div className="text-xs font-mono text-[var(--color-text-muted)] min-w-[88px]">
                    {order.orderNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">
                      {order.firstName} {order.lastName}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)] truncate">
                      {order.items[0]?.partName ?? "—"}
                    </div>
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)] hidden sm:block shrink-0">
                    {fmtDate(order.createdAt)}
                  </div>
                  <div className="text-sm font-bold shrink-0">{fmtSek(order.totalSek)}</div>
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-semibold shrink-0 ${STATUS_STYLES[order.status] ?? ""}`}
                  >
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] p-5">
          <h2 className="font-bold mb-4">Snabbåtgärder</h2>
          <div className="space-y-2">
            <QuickAction
              href="/admin/bilar/ny"
              icon={<Car size={16} />}
              label="Registrera ny bil"
              desc="Lägg till bil och delar"
            />
            <QuickAction
              href="/admin/import"
              icon={<Upload size={16} />}
              label="Importera CSV"
              desc="Ladda upp lagerexport"
            />
            <QuickAction
              href="/admin/eftersok"
              icon={<Search size={16} />}
              label="Svara på förfrågningar"
              desc="Hantera inkomna meddelanden"
            />
            <QuickAction
              href="/admin/ordrar"
              icon={<ShoppingBag size={16} />}
              label="Plocka ordrar"
              desc="Markera som packad/skickad"
            />
            <QuickAction
              href="/admin/annonser"
              icon={<Megaphone size={16} />}
              label="Publicera annonser"
              desc="Publicera lagerlista"
            />
            <QuickAction
              href="/admin/dropship"
              icon={<Truck size={16} />}
              label="Dropship-leverantörer"
              desc="Hantera partners"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const ACCENT_STYLES: Record<string, { value: string; bar: string; icon: string }> = {
  green:   { value: "text-emerald-400",                 bar: "bg-emerald-500",                       icon: "text-emerald-400" },
  orange:  { value: "text-[var(--color-brand-orange)]", bar: "bg-[var(--color-brand-orange)]",       icon: "text-[var(--color-brand-orange)]" },
  warning: { value: "text-amber-400",                   bar: "bg-amber-500",                         icon: "text-amber-400" },
};

function KpiCard({
  href,
  icon,
  label,
  value,
  subtext,
  accent,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  accent?: keyof typeof ACCENT_STYLES;
}) {
  const a = accent ? ACCENT_STYLES[accent] : null;
  return (
    <Link
      href={href}
      className="card-hover relative block rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] p-5 hover:border-[var(--color-brand-orange)]/40 transition-colors overflow-hidden"
    >
      {a && <div className={`absolute top-0 left-0 w-1 h-full ${a.bar}`} />}
      <div className={`mb-3 ${a ? a.icon : "text-[var(--color-text-secondary)]"}`}>
        {icon}
      </div>
      <div className={`text-2xl lg:text-3xl font-black leading-none ${a ? a.value : ""}`}>
        {typeof value === "number" ? value.toLocaleString("sv-SE") : value}
      </div>
      <div className="text-[10px] text-[var(--color-text-muted)] mt-2 uppercase tracking-wider font-bold">
        {label}
      </div>
      {subtext && (
        <div className="text-xs text-[var(--color-text-secondary)] mt-1.5">
          {subtext}
        </div>
      )}
    </Link>
  );
}

function QuickAction({
  href,
  icon,
  label,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-dark-800)] border border-transparent hover:border-[var(--color-brand-orange)]/30 hover:bg-[var(--color-dark-600)] transition-all"
    >
      <div className="text-[var(--color-brand-orange)] shrink-0">{icon}</div>
      <div className="min-w-0">
        <div className="text-sm font-semibold truncate">{label}</div>
        <div className="text-xs text-[var(--color-text-muted)] truncate">
          {desc}
        </div>
      </div>
    </Link>
  );
}
