/**
 * Marketing analytics scaffolding.
 *
 * - Google Analytics 4 (GA4) — measurement ID hardcoded as default so
 *   pageviews start flowing without touching Vercel env vars. Override
 *   via NEXT_PUBLIC_GA_ID if we ever migrate properties.
 * - Meta Pixel — enabled by NEXT_PUBLIC_META_PIXEL_ID.
 * - Google Ads tag — enabled by NEXT_PUBLIC_GOOGLE_ADS_ID.
 *
 * gtag.js is loaded once and shared between GA4 and Google Ads, so
 * we don't double-load the same library when both IDs are present.
 *
 * Plausible (privacy-first traffic analytics) lives in its own
 * Plausible.tsx component — these two stack rather than replace each
 * other: Plausible gives clean truth-of-traffic, GA4 + the pixels
 * power retargeting.
 */

import Script from "next/script";

// Bilskrotscentralen GA4 measurement ID. Hardcoded so analytics
// activate immediately on next deploy.
const GA_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-Y14NBBQ8NL";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

const needsGtag = Boolean(GA_ID || GOOGLE_ADS_ID);
// Single loader script — gtag.js can configure multiple targets.
const gtagSrc = `https://www.googletagmanager.com/gtag/js?id=${GA_ID || GOOGLE_ADS_ID}`;

const gtagInit = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  ${GA_ID ? `gtag('config', '${GA_ID}');` : ""}
  ${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ""}
`.trim();

export function Analytics() {
  return (
    <>
      {needsGtag && (
        <>
          <Script src={gtagSrc} strategy="afterInteractive" async />
          <Script id="gtag-init" strategy="afterInteractive">
            {gtagInit}
          </Script>
        </>
      )}

      {META_PIXEL_ID && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height={1}
              width={1}
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
    </>
  );
}
