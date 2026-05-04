const SITE_URL = "https://bilskrotscentralen.com";
const PHONE = "+46-171-21002";
const ADDRESS = {
  streetAddress: "Magasingatan 2",
  addressLocality: "Enköping",
  postalCode: "749 35",
  addressRegion: "Uppsala län",
  addressCountry: "SE",
};
const GEO = { latitude: 59.6364, longitude: 17.0775 };
const AREA_SERVED = ["Enköping", "Uppsala", "Västerås", "Stockholm", "Eskilstuna", "Mälardalen"];

function tag(data: object) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return tag({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: "Bilskrotscentralen i Sverige AB",
    alternateName: "Bilskrotscentralen Enköping",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo-square.png`,
      width: 1024,
      height: 1024,
    },
    image: `${SITE_URL}/logo-square.png`,
    email: "info@bilskrotscentralen.com",
    telephone: PHONE,
    address: { "@type": "PostalAddress", ...ADDRESS },
    foundingDate: "1984",
    sameAs: [
      // Lägg till när konton finns:
      // "https://www.facebook.com/bilskrotscentralen",
      // "https://www.instagram.com/bilskrotscentralen",
      // "https://g.page/bilskrotscentralen",
    ],
  });
}

export function WebSiteJsonLd() {
  return tag({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    name: "Bilskrotscentralen",
    url: SITE_URL,
    inLanguage: "sv-SE",
    publisher: { "@id": `${SITE_URL}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/bildelar?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  });
}

export function LocalBusinessJsonLd() {
  return tag({
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    "@id": `${SITE_URL}#localbusiness`,
    name: "Bilskrotscentralen",
    image: `${SITE_URL}/images/mercedes-hero.jpeg`,
    logo: `${SITE_URL}/logo-square.png`,
    description:
      "Auktoriserad bildemontering och bildelsbutik i Enköping. Mercedes-specialist sedan 1984. 30 000+ begagnade bildelar i lager. Fri hämtning av skrotbil i Mälardalen.",
    url: SITE_URL,
    telephone: PHONE,
    email: "info@bilskrotscentralen.com",
    priceRange: "$$",
    currenciesAccepted: "SEK",
    paymentAccepted: "Klarna, Swish, kort, faktura",
    address: { "@type": "PostalAddress", ...ADDRESS },
    geo: { "@type": "GeoCoordinates", ...GEO },
    areaServed: AREA_SERVED.map((n) => ({ "@type": "City", name: n })),
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "08:00", closes: "17:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "08:00", closes: "15:00" },
    ],
    foundingDate: "1984",
    sameAs: [],
  });
}

type BreadcrumbItem = { name: string; url: string };
export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  return tag({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  });
}

type ProductInput = {
  name: string;
  sku: string;
  description?: string;
  imageUrl?: string;
  brandName?: string;
  vehicle?: { model: string; year: number | null };
  priceSek?: number | null;
  available: boolean;
  url: string;
  oeNumber?: string | null;
};
export function ProductJsonLd({ product }: { product: ProductInput }) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.description,
    image: product.imageUrl ? [product.imageUrl] : undefined,
    brand: product.brandName ? { "@type": "Brand", name: product.brandName } : undefined,
    mpn: product.oeNumber ?? undefined,
    isRelatedTo: product.vehicle
      ? `${product.brandName ?? ""} ${product.vehicle.model}${product.vehicle.year ? ` ${product.vehicle.year}` : ""}`.trim()
      : undefined,
  };
  if (product.priceSek != null) {
    data.offers = {
      "@type": "Offer",
      url: product.url,
      priceCurrency: "SEK",
      price: product.priceSek,
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/UsedCondition",
      seller: { "@id": `${SITE_URL}#organization` },
    };
  }
  return tag(data);
}

type FaqItem = { question: string; answer: string };
export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  return tag({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  });
}
