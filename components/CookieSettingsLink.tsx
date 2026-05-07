"use client";

/**
 * Footer link that re-opens the cookie consent banner. Required
 * under GDPR — users must be able to change their mind any time.
 */

import { openCookieSettings } from "./CookieConsent";

export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className={
        className ??
        "hover:text-[var(--color-text-primary)] transition-colors text-left"
      }
    >
      Cookie-inställningar
    </button>
  );
}
