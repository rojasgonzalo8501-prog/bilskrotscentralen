/**
 * Plausible — privacy-first analytics, GDPR-friendly, no cookies needed.
 *
 * Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN in env (e.g. "bilskrotscentralen.com")
 * to activate. NEXT_PUBLIC_PLAUSIBLE_SCRIPT lets you swap to a
 * self-hosted instance or extended script (outbound-links, file-downloads,
 * etc) — defaults to the official EU-hosted plausible.io script.
 *
 * Pairs well with the Meta Pixel + Google Ads scaffold in Analytics.tsx —
 * Plausible covers truth-of-traffic and conversions, the others cover
 * remarketing.
 */

import Script from "next/script";

const DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const SRC =
  process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT ||
  "https://plausible.io/js/script.outbound-links.js";

export function Plausible() {
  if (!DOMAIN) return null;
  return (
    <Script
      id="plausible"
      strategy="afterInteractive"
      defer
      data-domain={DOMAIN}
      src={SRC}
    />
  );
}
