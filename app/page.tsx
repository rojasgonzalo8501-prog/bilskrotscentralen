/* ─── Homepage — Bilskrotscentralen ─── */

import Image from "next/image";
import Link from "next/link";
import { getBrands } from "@/lib/codelist";
import { db } from "@/lib/db";
import { HomeHero } from "@/components/HomeHero";
import { TrustStrip } from "@/components/TrustStrip";
import { FeaturedPartCard } from "@/components/FeaturedPartCard";
import { TestimonialCarousel, type Testimonial } from "@/components/TestimonialCarousel";
import { GUIDES } from "@/lib/guider";

// ISR: regenerate the homepage every 60s instead of fetching live on
// every request — featured parts and category counts don't need to be
// up-to-the-second, and this gives near-static performance.
export const revalidate = 60;

const BRANDS = getBrands();
const TOP_BRANDS = BRANDS.slice(0, 8);
const HERO_BRANDS = BRANDS.map((b) => ({ slug: b.slug, name: b.name }));

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

const MERCEDES_OE_CARDS = [
  { slug: "motor-transmission", name: "Motor",         image: "/images/motor.jpeg" },
  { slug: "motor-transmission", name: "Växellåda",     image: "/images/montering.jpeg" },
  { slug: "hjul-dack",          name: "Hjul & Stötd.", image: "/images/dack.jpeg" },
  { slug: "kaross-plat",        name: "Kaross",        image: "/images/vindruta.jpeg" },
  { slug: "kaross-plat",        name: "Dörr",          image: "/images/mercedes-hero.jpeg" },
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    author: "Lars E.",
    location: "Uppsala",
    rating: 5,
    text: "Hittade en omöjlig Mercedes-del på 24 timmar. Adam ringde personligen och rapporterade. Toppservice.",
    source: "Google",
  },
  {
    id: "t2",
    author: "Anna K.",
    location: "Västerås",
    rating: 5,
    text: "Skrotade min gamla Volvo — gratis hämtning, fick betalt på Swish samma dag. Smidigare än jag trodde.",
    source: "Trustpilot",
  },
  {
    id: "t3",
    author: "Bengts Bilservice",
    location: "Enköping",
    rating: 5,
    text: "Vår fasta partner sedan 5 år. Snabba leveranser, faktura 30 dagar, alltid rätt del. Rekommenderas.",
    source: "B2B-kund",
  },
  {
    id: "t4",
    author: "Mikael S.",
    location: "Stockholm",
    rating: 5,
    text: "Köpte luftfjäder till min E-klass. Halva priset mot ny — och med 6 månaders garanti.",
    source: "Google",
  },
  {
    id: "t5",
    author: "Jenny H.",
    location: "Eskilstuna",
    rating: 5,
    text: "Beställde söndag kväll. Levererad onsdag. Klarna-betalning gjorde det superenkelt.",
    source: "Trustpilot",
  },
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

export default async function HomePage() {
  const rawFeatured = await db.part.findMany({
    where: { status: "AVAILABLE", priceSek: { not: null } },
    include: { vehicle: true, images: { take: 1, orderBy: { sortOrder: "asc" } } },
    orderBy: [{ vehicle: { brandSlug: "asc" } }, { priceSek: "desc" }],
    take: 8,
  });

  const featuredParts = rawFeatured
    .sort((a, b) => {
      const aMerc = a.vehicle.brandSlug === "mercedes-benz" ? 0 : 1;
      const bMerc = b.vehicle.brandSlug === "mercedes-benz" ? 0 : 1;
      return aMerc - bMerc || (b.priceSek ?? 0) - (a.priceSek ?? 0);
    })
    .slice(0, 4);

  return (
    <>
      {/* ─── HERO ─── */}
      <HomeHero brands={HERO_BRANDS} />

      {/* ─── TRUST STRIP ─── */}
      <TrustStrip />

      {/* ─── MERCEDES SPECIALISTER ─── */}
      <section className="bg-white py-16 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wider uppercase">
              Mercedes Specialister
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Sök originaldelar direkt på OE-nummer — Mercedes-specialist sedan 1984
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr,3fr] gap-6 items-stretch">
            {/* Big Mercedes engine illustration */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 min-h-[260px]">
              <Image
                src="/images/motor.jpeg"
                alt="Mercedes motor"
                fill
                sizes="(max-width: 1024px) 100vw, 25vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-sm font-bold leading-tight mb-1">
                  Din expert på<br />begagnade och<br />testade originaldelar.
                </div>
              </div>
            </div>

            {/* 5 cards in a horizontal row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {MERCEDES_OE_CARDS.map((card, i) => (
                <form
                  key={i}
                  action="/bildelar"
                  className="rounded-xl border border-slate-200 bg-white hover:border-slate-400 hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  <input type="hidden" name="marke" value="mercedes-benz" />
                  <input type="hidden" name="kategori" value={card.slug} />
                  <div className="aspect-square bg-slate-50 relative">
                    <Image
                      src={card.image}
                      alt={card.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 15vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2 border-t border-slate-100 flex flex-col gap-1.5 bg-white">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider px-1">
                      {card.name}
                    </div>
                    <div className="flex gap-1 items-center">
                      <input
                        type="text"
                        name="q"
                        placeholder="OE-nr…"
                        className="flex-1 min-w-0 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] placeholder:text-slate-400 text-slate-900 focus:outline-none focus:border-slate-900 transition-all"
                      />
                      <button
                        type="submit"
                        aria-label={`Sök ${card.name}`}
                        className="shrink-0 p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </form>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── KATEGORIER ─── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">Populära kategorier</h2>
            <p className="text-sm text-slate-500">Bläddra efter deltyp</p>
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
              className="group relative rounded-xl overflow-hidden border border-slate-200 aspect-[4/3] hover:shadow-lg transition-shadow"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <div className="font-bold text-sm leading-tight">{cat.name}</div>
                <div className="text-xs text-[var(--color-brand-orange-light)] font-medium mt-0.5">
                  {cat.count.toLocaleString()} delar
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── TRUST + B2B side-by-side ─── */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-6">

            {/* LEFT — Trust and Sustainability */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wider uppercase mb-5">
                Trust &amp; Sustainability
              </h2>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded bg-emerald-500 text-white text-xl font-black">
                    ★
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Trustpilot
                    </div>
                    <div className="text-2xl font-black text-slate-900 leading-none mt-0.5">
                      4.9<span className="text-base text-slate-400">/5</span>
                    </div>
                  </div>
                  <div className="ml-auto text-xs text-slate-500">
                    240+<br />recensioner
                  </div>
                </div>
              </div>

              <TestimonialCarousel testimonials={TESTIMONIALS} />
            </div>

            {/* RIGHT — B2B Portal */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wider uppercase mb-5">
                B2B Portal
              </h2>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    För verkstäder:
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 leading-snug">
                  Nettopriser, expressfrakt och realtidslager.
                </h3>

                <Link
                  href="/b2b/anslut"
                  className="block text-center px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm uppercase tracking-wider transition-colors"
                >
                  Anslut Din Verkstad
                </Link>
                <Link
                  href="/b2b"
                  className="block text-center mt-2 text-xs text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Läs mer om B2B-portalen →
                </Link>

                <Link
                  href="/logga-in"
                  className="block text-center mt-2 text-xs text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Redan kund? Logga in →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED PARTS ─── */}
      <section className="max-w-6xl mx-auto px-4 py-16 bg-white">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">Utvalda delar</h2>
            <p className="text-sm text-slate-500">Riktiga delar direkt ur lagret — köp direkt online</p>
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

      {/* ─── VERKSTAD — köp + montering på samma plats ─── */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-[1.1fr,1fr] gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-brand-orange)]/15 border border-[var(--color-brand-orange)]/30 text-[var(--color-brand-orange-light)] text-xs font-bold uppercase tracking-widest mb-4">
                Köp + montering på samma plats
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
                Vi är även en <span className="text-[var(--color-brand-orange)]">Mercedes-verkstad</span>
              </h2>
              <p className="text-base text-slate-300 mb-6 leading-relaxed">
                Behöver du delen monterad? Vår verkstad i Enköping fixar det
                samma dag — luftfjädring, AC, motor, växellåda och elektronik.
                Originaldelar från eget lager till halva priset av nytt.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                {[
                  "Luftfjädring (Airmatic)",
                  "AC-service",
                  "Motor & turbo",
                  "Växellåda",
                  "Diagnos & elektronik",
                  "Hjul & balansering",
                ].map((s) => (
                  <div
                    key={s}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-xs text-slate-300"
                  >
                    <span className="w-1 h-1 rounded-full bg-[var(--color-brand-orange)]" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/verkstad"
                  className="px-5 py-3 rounded-xl bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-dark)] text-white font-bold text-sm transition-colors uppercase tracking-wider"
                >
                  Boka verkstadstid →
                </Link>
                <a
                  href="tel:017121002"
                  className="px-5 py-3 rounded-xl border border-slate-600 hover:border-white text-slate-200 hover:text-white font-bold text-sm transition-colors"
                >
                  Ring 0171-210 02
                </a>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-[420px]">
              <Image
                src="/images/verkstad-hero.jpeg"
                alt="Bilskrotscentralens verkstad i Enköping"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                  <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-1">
                    Mercedes-specialist sedan 1984
                  </div>
                  <div className="text-sm font-bold text-white">
                    40 års erfarenhet — vi lagar det andra verkstäder skickar
                    vidare.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GUIDER — kunskapsbank för SEO ─── */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
                Guider &amp; kunskapsbank
              </h2>
              <p className="text-sm text-slate-500">
                40 års erfarenhet — gratis kunskap från våra Mercedes-specialister
              </p>
            </div>
            <Link
              href="/guider"
              className="text-sm text-[var(--color-brand-orange)] font-medium hover:underline hidden sm:block"
            >
              Alla guider →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GUIDES.slice(0, 3).map((g) => (
              <Link
                key={g.slug}
                href={`/guider/${g.slug}`}
                className="group p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col"
              >
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {g.category} · {g.readTimeMin} min
                </span>
                <h3 className="font-bold text-slate-900 leading-tight mb-2 group-hover:text-[var(--color-brand-orange)] transition-colors">
                  {g.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-3">
                  {g.excerpt}
                </p>
                <span className="text-sm font-semibold text-[var(--color-brand-orange)]">
                  Läs guiden →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BILRUTOR-BANNER (light) ─── */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)] text-xs font-bold uppercase tracking-widest mb-3">
                  Nya rutor till alla bilar
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
                  Nya bilrutor till alla bilar
                </h2>
                <p className="text-slate-600">
                  Vindrutor, bakrutor, sidorutor och takluckor. Vi levererar och monterar.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  {["Vindruta", "Bakruta", "Sidoruta", "Taklucka"].map((type) => (
                    <div key={type} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-medium text-slate-700">
                      <span className="text-[var(--color-brand-orange)]">🪟</span> {type}
                    </div>
                  ))}
                </div>
                <Link href="/bilrutor#forfragan" className="w-full text-center py-3.5 rounded-xl bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-dark)] text-white font-bold text-sm transition-colors uppercase">
                  Skicka förfrågan →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BRANDS GRID ─── */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">Sök per bilmärke</h2>
              <p className="text-sm text-slate-500">Välj ditt märke och hitta rätt del</p>
            </div>
            <Link href="/bildelar/marken" className="text-sm text-[var(--color-brand-orange)] font-medium hover:underline hidden sm:block">
              Alla märken →
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-2 sm:gap-3">
            {TOP_BRANDS.map((brand) => (
              <Link
                key={brand.slug}
                href={`/bildelar/marken/${brand.slug}`}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-slate-200 text-center group hover:border-slate-300 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center p-1.5 group-hover:scale-110 transition-transform">
                  <Image
                    src={brand.logoUrl}
                    alt={brand.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-semibold text-xs leading-tight text-slate-700">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ÖPPETTIDER + KONTAKT ─── */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Öppettider</h2>
              <p className="text-sm text-slate-500 mb-6">Magasingatan 2, Enköping</p>
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                {[
                  ["Måndag–Torsdag", "08:00 — 17:00", false],
                  ["Fredag", "08:00 — 15:00", false],
                  ["Lördag", "10:00 — 14:00", false],
                  ["Söndag", "Stängt", true],
                ].map(([day, hours, closed]) => (
                  <div
                    key={day as string}
                    className="flex justify-between items-center px-5 py-3.5 border-b border-slate-100 last:border-0"
                  >
                    <span className="text-sm text-slate-600">{day as string}</span>
                    <span className={`text-sm font-semibold ${closed ? "text-slate-400" : "text-slate-900"}`}>
                      {hours as string}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-black text-slate-900 mb-2">Kontakta oss</h2>
              <a href="tel:017121002" className="flex items-center gap-4 p-5 rounded-xl bg-white border border-slate-200 hover:border-[var(--color-brand-orange)]/40 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-orange)]/10 flex items-center justify-center text-[var(--color-brand-orange)] text-xl">📞</div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Telefon</div>
                  <div className="font-bold text-slate-900">0171-210 02</div>
                </div>
              </a>
              <a href="mailto:info@bilskrotscentralen.com" className="flex items-center gap-4 p-5 rounded-xl bg-white border border-slate-200 hover:border-[var(--color-brand-orange)]/40 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-orange)]/10 flex items-center justify-center text-[var(--color-brand-orange)] text-xl">✉️</div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">E-post</div>
                  <div className="font-bold text-slate-900 text-sm">info@bilskrotscentralen.com</div>
                </div>
              </a>
              <a href="https://maps.google.com/?q=Magasingatan+2+Enköping" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 rounded-xl bg-white border border-slate-200 hover:border-[var(--color-brand-orange)]/40 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-orange)]/10 flex items-center justify-center text-[var(--color-brand-orange)] text-xl">📍</div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Besöksadress</div>
                  <div className="font-bold text-slate-900">Magasingatan 2, Enköping</div>
                </div>
              </a>
            </div>
          </div>

          {/* Google Maps embed — single iframe is plenty for one location */}
          <div className="mt-10">
            <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-[16/9] sm:aspect-[21/9] shadow-sm">
              <iframe
                src="https://www.google.com/maps?q=Magasingatan+2,+749+35+Enk%C3%B6ping&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title="Bilskrotscentralen — Magasingatan 2, Enköping"
              />
            </div>
            <p className="text-xs text-slate-500 text-center mt-3">
              Gratis besöksparkering · 5 min från E18 · enklast med bil
            </p>
          </div>
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Varför Bilskrotscentralen?</h2>
            <p className="text-sm text-slate-500">Riktiga delar, riktig service, 40 år i branschen</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🛒", title: "Köp direkt online", desc: "Hitta delen, betala med Klarna eller Swish — ingen väntan på telefonsvar." },
              { icon: "🛡️", title: "Garanti på alla delar", desc: "Funktionsgaranti ingår. Funkar den inte? Pengarna tillbaka." },
              { icon: "📦", title: "Leverans 1–3 dagar", desc: "PostNord eller DHL med spårning. Fri frakt över 500 kr." },
              { icon: "♻️", title: "100 % återvinning", desc: "Allt från bilen återvinns till nytt material — inget blir avfall." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-sm transition-all">
                <span className="text-2xl block mb-3">{item.icon}</span>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
