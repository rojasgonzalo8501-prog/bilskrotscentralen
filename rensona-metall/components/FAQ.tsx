"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  { q: "Vilka material köper ni?", a: "Vi köper alla typer av metallskrot — koppar, mässing, aluminium, järn, stål, bly, zink, rostfritt och specialmetaller. Se prislistan för dagspriser. Vi tar INTE emot vitvaror (kylar, frysar, tvättmaskiner) — dessa lämnas på återvinningscentralen." },
  { q: "Hur snabbt får jag betalt?", a: "Cash direkt vid leverans. Vi väger materialet på plats, beräknar priset, och betalar via Swish, bankgiro eller kontant. Allt sker på 5–10 minuter beroende på mängd." },
  { q: "Behöver jag boka tid?", a: "Nej, drop-in funkar alltid. Bara kom in under öppettider. Vid större volymer (en hel container) — ring oss så vi förbereder." },
  { q: "Vad ska jag ta med?", a: "Bara legitimation (körkort eller ID-kort). Vid bilskrotning behöver vi registreringsbevis del 2 (gula). Vid företag behöver vi F-skattesedel och org.nr." },
  { q: "Tar ni emot kontant?", a: "Ja, för mindre belopp. Vid belopp över 58 000 kr (5 000 EUR) krävs extra ID-kontroll enligt penningtvättslagen. Vi rekommenderar Swish eller bankgiro för snabbast och säkrast hantering." },
  { q: "Hur prissätter ni materialet?", a: "Priserna baseras på dagsaktuella marknadspriser från London Metal Exchange (LME) och kvaliteten på materialet. Ren och sorterad metall ger högre pris. Se vår live prislista för aktuella priser." },
  { q: "Vad händer efter att jag lämnat skrotet?", a: "Cirka 98% av materialet återvinns enligt EU:s ELV-direktiv. Metallen sorteras och säljs vidare till svenska stålverk och raffinaderier." },
  { q: "Erbjuder ni hämtning?", a: "Ja, för företag och vid större volymer (>500 kg). Vi har egna fordon i Mälardalen. Boka via vår företagstjänst eller ring oss." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 px-5 md:px-10 lg:px-14" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-px" style={{ background: "var(--color-cu)" }} />
          <span className="font-mono text-[8.5px] tracking-[1.8px] uppercase" style={{ color: "var(--color-cu)" }}>Frågor & svar</span>
        </div>
        <h2 className="font-display text-[40px] md:text-[56px] leading-[0.92] tracking-wide uppercase mb-8" style={{ color: "var(--color-txt)" }}>
          Vanliga<br />frågor.
        </h2>

        <div>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left py-5 flex items-center justify-between gap-4"
              >
                <h4 className="font-body font-medium text-sm md:text-base leading-snug" style={{ color: "var(--color-txt)" }}>
                  {item.q}
                </h4>
                <div className="flex-shrink-0 w-7 h-7 rounded-full border grid place-items-center transition-all"
                  style={open === i
                    ? { background: "var(--color-cu)", borderColor: "var(--color-cu)" }
                    : { background: "rgba(200,121,65,0.08)", borderColor: "rgba(200,121,65,0.25)" }
                  }>
                  <div className="relative w-3 h-3">
                    <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px block"
                      style={{ background: open === i ? "white" : "var(--color-cu)" }} />
                    <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px block transition-transform"
                      style={{ background: open === i ? "white" : "var(--color-cu)", transform: open === i ? "scaleY(0)" : "scaleY(1)" }} />
                  </div>
                </div>
              </button>
              <div className={`overflow-hidden transition-all ${open === i ? "max-h-96 pb-5" : "max-h-0"}`}>
                <p className="font-body text-sm leading-relaxed max-w-2xl" style={{ color: "var(--color-txt2)" }}>
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
