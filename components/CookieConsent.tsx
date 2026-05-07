"use client";

/**
 * GDPR cookie-consent banner.
 *
 * EU law requires explicit opt-in before loading non-essential
 * tracking (Google Analytics, Meta Pixel, Google Ads). We persist the
 * choice in localStorage and dispatch a custom event so Analytics.tsx
 * can react and load the gtag script only after the user clicks
 * "Acceptera alla".
 *
 * Three states:
 *   - unset       → banner shown
 *   - "all"       → analytics + retargeting allowed
 *   - "necessary" → analytics blocked; only first-party cookies stay
 *
 * Plausible isn't gated because it doesn't set cookies (privacy-first
 * by design — no consent legally required). Tawk is user-initiated so
 * the chat itself doesn't fire until the customer opens it.
 */

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "merca:consent";
export const CONSENT_EVENT = "merca:consent-changed";
const REOPEN_EVENT = "merca:consent-reopen";

/**
 * Re-open the cookie banner (used by the "Cookie-inställningar"
 * link in the footer). Wipes the stored choice so analytics is
 * paused until the user picks again.
 */
export function openCookieSettings() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
  window.dispatchEvent(new CustomEvent(REOPEN_EVENT));
}

export type ConsentValue = "all" | "necessary";

export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(KEY);
  return v === "all" || v === "necessary" ? v : null;
}

function writeConsent(value: ConsentValue) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, value);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

export function CookieConsent() {
  // Render nothing on first paint to avoid SSR/CSR mismatch + a flash
  // of the banner for users who already chose.
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (readConsent() == null) setShow(true);
    const onReopen = () => setShow(true);
    window.addEventListener(REOPEN_EVENT, onReopen);
    return () => window.removeEventListener(REOPEN_EVENT, onReopen);
  }, []);

  if (!show) return null;

  function accept(v: ConsentValue) {
    writeConsent(v);
    setShow(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie-inställningar"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3"
    >
      <div className="max-w-3xl mx-auto bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] rounded-2xl shadow-2xl shadow-black/40 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 min-w-0">
          <div className="text-sm text-[var(--color-text-primary)] mb-1 font-bold">
            🍪 Cookies
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            Vi använder cookies för att kassan och kontot ska fungera. Du
            kan också tillåta cookies för anonym statistik (Google
            Analytics) som hjälper oss göra sidan bättre.{" "}
            <Link
              href="/integritetspolicy"
              className="text-[var(--color-brand-orange)] hover:underline whitespace-nowrap"
            >
              Läs mer →
            </Link>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => accept("necessary")}
            className="px-4 py-2.5 rounded-lg border border-[var(--color-dark-500)] hover:border-[var(--color-text-secondary)] text-[var(--color-text-secondary)] text-sm font-bold transition-colors whitespace-nowrap"
          >
            Bara nödvändiga
          </button>
          <button
            type="button"
            onClick={() => accept("all")}
            className="px-4 py-2.5 rounded-lg bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-dark)] text-white text-sm font-bold transition-colors whitespace-nowrap"
          >
            Acceptera alla
          </button>
        </div>
      </div>
    </div>
  );
}
