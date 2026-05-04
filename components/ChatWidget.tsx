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

const CRISP_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
const TAWK_PROPERTY = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
const TAWK_WIDGET = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || "default";

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
    return (
      <Script id="tawk-chat" strategy="afterInteractive">
        {`
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/${TAWK_PROPERTY}/${TAWK_WIDGET}';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
          })();
        `}
      </Script>
    );
  }

  // No widget configured → keep WhatsApp as fallback so customers can
  // still reach us. Once a Crisp/Tawk ID is added in env, this disappears.
  return <WhatsAppButton />;
}
