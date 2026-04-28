/* ─── Homepage — Bilskrotscentralen ─── */

import Link from "next/link";
import { getBrands } from "@/lib/codelist";
import { db } from "@/lib/db";
import { HeroSearch } from "@/components/HeroSearch";
import { FeaturedPartCard } from "@/components/FeaturedPartCard";

export const dynamic = "force-dynamic";

const BRANDS = getBrands().slice(0, 8);

const CATEGORIES = [
  { name: "Motor & Transmission", slug: "motor-transmission", image: "/images/motor.jpeg",        count: 4820 },
  { name: "Kaross & Plåt",         slug: "kaross-plat",        image: "/images/vindruta.jpeg",     count: 6340 },
  { name: "Luftfjädring",          slug: "luftfjadring",       image: "/images/luft.jpeg",         count: 890  },
  { name: "Bromsar",               slug: "bromsar",            image: "/images/montering.jpeg",    count: 2100 },
  { name: "Elektrik & Elektronik", slug: "elektrik",           image: "/images/diagnos.jpeg",      count: 3450 },
  { name: "Inredning",             slug: "inredning",          image: "/images/verkstad-hero.jpeg",count: 5200 },
  { name: "Hjul & Däck",           slug: "hjul-dack",          image: "/images/dack.jpeg",         count: 1780 },
  { name: "Belysning",             slug: "belysning",          image: "/images/mercedes-hero.jpeg",count: 2340 },
];

function partImage(name: string, firstImage?: string | null): string {
  if (firstImage) return firstImage;
  const n = name.toUpperCase();
  if (n.includes("LUFT") || n.includes("FJÄDR") || n.includes("FJADR")) return "/images/luft.jpeg";
  if (n.includes("MOTOR") || n.includes("TURBO") || n.includes("DIFF") || n.includes("BAKVÄXEL")) return "/images/motor.jpeg";
  if (n.includes("VÄXELLÅDA") || n.includes("VAXELLADA") || n.includes("MONTER")) return "/images/montering.jpeg";
  if (n.includes("DIAGNOS") || n.includes("GPS") || n.includes("INSTRUMENT") || n.includes("NAVIGATOR")) return "/images/diagnos.jpeg";
  if (n.includes("DÄCK") || n.includes("DACK") || n.includes("HJUL") || n.includes("FÄLG")) return "/images/dack.jpeg";
  if (n.includes("VINDRUTA") || n.includes("GLAS") || n.includes("RUTA")) return "/images/vindruta.jpeg";
  if (n.includes("STRÅL") || n.includes("STRAL") || n.includes("BELYS")) return "/images/mercedes-hero.jpeg";
  return "/images/motor.jpeg";
}

function toTitleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default async function HomePage() {
  const [rawFeatured, topBrands] = await Promise.all([
    db.part.findMany({
      where: { status: "AVAILABLE", priceSek: { not: null } },
      include: { vehicle: true, images: { take: 1, orderBy: { sortOrder: "asc" } } },
      orderBy: [{ vehicle: { brandSlug: "asc" } }, { priceSek: "desc" }],
      take: 8,
    }),
    db.vehicle.findMany({
      where: { status: { not: "SCRAPPED" } },
      select: { brandSlug: true, model: true },
      take: 20,
    }),
  ]);

  const featuredParts = rawFeatured
    .sort((a, b) => {
      const aMerc = a.vehicle.brandSlug === "mercedes-benz" ? 0 : 1;
      const bMerc = b.vehicle.brandSlug === "mercedes-benz" ? 0 : 1;
      return aMerc - bMerc || (b.priceSek ?? 0) - (a.priceSek ?? 0);
    })
    .slice(0, 4);

  // Dynamic popular search terms from real inventory, fallback handled in HeroSearch
  const popularTerms = topBrands.length > 0
    ? [...new Set(topBrands.map((v) => {
        if (v.brandSlug === "mercedes-benz") return "Mercedes " + (v.model?.split(" ")[0] ?? "E-klass");
        return v.brandSlug.charAt(0).toUpperCase() + v.brandSlug.slice(1).replace(/-/g, " ");
      }))].slice(0, 4)
    : [];
  return (
    <>
      {/* ─── HERO — split layout ─── */}
      <section className="relative min-h-[70vh] sm:min-h-[90vh] flex items-center overflow-hidden pt-12 pb-12 sm:pt-16">
        {/* Background photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/verkstad-hero.jpeg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover object-center" />
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-black/50" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[var(--color-brand-orange)] opacity-[0.06] rounded-full blur-[140px] -translate-x-1/3 -translate-y-1/3" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 w-full">
          <div>
            {/* Text + search */}
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-brand-orange)]/30 bg-[var(--color-brand-orange)]/8 text-[var(--color-brand-orange-light)] text-xs font-semibold tracking-wider uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
                Mercedes-specialist sedan 1984
              </div>

              <h1 className="text-4xl sm:text-5xl font-black leading-[1.08] tracking-tight mb-4">
                Rätt bildelar<br />
                <span className="gradient-text">till rätt pris</span>
              </h1>

              <p className="text-base text-[var(--color-text-secondary)] mb-8 max-w-md leading-relaxed">
                30 000+ begagnade bildelar direkt från vår bildemontering i Enköping.
                Beställ online — leverans 1–3 dagar eller hämta direkt.
              </p>

              {/* Search widget */}
              <HeroSearch popularTerms={popularTerms} />

              {/* Quick stats */}
              <div className="flex flex-wrap gap-x-4 gap-y-3 sm:gap-6 mt-6">
                {[
                  { value: "30 000+", label: "Delar i lager" },
                  { value: "40 år",   label: "Erfarenhet" },
                  { value: "1–3 dagar", label: "Leveranstid" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-base sm:text-lg font-black text-[var(--color-brand-orange)]">{s.value}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section className="border-y border-[var(--color-dark-500)] bg-[var(--color-dark-800)]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-8 gap-y-1.5">
            {[
              { icon: "🚚", text: "Fri frakt över 500 kr" },
              { icon: "✅", text: "Garanti på alla delar" },
              { icon: "💳", text: "Klarna · Swish · Kort" },
              { icon: "📞", text: "0171-210 02" },
              { icon: "📍", text: "Hämta i Enköping" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-sm py-1">
                <span>{item.icon}</span>
                <span className="text-[var(--color-text-secondary)] font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SCRAP YOUR CAR CTA ─── */}
      <section className="bg-[var(--color-dark-800)] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-2xl border border-[var(--color-brand-orange)]/20 bg-gradient-to-r from-[var(--color-brand-orange)]/8 via-transparent to-[var(--color-brand-orange)]/8 p-8 sm:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black mb-3">Dags att skrota bilen?</h2>
                <p className="text-[var(--color-text-secondary)] mb-2">
                  Vi hämtar gratis i hela Mälardalen och sköter avregistreringen.
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Enköping · Uppsala · Västerås · Stockholm · Eskilstuna
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Registreringsnummer"
                    className="flex-1 px-4 py-3 bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] rounded-xl text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-all"
                  />
                  <Link href="/skrota-bilen#boka" className="btn-primary px-5 py-3 rounded-xl text-sm whitespace-nowrap inline-flex items-center justify-center">
                    Boka hämtning
                  </Link>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] text-center">
                  Eller ring direkt:{" "}
                  <a href="tel:017121002" className="text-[var(--color-brand-orange)] font-semibold">0171-210 02</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black mb-1">Populära kategorier</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">Bläddra efter deltyp</p>
          </div>
          <Link href="/bildelar/kategorier" className="text-sm text-[var(--color-brand-orange)] font-medium hover:underline hidden sm:block">
            Se alla →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/bildelar/kategorier/${cat.slug}`}
              className="card-hover group relative rounded-xl overflow-hidden border border-[var(--color-dark-500)] aspect-[4/3]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="font-bold text-sm text-white leading-tight">{cat.name}</div>
                <div className="text-xs text-[var(--color-brand-orange-light)] font-medium mt-0.5">{cat.count.toLocaleString()} delar</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── BILRUTOR BANNER ─── */}
      <section className="bg-[var(--color-dark-800)] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-2xl overflow-hidden border border-[var(--color-brand-orange)]/20 bg-gradient-to-r from-[var(--color-brand-orange)]/10 via-[var(--color-dark-700)] to-[var(--color-brand-orange)]/10 p-8 sm:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-brand-orange)]/15 border border-[var(--color-brand-orange)]/25 text-[var(--color-brand-orange-light)] text-xs font-semibold uppercase tracking-wider mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-orange)] animate-pulse" />
                  Nya rutor till alla bilar
                </div>
                <h2 className="text-2xl sm:text-3xl font-black mb-3">
                  Nya bilrutor till <span className="gradient-text">alla bilar</span>
                </h2>
                <p className="text-[var(--color-text-secondary)] mb-2">
                  Nya vindrutor, bakrutor, sidorutor och takluckor till alla bilmärken. Vi levererar och monterar — ring oss med ditt regnummer så löser vi det.
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2">
                  {["Vindruta", "Bakruta", "Sidoruta", "Taklucka"].map((type) => (
                    <div key={type} className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[var(--color-dark-600)] border border-[var(--color-dark-500)] text-xs sm:text-sm font-medium">
                      <span className="text-[var(--color-brand-orange)]">🪟</span> {type}
                    </div>
                  ))}
                </div>
                <Link href="/bilrutor#forfragan" className="w-full text-center py-3.5 rounded-xl bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-dark)] text-white font-bold text-sm transition-colors inline-block">
                  Skicka förfrågan →
                </Link>
                <a href="tel:017121002" className="w-full text-center py-3 rounded-xl border border-[var(--color-dark-400)] text-[var(--color-text-secondary)] hover:border-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange-light)] font-medium text-sm transition-colors inline-block">
                  Ring oss: 0171-210 02
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BRANDS GRID ─── */}
      <section className="bg-[var(--color-dark-800)] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black mb-1">Sök per bilmärke</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">Välj ditt märke och hitta rätt del</p>
            </div>
            <Link href="/bildelar/marken" className="text-sm text-[var(--color-brand-orange)] font-medium hover:underline hidden sm:block">
              Alla märken →
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-2 sm:gap-3">
            {BRANDS.map((brand) => (
              <Link
                key={brand.slug}
                href={`/bildelar/marken/${brand.slug}`}
                className="card-hover flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-center group hover:border-[var(--color-brand-orange)]/40"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-1.5 group-hover:scale-110 transition-transform shadow-md">
                  <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain" />
                </div>
                <span className="font-semibold text-xs leading-tight">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PARTS — real data from db ─── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black mb-1">Utvalda delar</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">Riktiga delar direkt ur lagret — köp direkt online</p>
          </div>
          <Link href="/bildelar" className="text-sm text-[var(--color-brand-orange)] font-medium hover:underline hidden sm:block">
            Se alla →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredParts.map((part) => (
            <FeaturedPartCard
              key={part.id}
              id={part.id}
              sku={part.sku}
              name={part.name}
              priceSek={part.priceSek!}
              brandSlug={part.vehicle.brandSlug}
              model={part.vehicle.model}
              imageUrl={partImage(part.name, part.images[0]?.url)}
            />
          ))}
        </div>
      </section>

      {/* ─── ÖPPETTIDER & KONTAKT ─── */}
      <section className="bg-[var(--color-dark-800)] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Öppettider */}
            <div>
              <h2 className="text-2xl font-black mb-2">Öppettider</h2>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                Besök oss på Magasingatan 2 i Enköping — eller ring direkt.
              </p>
              <div className="space-y-0 rounded-xl overflow-hidden border border-[var(--color-dark-500)]">
                {[
                  ["Måndag–Torsdag", "08:00 — 17:00", false],
                  ["Fredag",         "08:00 — 15:00", false],
                  ["Lördag",         "10:00 — 14:00", false],
                  ["Söndag",         "Stängt",        true],
                ].map(([day, hours, closed]) => (
                  <div
                    key={day as string}
                    className="flex justify-between items-center px-5 py-3.5 border-b border-[var(--color-dark-500)] last:border-0 bg-[var(--color-dark-700)]"
                  >
                    <span className="text-sm text-[var(--color-text-secondary)]">{day as string}</span>
                    <span className={`text-sm font-semibold ${closed ? "text-[var(--color-text-muted)]" : "text-[var(--color-text-primary)]"}`}>
                      {hours as string}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Kontakt */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black mb-2">Kontakta oss</h2>
              <a href="tel:017121002" className="flex items-center gap-4 p-5 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)]/50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-orange)]/10 flex items-center justify-center text-[var(--color-brand-orange)] text-xl shrink-0">📞</div>
                <div>
                  <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-0.5">Telefon</div>
                  <div className="font-bold group-hover:text-[var(--color-brand-orange)] transition-colors">0171-210 02</div>
                </div>
              </a>
              <a href="mailto:info@bilskrotscentralen.com" className="flex items-center gap-4 p-5 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)]/50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-orange)]/10 flex items-center justify-center text-[var(--color-brand-orange)] text-xl shrink-0">✉️</div>
                <div>
                  <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-0.5">E-post</div>
                  <div className="font-bold group-hover:text-[var(--color-brand-orange)] transition-colors">info@bilskrotscentralen.com</div>
                </div>
              </a>
              <a href="https://maps.google.com/?q=Magasingatan+2+Enköping" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)]/50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-orange)]/10 flex items-center justify-center text-[var(--color-brand-orange)] text-xl shrink-0">📍</div>
                <div>
                  <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-0.5">Besöksadress</div>
                  <div className="font-bold group-hover:text-[var(--color-brand-orange)] transition-colors">Magasingatan 2, 749 35 Enköping</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black mb-2">Varför Bilskrotscentralen?</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Riktiga delar, riktig service, 40 år i branschen</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: "🛒",
              title: "Köp direkt online",
              desc: "Hitta delen, betala med Klarna eller Swish — ingen väntan på telefonsvar.",
            },
            {
              icon: "🛡️",
              title: "Garanti på alla delar",
              desc: "Funktionsgaranti ingår. Funkar den inte? Pengarna tillbaka.",
            },
            {
              icon: "📦",
              title: "Leverans 1–3 dagar",
              desc: "PostNord eller DHL med spårning. Fri frakt över 500 kr.",
            },
            {
              icon: "⭐",
              title: "Mercedes-specialister",
              desc: "8 400+ Mercedes-delar. Luftfjädring till Sveriges lägsta priser.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)]"
            >
              <span className="text-2xl block mb-3">{item.icon}</span>
              <h3 className="text-base font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
