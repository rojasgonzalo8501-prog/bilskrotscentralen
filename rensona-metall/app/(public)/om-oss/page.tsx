import type { Metadata } from "next";
import { COMPANY } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Om oss – Rensona Metall",
  description: "Rensona Metall — auktoriserad bilskrotare i Enköping sedan 1984. Läs om oss, vår historia och vårt miljöengagemang.",
};

const MILESTONES = [
  { year: "1984", text: "Grundades som Mercaskroten i Sverige AB i Enköping." },
  { year: "1997", text: "Auktorisering som bilskrotare — en av de första i Uppland." },
  { year: "2005", text: "Ny anläggning på Industrivägen 12 med modern invägning." },
  { year: "2015", text: "Rebranding till Rensona Metall. Onlineprislista lanseras." },
  { year: "2022", text: "Ny avfuktningsanläggning — 98% av material återvinns." },
  { year: "2026", text: "Digital mottagning och live-prissättning driftsätts." },
];

const TEAM = [
  { name: "Björn Lindgren", role: "VD & ägare", desc: "Tredje generationen Lindgren i metallbranschen." },
  { name: "Sonja Åberg", role: "Mottagningschef", desc: "20 år på anläggningen. Sköter kvalitetssäkring." },
  { name: "Marcus Pettersson", role: "Logistik", desc: "Ansvarar för hämtningar och containertransporter." },
];

export default function OmOssPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-28 px-5 md:px-10 lg:px-14" style={{ background: "var(--color-dark)", color: "var(--color-white)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px" style={{ background: "var(--color-cu-b)" }} />
            <span className="font-mono text-[8.5px] tracking-[1.8px] uppercase" style={{ color: "var(--color-cu-b)" }}>Om oss</span>
          </div>
          <h1 className="font-display text-[48px] md:text-[72px] lg:text-[88px] leading-[0.9] tracking-wide uppercase mb-4">
            40 år av<br />
            <span style={{ color: "var(--color-cu)" }}>metallhantverk.</span>
          </h1>
          <p className="font-serif-it text-xl md:text-2xl max-w-2xl" style={{ color: "rgba(250,247,243,0.6)" }}>
            Auktoriserad bilskrotare och metallhandlare i Enköping sedan 1984.
            Familjeägt. Lokalt. Schysst.
          </p>
        </div>
      </section>

      {/* Om bolaget */}
      <section className="py-16 md:py-24 px-5 md:px-10 lg:px-14" style={{ background: "var(--color-bg)" }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-start">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px" style={{ background: "var(--color-cu)" }} />
              <span className="font-mono text-[8.5px] tracking-[1.8px] uppercase" style={{ color: "var(--color-cu)" }}>Bolaget</span>
            </div>
            <h2 className="font-display text-[40px] md:text-[52px] leading-[0.92] tracking-wide uppercase mb-6" style={{ color: "var(--color-txt)" }}>
              Vem vi är.
            </h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--color-txt2)" }}>
              <p>
                {COMPANY.brand} drivs av {COMPANY.name} och är en av Mälardalens ledande aktörer inom metallskrot och bilskrotning.
                Vi är auktoriserade av Naturvårdsverket och följer alla krav i ELV-direktivet.
              </p>
              <p>
                Vår anläggning på {COMPANY.address} hanterar allt från ett kilo kopparkabel till kompletta bilflottor.
                Vi erbjuder rättvisa dagspriser baserade på London Metal Exchange och betalar direkt — kontant, Swish eller bankgiro.
              </p>
              <p>
                Miljöansvar är inte ett marknadsföringsknep för oss — det är grunden i verksamheten.
                Cirka 98% av allt material vi tar emot återvinns och säljs vidare till svenska stålverk och raffinaderier.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              ["Org.nr", COMPANY.org],
              ["Adress", COMPANY.address],
              ["Telefon", COMPANY.phone],
              ["E-post", COMPANY.email],
              ["Öppettider", COMPANY.hours],
              ["Auktorisation", "Naturvårdsverket · ELV-direktiv"],
              ["Grundat", "1984"],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-4 py-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                <span className="font-mono text-[9px] tracking-[1.2px] uppercase w-28 flex-shrink-0 pt-0.5" style={{ color: "var(--color-txt2)" }}>{label}</span>
                <span className="text-sm" style={{ color: "var(--color-txt)" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tidslinje */}
      <section className="py-16 md:py-24 px-5 md:px-10 lg:px-14" style={{ background: "var(--color-white)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px" style={{ background: "var(--color-cu)" }} />
            <span className="font-mono text-[8.5px] tracking-[1.8px] uppercase" style={{ color: "var(--color-cu)" }}>Historia</span>
          </div>
          <h2 className="font-display text-[40px] md:text-[52px] leading-[0.92] tracking-wide uppercase mb-10" style={{ color: "var(--color-txt)" }}>
            Milstolpar.
          </h2>

          <div className="space-y-0">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className="flex gap-6 pb-8 relative">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-[9px] font-bold flex-shrink-0"
                    style={{ background: "var(--color-cu)", color: "var(--color-dark)" }}>
                    {m.year.slice(2)}
                  </div>
                  {i < MILESTONES.length - 1 && (
                    <div className="w-px flex-1 mt-1" style={{ background: "rgba(200,121,65,0.2)" }} />
                  )}
                </div>
                <div className="pt-2 pb-4">
                  <div className="font-mono text-[9px] tracking-[1.2px] uppercase mb-1" style={{ color: "var(--color-cu)" }}>{m.year}</div>
                  <p className="text-sm" style={{ color: "var(--color-txt2)" }}>{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24 px-5 md:px-10 lg:px-14" style={{ background: "var(--color-bg)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px" style={{ background: "var(--color-cu)" }} />
            <span className="font-mono text-[8.5px] tracking-[1.8px] uppercase" style={{ color: "var(--color-cu)" }}>Teamet</span>
          </div>
          <h2 className="font-display text-[40px] md:text-[52px] leading-[0.92] tracking-wide uppercase mb-10" style={{ color: "var(--color-txt)" }}>
            Människorna.
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {TEAM.map((p) => (
              <div key={p.name} className="rounded-2xl p-7" style={{ background: "var(--color-white)", border: "1px solid rgba(0,0,0,0.08)" }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-display text-xl mb-4"
                  style={{ background: "rgba(200,121,65,0.12)", color: "var(--color-cu)" }}>
                  {p.name[0]}
                </div>
                <h3 className="font-display text-xl tracking-wider uppercase mb-1" style={{ color: "var(--color-txt)" }}>{p.name}</h3>
                <div className="font-mono text-[8.5px] tracking-[1.2px] uppercase mb-3" style={{ color: "var(--color-cu)" }}>{p.role}</div>
                <p className="text-sm" style={{ color: "var(--color-txt2)" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
