import Link from "next/link";
import { COMPANY } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/mottagning", label: "Mottagning" },
  { href: "/admin/transaktioner", label: "Transaktioner" },
  { href: "/admin/kunder", label: "Kunder" },
  { href: "/admin/priser", label: "Priser" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-dark)", color: "var(--color-white)" }}>
      <header style={{ background: "var(--color-dark)", borderBottom: "1px solid rgba(200,121,65,0.2)" }}>
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-display text-xl tracking-wider uppercase" style={{ color: "var(--color-cu)" }}>
              RENSONA <span style={{ color: "rgba(250,247,243,0.6)" }}>ADMIN</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="font-mono text-[9px] tracking-[1.5px] uppercase px-3 py-2 rounded transition-colors"
                  style={{ color: "rgba(250,247,243,0.55)" }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="font-mono text-[8.5px] tracking-[1.2px] uppercase" style={{ color: "rgba(250,247,243,0.3)" }}>
            {COMPANY.name}
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
