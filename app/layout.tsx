import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getSession } from "@/lib/auth";
import { CartProvider } from "@/components/CartContext";
import Header from "@/components/Header";
import { LocalBusinessJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ea580c",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://bilskrotscentralen.com"),
  title: {
    default: "Bilskrotscentralen Enköping — Begagnade bildelar | Mercedes-specialist sedan 1984",
    template: "%s | Bilskrotscentralen Enköping",
  },
  description:
    "Bildemontering i Enköping med 30 000+ begagnade bildelar i lager. Mercedes-specialist sedan 1984. Fri hämtning av skrotbilar i Mälardalen — Uppsala, Västerås, Stockholm, Eskilstuna. Garanti, Klarna & Swish.",
  keywords: [
    "bildelar Enköping",
    "begagnade bildelar Mälardalen",
    "Mercedes bildelar",
    "luftfjädring Mercedes",
    "bilskrot Enköping",
    "bildemontering Enköping",
    "skrota bilen Uppsala",
    "skrota bilen Västerås",
    "skrota bilen Stockholm",
    "reservdelar Mercedes-Benz",
  ],
  alternates: {
    canonical: "/",
    languages: { "sv-SE": "/" },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Bilskrotscentralen Enköping — Bildelar till rätt pris",
    description: "30 000+ begagnade bildelar i lager. Mercedes-specialist sedan 1984. Fri hämtning i hela Mälardalen.",
    type: "website",
    locale: "sv_SE",
    siteName: "Bilskrotscentralen",
    url: "https://bilskrotscentralen.com",
    images: [{ url: "/images/mercedes-hero.jpeg", width: 1200, height: 630, alt: "Bilskrotscentralen bildemontering Enköping" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bilskrotscentralen Enköping — Bildelar till rätt pris",
    description: "30 000+ begagnade bildelar. Mercedes-specialist sedan 1984. Fri hämtning i Mälardalen.",
    images: ["/images/mercedes-hero.jpeg"],
  },
  applicationName: "Bilskrotscentralen",
  authors: [{ name: "Bilskrotscentralen i Sverige AB" }],
  creator: "Bilskrotscentralen i Sverige AB",
  publisher: "Bilskrotscentralen i Sverige AB",
  category: "Bildemontering",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="sv" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){if(localStorage.getItem('theme')==='light')document.documentElement.classList.add('light');})();` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href="https://bilskrotscentralen.com" />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <LocalBusinessJsonLd />
      </head>
      <body className="antialiased">
        <CartProvider>
          <Header session={session} />
          <main>{children}</main>
          <Footer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="border-t border-[var(--color-dark-500)] bg-[var(--color-dark-900)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <svg width="36" height="36" viewBox="0 0 42 42" fill="none">
                <defs><clipPath id="footer-logo-clip"><rect width="42" height="42" rx="11"/></clipPath></defs>
                <g clipPath="url(#footer-logo-clip)">
                  <rect width="42" height="42" fill="#111827"/>
                  <rect x="0" y="0" width="6" height="42" fill="#ea580c"/>
                </g>
                <path d="M13 30 L13 12 L18 12 L21 18 L24 12 L29 12 L29 30 L25 30 L25 20 L21 25 L17 20 L17 30 Z" fill="white"/>
                <circle cx="34" cy="11" r="2.5" fill="#ea580c"/>
              </svg>
              <span className="font-black text-base text-[var(--color-text-primary)]">BILSKROTSCENTRALEN</span>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Mercedes-specialist sedan 1984. 30 000+ bildelar i lager.
              Sveriges mest pålitliga bildemontering.
            </p>
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              Öppet mån–tors 08–17, fre 08–15 — Ring 0171-210 02
            </div>
          </div>

          {/* Bildelar */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-4">Bildelar</h3>
            <ul className="space-y-2">
              <FooterLink href="/bildelar" label="Alla bildelar" />
              <FooterLink href="/bildelar/marken" label="Sök per märke" />
              <FooterLink href="/bildelar/kategorier" label="Kategorier" />
              <FooterLink href="/mercedes" label="Mercedes-delar" />
              <FooterLink href="/mercedes/luftfjadring" label="Luftfjädring" />
              <FooterLink href="/eftersok" label="Eftersök en del" />
            </ul>
          </div>

          {/* Tjänster */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-4">Tjänster</h3>
            <ul className="space-y-2">
              <FooterLink href="/skrota-bilen" label="Skrota bilen — gratis hämtning" />
              <FooterLink href="/verkstad" label="Verkstad" />
              <FooterLink href="/b2b" label="För verkstäder (B2B)" />
              <FooterLink href="/om-oss" label="Om oss" />
              <FooterLink href="/kontakt" label="Kontakt" />
              <FooterLink href="/faq" label="Vanliga frågor" />
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-4">Kontakt</h3>
            <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-brand-orange)]">📍</span>
                <span>Magasingatan 2<br />749 35 Enköping</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-brand-orange)]">📞</span>
                <a href="tel:017121002" className="hover:text-[var(--color-brand-orange)] transition-colors">0171-210 02</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-brand-orange)]">✉️</span>
                <a href="mailto:info@bilskrotscentralen.com" className="hover:text-[var(--color-brand-orange)] transition-colors">info@bilskrotscentralen.com</a>
              </li>
            </ul>
            <div className="mt-6 flex gap-2 flex-wrap">
              <span className="px-3 py-1.5 rounded-md bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-xs text-[var(--color-text-muted)]">💳 Klarna</span>
              <span className="px-3 py-1.5 rounded-md bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-xs text-[var(--color-text-muted)]">📱 Swish</span>
              <span className="px-3 py-1.5 rounded-md bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-xs text-[var(--color-text-muted)]">💳 Kort</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[var(--color-dark-500)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--color-text-muted)]">
            © 2026 Bilskrotscentralen i Sverige AB · Org.nr 556634-0815 · Auktoriserad bildemontering
          </p>
          <div className="flex gap-4 text-xs text-[var(--color-text-muted)]">
            <a href="/integritetspolicy" className="hover:text-[var(--color-text-primary)] transition-colors">Integritetspolicy</a>
            <a href="/kopvillkor" className="hover:text-[var(--color-text-primary)] transition-colors">Köpvillkor</a>
            <a href="/garanti" className="hover:text-[var(--color-text-primary)] transition-colors">Garanti</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <a
        href={href}
        className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-orange)] transition-colors"
      >
        {label}
      </a>
    </li>
  );
}
