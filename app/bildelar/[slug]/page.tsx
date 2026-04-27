import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/db";
import { getBrand } from "@/lib/codelist";
import { AddToCartButton } from "@/components/AddToCartButton";
import { BreadcrumbJsonLd, ProductJsonLd } from "@/components/JsonLd";

const SITE_URL = "https://bilskrotscentralen.se";

function waText(partName: string, sku: string, prefix: string): string {
  const name = partName.length > 60 ? partName.slice(0, 60) + "…" : partName;
  return encodeURIComponent(`${prefix} ${name} (Art.nr ${sku}).`);
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const part = await db.part.findUnique({
    where: { sku: slug },
    include: { vehicle: true, images: { take: 1, orderBy: { sortOrder: "asc" } } },
  });
  if (!part) return { title: "Delen hittades inte" };
  const brand = getBrand(part.vehicle.brandSlug);
  const title = `${part.name} — ${brand?.name ?? part.vehicle.brandSlug} ${part.vehicle.model}${part.vehicle.year ? ` ${part.vehicle.year}` : ""}`;
  const description = `${part.name} till ${brand?.name ?? ""} ${part.vehicle.model}${
    part.vehicle.year ? ` ${part.vehicle.year}` : ""
  }${part.oeNumber ? ` (OE ${part.oeNumber})` : ""}. ${part.priceSek?.toLocaleString("sv-SE") ?? "Pris på förfrågan"} kr · Begagnad originaldel från Bilskrotscentralen i Enköping · Garanti · Leverans 1–3 dagar i hela Sverige.`;
  return {
    title,
    description,
    alternates: { canonical: `/bildelar/${part.sku}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/bildelar/${part.sku}`,
      images: part.images?.[0]?.url ? [{ url: part.images[0].url, alt: part.name }] : undefined,
    },
  };
}

export default async function PartPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const part = await db.part.findUnique({
    where: { sku: slug },
    include: { vehicle: true, images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!part) notFound();

  const brand = getBrand(part.vehicle.brandSlug);
  const partUrl = `${SITE_URL}/bildelar/${part.sku}`;
  const breadcrumbs = [
    { name: "Hem", url: "/" },
    { name: "Bildelar", url: "/bildelar" },
    { name: brand?.name ?? part.vehicle.brandSlug, url: `/bildelar/marken/${part.vehicle.brandSlug}` },
    { name: part.name, url: `/bildelar/${part.sku}` },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 pt-10 pb-20">
      <ProductJsonLd
        product={{
          name: part.name,
          sku: part.sku,
          description: part.notes ?? undefined,
          imageUrl: part.images[0]?.url
            ? part.images[0].url.startsWith("http")
              ? part.images[0].url
              : `${SITE_URL}${part.images[0].url}`
            : undefined,
          brandName: brand?.name ?? part.vehicle.brandSlug,
          vehicle: { model: part.vehicle.model, year: part.vehicle.year },
          priceSek: part.priceSek,
          available: part.status === "AVAILABLE",
          url: partUrl,
          oeNumber: part.oeNumber,
        }}
      />
      <BreadcrumbJsonLd items={breadcrumbs} />
      {/* Breadcrumb */}
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[var(--color-brand-orange)]">Hem</Link>
        <span>›</span>
        <Link href="/bildelar" className="hover:text-[var(--color-brand-orange)]">Bildelar</Link>
        <span>›</span>
        <a href={`/bildelar/marken/${part.vehicle.brandSlug}`} className="hover:text-[var(--color-brand-orange)]">
          {brand?.name ?? part.vehicle.brandSlug}
        </a>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)] truncate">{part.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Image gallery */}
        <div>
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-[var(--color-dark-600)] to-[var(--color-dark-800)] border border-[var(--color-dark-500)] flex items-center justify-center text-8xl overflow-hidden relative">
            {part.images[0] ? (
              <Image
                src={part.images[0].url}
                alt={part.images[0].alt ?? part.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              "🔩"
            )}
          </div>
          {part.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {part.images.slice(1, 6).map((img) => (
                <div key={img.id} className="aspect-square rounded-lg bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] overflow-hidden relative">
                  <Image
                    src={img.url}
                    alt={img.alt ?? part.name}
                    fill
                    sizes="20vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
            {brand?.name ?? part.vehicle.brandSlug} · {part.vehicle.model}
            {part.vehicle.year ? ` · ${part.vehicle.year}` : ""}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">{part.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <StatusPill status={part.status} />
            <span className="text-xs text-[var(--color-text-muted)]">Artikelnr {part.sku}</span>
          </div>

          {part.priceSek != null ? (
            <>
              <div className="text-4xl font-black text-[var(--color-brand-orange)] mb-1">
                {part.priceSek.toLocaleString("sv-SE")} kr
              </div>
              <div className="text-xs text-[var(--color-text-muted)] mb-8">
                inkl. moms · Fri frakt över 500 kr
              </div>
              <AddToCartButton
                partId={part.id}
                sku={part.sku}
                name={part.name}
                priceSek={part.priceSek}
                available={part.status === "AVAILABLE"}
              />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-[var(--color-text-muted)] mb-1">
                Pris på förfrågan
              </div>
              <div className="text-xs text-[var(--color-text-muted)] mb-8">
                Kontakta oss så svarar vi direkt
              </div>
              <a
                href={`https://wa.me/4617121002?text=${waText(part.name, part.sku, "Hej! Jag är intresserad av — vad är priset för")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-base px-8 py-4 rounded-xl w-full sm:w-auto transition-colors"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Förfråga pris på WhatsApp
              </a>
            </>
          )}

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
            <Spec label="OE-nummer" value={part.oeNumber ?? "—"} />
            <Spec label="Skick" value={conditionLabel(part.condition)} />
            <Spec label="Demonterad ur" value={`${brand?.name ?? part.vehicle.brandSlug} ${part.vehicle.model}`} />
            <Spec label="Årsmodell" value={part.vehicle.year?.toString() ?? "—"} />
            <Spec label="Lagernr fordon" value={part.vehicle.stockNumber} />
            {part.notes && <Spec label="Noteringar" value={part.notes} full />}
          </div>

          {/* Trust */}
          <div className="mt-8 p-4 rounded-xl bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-sm">
            <div className="flex items-center gap-2">🛡️ <span>Garanti på alla delar</span></div>
            <div className="flex items-center gap-2">🚚 <span>Leverans 1–3 dagar</span></div>
            <a
              href={`https://wa.me/4617121002?text=${waText(part.name, part.sku, "Hej! Jag har en fråga om")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#25D366] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span>Frågor? Skriv på WhatsApp</span>
            </a>
            <div className="flex items-center gap-2">💳 <span>Klarna, Swish, kort</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Spec({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-0.5">{label}</div>
      <div className="text-[var(--color-text-primary)]">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    AVAILABLE: "bg-[var(--color-success)]/10 text-[var(--color-success-bright)]",
    RESERVED: "bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange-light)]",
    SOLD: "bg-[var(--color-dark-500)] text-[var(--color-text-muted)]",
    WITHDRAWN: "bg-[var(--color-dark-500)] text-[var(--color-text-muted)]",
  };
  const labels: Record<string, string> = {
    AVAILABLE: "✓ I lager",
    RESERVED: "Reserverad",
    SOLD: "Slutsåld",
    WITHDRAWN: "Återkallad",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] ?? ""}`}>
      {labels[status] ?? status}
    </span>
  );
}

function conditionLabel(c: string): string {
  const m: Record<string, string> = {
    NEW: "Ny",
    USED_LIKE_NEW: "Begagnad — som ny",
    USED_GOOD: "Begagnad — bra skick",
    USED_OK: "Begagnad — OK skick",
    USED_POOR: "Begagnad — slitet",
  };
  return m[c] ?? c;
}
