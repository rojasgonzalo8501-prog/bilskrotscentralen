import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Integritetspolicy",
  description: "Hur Rensona Metall (Mercaskroten i Sverige AB) hanterar dina personuppgifter enligt GDPR.",
};

export default function IntegritetspolicyPage() {
  return (
    <>
      <section className="py-24 pt-32" style={{ background: "var(--color-dark)" }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <nav className="flex items-center gap-2 mb-8 text-xs" style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.4)" }} className="hover:opacity-80 transition-opacity">HEM</Link>
            <span>›</span>
            <span style={{ color: "var(--color-cu)" }}>INTEGRITETSPOLICY</span>
          </nav>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1, letterSpacing: "0.03em", color: "var(--color-white)" }}>
            INTEGRITETSPOLICY
          </h1>
          <p style={{ fontFamily: "var(--font-body)", color: "rgba(250,247,243,0.5)", fontSize: "0.85rem", marginTop: "1rem" }}>
            Senast uppdaterad: maj 2026
          </p>
        </div>
      </section>

      <section style={{ background: "var(--color-bg)" }} className="py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              color: "var(--color-txt)",
              lineHeight: 1.8,
            }}
          >
            <Section title="1. Personuppgiftsansvarig">
              <p>
                Mercaskroten i Sverige AB, organisationsnummer <strong>[FYLL I ORG.NR]</strong>, Industrivägen 12, 745 35 Enköping,
                är personuppgiftsansvarig för den behandling av personuppgifter som beskrivs i denna policy.
              </p>
              <p>
                Kontakt: <a href="mailto:info@rensona.se" style={{ color: "var(--color-cu)" }}>info@rensona.se</a> · 0171-210 02
              </p>
            </Section>

            <Section title="2. Vilka uppgifter samlar vi in?">
              <p>Vi samlar in följande uppgifter när du gör en bokningsförfrågan via vår webbplats:</p>
              <ul style={{ paddingLeft: "1.5rem" }}>
                <li>Namn</li>
                <li>Telefonnummer</li>
                <li>E-postadress (valfritt)</li>
                <li>Adress där fordonet befinner sig</li>
                <li>Fordonets registreringsnummer, märke, modell och årsmodell</li>
                <li>Valt betalningssätt</li>
              </ul>
            </Section>

            <Section title="3. Varför behandlar vi dina uppgifter?">
              <p>Uppgifterna används uteslutande för att:</p>
              <ul style={{ paddingLeft: "1.5rem" }}>
                <li>Hantera och bekräfta din bokningsförfrågan</li>
                <li>Kontakta dig för att boka tid för upphämtning</li>
                <li>Utfärda skrotningsintyg och genomföra avregistrering hos Transportstyrelsen</li>
              </ul>
              <p>
                Rättslig grund: <strong>Fullgörande av avtal</strong> (artikel 6.1 b GDPR) och i förekommande fall
                <strong> rättslig förpliktelse</strong> (artikel 6.1 c GDPR) avseende skrotningsdokumentation.
              </p>
            </Section>

            <Section title="4. Hur länge sparar vi uppgifterna?">
              <p>
                Kontaktuppgifter och bokningsdetaljer sparas i maximalt 24 månader efter avslutat uppdrag.
                Skrotningsintyg och transportdokumentation sparas i 7 år i enlighet med bokföringslagen.
              </p>
            </Section>

            <Section title="5. Delning med tredje part">
              <p>Vi delar dina uppgifter med:</p>
              <ul style={{ paddingLeft: "1.5rem" }}>
                <li><strong>Transportstyrelsen</strong> — för avregistrering av skrotat fordon (rättslig förpliktelse)</li>
                <li><strong>Resend Inc.</strong> — e-posttjänst för intern notifiering om bokningar (personuppgiftsbiträde)</li>
              </ul>
              <p>Vi säljer aldrig dina uppgifter till tredje part.</p>
            </Section>

            <Section title="6. Dina rättigheter">
              <p>Enligt GDPR har du rätt att:</p>
              <ul style={{ paddingLeft: "1.5rem" }}>
                <li><strong>Begära tillgång</strong> till de uppgifter vi har om dig</li>
                <li><strong>Begära rättelse</strong> av felaktiga uppgifter</li>
                <li><strong>Begära radering</strong> ("rätten att bli bortglömd") om det inte finns rättslig grund att behålla uppgifterna</li>
                <li><strong>Invända</strong> mot behandling</li>
                <li><strong>Inge klagomål</strong> till Integritetsskyddsmyndigheten (IMY), imy.se</li>
              </ul>
              <p>
                Kontakta oss på <a href="mailto:info@rensona.se" style={{ color: "var(--color-cu)" }}>info@rensona.se</a> för att utöva dina rättigheter.
              </p>
            </Section>

            <Section title="7. Säkerhet">
              <p>
                Vi vidtar tekniska och organisatoriska åtgärder för att skydda dina personuppgifter mot obehörig åtkomst,
                förlust och förstörelse. All kommunikation till och från webbplatsen sker krypterat via HTTPS.
              </p>
            </Section>

            <Section title="8. Ändringar">
              <p>
                Vi kan komma att uppdatera denna policy. Den senaste versionen finns alltid tillgänglig på rensona.se/integritetspolicy.
                Väsentliga ändringar kommuniceras via e-post till berörda registrerade.
              </p>
            </Section>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", letterSpacing: "0.03em", color: "var(--color-cu)", marginBottom: "0.75rem" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
