"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

const HeroCanvas = dynamic(
  () => import("@/components/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false }
);

// ─── HeroSection ─────────────────────────────────────────────────────────────

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = heroRef.current;
      if (!el) return;
      const max = el.clientHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      style={{ height: "240vh", position: "relative" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "var(--color-dark)",
        }}
      >
        {/* Full-bleed canvas */}
        <HeroCanvas scrollProgress={scrollProgress} />

        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 1.5rem",
            background: "linear-gradient(to bottom, rgba(15,10,6,0.55) 0%, rgba(15,10,6,0.3) 50%, rgba(15,10,6,0.7) 100%)",
          }}
        >
          {/* Ghost "RENSONA" */}
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(5rem, 16vw, 14rem)",
              lineHeight: 0.9,
              letterSpacing: "0.04em",
              color: "transparent",
              WebkitTextStroke: "2px var(--color-cu)",
              margin: 0,
            }}
          >
            RENSONA
          </h1>

          {/* Solid "METALL." */}
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(5rem, 16vw, 14rem)",
              lineHeight: 0.9,
              letterSpacing: "0.04em",
              color: "var(--color-white)",
              margin: 0,
            }}
          >
            METALL.
          </h1>

          {/* Subheading */}
          <p
            className="font-serif-it"
            style={{
              fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)",
              color: "var(--color-cu)",
              marginTop: "1.25rem",
              marginBottom: "2.5rem",
            }}
          >
            Vi skrotar smart.
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/skrota" className="btn-cu">
              Boka hämtning
            </Link>
            <a href="#how" className="btn-ghost">
              Se hur det funkar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TICKER_TEXT =
  "AUKTORISERAD BILDEMONTERING · KOSTNADSFRI HÄMTNING · LME-PRISSÄTTNING · SKROTNINGSINTYG · EU ELV-DIREKTIV · 40 ÅRS ERFARENHET · ";

const TRUST_STATS = [
  { number: "12 400+", label: "Skrotade bilar" },
  { number: "98%",     label: "Återvinningsgrad" },
  { number: "3 850 kr", label: "Genomsnittlig skrotpremie" },
  { number: "24h",     label: "Svarstid" },
];

const HOW_STEPS = [
  {
    n: "01",
    title: "Ange regnumret",
    desc: "Autofyll via Transportstyrelsen — fordonets uppgifter hämtas direkt.",
  },
  {
    n: "02",
    title: "Få ditt pris",
    desc: "Realtids LME-prissättning ger dig alltid ett rättvist och transparent erbjudande.",
  },
  {
    n: "03",
    title: "Boka hämtning",
    desc: "Swish · Bankgiro · Kontant. Vi kommer till dig, du väljer betalningssätt.",
  },
];

const PROCESS_STEPS = [
  { title: "Ange regnummer",      desc: "Fyll i ditt registreringsnummer så hämtar vi fordonets data automatiskt." },
  { title: "Få erbjudande",       desc: "Inom 24 timmar presenterar vi ett pris baserat på vikt och dagens metallkurser." },
  { title: "Boka upphämtning",    desc: "Välj datum och tid som passar dig — vi finns i hela Mälardalen." },
  { title: "Vi hämtar bilen",     desc: "Vårt team anländer i tid och tar hand om bilen säkert och professionellt." },
  { title: "Du får betalt & intyg", desc: "Betalning direkt via Swish, bankgiro eller kontant. Skrotningsintyg skickas digitalt." },
];

const FEATURES = [
  {
    icon: "🚛",
    title: "Gratis hämtning",
    desc: "Vi kör till dig i hela Mälardalen, oavsett bilens skick.",
  },
  {
    icon: "💰",
    title: "Marknadens bästa pris",
    desc: "LME-kopplad prissättning, inga dolda avdrag.",
  },
  {
    icon: "⚡",
    title: "Svar inom 24h",
    desc: "Ring eller boka online, vi återkommer snabbt.",
  },
  {
    icon: "📋",
    title: "Vi sköter pappren",
    desc: "Avregistrering hos Transportstyrelsen ingår alltid.",
  },
  {
    icon: "♻️",
    title: "98% återvinning",
    desc: "EU ELV-certifierat. Inget av bilen hamnar på soptipp.",
  },
  {
    icon: "🔒",
    title: "Auktoriserad sedan 1984",
    desc: "Länsstyrelsen, Naturvårdsverket, Transportstyrelsen.",
  },
];

const ENV_STATS = [
  { number: "98%",  label: "Av fordonets vikt återvinns" },
  { number: "1.5t", label: "CO₂ sparas per skrotad bil" },
  { number: "0 kr", label: "Dumpningsavgift" },
  { number: "100%", label: "EU ELV-direktiv" },
];

const CERTS = [
  { title: "Länsstyrelsen",       sub: "SFS 1997:185" },
  { title: "Naturvårdsverket",    sub: "ELV-hantering" },
  { title: "Transportstyrelsen",  sub: "Digital avregistrering" },
  { title: "EU ELV-direktiv",     sub: "2000/53/EG" },
];

const TESTIMONIALS = [
  {
    name: "Lars E.",
    city: "Uppsala",
    text: "Professionell hantering, fick betalt på Swish direkt. Enklare än jag trodde.",
  },
  {
    name: "Anna K.",
    city: "Västerås",
    text: "Hämtade bilen utan kostnad trots att den inte var körbar. Toppen service.",
  },
  {
    name: "Mikael S.",
    city: "Stockholm",
    text: "Bästa priset av tre alternativ. Snabb svarstid.",
  },
];

const cardStyle: React.CSSProperties = {
  background: "var(--color-panel)",
  border: "1px solid rgba(60,30,10,0.1)",
  borderRadius: "12px",
  padding: "2rem",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />

      {/* ── TICKER ────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--color-dark)",
          borderTop: "1px solid rgba(200,121,65,0.2)",
          borderBottom: "1px solid rgba(200,121,65,0.2)",
          overflow: "hidden",
          padding: "0.85rem 0",
        }}
      >
        <div className="ticker-track">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="font-mono"
              style={{
                color: "var(--color-white)",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                paddingRight: "4rem",
                whiteSpace: "nowrap",
              }}
            >
              {TICKER_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* ── TRUST BAR ─────────────────────────────────────────────────────── */}
      <section
        id="trust"
        style={{ background: "var(--color-bg)" }}
        className="py-20"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {TRUST_STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="font-display"
                  style={{
                    fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
                    color: "var(--color-cu)",
                    lineHeight: 1,
                  }}
                >
                  {s.number}
                </div>
                <div
                  className="font-mono"
                  style={{
                    fontSize: "0.68rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-txt2)",
                    marginTop: "0.5rem",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section
        id="how"
        style={{ background: "var(--color-bg)", borderTop: "1px solid rgba(60,30,10,0.08)" }}
        className="py-20"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2.8rem, 7vw, 5rem)",
              color: "var(--color-txt)",
              letterSpacing: "0.03em",
              marginBottom: "0.5rem",
            }}
          >
            SÅ FUNGERAR DET
          </h2>
          <p
            className="font-serif-it"
            style={{
              fontSize: "1.2rem",
              color: "var(--color-cu)",
              marginBottom: "3rem",
            }}
          >
            Tre enkla steg — från regnummer till betalning.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {HOW_STEPS.map((step) => (
              <div key={step.n} style={cardStyle}>
                <div
                  className="font-display"
                  style={{
                    fontSize: "3.5rem",
                    color: "var(--color-cu)",
                    lineHeight: 1,
                    marginBottom: "1rem",
                  }}
                >
                  {step.n}
                </div>
                <h3
                  className="font-body"
                  style={{
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "var(--color-txt)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="font-body"
                  style={{ color: "var(--color-txt2)", fontSize: "0.95rem", lineHeight: 1.6 }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/skrota" className="btn-cu">
              Kom igång nu
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────────────────── */}
      <section
        id="process"
        style={{ background: "var(--color-bg2)", borderTop: "1px solid rgba(60,30,10,0.08)" }}
        className="py-20"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2.8rem, 7vw, 5rem)",
              color: "var(--color-txt)",
              letterSpacing: "0.03em",
              marginBottom: "3rem",
            }}
          >
            PROCESSEN
          </h2>

          <div style={{ position: "relative" }}>
            {PROCESS_STEPS.map((step, idx) => (
              <div
                key={step.title}
                style={{
                  display: "flex",
                  gap: "2rem",
                  marginBottom: idx < PROCESS_STEPS.length - 1 ? "0" : "0",
                  position: "relative",
                }}
              >
                {/* Left: number + line */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                    width: "2.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      borderRadius: "50%",
                      background: "var(--color-cu)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      zIndex: 1,
                    }}
                  >
                    <span
                      className="font-mono"
                      style={{ color: "var(--color-white)", fontSize: "0.75rem", fontWeight: 700 }}
                    >
                      {idx + 1}
                    </span>
                  </div>
                  {idx < PROCESS_STEPS.length - 1 && (
                    <div
                      style={{
                        width: "2px",
                        flex: 1,
                        minHeight: "4rem",
                        background: "rgba(200,121,65,0.3)",
                        margin: "0.25rem 0",
                      }}
                    />
                  )}
                </div>

                {/* Right: content */}
                <div style={{ paddingBottom: idx < PROCESS_STEPS.length - 1 ? "2rem" : "0" }}>
                  <h3
                    className="font-body"
                    style={{
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: "var(--color-txt)",
                      marginBottom: "0.35rem",
                      lineHeight: "2.5rem",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="font-body"
                    style={{
                      color: "var(--color-txt2)",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      maxWidth: "520px",
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section
        id="features"
        style={{ background: "var(--color-bg)", borderTop: "1px solid rgba(60,30,10,0.08)" }}
        className="py-20"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2.8rem, 7vw, 5rem)",
              color: "var(--color-txt)",
              letterSpacing: "0.03em",
              marginBottom: "0.5rem",
            }}
          >
            VARFÖR RENSONA?
          </h2>
          <p
            className="font-serif-it"
            style={{
              fontSize: "1.2rem",
              color: "var(--color-cu)",
              marginBottom: "3rem",
            }}
          >
            Det proffs väljer — och det kunder återkommer till.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} style={cardStyle}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{f.icon}</div>
                <h3
                  className="font-body"
                  style={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "var(--color-txt)",
                    marginBottom: "0.4rem",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  className="font-body"
                  style={{ color: "var(--color-txt2)", fontSize: "0.9rem", lineHeight: 1.6 }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section
        id="pris"
        style={{ background: "var(--color-bg2)", borderTop: "1px solid rgba(60,30,10,0.08)" }}
        className="py-20"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <h2
                className="font-display"
                style={{
                  fontSize: "clamp(2.8rem, 7vw, 5rem)",
                  color: "var(--color-txt)",
                  letterSpacing: "0.03em",
                  marginBottom: "1rem",
                }}
              >
                PRISSÄTTNING
              </h2>
              <p
                className="font-body"
                style={{
                  color: "var(--color-txt2)",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  marginBottom: "1.25rem",
                }}
              >
                Vi prissätter varje bil baserat på London Metal Exchange (LME) dagskurs för
                koppar, aluminium och stål. Det innebär att du alltid får ett marknadsmässigt och
                transparent pris — inga dolda avdrag eller schabloner.
              </p>
              <p
                className="font-body"
                style={{
                  color: "var(--color-txt2)",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  fontStyle: "italic",
                }}
              >
                Slutpris bekräftas vid hämtning baserat på bilens vikt och metallmarknadens dagspris.
              </p>
            </div>

            {/* Right: price card */}
            <div
              style={{
                ...cardStyle,
                border: "1px solid rgba(200,121,65,0.3)",
                textAlign: "center",
              }}
            >
              <p
                className="font-mono"
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--color-txt2)",
                  marginBottom: "1rem",
                }}
              >
                Uppskattat prisintervall
              </p>
              <div
                className="font-display"
                style={{
                  fontSize: "clamp(3rem, 8vw, 5.5rem)",
                  color: "var(--color-cu)",
                  lineHeight: 1,
                  marginBottom: "0.5rem",
                }}
              >
                2 000 – 6 000 kr
              </div>
              <p
                className="font-body"
                style={{
                  color: "var(--color-txt2)",
                  fontSize: "0.85rem",
                  marginBottom: "1.75rem",
                }}
              >
                Beroende på märke, modell, vikt och dagslägets metallkurs.
              </p>
              <Link href="/skrota" className="btn-cu">
                Få ditt pris nu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ENVIRONMENT ───────────────────────────────────────────────────── */}
      <section
        id="miljo"
        style={{ background: "var(--color-dark)" }}
        className="py-20"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2.8rem, 7vw, 5rem)",
              color: "var(--color-white)",
              letterSpacing: "0.03em",
              marginBottom: "0.75rem",
            }}
          >
            MILJÖANSVAR ÄR KÄRNAN
          </h2>
          <p
            className="font-body"
            style={{
              color: "rgba(250,247,243,0.55)",
              fontSize: "1rem",
              lineHeight: 1.7,
              maxWidth: "580px",
              marginBottom: "3.5rem",
            }}
          >
            Vi är certifierade enligt EU:s ELV-direktiv och tar hand om varje fordon med
            minsta möjliga miljöpåverkan. Vätskor tappas av, farliga material sorteras, och
            nästintill hela bilen återvinns.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {ENV_STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="font-display"
                  style={{
                    fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
                    color: "var(--color-cu)",
                    lineHeight: 1,
                  }}
                >
                  {s.number}
                </div>
                <div
                  className="font-mono"
                  style={{
                    fontSize: "0.68rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(250,247,243,0.5)",
                    marginTop: "0.5rem",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ────────────────────────────────────────────────── */}
      <section
        id="cert"
        style={{ background: "var(--color-bg)", borderTop: "1px solid rgba(60,30,10,0.08)" }}
        className="py-20"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              color: "var(--color-txt)",
              letterSpacing: "0.03em",
              marginBottom: "2.5rem",
              textAlign: "center",
            }}
          >
            CERTIFIERINGAR & TILLSTÅND
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {CERTS.map((c) => (
              <div
                key={c.title}
                style={{
                  ...cardStyle,
                  textAlign: "center",
                  padding: "1.75rem 1.25rem",
                }}
              >
                <div
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "50%",
                    background: "var(--color-cu-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                  }}
                >
                  <span style={{ color: "var(--color-cu)", fontSize: "1.1rem" }}>✓</span>
                </div>
                <div
                  className="font-body"
                  style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-txt)", marginBottom: "0.35rem" }}
                >
                  {c.title}
                </div>
                <div
                  className="font-mono"
                  style={{ fontSize: "0.65rem", letterSpacing: "0.08em", color: "var(--color-txt2)", textTransform: "uppercase" }}
                >
                  {c.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section
        id="testi"
        style={{ background: "var(--color-bg2)", borderTop: "1px solid rgba(60,30,10,0.08)" }}
        className="py-20"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              color: "var(--color-txt)",
              letterSpacing: "0.03em",
              marginBottom: "0.5rem",
            }}
          >
            VAD KUNDERNA SÄGER
          </h2>
          <p
            className="font-serif-it"
            style={{ fontSize: "1.1rem", color: "var(--color-cu)", marginBottom: "2.5rem" }}
          >
            Riktiga upplevelser från riktiga kunder.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={cardStyle}>
                <div style={{ color: "var(--color-cu)", fontSize: "1rem", marginBottom: "1rem", letterSpacing: "0.05em" }}>
                  ★★★★★
                </div>
                <p
                  className="font-body"
                  style={{
                    color: "var(--color-txt)",
                    fontSize: "0.95rem",
                    lineHeight: 1.65,
                    marginBottom: "1.25rem",
                    fontStyle: "italic",
                  }}
                >
                  "{t.text}"
                </p>
                <div
                  className="font-mono"
                  style={{
                    fontSize: "0.68rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-txt2)",
                  }}
                >
                  {t.name} — {t.city}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section
        id="kontakt"
        style={{ background: "var(--color-dark)", textAlign: "center" }}
        className="py-20"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(3rem, 10vw, 8rem)",
              color: "var(--color-white)",
              letterSpacing: "0.03em",
              lineHeight: 0.95,
              marginBottom: "1rem",
            }}
          >
            REDO ATT SKROTA SMART?
          </h2>
          <p
            className="font-serif-it"
            style={{
              fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
              color: "var(--color-cu)",
              marginBottom: "1rem",
            }}
          >
            Enkelt, snabbt och alltid till rätt pris.
          </p>
          <p
            className="font-mono"
            style={{
              fontSize: "1.1rem",
              color: "rgba(250,247,243,0.6)",
              letterSpacing: "0.06em",
              marginBottom: "2.5rem",
            }}
          >
            0171-210 02
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/skrota" className="btn-cu">
              Boka online
            </Link>
            <a href="tel:017121002" className="btn-ghost">
              Ring 0171-210 02
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: "var(--color-dark2)",
          borderTop: "1px solid rgba(200,121,65,0.15)",
        }}
      >
        {/* Main grid */}
        <div
          className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid sm:grid-cols-2 md:grid-cols-4 gap-10"
        >
          {/* Col 1: Brand */}
          <div>
            <div
              className="font-display"
              style={{
                fontSize: "1.5rem",
                letterSpacing: "0.04em",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ color: "var(--color-cu)" }}>RENSONA </span>
              <span style={{ color: "var(--color-white)" }}>METALL</span>
            </div>
            <p
              className="font-serif-it"
              style={{ color: "var(--color-cu)", fontSize: "0.95rem", marginBottom: "1rem" }}
            >
              Vi skrotar smart.
            </p>
            <p
              className="font-body"
              style={{ color: "rgba(250,247,243,0.45)", fontSize: "0.8rem", lineHeight: 1.65 }}
            >
              Mercaskroten i Sverige AB<br />
              Auktoriserad bildemontering<br />
              Enköping, Mälardalen
            </p>
          </div>

          {/* Col 2: Tjänster */}
          <div>
            <h4
              className="font-mono"
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(250,247,243,0.4)",
                marginBottom: "1rem",
              }}
            >
              Tjänster
            </h4>
            {[
              { label: "Bilskrotning", href: "/skrota" },
              { label: "Metallhandel", href: "/metall" },
              { label: "Hur det funkar", href: "#how" },
              { label: "Miljö", href: "#miljo" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-body block"
                style={{
                  color: "rgba(250,247,243,0.6)",
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--color-cu-b)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(250,247,243,0.6)")}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Col 3: Kontakt */}
          <div>
            <h4
              className="font-mono"
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(250,247,243,0.4)",
                marginBottom: "1rem",
              }}
            >
              Kontakt
            </h4>
            <address
              className="font-body"
              style={{
                fontStyle: "normal",
                color: "rgba(250,247,243,0.6)",
                fontSize: "0.9rem",
                lineHeight: 1.8,
              }}
            >
              Industrigatan 14<br />
              745 37 Enköping<br />
              <a
                href="tel:017121002"
                style={{ color: "var(--color-cu)", textDecoration: "none" }}
              >
                0171-210 02
              </a><br />
              <a
                href="mailto:info@rensona.se"
                style={{ color: "var(--color-cu)", textDecoration: "none" }}
              >
                info@rensona.se
              </a><br />
              <span style={{ color: "rgba(250,247,243,0.4)", fontSize: "0.8rem" }}>
                Mån–Fre 07:30–17:00
              </span>
            </address>
          </div>

          {/* Col 4: Certifikat */}
          <div>
            <h4
              className="font-mono"
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(250,247,243,0.4)",
                marginBottom: "1rem",
              }}
            >
              Certifikat
            </h4>
            {CERTS.map((c) => (
              <div
                key={c.title}
                className="font-body"
                style={{
                  color: "rgba(250,247,243,0.6)",
                  fontSize: "0.85rem",
                  marginBottom: "0.45rem",
                }}
              >
                <span style={{ color: "var(--color-cu)", marginRight: "0.5rem" }}>✓</span>
                {c.title}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          className="max-w-6xl mx-auto px-6 lg:px-10 py-5 flex flex-wrap items-center justify-between gap-3"
        >
          <p
            className="font-mono"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.08em",
              color: "rgba(250,247,243,0.3)",
            }}
          >
            © 2026 Mercaskroten i Sverige AB · Org.nr XXXXXX
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[
              { label: "Integritetspolicy", href: "/integritet" },
              { label: "Cookies", href: "/cookies" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-mono"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  color: "rgba(250,247,243,0.3)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(250,247,243,0.7)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(250,247,243,0.3)")}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
