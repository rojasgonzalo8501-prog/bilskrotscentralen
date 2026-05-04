/**
 * Sentry — Node.js (server) configuration.
 * Same DSN, separate sample rate so server traces don't bleed quota.
 */

import * as Sentry from "@sentry/nextjs";

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    tracesSampleRate: 0.05,
    environment: process.env.VERCEL_ENV || "development",
  });
}
