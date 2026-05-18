"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/metall",   label: "Metallhandel" },
  { href: "/#how",     label: "Hur det funkar" },
  { href: "/#pris",    label: "Pris" },
  { href: "/#kontakt", label: "Kontakt" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-[var(--color-dark)]/90 border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className="text-[var(--color-cu)] leading-none"
            style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", letterSpacing: "0.04em" }}
          >
            RENSONA
          </span>
          <span
            className="text-white/90 leading-none hidden sm:block"
            style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", letterSpacing: "0.04em" }}
          >
            METALL
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-white/70 hover:text-[var(--color-cu-b)] transition-colors"
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="tel:017121002"
            className="hidden sm:block text-white/70 hover:text-[var(--color-cu-b)] transition-colors"
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}
          >
            0171-210 02
          </a>
          <Link
            href="/skrota"
            className="btn-cu"
            style={{ padding: "0.5rem 1.1rem", fontSize: "0.72rem" }}
          >
            Boka hämtning
          </Link>
        </div>
      </div>
    </nav>
  );
}
