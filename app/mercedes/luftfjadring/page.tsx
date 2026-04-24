import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mercedes luftfjädring — strutar, kompressorer, bälgar | Sveriges lägsta priser",
  description:
    "890+ Mercedes luftfjädringsdelar i lager. Strutar, bälgar, kompressorer (Wabco/AMK), nivågivare. E-klass, S-klass, ML, GLE, GLC. Garanti, fri frakt över 500 kr.",
  keywords: [
    "Mercedes luftfjädring",
    "luftfjädringsstrut Mercedes",
    "Mercedes kompressor",
    "Wabco luftfjädring",
    "AMK kompressor",
    "Airmatic Mercedes",
  ],
};

const LUFTFJADRING_PRODUCTS = [
  {
    name: "Luftfjädringsstrut fram",
    models: "E-klass W211/W212, S-klass W220/W221, CLS W219",
    priceFrom: 4500,
    icon: "🔧",
  },
  {
    name: "Luftfjädringsstrut bak",
    models: "ML W164/W166, GL X164, GLE W166",
    priceFrom: 3800,
    icon: "🔩",
  },
  {
    name: "Kompressor (Wabco)",
    models: "S-klass W220, ML W164, R-klass W251",
    priceFrom: 3200,
    icon: "💨",
  },
  {
    name: "Kompressor (AMK)",
    models: "E-klass W212, S-klass W221, GL X164",
    priceFrom: 2900,
    icon: "💨",
  },
  {
    name: "Luftbälg fram/bak",
    models: "Alla Airmatic-modeller",
    priceFrom: 1800,
    icon: "🎈",
  },
  {
    name: "Nivågivare",
    models: "Alla Airmatic-modeller",
    priceFrom: 850,
    icon: "📡",
  },
];

const COMPATIBLE_MODELS = [
  "E-klass W211 (2002–2009)",
  "E-klass W212 (2009–2016)",
  "S-klass W220 (1998–2005)",
  "S-klass W221 (2005–2013)",
  "S-klass W222 (2013–2020)",
  "CLS W219 (2004–2010)",
  "CLS W218 (2010–2018)",
  "ML W164 (2005–2011)",
  "ML W166 (2011–2015)",
  "GL X164 (2006–2012)",
  "GL X166 (2012–2016)",
  "GLE W166 (2015–2019)",
  "R-klass W251 (2005–2017)",
];

export default function LuftfjadringPage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-10 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-dark-900)] via-[#0d1117] to-[var(--color-dark-900)]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[var(--color-brand-orange)] opacity-[0.06] rounded-full blur-[120px]" />

        <div className="relative max-w-5xl mx-auto px-4">
          <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--color-brand-orange)]">Hem</Link>
            <span>›</span>
            <a href="/mercedes" className="hover:text-[var(--color-brand-orange)]">Mercedes</a>
            <span>›</span>
            <span className="text-[var(--color-text-secondary)]">Luftfjädring</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-brand-orange)]/30 bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange-light)] text-xs font-semibold tracking-wider uppercase mb-6">
            ★ 890+ luftfjädringsdelar i lager
          </div>

          <h1 className="text-4xl sm:text-6xl font-black leading-[1.05] tracking-tight mb-6">
            Mercedes <span className="gradient-text">luftfjädring</span>
            <br />
            <span className="text-[var(--color-text-secondary)] text-2xl sm:text-3xl font-bold">
              — Sveriges lägsta priser
            </span>
          </h1>

          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mb-10 leading-relaxed">
            Strutar, bälgar, kompressorer (Wabco & AMK), nivågivare och hela Airmatic-system.
            Vi har specialiserat oss på Mercedes luftfjädring sedan 1990-talet — det finns inte
            en enda komponent vi inte har sett.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <a href="/eftersok" className="btn-primary text-base px-6 py-3 rounded-xl">
              📨 Eftersök med OE-nummer
            </a>
            <a href="tel:017121002" className="btn-secondary text-base px-6 py-3 rounded-xl">
              📞 0171-210 02
            </a>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { v: "890+", l: "Delar i lager" },
              { v: "✓", l: "Funktionsgaranti" },
              { v: "Wabco", l: "+ AMK original" },
              { v: "1–3 dgr", l: "Leverans" },
            ].map((s) => (
              <div key={s.l} className="text-center p-4 rounded-xl bg-[var(--color-dark-800)] border border-[var(--color-dark-500)]">
                <div className="text-xl font-bold text-[var(--color-brand-orange)]">{s.v}</div>
                <div className="text-xs text-[var(--color-text-muted)] mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS ─── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-3">Luftfjädringsdelar i lager</h2>
          <p className="text-[var(--color-text-secondary)]">Priser från — alla testade och garanterade</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LUFTFJADRING_PRODUCTS.map((p) => (
            <div
              key={p.name}
              className="card-hover p-6 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)]"
            >
              <div className="text-4xl mb-3">{p.icon}</div>
              <h3 className="font-bold text-lg mb-2">{p.name}</h3>
              <p className="text-xs text-[var(--color-text-muted)] mb-4">{p.models}</p>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs text-[var(--color-text-muted)]">Från</div>
                  <div className="text-2xl font-black text-[var(--color-brand-orange)]">
                    {p.priceFrom.toLocaleString("sv-SE")} kr
                  </div>
                </div>
                <a href="/eftersok" className="text-sm text-[var(--color-brand-orange)] hover:underline">
                  Förfråga →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── COMPATIBLE MODELS ─── */}
      <section className="bg-[var(--color-dark-800)] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-3">Modeller vi har luftfjädring till</h2>
            <p className="text-[var(--color-text-secondary)]">Hittar du inte din modell? Ring oss — vi har troligen den ändå.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {COMPATIBLE_MODELS.map((m) => (
              <div
                key={m}
                className="px-4 py-3 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-sm"
              >
                ✓ {m}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── KNOWLEDGE / SEO TEXT ─── */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-black mb-4">Kort om Mercedes luftfjädring</h2>
        <div className="prose prose-invert text-[var(--color-text-secondary)] space-y-4 leading-relaxed">
          <p>
            Mercedes-Benz har använt luftfjädring (ofta marknadsfört som <strong>Airmatic</strong>) på
            sina premiummodeller sedan slutet av 1990-talet. Systemet ger en överlägsen
            körkomfort, men komponenterna är slitdetaljer som vanligen behöver bytas vid 150 000 km.
          </p>
          <p>
            De vanligaste felen är <strong>läckande luftbälgar</strong> (bilen sjunker över natten),{" "}
            <strong>trasig kompressor</strong> (felmeddelande &quot;Visit Workshop&quot;) och{" "}
            <strong>defekta nivågivare</strong>. Att köpa nya delar kostar 15 000–30 000 kr per
            position. Begagnade originaldelar från oss kostar en bråkdel — och har samma
            funktionsgaranti.
          </p>
          <p>
            Vi köper hela bilar med fungerande luftfjädring, demonterar systemen försiktigt och
            funktionstestar varje komponent innan vi lagerlägger den. Om en kompressor inte håller
            trycket säljer vi den inte. Punkt.
          </p>
        </div>

        <div className="mt-10 p-6 rounded-xl bg-[var(--color-brand-orange)]/5 border border-[var(--color-brand-orange)]/30">
          <h3 className="font-bold mb-2">Behöver du hjälp att identifiera rätt del?</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            Skicka regnummer eller VIN så hittar Adam exakt rätt komponent — kostnadsfritt.
          </p>
          <a href="/eftersok" className="btn-primary inline-flex">📨 Skicka eftersökning →</a>
        </div>
      </section>
    </>
  );
}
