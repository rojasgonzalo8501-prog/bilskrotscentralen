import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Metallhandel — köp av koppar, aluminium & skrotmetall",
  description:
    "Vi köper koppar, aluminium, järnskrot, mässing och rostfritt från företag och privatpersoner i hela Sverige. Dagsaktuella LME-priser utan dolda avdrag.",
};

const METALS = [
  {
    name: "Koppar",
    icon: "🟤",
    grade: "1A blankt · Kabelkoppar · Rörkoppar",
    price: "68–74 kr/kg",
    desc: "Kablar, rör, plåt och ledning. Bäst betalt för rent, osorterat material utan isolering.",
  },
  {
    name: "Aluminium",
    icon: "⬜",
    grade: "Profil · Gjutgods · Folier",
    price: "14–18 kr/kg",
    desc: "Fönsterprofiler, gjutgods, fordonsdelar och aluminiumplåt. Priset varierar med legering.",
  },
  {
    name: "Järnskrot",
    icon: "⬛",
    grade: "Blandat järn · Konstruktionsstål",
    price: "1,80–2,40 kr/kg",
    desc: "Stålbalkar, gjutjärn, maskiner och tyngre konstruktioner. Volymbonus vid större leveranser.",
  },
  {
    name: "Mässing",
    icon: "🟡",
    grade: "Blankt · Blandad mässing",
    price: "38–44 kr/kg",
    desc: "Kranar, armaturer, svarvstickor och ventiler. Sorterat material ger högre pris.",
  },
  {
    name: "Rostfritt stål",
    icon: "🔘",
    grade: "304 · 316 · Blandat",
    price: "12–16 kr/kg",
    desc: "Serveringsutrustning, tankar, balustrad och rör. Pris beror på nickelhalt (grade).",
  },
  {
    name: "Bly",
    icon: "🔵",
    grade: "Rent bly · Batteribly",
    price: "14–17 kr/kg",
    desc: "Plomber, kabelmantel och ackumulatorbly. Hanteras i enlighet med miljölagstiftning.",
  },
];

const SERVICES = [
  {
    title: "Privatpersoner",
    desc: "Kör in ditt skrotmetall till oss på Industrivägen 12 i Enköping, måndag–fredag. Väg och betalt direkt.",
    cta: null,
  },
  {
    title: "Företag & industri",
    desc: "Vi hämtar större volymer direkt från er anläggning. Avtal, transportdokumentation och vägning ingår.",
    cta: "Kontakta oss",
  },
  {
    title: "Rivning & sanering",
    desc: "Samarbetar ni med rivningsprojekt? Vi hanterar klassificering, transport och återvinning av all metallhaltigt material.",
    cta: "Begär offert",
  },
];

export default function MetallPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 pt-32" style={{ background: "var(--color-dark)" }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <nav
            className="flex items-center gap-2 mb-8 text-xs"
            style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}
          >
            <Link href="/" style={{ color: "rgba(255,255,255,0.4)" }} className="hover:opacity-80 transition-opacity">
              HEM
            </Link>
            <span>›</span>
            <span style={{ color: "var(--color-cu)" }}>METALLHANDEL</span>
          </nav>

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-cu)",
              marginBottom: "1rem",
            }}
          >
            Köp & försäljning av skrotmetall
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              lineHeight: 0.95,
              letterSpacing: "0.03em",
              color: "var(--color-white)",
              marginBottom: "1.5rem",
            }}
          >
            VI BETALAR MARKNADENS
            <br />
            <span style={{ color: "var(--color-cu)" }}>BÄSTA METALLPRIS.</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
              color: "rgba(250,247,243,0.65)",
              maxWidth: "520px",
              lineHeight: 1.6,
            }}
          >
            Prissatt dagligen mot London Metal Exchange. Inga mellanhänder, inga schabloner.
          </p>
        </div>
      </section>

      {/* Price table */}
      <section style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" }} className="py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-cu)", marginBottom: "0.75rem" }}>
            Dagsaktuella priser
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              lineHeight: 1,
              letterSpacing: "0.03em",
              color: "var(--color-txt)",
              marginBottom: "0.5rem",
            }}
          >
            INKÖPSPRISER
          </h2>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--color-txt2)", fontSize: "0.9rem", marginBottom: "3rem" }}>
            Priserna uppdateras vardagar. Ring för aktuell notering vid större volymer.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {METALS.map((m) => (
              <div
                key={m.name}
                style={{
                  background: "var(--color-panel)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                }}
              >
                <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{m.icon}</div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", letterSpacing: "0.03em", color: "var(--color-txt)", margin: 0 }}>
                    {m.name}
                  </h3>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", fontWeight: 700, color: "var(--color-cu)", whiteSpace: "nowrap" }}>
                    {m.price}
                  </span>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-txt2)", marginBottom: "0.75rem" }}>
                  {m.grade}
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--color-txt2)", lineHeight: 1.6, margin: 0 }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.06em", color: "var(--color-txt2)", marginTop: "2rem", fontStyle: "italic" }}>
            * Priser exkl. moms. Slutpris fastställs vid vägning. Priser gäller fr.o.m. veckans LME-notering.
          </p>
        </div>
      </section>

      {/* Services */}
      <section style={{ background: "var(--color-bg2)", borderBottom: "1px solid var(--color-border)" }} className="py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-cu)", marginBottom: "0.75rem" }}>
            Hur det fungerar
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              lineHeight: 1,
              letterSpacing: "0.03em",
              color: "var(--color-txt)",
              marginBottom: "3rem",
            }}
          >
            VI KÖR FÖR ALLA
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                style={{
                  background: "var(--color-panel)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", letterSpacing: "0.02em", color: "var(--color-cu)", margin: 0 }}>
                  {s.title}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--color-txt2)", lineHeight: 1.65, margin: 0 }}>
                  {s.desc}
                </p>
                {s.cta && (
                  <a
                    href="tel:017121002"
                    className="btn-cu"
                    style={{ marginTop: "auto", alignSelf: "flex-start", padding: "0.6rem 1.2rem", fontSize: "0.72rem" }}
                  >
                    {s.cta}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opening hours + contact */}
      <section style={{ background: "var(--color-dark)" }} className="py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-cu)", marginBottom: "1rem" }}>
                Öppettider inlämning
              </p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--color-white)", marginBottom: "1.5rem", lineHeight: 1 }}>
                VÄLKOMMEN TILL ANLÄGGNINGEN
              </h2>
              <dl style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", lineHeight: 2, margin: 0 }}>
                {[
                  ["Måndag – Torsdag", "07:00 – 16:30"],
                  ["Fredag", "07:00 – 15:00"],
                  ["Lördag – Söndag", "Stängt"],
                ].map(([day, time]) => (
                  <div key={day} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0.4rem 0" }}>
                    <dt style={{ color: "rgba(250,247,243,0.55)" }}>{day}</dt>
                    <dd style={{ color: "var(--color-cu)", fontFamily: "var(--font-mono)", fontSize: "0.82rem", margin: 0 }}>{time}</dd>
                  </div>
                ))}
              </dl>
              <address style={{ fontStyle: "normal", marginTop: "1.5rem", fontFamily: "var(--font-body)", color: "rgba(250,247,243,0.5)", fontSize: "0.85rem", lineHeight: 1.8 }}>
                Industrivägen 12<br />
                745 35 Enköping<br />
                <a href="tel:017121002" style={{ color: "var(--color-cu)", textDecoration: "none" }}>0171-210 02</a>
              </address>
            </div>

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "1rem" }}>
              <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", color: "rgba(250,247,243,0.7)", lineHeight: 1.6, margin: 0 }}>
                Osäker på vilket pris du kan förvänta dig? Ring oss — vi svarar snabbt och ärligt.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <a href="tel:017121002" className="btn-cu">Ring 0171-210 02</a>
                <a href="mailto:info@rensona.se" className="btn-ghost">info@rensona.se</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
