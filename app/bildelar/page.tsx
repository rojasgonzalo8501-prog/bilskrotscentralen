import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { getBrands } from "@/lib/codelist";
import BrandSelector from "./BrandSelector";
import { MobileFilters } from "./MobileFilters";

export const metadata: Metadata = {
  title: "Alla bildelar — sök 30 000+ delar i lager",
  description:
    "Sök bland alla våra begagnade bildelar. Filtrera per märke, kategori eller modell. Fri frakt över 500 kr · Garanti · Leverans 1–3 dagar.",
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  q?: string;
  marke?: string;
  kategori?: string;
  modell?: string;
  ar?: string;
  sortera?: string;
}>;

const SORT_OPTIONS = [
  { value: "ny",        label: "Nyast först" },
  { value: "pris-asc", label: "Lägsta pris" },
  { value: "pris-desc", label: "Högsta pris" },
];

function sortOrder(sortera?: string) {
  if (sortera === "pris-asc")  return { priceSek: "asc"  as const };
  if (sortera === "pris-desc") return { priceSek: "desc" as const };
  return { createdAt: "desc" as const };
}

export default async function BildelarPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, marke, kategori, modell, ar, sortera } = await searchParams;

  const categoryData = kategori ? getCategory(kategori) : null;

  // Collect AND-conditions so q-OR and kategori-OR don't overwrite each other
  const andConditions: object[] = [];

  if (q) {
    andConditions.push({
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { oeNumber: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
      ],
    });
  }

  if (categoryData?.partCodePrefixes.length) {
    andConditions.push({
      OR: categoryData.partCodePrefixes.map((prefix) => ({
        partCode: { startsWith: prefix },
      })),
    });
  }

  const where = {
    status: "AVAILABLE" as const,
    ...(andConditions.length > 0 && { AND: andConditions }),
    ...((marke || modell || ar) && {
      vehicle: {
        ...(marke && { brandSlug: marke }),
        ...(modell && { model: { contains: modell, mode: "insensitive" as const } }),
        ...(ar && { year: parseInt(ar) }),
      },
    }),
  };

  const [parts, totalAvailable] = await Promise.all([
    db.part.findMany({
      where,
      include: { vehicle: true, images: { take: 1, orderBy: { sortOrder: "asc" } } },
      orderBy: sortOrder(sortera),
      take: 60,
    }),
    db.part.count({ where: { status: "AVAILABLE" } }),
  ]);

  const allBrands = getBrands();
  const brands = allBrands.slice(0, 12);

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-10 pb-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/motor.jpeg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />

        <div className="relative max-w-7xl mx-auto px-4">
          <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--color-brand-orange)] transition-colors">Hem</Link>
            <span>›</span>
            <span className="text-[var(--color-text-secondary)]">Bildelar</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
            Alla <span className="gradient-text">bildelar</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mb-8">
            {totalAvailable.toLocaleString("sv-SE")} delar tillgängliga · Begagnade originaldelar
            med garanti.
          </p>

          {/* Brand → Model → Year dropdown (client component) */}
          <BrandSelector brands={allBrands} />

          {/* OE-number / free text search */}
          <form method="GET" className="mt-4 max-w-3xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="q"
                defaultValue={q ?? ""}
                placeholder="Eller sök på OE-nummer, artikelnr eller del…"
                className="flex-1 px-5 py-3.5 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] focus:ring-1 focus:ring-[var(--color-brand-orange)] transition-all"
              />
              <button type="submit" className="btn-primary text-sm px-6 py-3.5 rounded-xl whitespace-nowrap">
                Sök →
              </button>
            </div>
            {(q || marke || kategori || modell || ar) && (
              <div className="mt-3 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                <span>Filter:</span>
                {q && <Pill label={`"${q}"`} />}
                {marke && <Pill label={`Märke: ${marke}`} />}
                {modell && <Pill label={`Modell: ${modell}`} />}
                {ar && <Pill label={`År: ${ar}`} />}
                {kategori && <Pill label={`Kategori: ${kategori}`} />}
                <Link href="/bildelar" className="ml-2 text-[var(--color-brand-orange)] hover:underline">
                  Rensa
                </Link>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* ─── MAIN CONTENT: SIDEBAR + GRID ─── */}
      <section className="max-w-7xl mx-auto px-4 py-8 pb-20">
        <div className="flex gap-8">

          {/* ─── SIDEBAR ─── */}
          <aside className="hidden lg:flex flex-col gap-6 w-56 shrink-0">

            {/* Categories */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                Kategorier
              </h3>
              <ul className="space-y-0.5">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <a
                      href={`/bildelar/kategorier/${c.slug}`}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                        kategori === c.slug
                          ? "bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)] font-medium"
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-700)] hover:text-[var(--color-text-primary)]"
                      }`}
                    >
                      <span className="text-base leading-none">{c.icon}</span>
                      <span className="leading-tight">{c.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[var(--color-dark-600)]" />

            {/* Brands */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                Märken
              </h3>
              <ul className="space-y-0.5">
                {brands.map((b) => (
                  <li key={b.slug}>
                    <a
                      href={`/bildelar?marke=${b.slug}`}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                        marke === b.slug
                          ? "bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)] font-medium"
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-dark-700)] hover:text-[var(--color-text-primary)]"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={b.logoUrl} alt={b.name} width={16} height={16} className="object-contain max-w-full max-h-full" loading="lazy" />
                      </div>
                      <span>{b.name}</span>
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    href="/bildelar/marken"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--color-brand-orange)] hover:bg-[var(--color-dark-700)] transition-all"
                  >
                    <span>→</span>
                    <span>Alla {allBrands.length} märken</span>
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          {/* ─── PARTS GRID ─── */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter drawer */}
            <MobileFilters
              categories={CATEGORIES}
              brands={brands}
              aktivKategori={kategori}
              aktivMarke={marke}
            />
            {/* Mobile category pills */}
            <div className="lg:hidden flex gap-2 flex-wrap mb-6">
              {CATEGORIES.map((c) => (
                <a
                  key={c.slug}
                  href={`/bildelar/kategorier/${c.slug}`}
                  className="px-3 py-1.5 rounded-full text-sm border border-[var(--color-dark-500)] text-[var(--color-text-secondary)] hover:border-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange)] transition-all"
                >
                  {c.icon} {c.name}
                </a>
              ))}
            </div>

            {parts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--color-dark-500)] p-12 text-center">
                <div className="text-5xl mb-4">📦</div>
                <h2 className="text-xl font-bold mb-2">
                  {q || marke || modell || ar
                    ? "Inga delar matchade din sökning"
                    : "Lagret håller på att laddas upp"}
                </h2>
                <p className="text-[var(--color-text-secondary)] text-sm mb-6 max-w-md mx-auto">
                  {q || marke || modell || ar ? (
                    <>Försök bredda sökningen eller använd <a href="/eftersok" className="text-[var(--color-brand-orange)] hover:underline">eftersökstjänsten</a> — vi har 30 000+ delar som inte alla är digitaliserade än.</>
                  ) : (
                    <>Adams första lagerexport är på väg in. Under tiden kan du ringa <strong>0171-210 02</strong> eller skicka en eftersökning så hittar vi din del.</>
                  )}
                </p>
                <a href="/eftersok" className="btn-primary">Skicka eftersökning →</a>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
                  <h2 className="text-lg font-bold">
                    {parts.length} {parts.length === 1 ? "del" : "delar"}{" "}
                    <span className="text-sm font-normal text-[var(--color-text-muted)]">visas</span>
                  </h2>
                  <form method="GET">
                    {/* Preserve existing filters */}
                    {q && <input type="hidden" name="q" value={q} />}
                    {marke && <input type="hidden" name="marke" value={marke} />}
                    {kategori && <input type="hidden" name="kategori" value={kategori} />}
                    {modell && <input type="hidden" name="modell" value={modell} />}
                    {ar && <input type="hidden" name="ar" value={ar} />}
                    <div className="flex items-center gap-2">
                      <select
                        name="sortera"
                        defaultValue={sortera ?? "ny"}
                        className="px-3 py-2 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-sm text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-brand-orange)] cursor-pointer"
                      >
                        {SORT_OPTIONS.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <button type="submit" className="px-3 py-2 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-brand-orange)] transition-colors">→</button>
                    </div>
                  </form>
                </div>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {parts.map((p) => (
                    <a
                      key={p.id}
                      href={`/bildelar/${p.sku}`}
                      className="card-hover rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] overflow-hidden group"
                    >
                      <div className="h-44 bg-gradient-to-br from-[var(--color-dark-600)] to-[var(--color-dark-800)] flex items-center justify-center text-5xl">
                        {p.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.images[0].url} alt={p.images[0].alt ?? p.name} className="w-full h-full object-cover" />
                        ) : (
                          "🔩"
                        )}
                      </div>
                      <div className="p-4">
                        <div className="text-xs text-[var(--color-text-muted)] mb-1">
                          {p.vehicle.brandSlug} · {p.vehicle.model}
                        </div>
                        <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2">{p.name}</h3>
                        {p.oeNumber && (
                          <div className="text-xs text-[var(--color-text-muted)] mb-3">OE: {p.oeNumber}</div>
                        )}
                        <div className="text-xl font-black text-[var(--color-brand-orange)]">
                          {p.priceSek?.toLocaleString("sv-SE") ?? "—"} kr
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
      </section>
    </>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange-light)] border border-[var(--color-brand-orange)]/30">
      {label}
    </span>
  );
}
