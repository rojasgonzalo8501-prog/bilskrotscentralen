"use client";

/**
 * ChatTrigger — contextual entry point to the live chat (Tawk).
 *
 * Use this anywhere you previously had a "Skriv på WhatsApp" link
 * tied to a specific part / order / question. Click opens the floating
 * Tawk widget and seeds visitor attributes (SKU, partName, orderNumber,
 * topic) so the agent sees what the customer is asking about before
 * the first message lands.
 *
 * Falls back to the wa.me link if the Tawk script hasn't loaded yet
 * (rare — happens when a customer clicks within the first second of
 * landing, before the lazyOnload script fires).
 */

import { useCallback } from "react";

type TawkAttrs = Record<string, string | number | undefined>;

interface Props {
  /** Visitor attributes the Tawk agent will see. Drop empty values. */
  context?: TawkAttrs;
  /** Optional pre-fill message recorded as a Tawk event. */
  prefill?: string;
  /** wa.me-style URL to open if Tawk isn't available yet. */
  fallbackHref?: string;
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}

export function ChatTrigger({
  context,
  prefill,
  fallbackHref,
  className,
  ariaLabel,
  children,
}: Props) {
  const handle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const w = window as unknown as {
        Tawk_API?: {
          maximize?: () => void;
          setAttributes?: (attrs: Record<string, string>, cb?: (err?: unknown) => void) => void;
          addEvent?: (name: string, meta: Record<string, string>, cb?: (err?: unknown) => void) => void;
        };
      };
      const api = w.Tawk_API;
      if (api && typeof api.maximize === "function") {
        if (context && api.setAttributes) {
          const cleanAttrs: Record<string, string> = {};
          for (const [k, v] of Object.entries(context)) {
            if (v != null && v !== "") cleanAttrs[k] = String(v);
          }
          if (Object.keys(cleanAttrs).length > 0) {
            try {
              api.setAttributes(cleanAttrs, () => {});
            } catch {
              /* swallow — chat still opens */
            }
          }
        }
        if (prefill && api.addEvent) {
          try {
            api.addEvent("customer-prefill", { message: prefill }, () => {});
          } catch {
            /* swallow */
          }
        }
        api.maximize();
        return;
      }
      // Fallback: chat hasn't loaded — open WhatsApp in new tab
      if (fallbackHref && typeof window !== "undefined") {
        window.open(fallbackHref, "_blank", "noopener,noreferrer");
      }
    },
    [context, prefill, fallbackHref]
  );

  return (
    <button type="button" onClick={handle} aria-label={ariaLabel} className={className}>
      {children}
    </button>
  );
}
