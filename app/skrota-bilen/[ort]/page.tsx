import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CITIES, getAllCitySlugs, getCity } from "@/lib/cities";

export function generateStaticParams() {
  return getAllCitySlugs().map((ort) => ({ ort }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ort: string }>;
}): Promise<Metadata> {
  const { ort } = await params;
  const city = getCity(ort);
  if (!city) return {};
  return {
    title: `Skrota bilen ${city.name} — gratis hämtning, marknadens bästa pris`,
    description: `Skrota bilen i ${city.name}. Gratis hämtning, auktoriserad bildemontering, vi sköter avregistreringen. ${city.blurb}`,
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ ort: string }>;
}) {
  const { ort } = await params;
  const city = getCity(ort);
  if (!city) notFound();

  const others = CITIES.filter((c) => c.slug !== city.slug && c.slug !== "malardalen");

  return (
    <>
      <section className="relative overflow-hidden pt-10 pb-12">
        <img src="/images/montering.jpeg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--color-brand-orange)] opacity-[0.05] rounded-full blur-[120px]" />

        <div className="relative max-w-5xl mx-auto px-4">
          <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--color-brand-orange)]">Hem</Link>
            <span>›</span>
            <Link href="/skrota-bilen" className="hover:text-[var(--color-brand-orange)]">Skrota bilen</Link>
            <span>›</span>
            <span className="text-[var(--color-text-secondary)]">{city.name}</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Skrota bilen i <span className="gradient-text">{city.name}</span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mb-8">{city.blurb}</p>

          <div className="glass rounded-2xl p-6 max-w-2xl">
            <form action="/eftersok" className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="regnr"
                placeholder="Ditt registreringsnummer"
                className="flex-1 px-5 py-4 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-base placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-all"
              />
              <button type="submit" className="btn-primary px-6 py-4 rounded-xl whitespace-nowrap">
                Boka hämtning
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: "🚛", title: "Gratis hämtning", desc: `Vi kör till ${city.name} ${city.distanceKm <= 35 ? "samma vecka" : "inom 1–3 dagar"}.` },
            { icon: "💰", title: "Bästa priset", desc: "Adam ringer med konkret offert inom 24 h." },
            { icon: "📋", title: "Vi sköter pappersarbetet", desc: "Avregistrering hos Transportstyrelsen ingår." },
          ].map((b) => (
            <div key={b.title} className="p-6 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)]">
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="font-bold mb-2">{b.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 prose prose-invert text-[var(--color-text-secondary)] leading-relaxed">
          <h2 className="text-2xl font-black text-[var(--color-text-primary)] mb-4">
            Hur det funkar i {city.name}
          </h2>
          <p>
            Skicka ditt registreringsnummer via formuläret eller ring Adam direkt på{" "}
            <strong className="text-[var(--color-brand-orange)]">0171-210 02</strong>. Inom 24
            timmar får du en konkret offert baserat på bilens märke, modell och skick. När du
            tackat ja bokar vi en bärgare som hämtar bilen i {city.name} kostnadsfritt.
          </p>
          <p>
            Du får betalt direkt vid hämtning — Swish, kontant eller banköverföring, du väljer.
            Vi rapporterar avregistreringen till Transportstyrelsen så snart bilen är på vår
            anläggning, och du får mottagningsbevis via mejl.
          </p>
          <p>
            Varför Bilskrotscentralen? Vi har funnits sedan 1984, är en auktoriserad
            bildemontering och betalar bättre än de flesta eftersom vi säljer reservdelarna
            vidare själva. Mercedes och Volvo betingar oftast bäst priser hos oss.
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-dark-800)] py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
            Andra orter vi hämtar i
          </h2>
          <div className="flex flex-wrap gap-2">
            {others.map((c) => (
              <a
                key={c.slug}
                href={`/skrota-bilen/${c.slug}`}
                className="px-3 py-1.5 rounded-full text-sm border border-[var(--color-dark-500)] text-[var(--color-text-secondary)] hover:border-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange)] transition-all"
              >
                {c.name}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
