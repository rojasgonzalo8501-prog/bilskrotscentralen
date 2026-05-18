import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookiepolicy",
  description: "Information om hur Rensona Metall använder cookies på sin webbplats.",
};

export default function CookiesPage() {
  return (
    <>
      <section className="py-24 pt-32" style={{ background: "var(--color-dark)" }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <nav className="flex items-center gap-2 mb-8 text-xs" style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.4)" }} className="hover:opacity-80 transition-opacity">HEM</Link>
            <span>›</span>
            <span style={{ color: "var(--color-cu)" }}>COOKIES</span>
          </nav>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1, letterSpacing: "0.03em", color: "var(--color-white)" }}>
            COOKIEPOLICY
          </h1>
          <p style={{ fontFamily: "var(--font-body)", color: "rgba(250,247,243,0.5)", fontSize: "0.85rem", marginTop: "1rem" }}>
            Senast uppdaterad: maj 2026
          </p>
        </div>
      </section>

      <section style={{ background: "var(--color-bg)" }} className="py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--color-txt)", lineHeight: 1.8 }}>

            <div style={{ marginBottom: "2rem", padding: "1.25rem 1.5rem", background: "var(--color-panel)", border: "1px solid var(--color-border)", borderRadius: "10px" }}>
              <p style={{ margin: 0, color: "var(--color-txt2)" }}>
                <strong style={{ color: "var(--color-txt)" }}>Kort version:</strong> Vi använder bara tekniskt nödvändiga cookies. Inga spårningscookies, inga annonscookies.
              </p>
            </div>

            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", letterSpacing: "0.03em", color: "var(--color-cu)", marginBottom: "0.75rem" }}>
              Vad är cookies?
            </h2>
            <p>
              Cookies är små textfiler som lagras i din webbläsare när du besöker en webbplats. De används för att
              webbplatsen ska fungera korrekt, komma ihåg inställningar eller samla in statistik.
            </p>

            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", letterSpacing: "0.03em", color: "var(--color-cu)", margin: "2rem 0 0.75rem" }}>
              Vilka cookies använder vi?
            </h2>

            <div style={{ border: "1px solid var(--color-border)", borderRadius: "10px", overflow: "hidden", marginBottom: "1.5rem" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "var(--color-panel)" }}>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-txt2)", borderBottom: "1px solid var(--color-border)" }}>Namn</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-txt2)", borderBottom: "1px solid var(--color-border)" }}>Typ</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-txt2)", borderBottom: "1px solid var(--color-border)" }}>Syfte</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-txt2)", borderBottom: "1px solid var(--color-border)" }}>Varaktighet</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["__Host-next-auth.csrf-token", "Teknisk", "Skydd mot CSRF-attacker (formulärskydd)", "Session"],
                    ["next-session", "Teknisk", "Håller sessionen aktiv vid formulärinlämning", "Session"],
                  ].map(([name, type, purpose, duration], i) => (
                    <tr key={name} style={{ background: i % 2 === 0 ? "transparent" : "var(--color-panel)" }}>
                      <td style={{ padding: "0.65rem 1rem", fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--color-cu)" }}>{name}</td>
                      <td style={{ padding: "0.65rem 1rem", color: "var(--color-txt2)" }}>{type}</td>
                      <td style={{ padding: "0.65rem 1rem", color: "var(--color-txt2)" }}>{purpose}</td>
                      <td style={{ padding: "0.65rem 1rem", color: "var(--color-txt2)" }}>{duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              Vi använder <strong>inga</strong> analyscookies (Google Analytics, Hotjar el.dyl.) eller annonscookies.
              Vi delar inte cookiedata med tredje part.
            </p>

            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", letterSpacing: "0.03em", color: "var(--color-cu)", margin: "2rem 0 0.75rem" }}>
              Hantera cookies
            </h2>
            <p>
              Du kan blockera eller radera cookies i din webbläsares inställningar. Observera att om du blockerar
              tekniskt nödvändiga cookies kan formulär på webbplatsen sluta fungera korrekt.
            </p>
            <p>
              Läs mer i din webbläsares hjälpavsnitt:
              {" "}<a href="https://support.google.com/chrome/answer/95647" style={{ color: "var(--color-cu)" }} target="_blank" rel="noopener noreferrer">Chrome</a>,
              {" "}<a href="https://support.mozilla.org/sv/kb/aktivera-och-avaktivera-cookies-webbplatsinformation" style={{ color: "var(--color-cu)" }} target="_blank" rel="noopener noreferrer">Firefox</a>,
              {" "}<a href="https://support.apple.com/sv-se/guide/safari/sfri11471/mac" style={{ color: "var(--color-cu)" }} target="_blank" rel="noopener noreferrer">Safari</a>.
            </p>

            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", letterSpacing: "0.03em", color: "var(--color-cu)", margin: "2rem 0 0.75rem" }}>
              Frågor?
            </h2>
            <p>
              Kontakta oss på{" "}
              <a href="mailto:info@rensonametall.se" style={{ color: "var(--color-cu)" }}>info@rensonametall.se</a>.
            </p>
          </div>

          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--color-border)" }}>
            <Link href="/" className="btn-cu" style={{ fontSize: "0.72rem", padding: "0.6rem 1.2rem" }}>
              ← Tillbaka till startsidan
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
