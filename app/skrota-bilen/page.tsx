import type { Metadata } from "next";
import { CITIES } from "@/lib/cities";
import { SkrotaForm } from "./SkrotaForm";
import { FaqJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  // Front-loaded with the primary location keyword + free + auktoriserad
  // — the three triggers that move ranking on "skrot enköping" /
  // "bilskrot mälardalen" / "skrota bilen [stad]" queries.
  title: "Bilskrot Enköping — skrota bilen gratis i hela Mälardalen | Auktoriserad sedan 1984",
  description:
    "Auktoriserad bilskrot i Enköping. Skrota din bil kostnadsfritt — vi hämtar gratis i Enköping, Uppsala, Västerås, Stockholm och Eskilstuna. Marknadens bästa skrotpremie. Ring 0171-210 02.",
  keywords: [
    "skrota bilen",
    "skrota bilen gratis",
    "bilhämtning",
    "bildemontering Enköping",
    "skrota bilen Stockholm",
    "skrota bilen Uppsala",
  ],
};

const STEPS = [
  { num: "1", title: "Ring eller boka online", desc: "Kontakta oss via telefon, formulär eller chatten. Vi behöver registreringsnummer och din adress." },
  { num: "2", title: "Vi bokar upphämtning", desc: "Vi ordnar en tid som passar dig — ofta inom 1–2 dagar. Ingen kostnad, inga dolda avgifter." },
  { num: "3", title: "Vi hämtar bilen", desc: "Vår chaufför hämtar bilen direkt hos dig. Ha registeringsbevisets del 2 (gult papper) och legitimation redo." },
  { num: "4", title: "Du får skrotningsintyget", desc: "Vi hanterar all administration och du får ett skrotningsintyg. Klart!" },
];

const CHECKLIST = [
  "Registeringsbevisets del 2 (gult papper)",
  "Giltig legitimation",
  "Nycklarna till bilen (om du har dem)",
];

const FAQ = [
  {
    q: "Vad betalar ni för min bil?",
    a: "Det beror på märke, modell, ålder och skick. Mercedes och Volvo betingar oftast högre priser hos oss eftersom vi har störst efterfrågan på reservdelar. Adam ringer tillbaka inom 24 h med en konkret offert.",
  },
  {
    q: "Är det verkligen gratis?",
    a: "Ja. Vi tar inget för hämtning, transport eller pappersarbete inom Mälardalen. Du får dessutom betalt för bilen.",
  },
  {
    q: "Vad händer om bilen inte är körbar?",
    a: "Inga problem — vi kommer med bärgare. Det är inkluderat i tjänsten.",
  },
  {
    q: "Vem sköter avregistreringen?",
    a: "Vi gör det åt dig. Som auktoriserad bildemontering rapporterar vi direkt till Transportstyrelsen, så du behöver inte göra någonting.",
  },
  {
    q: "Hur snabbt får jag pengarna?",
    a: "Direkt vid hämtning — Swish, kontant eller banköverföring, vad du föredrar.",
  },
];

export default function SkrotaBilenPage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/montering.jpeg"
          alt="Bilar att skrotas Bilskrotscentralen"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-900/80" />
        <div className="relative max-w-4xl mx-auto px-4 py-20 lg:py-28 text-white text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 bg-[var(--color-brand-orange)]/30 text-[var(--color-brand-orange-light)] border border-[var(--color-brand-orange)]/40">
            Auktoriserad bilskrot sedan 1984
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-6">
            Skrota din bil{" "}
            <span className="gradient-text">helt gratis</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-10">
            Vi hämtar din bil utan kostnad i hela Mälardalen. Enkel bokning, snabb upphämtning
            och all administration hanterar vi åt dig.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:017121002" className="btn-primary flex items-center justify-center gap-2 px-7 py-3.5 text-base">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.39 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.29 6.29l.95-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Ring 0171-210 02
            </a>
            <a href="#boka" className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold border-2 border-white/60 hover:border-white transition-colors">
              Boka online
            </a>
          </div>
        </div>
      </section>

      {/* ─── PHOTO STRIP ─── */}
      <section className="py-2 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { img: "/images/motor.jpeg",        alt: "Bildemontering" },
              { img: "/images/montering.jpeg",    alt: "Bilar på anläggningen" },
              { img: "/images/verkstad-hero.jpeg", alt: "Bilservice Bilskrotscentralen" },
            ].map(({ img, alt }) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={alt} src={img} alt={alt} className="w-full h-32 object-cover rounded-lg opacity-80" />
            ))}
          </div>
        </div>
      </section>

      {/* ─── STEPS ─── */}
      <section className="py-14 bg-[var(--color-dark-800)]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-black text-center mb-10">Så här enkelt fungerar det</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="flex gap-4 p-5 rounded-xl border border-[var(--color-dark-500)] bg-[var(--color-dark-700)]">
                <div className="w-9 h-9 rounded-full bg-[var(--color-brand-orange)] flex items-center justify-center font-black text-white shrink-0 mt-0.5">
                  {num}
                </div>
                <div>
                  <div className="font-bold text-[var(--color-text-primary)] mb-1">{title}</div>
                  <div className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CHECKLIST ─── */}
      <section className="py-10 bg-[var(--color-dark-900)] border-y border-[var(--color-dark-500)]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-black mb-6">Det här behöver du ha redo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CHECKLIST.map((item) => (
              <div key={item} className="flex items-start gap-3 p-4 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-green-400 mt-0.5 shrink-0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span className="text-sm text-[var(--color-text-secondary)]">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-[var(--color-text-muted)] mt-4">
            * Fungerar bilen inte? Inga problem — vi hanterar alla typer av bilar, oavsett skick.
          </p>
        </div>
      </section>

      {/* ─── BOOKING FORM ─── */}
      <section id="boka" className="py-14 bg-[var(--color-dark-800)]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Form */}
            <div className="flex-1">
              <h2 className="text-2xl font-black mb-2">Boka gratis upphämtning</h2>
              <p className="text-[var(--color-text-muted)] mb-8 text-sm">Vi återkommer inom 2 timmar under kontorstid.</p>
              <SkrotaForm />
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block w-72 shrink-0 sticky top-24">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/verkstad-hero.jpeg"
                alt="Bildemontering Bilskrotscentralen"
                className="w-full h-80 object-cover rounded-2xl mb-4"
              />
              <div className="p-4 rounded-xl bg-[var(--color-brand-orange)]/10 border border-[var(--color-brand-orange)]/30">
                <div className="font-bold text-[var(--color-text-primary)] mb-1 text-sm">Ring oss direkt</div>
                <a href="tel:017121002" className="text-lg font-black text-[var(--color-brand-orange)]">
                  0171-210 02
                </a>
                <div className="text-xs text-[var(--color-text-muted)] mt-1">Mån–Tors 08:00–17:00 · Fre 08:00–15:00</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CITIES ─── */}
      <section className="py-10 bg-[var(--color-dark-900)] border-t border-[var(--color-dark-500)]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-brand-orange)]"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            <h2 className="text-lg font-black">Orter vi täcker</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CITIES.filter((c) => c.slug !== "malardalen").map(({ slug, name }) => (
              <a key={slug} href={`/skrota-bilen/${slug}`}
                className="flex items-center gap-2 p-3 rounded-xl border border-[var(--color-dark-500)] bg-[var(--color-dark-700)] hover:border-[var(--color-brand-orange)] hover:shadow-sm transition-all">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-brand-orange)] shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span className="text-sm font-medium text-[var(--color-text-secondary)]">Bilskrot {name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      {/* FAQ JSON-LD lets Google render these as expandable rich snippets
          on the SERP — proven to lift CTR on transactional queries. */}
      <FaqJsonLd items={FAQ.map((f) => ({ question: f.q, answer: f.a }))} />
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-black mb-8 text-center">Vanliga frågor</h2>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <details key={f.q} className="p-5 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] group">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                {f.q}
                <span className="text-[var(--color-brand-orange)] group-open:rotate-45 transition-transform text-xl">+</span>
              </summary>
              <p className="mt-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
