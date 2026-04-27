"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Car,
  Package,
  ShoppingBag,
  Search,
  Megaphone,
  Truck,
  Users,
  Upload,
  ExternalLink,
  LogOut,
  FileText,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import type { Role } from "@/lib/auth";

type NavItem = { href: string; icon: React.ReactNode; label: string };

const NAV: NavItem[] = [
  { href: "/admin",           icon: <LayoutDashboard size={18} />, label: "Dashboard"      },
  { href: "/admin/inventory", icon: <Package size={18} />,         label: "Lager"           },
  { href: "/admin/bilar",     icon: <Car size={18} />,             label: "Bilar"           },
  { href: "/admin/delar",     icon: <Package size={18} />,         label: "Delar"           },
  { href: "/admin/dropship",  icon: <Truck size={18} />,           label: "Dropship"        },
  { href: "/admin/ordrar",    icon: <ShoppingBag size={18} />,     label: "Ordrar"          },
  { href: "/admin/fakturor",  icon: <FileText size={18} />,        label: "Fakturor"        },
  { href: "/admin/kunder",    icon: <Users size={18} />,           label: "Kunder"          },
  { href: "/admin/eftersok",  icon: <Search size={18} />,          label: "Förfrågningar"   },
  { href: "/admin/annonser",  icon: <Megaphone size={18} />,       label: "Annonser"        },
  { href: "/admin/import",    icon: <Upload size={18} />,          label: "Importera"       },
];

const SUPERADMIN_NAV: NavItem[] = [
  { href: "/admin/anvandare", icon: <ShieldCheck size={18} />,     label: "Användare"       },
];

const EXTERNAL = [
  { href: "https://www.bildem.se",             label: "Bildem"             },
  { href: "https://www.bildelsbasen.se",       label: "Marknadsplats"      },
  { href: "https://www.transportstyrelsen.se", label: "Transportstyrelsen" },
];

export default function AdminSidebar({
  userName,
  role,
  logoutAction,
}: {
  userName: string;
  role: Role;
  logoutAction: () => Promise<void>;
}) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const nav = role === "superadmin" ? [...NAV, ...SUPERADMIN_NAV] : NAV;

  // Close drawer on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setOpen(false);
  }, [path]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[70] h-14 flex items-center justify-between px-3 border-b border-[var(--color-dark-500)] bg-[var(--color-dark-800)]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="p-2 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-700)]"
          aria-label="Öppna meny"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Bilskrotscentralen" className="w-8 h-8 object-contain" />
          <div className="font-bold text-xs tracking-tight">BILSKROTSCENTRALEN</div>
        </div>
        <Link
          href="/"
          className="p-2 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-dark-700)]"
          aria-label="Till sajten"
        >
          <ExternalLink size={18} />
        </Link>
      </div>

      {/* Backdrop on mobile when open */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-[75] bg-black/60"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static top-0 left-0 z-[80] h-full md:h-auto w-60 md:w-16 lg:w-60 shrink-0 border-r border-[var(--color-dark-500)] bg-[var(--color-dark-800)] flex flex-col transition-transform duration-200`}
      >
        {/* Logo / header */}
        <div className="h-14 md:h-16 flex items-center px-4 border-b border-[var(--color-dark-500)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Bilskrotscentralen" className="w-9 h-9 object-contain shrink-0" />
          <div className="ml-3 block md:hidden lg:block flex-1 min-w-0">
            <div className="font-bold text-sm leading-none tracking-tight truncate">BILSKROTSCENTRALEN</div>
            <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mt-1">
              {role === "superadmin" ? "Super Admin" : "Admin"}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="md:hidden ml-auto p-1.5 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-dark-700)]"
            aria-label="Stäng meny"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {nav.map(({ href, icon, label }) => {
            const active = path === href || (href !== "/admin" && path.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--color-brand-orange)] text-white"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-dark-700)]"
                }`}
              >
                <span className="shrink-0">{icon}</span>
                <span className="block md:hidden lg:block truncate">{label}</span>
              </Link>
            );
          })}

          <div className="pt-6 pb-2 px-3">
            <h3 className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest block md:hidden lg:block">
              Externt
            </h3>
            <div className="hidden md:block lg:hidden h-px bg-[var(--color-dark-500)]" />
          </div>

          {EXTERNAL.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-dark-700)] transition-colors"
            >
              <span className="shrink-0"><ExternalLink size={18} /></span>
              <span className="block md:hidden lg:block truncate">{label}</span>
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--color-dark-500)] space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-dark-700)] transition-colors"
          >
            <ExternalLink size={14} />
            <span className="block md:hidden lg:block">Till sajten</span>
          </Link>
          <div className="block md:hidden lg:block px-3 pt-2 pb-1">
            <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
              Inloggad som
            </div>
            <div className="text-xs font-semibold text-[var(--color-text-primary)] truncate">
              {userName}
            </div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-orange)] hover:bg-[var(--color-dark-700)] transition-colors"
            >
              <LogOut size={16} className="shrink-0" />
              <span className="block md:hidden lg:block">Logga ut</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
