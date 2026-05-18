import Link from "next/link";

const KPIS = [
  { label: "Idag inköp", value: "0 kr", sub: "0 transaktioner" },
  { label: "Veckan", value: "0 kr", sub: "0 transaktioner" },
  { label: "Väntar KYC", value: "0", sub: "kunder" },
  { label: "Öppet", value: "Ja", sub: "07:00–16:30" },
];

const QUICK_LINKS = [
  { href: "/admin/mottagning", label: "Ny mottagning", desc: "Starta drop-in flödet" },
  { href: "/admin/transaktioner", label: "Transaktioner", desc: "Historik och kvitton" },
  { href: "/admin/kunder", label: "Kunder", desc: "Sök och hantera" },
  { href: "/admin/priser", label: "Priser", desc: "Uppdatera dagspriser" },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-5 md:px-10 py-10">
      <div className="mb-8">
        <div className="font-mono text-[8.5px] tracking-[1.8px] uppercase mb-2" style={{ color: "var(--color-cu)" }}>
          Dashboard
        </div>
        <h1 className="font-display text-4xl md:text-5xl tracking-wide uppercase" style={{ color: "var(--color-white)" }}>
          Idag
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="rounded-xl p-5" style={{ background: "rgba(250,247,243,0.05)", border: "1px solid rgba(250,247,243,0.1)" }}>
            <div className="font-mono text-[8px] tracking-[1.3px] uppercase mb-2" style={{ color: "rgba(250,247,243,0.4)" }}>{kpi.label}</div>
            <div className="font-display text-3xl tracking-wide" style={{ color: "var(--color-cu)" }}>{kpi.value}</div>
            <div className="font-mono text-[8px] tracking-[1px] uppercase mt-1" style={{ color: "rgba(250,247,243,0.35)" }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {QUICK_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-xl p-5 block transition-all hover:scale-[1.02]"
            style={{ background: "var(--color-cu)", color: "var(--color-dark)" }}
          >
            <div className="font-display text-xl tracking-wider uppercase mb-1">{l.label}</div>
            <div className="text-sm" style={{ color: "rgba(15,10,6,0.65)" }}>{l.desc}</div>
          </Link>
        ))}
      </div>

      <div className="rounded-xl p-6" style={{ background: "rgba(250,247,243,0.04)", border: "1px solid rgba(250,247,243,0.08)" }}>
        <div className="font-mono text-[8.5px] tracking-[1.3px] uppercase mb-4" style={{ color: "rgba(250,247,243,0.4)" }}>
          Senaste transaktioner
        </div>
        <p className="text-sm" style={{ color: "rgba(250,247,243,0.35)" }}>
          Inga transaktioner idag. Starta en ny mottagning för att registrera.
        </p>
      </div>
    </div>
  );
}
