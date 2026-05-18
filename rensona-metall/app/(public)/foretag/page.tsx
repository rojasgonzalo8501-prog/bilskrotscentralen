import type { Metadata } from "next";
import { COMPANY } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Företagstjänster – Rensona Metall",
  description: "Metallskrotshantering för företag. Hämtning i hela Sverige, containertjänst, dokumentation och KYC. Boka företagsavtal.",
};

const SERVICES = [
  {
    title: "Containerhämtning",
    desc: "Vi levererar container, hämtar när den är full. Fungerar för verkstäder, industrier och byggprojekt.",
    price: "Offert",
  },
  {
    title: "Regelbunden hämtning",
    desc: "Schemalagda hämtningar varje vecka eller månad. Egna fordon med lastbilsflak i Mälardalen.",
    price: "Fr. 1 200 kr/hämtning",
  },
  {
    title: "Engångshämtning",
    desc: "Stor mängd skrot på en gång? Vi hämtar direkt utan abonnemang.",
    price: "Offert",
  },
  {
    title: "Dokumentation & rapportering",
    desc: "Komplett kvittens, vägningsprotokoll och årsrapport för er miljöredovisning.",
    price: "Ingår",
  },
];

const INDUSTRIES = [
  "Verkstäder & tillverkningsindustri",
  "Byggbolag & rivningsentreprenörer",
  "Fastighetsförvaltare",
  "Bilverkstäder & däckfirmor",
  "El- och VVS-installatörer",
  "Kommuner & statliga bolag",
];

export default function ForetagPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-28 px-5 md:px-10 lg:px-14" style={{ background: "var(--color-dark)", color: "var(--color-white)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px" style={{ background: "var(--color-cu-b)" }} />
            <span className="font-mono text-[8.5px] tracking-[1.8px] uppercase" style={{ color: "var(--color-cu-b)" }}>Företag</span>
          </div>
          <h1 className="font-display text-[48px] md:text-[72px] lg:text-[88px] leading-[0.9] tracking-wide uppercase mb-4">
            Vi hämtar.<br />
            <span style={{ color: "var(--color-cu)" }}>Ni får betalt.</span>
          </h1>
          <p className="font-serif-it text-xl md:text-2xl max-w-2xl mb-10" style={{ color: "rgba(250,247,243,0.6)" }}>
            Metallskrotshantering för företag — containertjänst, schemalagda hämtningar och full dokumentation.
          </p>
          <a href={`mailto:${COMPANY.email}?subject=Företagsavtal`} className="btn-cu" style={{ display: "inline-block" }}>
            Kontakta oss för offert →
          </a>
        </div>
      </section>

      {/* Tjänster */}
      <section className="py-16 md:py-24 px-5 md:px-10 lg:px-14" style={{ background: "var(--color-bg)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px" style={{ background: "var(--color-cu)" }} />
            <span className="font-mono text-[8.5px] tracking-[1.8px] uppercase" style={{ color: "var(--color-cu)" }}>Tjänster</span>
          </div>
          <h2 className="font-display text-[40px] md:text-[56px] leading-[0.92] tracking-wide uppercase mb-10" style={{ color: "var(--color-txt)" }}>
            Vad vi erbjuder.
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {SERVICES.map((s) => (
              <div key={s.title} className="rounded-2xl p-7" style={{ background: "var(--color-white)", border: "1px solid rgba(0,0,0,0.08)" }}>
                <div className="font-mono text-[8.5px] tracking-[1.3px] uppercase mb-2" style={{ color: "var(--color-cu)" }}>★</div>
                <h3 className="font-display text-2xl tracking-wider uppercase mb-3" style={{ color: "var(--color-txt)" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--color-txt2)" }}>{s.desc}</p>
                <div className="font-mono text-[9.5px] tracking-[1.2px] uppercase" style={{ color: "var(--color-cu)" }}>{s.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branscher */}
      <section className="py-16 md:py-24 px-5 md:px-10 lg:px-14" style={{ background: "var(--color-dark)", color: "var(--color-white)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px" style={{ background: "var(--color-cu-b)" }} />
            <span className="font-mono text-[8.5px] tracking-[1.8px] uppercase" style={{ color: "var(--color-cu-b)" }}>Branscher</span>
          </div>
          <h2 className="font-display text-[40px] md:text-[56px] leading-[0.92] tracking-wide uppercase mb-10">
            Vi jobbar med.
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INDUSTRIES.map((ind) => (
              <div key={ind} className="rounded-xl px-5 py-4 flex items-center gap-3" style={{ background: "rgba(250,247,243,0.05)", border: "1px solid rgba(250,247,243,0.1)" }}>
                <span style={{ color: "var(--color-cu)" }}>✓</span>
                <span className="text-sm" style={{ color: "rgba(250,247,243,0.8)" }}>{ind}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-5 md:px-10 lg:px-14" style={{ background: "var(--color-cu)", color: "var(--color-dark)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-[40px] md:text-[56px] leading-[0.92] tracking-wide uppercase mb-4">
            Redo att börja?
          </h2>
          <p className="font-serif-it text-xl mb-8" style={{ color: "rgba(15,10,6,0.65)" }}>
            Kontakta oss för skräddarsytt avtal.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="font-display text-2xl tracking-wider uppercase">
              {COMPANY.phone}
            </a>
            <span style={{ color: "rgba(15,10,6,0.4)" }}>·</span>
            <a href={`mailto:${COMPANY.email}`} className="font-mono text-sm tracking-[1px]">
              {COMPANY.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
