import { COMPANY } from "@/lib/utils";

export function HittaHit() {
  return (
    <section id="hitta" className="py-16 md:py-24 px-5 md:px-10 lg:px-14" style={{ background: "var(--color-white)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-px" style={{ background: "var(--color-cu)" }} />
          <span className="font-mono text-[8.5px] tracking-[1.8px] uppercase" style={{ color: "var(--color-cu)" }}>Drop-in</span>
        </div>
        <h2 className="font-display text-[40px] md:text-[56px] lg:text-[68px] leading-[0.92] tracking-wide uppercase mb-3" style={{ color: "var(--color-txt)" }}>
          Kom in. <span style={{ color: "var(--color-cu)" }}>Få betalt.</span>
        </h2>
        <p className="font-serif-it text-lg md:text-xl max-w-xl mb-12" style={{ color: "var(--color-txt2)" }}>
          Bil, släp eller lätt lastbil — vi hjälper med avlastning på plats.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Hitta hit */}
          <div className="rounded-xl p-6" style={{ background: "var(--color-bg)", border: "1px solid rgba(0,0,0,0.08)" }}>
            <div className="font-mono text-[8.5px] tracking-[1.3px] uppercase mb-3" style={{ color: "var(--color-cu)" }}>★ Hitta hit</div>
            <h3 className="font-display text-2xl tracking-wider uppercase mb-3" style={{ color: "var(--color-txt)" }}>
              {COMPANY.address}
            </h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--color-txt2)" }}>
              Granne med Enköpings återvinningscentral. Lätt att hitta — skyltat från Industrivägen.
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-[9.5px] font-bold tracking-[1.3px] uppercase"
              style={{ color: "var(--color-cu)" }}
            >
              Öppna i Google Maps →
            </a>
          </div>

          {/* Öppettider */}
          <div className="rounded-xl p-6" style={{ background: "var(--color-bg)", border: "1px solid rgba(0,0,0,0.08)" }}>
            <div className="font-mono text-[8.5px] tracking-[1.3px] uppercase mb-3" style={{ color: "var(--color-cu)" }}>★ Öppettider</div>
            <h3 className="font-display text-2xl tracking-wider uppercase mb-3" style={{ color: "var(--color-txt)" }}>Öppet idag</h3>
            <div className="space-y-1.5 mb-4">
              {[["Mån–Tors", "07:00 – 16:30"], ["Fredag", "07:00 – 15:00"], ["Lördag–Söndag", "Stängt"]].map(([day, time]) => (
                <div key={day} className="flex justify-between text-sm">
                  <span style={{ color: "var(--color-txt2)" }}>{day}</span>
                  <span className="font-medium" style={{ color: "var(--color-txt)" }}>{time}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 font-mono text-[9.5px] tracking-[1.2px] uppercase" style={{ color: "var(--color-ok)" }}>
              <span className="w-2 h-2 rounded-full animate-blink" style={{ background: "var(--color-ok)" }} />
              Öppet nu
            </div>
          </div>

          {/* Vad du tar med */}
          <div className="rounded-xl p-6" style={{ background: "var(--color-bg)", border: "1px solid rgba(0,0,0,0.08)" }}>
            <div className="font-mono text-[8.5px] tracking-[1.3px] uppercase mb-3" style={{ color: "var(--color-cu)" }}>★ Vad du tar med</div>
            <h3 className="font-display text-2xl tracking-wider uppercase mb-3" style={{ color: "var(--color-txt)" }}>Ditt skrot + ID</h3>
            <ul className="space-y-2 mb-4">
              {["Legitimation (körkort/ID-kort)", "Vid bilskrotning: registreringsbevis del 2", "Vid företag: F-skatt + org.nr"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm" style={{ color: "var(--color-txt)" }}>
                  <span style={{ color: "var(--color-cu)" }} className="mt-0.5">✓</span>{t}
                </li>
              ))}
            </ul>
            <p className="text-xs italic" style={{ color: "var(--color-txt2)" }}>Vi hjälper med avlastning.</p>
          </div>
        </div>

        <div className="mt-10 rounded-xl p-5 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{ background: "rgba(200,121,65,0.08)", border: "1px solid rgba(200,121,65,0.2)" }}>
          <div>
            <div className="font-mono text-[9px] tracking-[1.2px] uppercase mb-1" style={{ color: "var(--color-txt2)" }}>Större volym?</div>
            <div className="font-display text-2xl tracking-wider uppercase" style={{ color: "var(--color-txt)" }}>Vi hämtar i hela Sverige</div>
          </div>
          <a href="/foretag" className="btn-cu" style={{ whiteSpace: "nowrap" }}>
            Företagstjänst →
          </a>
        </div>
      </div>
    </section>
  );
}
