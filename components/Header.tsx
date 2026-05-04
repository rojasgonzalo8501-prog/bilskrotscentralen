"use client";
import { useState } from "react";
import Link from "next/link";
import type { Session } from "@/lib/auth";
import { useCart } from "@/components/CartContext";
import ThemeToggle from "@/components/ThemeToggle";

const NAV = [
  { href: "/bildelar",     label: "Bildelar",     dropdown: true },
  { href: "/mercedes",     label: "Mercedes",     highlight: true },
  { href: "/bilrutor",     label: "Bilrutor",     highlight: false },
  { href: "/skrota-bilen", label: "Skrota bilen" },
  { href: "/verkstad",     label: "Verkstad" },
  { href: "/guider",       label: "Guider" },
  { href: "/om-oss",       label: "Om oss" },
];

export default function Header({ session }: { session: Session | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bildelarOpen, setBildelarOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-dark-800)] border-b border-[var(--color-dark-600)] shadow-sm">
      {/* ─── Announcement bar ─── */}
      <div className="bg-[var(--color-dark-900)] text-[var(--color-text-muted)] text-[11px] sm:text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <span className="truncate">
            <span className="hidden sm:inline">📍 Magasingatan 2, Enköping — Gratis upphämtning i hela Mälardalen</span>
            <span className="sm:hidden">📍 Enköping — Gratis upphämtning</span>
          </span>
          <div className="flex gap-3 sm:gap-4 items-center shrink-0">
            <a href="tel:+46171210002" className="flex items-center gap-1.5 hover:text-[var(--color-brand-orange)] transition-colors">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              0171-210 02
            </a>
            <a href="mailto:info@bilskrotscentralen.com" className="hover:text-[var(--color-brand-orange)] transition-colors hidden sm:block">
              info@bilskrotscentralen.com
            </a>
          </div>
        </div>
      </div>

      {/* ─── Main nav ─── */}
      <div className="max-w-7xl mx-auto px-4 h-24 sm:h-28 lg:h-32 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Bilskrotscentralen" className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-contain shrink-0" />
          <div className="leading-tight min-w-0">
            <div className="font-black text-[var(--color-text-primary)] text-sm sm:text-base lg:text-lg tracking-tight truncate">BILSKROTSCENTRALEN</div>
            <div className="text-xs sm:text-sm text-[var(--color-text-muted)] truncate hidden sm:block">Bildemontering &amp; Reservdelar</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {/* Bildelar dropdown */}
          <div className="relative" onMouseEnter={() => setBildelarOpen(true)} onMouseLeave={() => setBildelarOpen(false)}>
            <Link href="/bildelar" className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-dark-700)] transition-colors">
              Bildelar
              <svg className={`w-3.5 h-3.5 transition-transform ${bildelarOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </Link>
            {bildelarOpen && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-[var(--color-dark-800)] border border-[var(--color-dark-600)] rounded-xl shadow-xl overflow-hidden z-50">
                <Link href="/bildelar" className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-700)] hover:text-[var(--color-brand-orange)] transition-colors">
                  <span className="text-base">🔧</span>
                  <div>
                    <div className="font-medium text-[var(--color-text-primary)]">Begagnade bildelar</div>
                    <div className="text-xs text-[var(--color-text-muted)]">Originaldelar med garanti</div>
                  </div>
                </Link>
                <div className="border-t border-[var(--color-dark-600)]" />
                <Link href="/nya-bildelar" className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-700)] hover:text-[var(--color-brand-orange)] transition-colors">
                  <span className="text-base">✨</span>
                  <div>
                    <div className="font-medium text-[var(--color-text-primary)]">Nya bildelar</div>
                    <div className="text-xs text-[var(--color-text-muted)]">Fabriksnya reservdelar</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {NAV.filter(n => !n.dropdown).map((n) => {
            const { href, label } = n;
            const highlight = "highlight" in n && n.highlight;
            const recycle = "recycle" in n && n.recycle;
            const cls = recycle
              ? "text-emerald-400 hover:bg-[var(--color-dark-700)]"
              : highlight
              ? "text-[var(--color-brand-orange)] hover:bg-[var(--color-dark-700)]"
              : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-dark-700)]";
            return (
              <a key={href} href={href} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${cls}`}>
                {label}
              </a>
            );
          })}
          {session?.role === "admin" && (
            <a href="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-dark-700)] transition-colors">
              Admin
            </a>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Link href="/bildelar" className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-dark-700)] text-[var(--color-text-muted)] text-sm hover:bg-[var(--color-dark-600)] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <span className="hidden md:block">Sök bildelar…</span>
          </Link>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Cart with badge */}
          <CartButton />

          {/* Account */}
          {session ? (
            <a
              href={session.role === "admin" ? "/admin" : "/konto"}
              className="hidden sm:flex p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-700)] transition-colors"
              aria-label="Mitt konto"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </a>
          ) : (
            <div className="hidden sm:flex items-center gap-1">
              <a
                href="/logga-in"
                className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-dark-700)] transition-colors"
              >
                Logga in
              </a>
              <a
                href="/skapa-konto"
                className="px-3 py-2 rounded-lg text-sm font-semibold text-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange)]/10 transition-colors"
              >
                Skapa konto
              </a>
            </div>
          )}

          {/* CTA */}
          <Link href="/skrota-bilen" className="hidden sm:block px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-dark)] transition-colors whitespace-nowrap">
            Skrota bilen
          </Link>

          {/* Mobile burger */}
          <button className="lg:hidden p-2 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-700)]" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Meny">
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ─── Mobile menu ─── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--color-dark-600)] bg-[var(--color-dark-800)]">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            <Link href="/bildelar" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-700)] hover:text-[var(--color-text-primary)]">Begagnade bildelar</Link>
            <Link href="/nya-bildelar" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-700)] hover:text-[var(--color-text-primary)]">Nya bildelar</Link>
            {NAV.filter(n => !n.dropdown).map(({ href, label }) => (
              <a key={href} href={href} onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-700)] hover:text-[var(--color-text-primary)]">
                {label}
              </a>
            ))}
            {session?.role === "admin" && (
              <a href="/admin" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-700)] hover:text-[var(--color-text-primary)]">Admin</a>
            )}

            {/* Account links */}
            <div className="mt-2 pt-2 border-t border-[var(--color-dark-600)]">
              {session ? (
                <a href={session.role === "admin" ? "/admin" : "/konto"} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-700)]">
                  Mitt konto
                </a>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <a href="/logga-in" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-md text-sm font-medium text-center text-[var(--color-text-secondary)] border border-[var(--color-dark-500)] hover:bg-[var(--color-dark-700)]">
                    Logga in
                  </a>
                  <a href="/skapa-konto" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-md text-sm font-semibold text-center text-white bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-dark)]">
                    Skapa konto
                  </a>
                </div>
              )}
            </div>

            <Link href="/skrota-bilen" onClick={() => setMobileOpen(false)}
              className="mt-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white text-center bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-dark)] transition-colors">
              Skrota bilen gratis
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function CartButton() {
  const { count } = useCart();
  return (
    <a href="/kassa" className="relative p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-700)] transition-colors" aria-label={`Varukorg${count > 0 ? ` (${count} varor)` : ""}`}>
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-1.684 2.355-3.325 3.61-4.894L18.75 8.25H5.25M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--color-brand-orange)] text-white text-[10px] font-bold flex items-center justify-center leading-none">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </a>
  );
}

