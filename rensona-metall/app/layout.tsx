import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#c87941",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://rensona.se"),
  title: {
    default: "Rensona Metall — Auktoriserad bilskrotning & metallhandel",
    template: "%s | Rensona Metall",
  },
  description:
    "Auktoriserad bilskrotning i Enköping. Vi köper din bil, hämtar gratis i hela Mälardalen och betalar direkt. Metallhandel Sverige–Danmark via Mercaskroten.",
  keywords: [
    "bilskrotning",
    "skrota bilen",
    "metallhandel",
    "koppar",
    "aluminium",
    "skrotmetall",
    "Enköping",
    "Mälardalen",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Rensona Metall — Vi skrotar smart",
    description: "Auktoriserad bilskrotning & metallhandel. Fri hämtning i Mälardalen.",
    type: "website",
    locale: "sv_SE",
    siteName: "Rensona Metall",
    url: "https://rensona.se",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@1&family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
