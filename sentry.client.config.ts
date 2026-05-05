/**
 * Sentry — browser-side configuration.
 *
 * Loads only when NEXT_PUBLIC_SENTRY_DSN is set, so dev and any
 * deployment without observability configured stays a no-op.
 */

import * as Sentry from "@sentry/nextjs";

// Bilskrotscentralen Sentry project (EU region). Hardcoded as default
// so error tracking works without touching Vercel env vars; override
// via NEXT_PUBLIC_SENTRY_DSN if we ever migrate to a different project.
const DSN =
  process.env.NEXT_PUBLIC_SENTRY_DSN ||
  "https://c859c9150824aa4da116e4d0c42ebfc5@o4511331724820480.ingest.de.sentry.io/4511331732357200";

if (DSN) {
  Sentry.init({
    dsn: DSN,
    // 10% of sessions get traces — enough to spot regressions, light on quota
    tracesSampleRate: 0.1,
    // Replays only on errors so we have video evidence of breaks but no PII firehose
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0,
    integrations: [
      Sentry.replayIntegration({ maskAllText: false, blockAllMedia: true }),
    ],
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "development",
  });
}
