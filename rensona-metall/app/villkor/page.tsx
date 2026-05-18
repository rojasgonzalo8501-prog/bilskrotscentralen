import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Allmänna villkor",
  description: "Allmänna villkor för bilskrotning och metallhandel hos Rensona Metall (Mercaskroten i Sverige AB).",
};

export default function VillkorPage() {
  return (
    <>
      <section className="py-24 pt-32" style={{ background: "var(--color-dark)" }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <nav className="flex items-center gap-2 mb-8 text-xs" style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.4)" }} className="hover:opacity-80 transition-opacity">HEM</Link>
            <span>›</span>
            <span style={{ color: "var(--color-cu)" }}>VILLKOR</span>
          </nav>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1, letterSpacing: "0.03em", color: "var(--color-white)" }}>
            ALLMÄNNA VILLKOR
          </h1>
          <p style={{ fontFamily: "var(--font-body)", color: "rgba(250,247,243,0.5)", fontSize: "0.85rem", marginTop: "1rem" }}>
            Gäller från och med maj 2026 · Mercaskroten i Sverige AB
          </p>
        </div>
      </section>

      <section style={{ background: "var(--color-bg)" }} className="py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--color-txt)", lineHeight: 1.8 }}>

            {[
              {
                title: "1. Om oss",
                body: `Mercaskroten i Sverige AB (org.nr [FYLL I ORG.NR]), nedan kallat "Rensona Metall",
                       driver auktoriserad bilskrotning och metallhandel med säte i Enköping. Vi innehar alla
                       tillstånd som krävs enligt Länsstyrelsen, Naturvårdsverket och EU ELV-direktiv 2000/53/EG.`,
              },
              {
                title: "2. Bokningsförfrågan",
                body: `En bokningsförfrågan via rensona.se eller telefon är en intresseanmälan, inte ett bindande
                       avtal. Avtalet ingås när vi skriftligen eller muntligen bekräftar hämtningstid, pris och
                       betalningssätt. Vi förbehåller oss rätten att neka uppdrag som faller utanför vår
                       geografiska täckning (primärt Mälardalen) eller om fordonet bedöms innebära
                       oproportionerliga kostnader.`,
              },
              {
                title: "3. Prissättning",
                body: `Priset som presenteras i vår onlinekalkylator är ett estimat baserat på märke, modell och
                       aktuellt LME-metallpris. Slutpriset fastställs vid fysisk vägning och besiktning av
                       fordonet vid upphämtningstillfället. Om fordonet avviker väsentligt från uppgiven
                       information (t.ex. saknar motor, har brandskadar) kan priset justeras. Kunden informeras
                       alltid innan arbetet påbörjas.`,
              },
              {
                title: "4. Gratis hämtning",
                body: `Hämtning inom Mälardalen (Uppsala, Västerås, Enköping, Stockholm och angränsande kommuner)
                       är kostnadsfri. För hämtning utanför detta område kan en transportkostnad tillkomma.
                       Kostnaden kommuniceras alltid i förväg och kräver kundens godkännande.`,
              },
              {
                title: "5. Fordonets skick",
                body: `Kunden ansvarar för att fordonet är i sådant skick att det kan lastas på bärgningsbil,
                       eller att tillgång finns till fordonet med nyckel. Fordonet ska vara tömt på personliga
                       tillhörigheter och registreringsskyltar lämnas till chauffören. Vi hanterar fordon oavsett
                       om de är körbara eller ej.`,
              },
              {
                title: "6. Äganderätt",
                body: `Kunden intygar att hen är registrerad ägare till fordonet eller har fullmakt att avyttra det.
                       Rensona Metall förbehåller sig rätten att begära legitimation. Vi tar inget ansvar för
                       fordon som lämnas in av obehörig person.`,
              },
              {
                title: "7. Betalning",
                body: `Betalning sker i samband med upphämtning via Swish, Bankgiro eller kontant — kundens val.
                       Inget betalas i förskott. Vid avvikelse från överenskommet pris sker ny förhandling innan
                       betalning genomförs.`,
              },
              {
                title: "8. Skrotningsintyg och avregistrering",
                body: `Rensona Metall ansvarar för att skrotningsintyg utfärdas och att fordonet avregistreras hos
                       Transportstyrelsen senast inom 5 arbetsdagar efter upphämtning. Kunden meddelas per e-post
                       eller SMS när avregistreringen är genomförd.`,
              },
              {
                title: "9. Ansvarsbegränsning",
                body: `Rensona Metall ansvarar inte för skador som uppstår på mark, uppfart eller konstruktion i
                       samband med hämtning om kunden inte i förväg upplyst om känslig mark. Vi ansvarar inte
                       för indirekta förluster eller utebliven vinst.`,
              },
              {
                title: "10. Tvist",
                body: `Svensk lag tillämpas. Tvister avgörs i första hand genom förhandling. Om oenighet kvarstår
                       avgörs tvisten av Allmänna reklamationsnämnden (ARN) eller allmän domstol med Uppsala
                       tingsrätt som första instans.`,
              },
            ].map(({ title, body }) => (
              <div key={title} style={{ marginBottom: "2.25rem" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", letterSpacing: "0.03em", color: "var(--color-cu)", marginBottom: "0.6rem" }}>
                  {title}
                </h2>
                <p style={{ margin: 0, color: "var(--color-txt2)" }}>{body}</p>
              </div>
            ))}
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
