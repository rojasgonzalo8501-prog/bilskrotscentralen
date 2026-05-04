/**
 * ChatWidget — embedded live chat for the site.
 *
 * Provider is chosen by environment variables (set in Vercel → Settings
 * → Environment Variables, scope: Production + Preview). Pick ONE:
 *
 *   Crisp  →  NEXT_PUBLIC_CRISP_WEBSITE_ID="abcd-efgh-..."
 *   Tawk   →  NEXT_PUBLIC_TAWK_PROPERTY_ID="xxxxxxxxxx"
 *             NEXT_PUBLIC_TAWK_WIDGET_ID="default"   (or a custom id)
 *
 * Behaviour:
 *   • Crisp ID set     → Crisp widget loads, nothing else.
 *   • Tawk IDs set     → Tawk widget loads, nothing else.
 *   • Nothing set      → WhatsAppButton fallback so visitors always
 *                        have a way to reach the team.
 *
 * The widgets handle their own UI, position, and styling. We only
 * inject the loader scripts. Dev tip: if both Crisp and Tawk are set,
 * Crisp wins — keep only one configured to avoid duplicate widgets.
 */

import Script from "next/script";
import { WhatsAppButton } from "./WhatsAppButton";

// Bilskrotscentralen Tawk.to property — hardcoded so it works without
// touching Vercel env vars. Env vars override if you later move to a
// different account.
const TAWK_PROPERTY =
  process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || "69f8724a04aa141c33adf9a5";
const TAWK_WIDGET =
  process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || "1jnp7ssu3";

const CRISP_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

export function ChatWidget() {
  // Crisp wins when both are present
  if (CRISP_ID) {
    return (
      <Script id="crisp-chat" strategy="afterInteractive">
        {`
          window.$crisp=[];
          window.CRISP_WEBSITE_ID="${CRISP_ID}";
          (function(){
            var d=document,s=d.createElement("script");
            s.src="https://client.crisp.chat/l.js";
            s.async=1;
            d.getElementsByTagName("head")[0].appendChild(s);
          })();
        `}
      </Script>
    );
  }

  if (TAWK_PROPERTY) {
    // Idempotent loader: bail if Tawk has already been initialised on
    // the page (prevents double-injection in React StrictMode and
    // during route transitions). lazyOnload keeps the chat widget out
    // of the critical render path so it doesn't slow first paint.
    return (
      <Script id="tawk-chat" strategy="lazyOnload">
        {`
          (function(){
            if (window.__tawkLoaded) return;
            window.__tawkLoaded = true;
            window.Tawk_API = window.Tawk_API || {};
            window.Tawk_LoadStart = new Date();
            var s1 = document.createElement("script");
            var s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = "https://embed.tawk.to/${TAWK_PROPERTY}/${TAWK_WIDGET}";
            s1.charset = "UTF-8";
            s1.setAttribute("crossorigin", "*");
            if (s0 && s0.parentNode) {
              s0.parentNode.insertBefore(s1, s0);
            } else {
              document.head.appendChild(s1);
            }
          })();
        `}
      </Script>
    );
  }

  // No widget configured → keep WhatsApp as fallback so customers can
  // still reach us. Once a Crisp/Tawk ID is added in env, this disappears.
  return <WhatsAppButton />;
}
