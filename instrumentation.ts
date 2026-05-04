/**
 * Next.js instrumentation hook — wires Sentry into the right runtime.
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Re-export Sentry's onRequestError helper so server-side route handlers
// and React Server Component errors land in the same project as the rest.
export { onRequestError } from "@sentry/nextjs";
