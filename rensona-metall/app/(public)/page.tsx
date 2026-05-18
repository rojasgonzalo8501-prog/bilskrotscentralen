"use client";
// NOTE: This file is a client boundary because HeroSection uses React hooks.
// HomePage (default export) itself performs no data-fetching and acts as a
// pure layout/presentation component — all sections are static markup.

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { PriceList } from "@/components/PriceList";
import { Calculator } from "@/components/Calculator";
import { Compare } from "@/components/Compare";
import { HittaHit } from "@/components/HittaHit";
import { FAQ } from "@/components/FAQ";

// ─── Dynamic import (client-only, no SSR) ────────────────────────────────────

const HeroCanvas = dynamic(
  () => import("@/components/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false }
);

// ─── HeroSection — "use client" component ────────────────────────────────────
// Uses scroll-driven parallax via useRef + useEffect.

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
      aria-label="Hero"
    >
      {/* Sticky viewport — scrolls with parallax canvas behind */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "var(--color-dark)",
        }}
      >
        {/* Full-bleed Three.js canvas */}
        <HeroCanvas scrollProgress={scrollProgress} />

        {/* Gradient overlay so text is always legible */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(15,10,6,0.6) 0%, rgba(15,10,6,0.25) 45%, rgba(15,10,6,0.75) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Centered text overlay */}
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
          }}
        >
          {/* Ghost / outlined wordmark */}
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(5rem, 16vw, 14rem)",
              lineHeight: 0.9,
              letterSpacing: "0.04em",
              color: "transparent",
              WebkitTextStroke: "2px var(--color-cu)",
              margin: 0,
              userSelect: "none",
            }}
          >
            RENSONA
          </h1>

          {/* Solid white wordmark */}
          <div
            className="font-display"
            style={{
              fontSize: "clamp(5rem, 16vw, 14rem)",
              lineHeight: 0.9,
              letterSpacing: "0.04em",
              color: "var(--color-white)",
              margin: 0,
              userSelect: "none",
            }}
          >
            METALL.
          </div>

          {/* Copper italic subheading */}
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
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link href="/skrota" className="btn-cu">
              Boka hämtning
            </Link>
            <a href="#how" className="btn-ghost">
              Se hur det funkar
            </a>
          </div>
        </div>

        {/* Scroll indicator — fades as user scrolls */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            opacity: scrollProgress > 0.05 ? 0 : 1,
            transition: "opacity 0.4s",
            pointerEvents: "none",
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(250,247,243,0.4)",
            }}
          >
            Scrolla
          </span>
          <div
            style={{
              width: "1px",
              height: "2.5rem",
              background:
                "linear-gradient(to bottom, rgba(200,121,65,0.6), transparent)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

// ─── Data constants ───────────────────────────────────────────────────────────

const TICKER_TEXT =
  "AUKTORISERAD BILDEMONTERING  ·  KOSTNADSFRI HÄMTNING  ·  LME-PRISSÄTTNING  ·  SKROTNINGSINTYG  ·  EU ELV-DIREKTIV  ·  AUKTORISERAD SEDAN 1984  ·  ";

const TRUST_STATS: Array<{ number: string; label: string }> = [
  { number: "12 400+", label: "Skrotade bilar" },
  { number: "98%", label: "Återvinningsgrad" },
  { number: "3 850 kr", label: "Genomsnittlig skrotpremie" },
  { number: "24h", label: "Svarstid" },
];

const HOW_STEPS: Array<{ n: string; title: string; desc: string }> = [
  {
    n: "01",
    title: "Ange regnumret",
    desc: "Autofyll via Transportstyrelsen — fordonets uppgifter hämtas direkt utan manuell inmatning.",
  },
  {
    n: "02",
    title: "Få ditt pris",
    desc: "Realtids LME-prissättning ger dig alltid ett rättvist och transparent erbjudande utan dolda avdrag.",
  },
  {
    n: "03",
    title: "Boka hämtning",
    desc: "Swish · Bankgiro · Kontant. Vi kör till dig i hela Mälardalen — körbar eller ej.",
  },
];

const PROCESS_STEPS: Array<{ title: string; desc: string }> = [
  {
    title: "Ange regnummer",
    desc: "Fyll i ditt registreringsnummer på vår webbplats eller ring oss. Vi söker upp bilens uppgifter hos Transportstyrelsen automatiskt.",
  },
  {
    title: "Få erbjudande",
    desc: "Baserat på bilens vikt, skick och aktuellt LME-metallpris beräknas din skrotpremie. Priset presenteras direkt — inga dolda avdrag.",
  },
  {
    title: "Boka upphämtning",
    desc: "Välj datum och tid som passar dig. Vi hämtar i hela Mälardalen utan kostnad, oavsett om bilen är körbar eller ej.",
  },
  {
    title: "Vi hämtar bilen",
    desc: "Vår chaufför anländer med bärgningsbil i tid. Du behöver bara lämna nycklarna — vi tar hand om resten.",
  },
  {
    title: "Du får betalt & intyg",
    desc: "Betalning sker direkt via Swish, Bankgiro eller kontant. Skrotningsintyg och avregistrering hos Transportstyrelsen skickas digitalt.",
  },
];

const FEATURES: Array<{ icon: string; title: string; desc: string }> = [
  {
    icon: "🚛",
    title: "Gratis hämtning",
    desc: "Vi kör till dig i hela Mälardalen, oavsett om bilen är körbar.",
  },
  {
    icon: "💰",
    title: "Marknadens bästa pris",
    desc: "LME-kopplad prissättning uppdaterad dagligen — inga schabloner.",
  },
  {
    icon: "⚡",
    title: "Svar inom 24h",
    desc: "Ring eller boka online, vi återkommer alltid snabbt.",
  },
  {
    icon: "📋",
    title: "Vi sköter pappren",
    desc: "Avregistrering hos Transportstyrelsen och skrotningsintyg ingår alltid.",
  },
  {
    icon: "♻️",
    title: "98% återvinning",
    desc: "EU ELV-certifierat. Inget av bilen hamnar på soptipp.",
  },
  {
    icon: "🔒",
    title: "Auktoriserad sedan 1984",
    desc: "Länsstyrelsen, Naturvårdsverket och Transportstyrelsen godkända.",
  },
];

const ENV_STATS: Array<{ number: string; label: string }> = [
  { number: "98%", label: "Av fordonets vikt återvinns" },
  { number: "1,5t", label: "CO₂ sparas per skrotad bil" },
  { number: "0 kr", label: "Dumpningsavgift" },
  { number: "100%", label: "EU ELV-direktiv" },
];

const CERTS: Array<{ title: string; sub: string; desc: string }> = [
  {
    title: "Länsstyrelsen",
    sub: "SFS 1997:185",
    desc: "Tillstånd för skrothantering och miljöfarlig verksamhet.",
  },
  {
    title: "Naturvårdsverket",
    sub: "ELV-hantering",
    desc: "Godkänd auktoriserad bilskrotare enligt ELV-förordningen.",
  },
  {
    title: "Transportstyrelsen",
    sub: "Digital avregistrering",
    desc: "Direktanslutning för omedelbar avregistrering av skrotade fordon.",
  },
  {
    title: "EU ELV-direktiv",
    sub: "2000/53/EG",
    desc: "Fullständig efterlevnad av EU:s direktiv om uttjänta fordon.",
  },
];

const TESTIMONIALS: Array<{
  name: string;
  city: string;
  text: string;
}> = [
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
    text: "Bästa priset av tre alternativ. Snabb svarstid och trevlig personal.",
  },
];

// ─── Shared style helpers ─────────────────────────────────────────────────────

const cardStyle: CSSProperties = {
  background: "var(--color-panel)",
  border: "1px solid rgba(60,30,10,0.1)",
  borderRadius: "12px",
  padding: "2rem",
};

const sectionLabel: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.68rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--color-cu)",
  marginBottom: "0.75rem",
};

const sectionHeading: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(2.8rem, 7vw, 5rem)",
  lineHeight: 1,
  letterSpacing: "0.03em",
  color: "var(--color-txt)",
  marginBottom: "3rem",
};

// ─── Page — root Server-style component (default export) ─────────────────────

export default function HomePage() {
  return (
    <>
      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── 2. TICKER ───────────────────────────────────────────────────────── */}
      <div
        role="marquee"
        aria-label="Nyckelord"
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

      {/* ── 3. TRUST BAR ────────────────────────────────────────────────────── */}
      <section
        id="trust"
        aria-label="Nyckeltal"
        style={{
          background: "var(--color-bg)",
          borderBottom: "1px solid rgba(60,30,10,0.08)",
        }}
        className="py-20"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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

      {/* ── 4. HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section
        id="how"
        aria-labelledby="how-heading"
        style={{
          background: "var(--color-bg)",
          borderTop: "1px solid rgba(60,30,10,0.08)",
        }}
        className="py-20"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <p style={sectionLabel}>Processen</p>
          <h2
            id="how-heading"
            className="font-display"
            style={sectionHeading}
          >
            SÅ FUNGERAR DET
          </h2>

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
                  style={{
                    color: "var(--color-txt2)",
                    fontSize: "0.95rem",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Link href="/skrota" className="btn-cu">
              Starta din skrotning
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. PROCESS TIMELINE ─────────────────────────────────────────────── */}
      <section
        id="process"
        aria-labelledby="process-heading"
        style={{
          background: "var(--color-bg2)",
          borderTop: "1px solid rgba(60,30,10,0.08)",
        }}
        className="py-20"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <p style={sectionLabel}>Steg för steg</p>
          <h2
            id="process-heading"
            className="font-display"
            style={sectionHeading}
          >
            FRÅN BILNYCKEL TILL INTYG
          </h2>

          <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {PROCESS_STEPS.map((step, idx) => (
              <li
                key={step.title}
                style={{
                  display: "flex",
                  gap: "2rem",
                }}
              >
                {/* Left: circle + connector line */}
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
                      className="font-display"
                      style={{
                        color: "var(--color-white)",
                        fontSize: "1rem",
                        lineHeight: 1,
                      }}
                    >
                      {idx + 1}
                    </span>
                  </div>
                  {idx < PROCESS_STEPS.length - 1 && (
                    <div
                      aria-hidden
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
                <div
                  style={{
                    paddingBottom:
                      idx < PROCESS_STEPS.length - 1 ? "2rem" : "0",
                  }}
                >
                  <h3
                    className="font-body"
                    style={{
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: "var(--color-txt)",
                      margin: "0.4rem 0 0.4rem",
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
                      lineHeight: 1.65,
                      maxWidth: "520px",
                      margin: 0,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 6. FEATURES ─────────────────────────────────────────────────────── */}
      <section
        id="features"
        aria-labelledby="features-heading"
        style={{
          background: "var(--color-bg)",
          borderTop: "1px solid rgba(60,30,10,0.08)",
        }}
        className="py-20"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <p style={sectionLabel}>Fördelar</p>
          <h2
            id="features-heading"
            className="font-display"
            style={sectionHeading}
          >
            VARFÖR RENSONA?
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} style={cardStyle}>
                <div
                  aria-hidden
                  style={{ fontSize: "2rem", marginBottom: "0.75rem" }}
                >
                  {f.icon}
                </div>
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
                  style={{
                    color: "var(--color-txt2)",
                    fontSize: "0.9rem",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. PRICING ──────────────────────────────────────────────────────── */}
      <section
        id="pris"
        aria-labelledby="pris-heading"
        style={{
          background: "var(--color-bg2)",
          borderTop: "1px solid rgba(60,30,10,0.08)",
        }}
        className="py-20"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              <p style={sectionLabel}>Prissättning</p>
              <h2
                id="pris-heading"
                className="font-display"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.8rem, 7vw, 4.5rem)",
                  lineHeight: 1,
                  letterSpacing: "0.03em",
                  color: "var(--color-txt)",
                  marginBottom: "1.25rem",
                }}
              >
                RÄTTVIST PRIS VARJE DAG
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
                Vi sätter priset baserat på London Metal Exchange (LME) — världsstandarden
                för metallpriser. Det betyder att du alltid får ett marknadsmässigt och
                transparent pris utan förhandling eller dolda avdrag.
              </p>
              <p
                className="font-body"
                style={{
                  color: "var(--color-txt2)",
                  fontSize: "0.9rem",
                  lineHeight: 1.65,
                  fontStyle: "italic",
                }}
              >
                Faktorer: bilens vikt, metallinnehåll, årsmodell och skick. Priset
                justeras dagligen enligt LME-noteringar.
              </p>
            </div>

            {/* Right: price card */}
            <div
              style={{
                ...cardStyle,
                border: "1px solid rgba(200,121,65,0.3)",
              }}
            >
              <p
                className="font-mono"
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--color-txt2)",
                  marginBottom: "0.75rem",
                }}
              >
                Typiskt prisintervall
              </p>
              <div
                className="font-display"
                style={{
                  fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
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
                  fontSize: "0.82rem",
                  marginBottom: "1.75rem",
                  lineHeight: 1.5,
                }}
              >
                Beroende på märke, modell och metallmarknadens dagspris.
              </p>

              {/* Price breakdown table */}
              <dl
                style={{
                  borderTop: "1px solid rgba(60,30,10,0.1)",
                  paddingTop: "1.25rem",
                  marginBottom: "1.75rem",
                }}
              >
                {(
                  [
                    ["Personbil (lättvikt)", "2 000 – 3 200 kr"],
                    ["Personbil (medel)", "3 000 – 4 500 kr"],
                    ["SUV / MPV", "4 000 – 6 000 kr"],
                  ] as [string, string][]
                ).map(([type, range]) => (
                  <div
                    key={type}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.6rem 0",
                      borderBottom: "1px solid rgba(60,30,10,0.07)",
                    }}
                  >
                    <dt
                      className="font-body"
                      style={{ color: "var(--color-txt2)", fontSize: "0.9rem" }}
                    >
                      {type}
                    </dt>
                    <dd
                      className="font-mono"
                      style={{
                        color: "var(--color-txt)",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        margin: 0,
                      }}
                    >
                      {range}
                    </dd>
                  </div>
                ))}
              </dl>

              <p
                className="font-body"
                style={{
                  fontSize: "0.78rem",
                  color: "var(--color-txt2)",
                  lineHeight: 1.6,
                  fontStyle: "italic",
                  marginBottom: "1.5rem",
                }}
              >
                Slutpris bekräftas vid hämtning baserat på bilens vikt och metallmarknadens dagspris.
              </p>

              <Link href="/skrota" className="btn-cu" style={{ width: "100%", textAlign: "center", display: "flex", justifyContent: "center" }}>
                Beräkna ditt pris
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. ENVIRONMENT ──────────────────────────────────────────────────── */}
      <section
        id="miljo"
        aria-labelledby="miljo-heading"
        style={{ background: "var(--color-dark)" }}
        className="py-20"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <p
            style={{
              ...sectionLabel,
              color: "var(--color-cu)",
            }}
          >
            Hållbarhet
          </p>
          <h2
            id="miljo-heading"
            className="font-display"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.8rem, 7vw, 5rem)",
              lineHeight: 1,
              letterSpacing: "0.03em",
              color: "var(--color-white)",
              marginBottom: "1.25rem",
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
              marginBottom: "4rem",
            }}
          >
            Bilskrotning är en av de mest effektiva formerna av återvinning. Vi säkerställer att
            varje fordon hanteras enligt EU ELV-direktivet — från tömning av vätskor till
            återvinning av skrotmetall. Inget hamnar på soptipp.
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
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(250,247,243,0.45)",
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

      {/* ── 9. CERTIFICATIONS ───────────────────────────────────────────────── */}
      <section
        id="cert"
        aria-labelledby="cert-heading"
        style={{
          background: "var(--color-bg)",
          borderTop: "1px solid rgba(60,30,10,0.08)",
        }}
        className="py-20"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <p style={sectionLabel}>Tillstånd &amp; certifikat</p>
          <h2
            id="cert-heading"
            className="font-display"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 1,
              letterSpacing: "0.03em",
              color: "var(--color-txt)",
              marginBottom: "3rem",
            }}
          >
            AUKTORISERAD OCH CERTIFIERAD
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CERTS.map((c) => (
              <div key={c.title} style={cardStyle}>
                {/* Checkmark badge */}
                <div
                  aria-hidden
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "8px",
                    background: "rgba(200,121,65,0.09)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span style={{ color: "var(--color-cu)", fontSize: "1.2rem" }}>✓</span>
                </div>

                <h3
                  className="font-body"
                  style={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "var(--color-txt)",
                    margin: "0 0 0.25rem",
                  }}
                >
                  {c.title}
                </h3>
                <span
                  className="font-mono"
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.08em",
                    color: "var(--color-cu)",
                    display: "block",
                    marginBottom: "0.6rem",
                  }}
                >
                  {c.sub}
                </span>
                <p
                  className="font-body"
                  style={{
                    color: "var(--color-txt2)",
                    fontSize: "0.85rem",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. TESTIMONIALS ────────────────────────────────────────────────── */}
      <section
        id="testi"
        aria-labelledby="testi-heading"
        style={{
          background: "var(--color-bg2)",
          borderTop: "1px solid rgba(60,30,10,0.08)",
        }}
        className="py-20"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <p style={sectionLabel}>Kundrecensioner</p>
          <h2
            id="testi-heading"
            className="font-display"
            style={sectionHeading}
          >
            VAD KUNDERNA SÄGER
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} style={{ ...cardStyle, margin: 0 }}>
                {/* Stars */}
                <div
                  aria-label="5 av 5 stjärnor"
                  style={{
                    color: "var(--color-cu)",
                    fontSize: "1rem",
                    letterSpacing: "0.05em",
                    marginBottom: "1rem",
                  }}
                >
                  ★★★★★
                </div>

                <blockquote
                  className="font-body"
                  style={{
                    color: "var(--color-txt)",
                    fontSize: "0.95rem",
                    lineHeight: 1.65,
                    fontStyle: "italic",
                    margin: "0 0 1.25rem",
                  }}
                >
                  &ldquo;{t.text}&rdquo;
                </blockquote>

                <figcaption
                  style={{
                    borderTop: "1px solid rgba(60,30,10,0.08)",
                    paddingTop: "1rem",
                  }}
                >
                  <span
                    className="font-body"
                    style={{
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: "var(--color-txt)",
                    }}
                  >
                    {t.name}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.06em",
                      color: "var(--color-txt2)",
                      marginLeft: "0.5rem",
                    }}
                  >
                    {t.city}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. CTA ─────────────────────────────────────────────────────────── */}
      <section
        id="kontakt"
        aria-labelledby="cta-heading"
        style={{ background: "var(--color-dark)", textAlign: "center" }}
        className="py-20"
      >
        <div
          className="max-w-6xl mx-auto px-6 lg:px-10"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.25rem",
          }}
        >
          <p
            className="font-mono"
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-cu)",
            }}
          >
            Kom igång idag
          </p>

          <h2
            id="cta-heading"
            className="font-display"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 10vw, 8rem)",
              lineHeight: 0.95,
              letterSpacing: "0.03em",
              color: "var(--color-white)",
              margin: 0,
            }}
          >
            REDO ATT SKROTA SMART?
          </h2>

          <p
            className="font-serif-it"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
              color: "var(--color-cu)",
              margin: 0,
            }}
          >
            Vi hämtar din bil, du får ett rättvist pris — redan imorgon.
          </p>

          <a
            href="tel:017121002"
            className="font-mono"
            style={{
              fontSize: "1.1rem",
              color: "rgba(250,247,243,0.6)",
              letterSpacing: "0.08em",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            0171-210 02
          </a>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "0.5rem",
            }}
          >
            <Link href="/skrota" className="btn-cu">
              Boka online
            </Link>
            <a href="tel:017121002" className="btn-ghost">
              Ring 0171-210 02
            </a>
          </div>
        </div>
      </section>

      {/* ── PRISLISTA ──────────────────────────────────────────────────────── */}
      <PriceList />

      {/* ── KALKYLATOR ─────────────────────────────────────────────────────── */}
      <Calculator />

      {/* ── JÄMFÖRELSE ─────────────────────────────────────────────────────── */}
      <Compare />

      {/* ── HITTA HIT ──────────────────────────────────────────────────────── */}
      <HittaHit />

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <FAQ />

      {/* ── 12 + 13. FOOTER ─────────────────────────────────────────────────── */}
      {/* 12 = Footer grid columns, 13 = bottom copyright bar */}
      <footer
        style={{
          background: "var(--color-dark2, #1a1008)",
          borderTop: "1px solid rgba(200,121,65,0.15)",
        }}
      >
        {/* Grid: Brand · Tjänster · Kontakt · Certifikat */}
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
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
              style={{
                color: "var(--color-cu)",
                fontSize: "0.95rem",
                marginBottom: "1rem",
              }}
            >
              Vi skrotar smart.
            </p>
            <p
              className="font-body"
              style={{
                color: "rgba(250,247,243,0.45)",
                fontSize: "0.8rem",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Mercaskroten i Sverige AB
              <br />
              Org.nr 556634-0815
              <br />
              Auktoriserad bilskrotare sedan 1984
            </p>
          </div>

          {/* Col 2: Tjänster */}
          <nav aria-label="Sidfots-navigation Tjänster">
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
            {(
              [
                { label: "Bilskrotning", href: "/skrota" },
                { label: "Metallhandel", href: "/metall" },
                { label: "Hur det funkar", href: "/#how" },
                { label: "Miljö", href: "/#miljo" },
              ] as { label: string; href: string }[]
            ).map((l) => (
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
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--color-cu)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "rgba(250,247,243,0.6)")
                }
              >
                {l.label}
              </a>
            ))}
          </nav>

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
              Industrivägen 12, 745 35 Enköping
              <br />
              <a
                href="tel:017121002"
                style={{ color: "var(--color-cu)", textDecoration: "none" }}
              >
                0171-210 02
              </a>
              <br />
              <a
                href="mailto:info@rensonametall.se"
                style={{ color: "var(--color-cu)", textDecoration: "none" }}
              >
                info@rensonametall.se
              </a>
              <br />
              <span style={{ color: "rgba(250,247,243,0.4)", fontSize: "0.8rem" }}>
                Mån–Fre 07:00–16:30
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
                <span
                  aria-hidden
                  style={{ color: "var(--color-cu)", marginRight: "0.5rem" }}
                >
                  ✓
                </span>
                {c.title}
                <span
                  className="font-mono"
                  style={{
                    fontSize: "0.65rem",
                    color: "rgba(250,247,243,0.35)",
                    marginLeft: "0.4rem",
                  }}
                >
                  {c.sub}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          className="max-w-6xl mx-auto px-6 lg:px-10 py-5 flex flex-wrap items-center justify-between gap-3"
        >
          <p
            className="font-mono"
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.08em",
              color: "rgba(250,247,243,0.3)",
              margin: 0,
            }}
          >
            © 2026 Mercaskroten i Sverige AB · Org.nr 556634-0815
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {(
              [
                { label: "Integritetspolicy", href: "/integritetspolicy" },
                { label: "Cookies", href: "/cookies" },
                { label: "Villkor", href: "/villkor" },
              ] as { label: string; href: string }[]
            ).map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-mono"
                style={{
                  fontSize: "0.62rem",
                  letterSpacing: "0.08em",
                  color: "rgba(250,247,243,0.3)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "rgba(250,247,243,0.7)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "rgba(250,247,243,0.3)")
                }
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
