export function Compare() {
  return (
    <section className="py-16 md:py-20 px-5 md:px-10 lg:px-14" style={{ background: "var(--color-dark)", color: "var(--color-white)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-px" style={{ background: "var(--color-cu-b)" }} />
          <span className="font-mono text-[8.5px] tracking-[1.8px] uppercase" style={{ color: "var(--color-cu-b)" }}>Jämförelse</span>
        </div>
        <h2 className="font-display text-[40px] md:text-[56px] lg:text-[68px] leading-[0.92] tracking-wide uppercase mb-3">
          ÅVC vs{" "}
          <span style={{ color: "var(--color-cu-b)" }}>Rensona</span>
        </h2>
        <p className="font-serif-it text-lg md:text-xl max-w-xl mb-10" style={{ color: "rgba(250,247,243,0.55)" }}>
          Två val. Det smarta valet är uppenbart.
        </p>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* ÅVC */}
          <div className="rounded-2xl p-7 md:p-9" style={{ background: "rgba(250,247,243,0.05)", border: "1px solid rgba(250,247,243,0.1)" }}>
            <div className="font-mono text-[9px] tracking-[1.5px] uppercase mb-2" style={{ color: "rgba(250,247,243,0.4)" }}>Val 1</div>
            <h3 className="font-display text-3xl md:text-4xl tracking-wider uppercase mb-6" style={{ color: "rgba(250,247,243,0.7)" }}>
              Återvinningscentralen
            </h3>
            <ul className="space-y-3">
              {["Du får ingenting (0 kr)", "Köer och begränsade tider", "Bara visst material accepteras", "Du slänger värde"].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm" style={{ color: "rgba(250,247,243,0.6)" }}>
                  <span style={{ color: "var(--color-err)" }} className="mt-0.5">✗</span>{t}
                </li>
              ))}
            </ul>
          </div>

          {/* Rensona */}
          <div className="rounded-2xl p-7 md:p-9 relative" style={{ background: "var(--color-cu)", border: "1px solid var(--color-cu)" }}>
            <div className="absolute top-5 right-5 font-mono text-[9px] font-bold tracking-[1.5px] uppercase px-3 py-1 rounded-full"
              style={{ background: "var(--color-dark)", color: "var(--color-cu-b)" }}>
              ★ Smart
            </div>
            <div className="font-mono text-[9px] tracking-[1.5px] uppercase mb-2" style={{ color: "var(--color-dark)" }}>Val 2</div>
            <h3 className="font-display text-3xl md:text-4xl tracking-wider uppercase mb-6" style={{ color: "var(--color-dark)" }}>
              Rensona Metall
            </h3>
            <ul className="space-y-3">
              {["Cash direkt — bästa marknadspriset", "Drop-in när som helst under öppet", "Allt metall — koppar till skrotbilar", "Hämtning vid större volymer"].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm font-medium" style={{ color: "var(--color-dark)" }}>
                  <span className="font-bold mt-0.5">✓</span>{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
