/**
 * Sentry — edge runtime (middleware, edge route handlers).
 */

import * as Sentry from "@sentry/nextjs";

const DSN =
  process.env.NEXT_PUBLIC_SENTRY_DSN ||
  process.env.SENTRY_DSN ||
  "https://c859c9150824aa4da116e4d0c42ebfc5@o4511331724820480.ingest.de.sentry.io/4511331732357200";

if (DSN) {
  Sentry.init({
    dsn: DSN,
    tracesSampleRate: 0.05,
    environment: process.env.VERCEL_ENV || "development",
  });
}
