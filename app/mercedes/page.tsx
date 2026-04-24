import type { Metadata } from "next";
import Link from "next/link";
import { getModelsForBrand } from "@/lib/codelist";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Mercedes-Benz bildelar — specialist sedan 1984 | Bilskrotscentralen",
  description:
    "Mälardalen enda Mercedes-specialist. 8 400+ Mercedes-delar i lager. Luftfjädring, motor, kaross — Sveriges lägsta priser. Fri frakt över 500 kr.",
  keywords: [
    "Mercedes bildelar",
    "Mercedes Benz delar",
    "Mercedes luftfjädring",
    "begagnade Mercedes delar",
    "Mercedes specialist Sverige",
  ],
};

const MERCEDES_HIGHLIGHTS = [
  { model: "E-klass W212", years: "2009–2016", count: 740, image: "🚗" },
  { model: "C-klass W204", years: "2007–2014", count: 620, image: "🚙" },
  { model: "GLC X253", years: "2015–2022", count: 480, image: "🚓" },
  { model: "Vito W447", years: "2014–", count: 410, image: "🚐" },
  { model: "Sprinter W906", years: "2006–2018", count: 390, image: "🚚" },
  { model: "S-klass W221", years: "2005–2013", count: 320, image: "🏎️" },
  { model: "ML W164", years: "2005–2011", count: 280, image: "🚙" },
  { model: "A-klass W176", years: "2012–2018", count: 250, image: "🚗" },
];

const MERCEDES_PARTS = [
  { name: "Luftfjädringsstrut fram", priceFrom: 4500, oem: "A-clas/E-clas/S-clas" },
  { name: "Kompressor luftfjädring", priceFrom: 3200, oem: "Wabco / AMK" },
  { name: "Automatlåda 7G-Tronic", priceFrom: 8900, oem: "722.9" },
  { name: "Motor OM651 2.2 CDI", priceFrom: 18500, oem: "OM651" },
  { name: "Bi-xenon strålkastare", priceFrom: 2800, oem: "LED / Halogen" },
  { name: "Instrumentkluster", priceFrom: 1900, oem: "VDO" },
];

export const dynamic = "force-dynamic";

export default async function MercedesPage() {
  const models = getModelsForBrand("mercedes-benz");

  const [totalMercParts, dbTopParts] = await Promise.all([
    db.part.count({ where: { status: "AVAILABLE", vehicle: { brandSlug: "mercedes-benz" } } }),
    db.part.findMany({
      where: { status: "AVAILABLE", vehicle: { brandSlug: "mercedes-benz" }, priceSek: { not: null } },
      orderBy: { priceSek: "desc" },
      take: 6,
    }),
  ]);

  const displayParts = dbTopParts.length >= 3
    ? dbTopParts.map((p) => ({
        name: p.name.charAt(0).toUpperCase() + p.name.slice(1).toLowerCase(),
        priceFrom: p.priceSek!,
        oem: p.oeNumber ?? "—",
      }))
    : MERCEDES_PARTS;

  const mercCount = totalMercParts > 0 ? `${totalMercParts.toLocaleString("sv-SE")}+` : "8 400+";

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-10 pb-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/mercedes-hero.jpeg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/80" />

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-brand-orange)]/30 bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange-light)] text-xs font-semibold tracking-wider uppercase mb-6">
            ★ Mälardalen enda Mercedes-specialist sedan 1984
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
            <span className="gradient-text">Mercedes-Benz</span>
            <br />
            <span className="text-[var(--color-text-secondary)] text-3xl sm:text-4xl lg:text-5xl font-bold">
              bildelar — handplockade i 40 år
            </span>
          </h1>

          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10">
            8 400+ Mercedes-delar i lager. Vi köper, demonterar och säljer bara Mercedes —
            därför hittar du delar ingen annan har, till priser ingen annan kan matcha.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <a href="/mercedes/luftfjadring" className="btn-primary text-base px-6 py-3 rounded-xl">
              🔧 Luftfjädring →
            </a>
            <Link href="/bildelar?marke=mercedes-benz" className="btn-secondary text-base px-6 py-3 rounded-xl">
              Alla Mercedes-delar
            </Link>
            <a href="/eftersok" className="btn-secondary text-base px-6 py-3 rounded-xl">
              Hitta en del åt mig
            </a>
          </div>

          <div className="flex justify-center gap-8 sm:gap-12 text-center">
            {[
              { value: mercCount, label: "Mercedes-delar" },
              { value: "40 år", label: "MB-erfarenhet" },
              { value: "890+", label: "Luftfjädringsdelar" },
              { value: `${models.length}`, label: "Modeller" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-xl sm:text-2xl font-bold text-[var(--color-brand-orange)]">{s.value}</div>
                <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── POPULAR MODELS ─── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-3">Populära Mercedes-modeller i lager</h2>
          <p className="text-[var(--color-text-secondary)]">
            Klicka för att se alla delar vi har till just din modell
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MERCEDES_HIGHLIGHTS.map((m) => (
            <a
              key={m.model}
              href={`/bildelar?marke=mercedes-benz&q=${encodeURIComponent(m.model)}`}
              className="card-hover p-5 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{m.image}</div>
              <h3 className="font-bold text-base">{m.model}</h3>
              <p className="text-xs text-[var(--color-text-muted)] mb-2">{m.years}</p>
              <p className="text-sm text-[var(--color-brand-orange)] font-semibold">
                {m.count}+ delar i lager
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* ─── POPULAR PARTS ─── */}
      <section className="bg-[var(--color-dark-800)] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-3">Mest sökta Mercedes-delar</h2>
            <p className="text-[var(--color-text-secondary)]">Priser från — alla med garanti</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayParts.map((p) => (
              <div
                key={p.name}
                className="p-5 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-xs text-[var(--color-text-muted)]">{p.oem}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--color-text-muted)]">Från</div>
                  <div className="text-lg font-black text-[var(--color-brand-orange)]">
                    {p.priceFrom.toLocaleString("sv-SE")} kr
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-black mb-4">
              Varför <span className="gradient-text">Mercedes-specialist?</span>
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed">
              När en verkstad i Stockholm söker en luftfjädringsdel till en S-klass W221 ringer
              de oss. När en privatperson i Uppsala behöver en specifik kontaktdosa till sin Vito
              ringer de oss. När en bilhandlare i Västerås hittar en svår OE-nummer ringer de oss.
            </p>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              Det är för att vi har specialiserat oss i 40 år. Vi vet vad varje del heter, var den
              sitter, vilka generationer den passar och vad den ska kosta. Andra marknadsplatser har
              tusentals säljare som kan lite om allt — vi kan allt om Mercedes.
            </p>
          </div>
          <div className="glass rounded-2xl p-8">
            <h3 className="font-bold mb-6">Adams Mercedes-erfarenhet</h3>
            <ul className="space-y-3 text-sm">
              {[
                "40 års erfarenhet av Mercedes-Benz",
                "Demonterat 2 000+ Mercedes-bilar",
                "Specialiserad på luftfjädring (W211, W221, W222)",
                "Original OE-nummer på alla artiklar",
                "Funktionstestar elektronik före försäljning",
                "Stockholm, Uppsala, Västerås, Eskilstuna — fri frakt över 500 kr",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[var(--color-brand-orange)]">★</span>
                  <span className="text-[var(--color-text-secondary)]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-[var(--color-dark-800)] py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Hittar du inte den Mercedes-del du söker?</h2>
          <p className="text-[var(--color-text-secondary)] mb-8">
            Skicka en eftersökning med OE-nummer eller beskrivning. Adam kollar lagret personligen.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/eftersok" className="btn-primary text-base px-8 py-4 rounded-xl">
              📨 Skicka eftersökning
            </a>
            <a href="tel:017121002" className="btn-secondary text-base px-8 py-4 rounded-xl">
              📞 Ring 0171-210 02
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
