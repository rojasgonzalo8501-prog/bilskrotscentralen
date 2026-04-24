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
} from "lucide-react";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  PENDING:   "bg-[var(--color-warning)]/15 text-[var(--color-warning)]",
  PAID:      "bg-blue-500/15 text-blue-300",
  PACKED:    "bg-[var(--color-warning)]/15 text-[var(--color-warning)]",
  SHIPPED:   "bg-[var(--color-success)]/15 text-[var(--color-success-bright)]",
  DELIVERED: "bg-[var(--color-dark-500)] text-[var(--color-text-secondary)]",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING:   "Väntar",
  PAID:      "Betald",
  PACKED:    "Packad",
  SHIPPED:   "Skickad",
  DELIVERED: "Levererad",
};

export default async function AdminDashboardPage() {
  const [partCount, availableCount, vehicleCount, dismantlingCount] =
    await Promise.all([
      db.part.count(),
      db.part.count({ where: { status: "AVAILABLE" } }),
      db.vehicle.count(),
      db.vehicle.count({ where: { status: "DISMANTLING" } }),
    ]);

  // Orders don't have a model yet — the dashboard shows an empty state that
  // matches the rest of the app once Adam's data starts flowing in.
  const recentOrders: {
    id: string;
    customer: string;
    part: string;
    total: string;
    status: keyof typeof STATUS_LABELS;
  }[] = [];

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
            Översikt över lager, ordrar och förfrågningar.
          </p>
        </div>
        <Link
          href="/admin/bilar/ny"
          className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
        >
          <Plus size={16} /> Ny bil in
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          href="/admin/delar"
          icon={<Package size={20} />}
          label="Delar tillgängliga"
          value={availableCount}
          accent
        />
        <StatCard
          href="/admin/delar"
          icon={<Package size={20} />}
          label="Delar totalt"
          value={partCount}
        />
        <StatCard
          href="/admin/bilar"
          icon={<Car size={20} />}
          label="Bilar under demontering"
          value={dismantlingCount}
        />
        <StatCard
          href="/admin/bilar"
          icon={<Car size={20} />}
          label="Bilar totalt"
          value={vehicleCount}
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
                När Adam börjar ta emot beställningar dyker de upp här.
                Kassaflödet går igång så snart lagerexporten är importerad.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-dark-500)]">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="px-5 py-4 flex items-center gap-4 hover:bg-[var(--color-dark-600)] transition-colors"
                >
                  <div className="text-xs font-mono text-[var(--color-text-muted)] min-w-[56px]">
                    {order.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">
                      {order.customer}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)] truncate">
                      {order.part}
                    </div>
                  </div>
                  <div className="text-sm font-bold shrink-0">{order.total}</div>
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-semibold shrink-0 ${STATUS_STYLES[order.status]}`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>
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

function StatCard({
  href,
  icon,
  label,
  value,
  accent,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className="card-hover block rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] p-5 hover:border-[var(--color-brand-orange)]/40 transition-colors"
    >
      <div
        className={`mb-3 ${
          accent
            ? "text-[var(--color-brand-orange)]"
            : "text-[var(--color-text-secondary)]"
        }`}
      >
        {icon}
      </div>
      <div
        className={`text-3xl font-black ${
          accent ? "text-[var(--color-brand-orange)]" : ""
        }`}
      >
        {value.toLocaleString("sv-SE")}
      </div>
      <div className="text-xs text-[var(--color-text-muted)] mt-1 uppercase tracking-wider">
        {label}
      </div>
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
