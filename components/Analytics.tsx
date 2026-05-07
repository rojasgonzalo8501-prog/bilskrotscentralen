"use client";

/**
 * Marketing analytics gated behind cookie consent.
 *
 * GA4 (Google Analytics 4) and the Meta + Google Ads tags only load
 * after the user clicks "Acceptera alla" in the CookieConsent banner.
 * If they pick "Bara nödvändiga" — or if the banner hasn't been
 * answered yet — these scripts stay off the page entirely.
 *
 * Plausible (privacy-first, no cookies) is loaded unconditionally
 * from its own component since it doesn't legally require consent.
 *
 * NOTE: We hardcode the GA4 measurement ID as a default so the site
 * works without env-var setup. NEXT_PUBLIC_GA_ID overrides.
 */

import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_EVENT, readConsent } from "./CookieConsent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-Y14NBBQ8NL";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

export function Analytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(readConsent() === "all");
    const onChange = () => setConsented(readConsent() === "all");
    window.addEventListener(CONSENT_EVENT, onChange);
    window.addEventListener("storage", onChange); // other tabs
    return () => {
      window.removeEventListener(CONSENT_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  if (!consented) return null;

  const needsGtag = Boolean(GA_ID || GOOGLE_ADS_ID);
  const gtagSrc = `https://www.googletagmanager.com/gtag/js?id=${GA_ID || GOOGLE_ADS_ID}`;
  const gtagInit = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    ${GA_ID ? `gtag('config', '${GA_ID}');` : ""}
    ${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ""}
  `.trim();

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
