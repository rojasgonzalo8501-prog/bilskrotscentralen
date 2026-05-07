import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/db";
import { getBrand } from "@/lib/codelist";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ChatTrigger } from "@/components/ChatTrigger";
import { StickyAddToCart } from "@/components/StickyAddToCart";
import { WishlistButton } from "@/components/WishlistButton";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { BreadcrumbJsonLd, ProductJsonLd } from "@/components/JsonLd";

const SITE_URL = "https://bilskrotscentralen.com";

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
              <div className="flex flex-wrap gap-2 items-center">
                <AddToCartButton
                  partId={part.id}
                  sku={part.sku}
                  name={part.name}
                  priceSek={part.priceSek}
                  available={part.status === "AVAILABLE"}
                />
                <WishlistButton sku={part.sku} variant="inline" />
              </div>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-[var(--color-text-muted)] mb-1">
                Pris på förfrågan
              </div>
              <div className="text-xs text-[var(--color-text-muted)] mb-8">
                Kontakta oss så svarar vi direkt
              </div>
              <Link
                href={{
                  pathname: "/eftersok",
                  query: {
                    sku: part.sku,
                    del: part.name,
                    marke: brand?.name ?? part.vehicle.brandSlug,
                    modell: part.vehicle.model,
                    ar: part.vehicle.year ?? "",
                  },
                }}
                aria-label="Skicka pris-förfrågan på den här delen"
                className="inline-flex items-center gap-3 bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-dark)] text-white font-bold text-base px-8 py-4 rounded-xl w-full sm:w-auto transition-colors justify-center"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                Skicka pris-förfrågan
              </Link>
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
            <ChatTrigger
              context={{
                topic: "Fråga om del",
                sku: part.sku,
                partName: part.name,
                url: `${SITE_URL}/bildelar/${part.sku}`,
              }}
              prefill={`Hej! Jag har en fråga om ${part.name} (Art.nr ${part.sku}).`}
              fallbackHref={`https://wa.me/4617121002?text=${waText(part.name, part.sku, "Hej! Jag har en fråga om")}`}
              ariaLabel="Öppna chatten och fråga om delen"
              className="flex items-center gap-2 hover:text-[var(--color-brand-orange)] transition-colors text-left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
              <span>Frågor? Öppna chatten</span>
            </ChatTrigger>
            <div className="flex items-center gap-2">💳 <span>Klarna, Swish, kort</span></div>
          </div>
        </div>
      </div>

      <RecentlyViewed currentSku={part.sku} />

      <StickyAddToCart
        partId={part.id}
        sku={part.sku}
        name={part.name}
        priceSek={part.priceSek}
        available={part.status === "AVAILABLE"}
      />
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
