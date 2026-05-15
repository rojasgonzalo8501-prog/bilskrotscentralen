import type { Metadata } from "next";
import Link from "next/link";
import { SkrotaForm } from "./SkrotaForm";

export const metadata: Metadata = {
  title: "Boka bilskrotning — gratis hämtning i Mälardalen",
  description:
    "Boka gratis upphämtning av din bil. Auktoriserad bilskrotning i Enköping. Slå upp ditt regnummer och få ett estimerat erbjudande direkt.",
};

const STEPS = [
  { n: "1", title: "Ange regnummer", desc: "Slå upp ditt fordon och se ett estimerat erbjudande direkt." },
  { n: "2", title: "Fyll i kontaktinfo", desc: "Namn, telefon och adress där bilen står." },
  { n: "3", title: "Vi ringer tillbaka", desc: "Bekräftelse och hämtningstid inom 2 timmar på kontorstid." },
  { n: "4", title: "Betalt vid hämtning", desc: "Swish, bankgiro eller kontant — du väljer." },
];

export default function SkrotaPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="py-24 pt-32" style={{ background: "var(--color-dark)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <nav className="flex items-center justify-center gap-2 mb-8 text-xs" style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.4)" }} className="hover:opacity-80 transition-opacity">HEM</Link>
            <span>›</span>
            <span style={{ color: "var(--color-cu)" }}>BOKA SKROTNING</span>
          </nav>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem,6vw,5rem)", letterSpacing: "0.02em", color: "var(--color-white)", lineHeight: 1 }}>
            BOKA GRATIS HÄMTNING
          </h1>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--color-cu-b)" }}>
            Vi hämtar din bil utan kostnad i hela Mälardalen
          </p>
        </div>
      </section>

      {/* ── Steps strip ── */}
      <section style={{ background: "var(--color-bg2)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-white"
                  style={{ background: "var(--color-cu)", fontFamily: "var(--font-mono)" }}>
                  {n}
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "var(--color-txt)" }}>{title}</div>
                  <div className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--color-txt2)" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main ── */}
      <section className="py-16" style={{ background: "var(--color-bg)" }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr,340px] gap-12 items-start">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-black mb-2" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em", color: "var(--color-txt)", fontSize: "2rem" }}>
                SKROTNINGSFÖRFRÅGAN
              </h2>
              <p className="text-sm mb-8" style={{ color: "var(--color-txt2)" }}>
                Fyll i formuläret nedan så ringer vi upp med bekräftelse och tid.
              </p>
              <SkrotaForm />
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block sticky top-24 space-y-4">
              {/* Contact card */}
              <div className="rounded-2xl p-5 border" style={{ background: "var(--color-panel)", borderColor: "var(--color-border2)" }}>
                <div className="text-xs mb-1" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-txt2)" }}>Ring direkt</div>
                <a href="tel:017121002" className="text-2xl font-black hover:opacity-80 transition-opacity" style={{ fontFamily: "var(--font-display)", color: "var(--color-cu)", letterSpacing: "0.04em" }}>
                  0171-210 02
                </a>
                <div className="text-xs mt-1" style={{ color: "var(--color-txt2)", fontFamily: "var(--font-mono)" }}>
                  Mån–Tors 08:00–17:00 · Fre 08:00–15:00
                </div>
              </div>

              {/* Trust items */}
              <div className="rounded-2xl p-5 border space-y-3" style={{ background: "var(--color-panel)", borderColor: "var(--color-border)" }}>
                {[
                  ["✅", "Gratis hämtning", "Ingen kostnad för transport"],
                  ["💰", "Betalt direkt", "Swish vid upphämtning"],
                  ["📋", "Vi sköter pappren", "Avregistrering ingår"],
                  ["♻️", "98% återvinns", "EU ELV-certifierat"],
                ].map(([icon, title, desc]) => (
                  <div key={title} className="flex gap-3 items-start">
                    <span className="text-lg shrink-0">{icon}</span>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: "var(--color-txt)" }}>{title}</div>
                      <div className="text-xs" style={{ color: "var(--color-txt2)" }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Address */}
              <div className="rounded-2xl p-5 border" style={{ background: "var(--color-panel)", borderColor: "var(--color-border)" }}>
                <div className="text-xs mb-2" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-txt2)" }}>Besöksadress</div>
                <div className="text-sm font-semibold" style={{ color: "var(--color-txt)" }}>Magasingatan 2</div>
                <div className="text-sm" style={{ color: "var(--color-txt2)" }}>749 35 Enköping</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
