import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Integritetspolicy — Bilskrotscentralen i Sverige AB",
  description:
    "Hur Bilskrotscentralen i Sverige AB behandlar dina personuppgifter i enlighet med GDPR (dataskyddsförordningen).",
};

export default function IntegritetspolicyPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 pt-10 pb-20">
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--color-brand-orange)]">Hem</Link>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Integritetspolicy</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-black mb-2">
        <span className="gradient-text">Integritetspolicy</span>
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-10">
        Senast uppdaterad: april 2026 · Gäller från och med 2026-04-01
      </p>

      <div className="space-y-10 text-[var(--color-text-secondary)] leading-relaxed">

        <p className="text-sm p-4 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)]">
          Bilskrotscentralen i Sverige AB värnar om din personliga integritet.
          Denna policy beskriver hur vi samlar in, lagrar och använder dina
          personuppgifter i enlighet med EU:s dataskyddsförordning (GDPR,
          förordning 2016/679) och kompletterande svensk lagstiftning.
        </p>

        {/* 1. Personuppgiftsansvarig */}
        <PolicySection number="1" title="Personuppgiftsansvarig">
          <DataRow label="Företag" value="Bilskrotscentralen i Sverige AB" />
          <DataRow label="Org.nr" value="556634-0815" />
          <DataRow label="Adress" value="Magasingatan 2, 749 35 Enköping" />
          <DataRow label="Telefon" value="0171-210 02" />
          <DataRow label="E-post" value="info@bilskrotscentralen.com" />
          <DataRow label="Webbplats" value="www.bilskrotscentralen.com" />
          <p className="mt-3 text-sm">
            Har du frågor om hur vi behandlar dina personuppgifter eller vill utöva
            dina rättigheter? Kontakta oss via e-post eller telefon ovan.
          </p>
        </PolicySection>

        {/* 2. Vilka uppgifter vi samlar in */}
        <PolicySection number="2" title="Vilka personuppgifter samlar vi in?">
          <p>Vi samlar in personuppgifter i följande situationer:</p>

          <SubSection title="Vid köp i webbshoppen">
            <ul className="list-disc pl-5 space-y-1">
              <li>Namn och kontaktuppgifter (e-post, telefon)</li>
              <li>Leverans- och fakturaadress</li>
              <li>Orderhistorik och köpta produkter</li>
              <li>Betalningsinformation (hanteras av Klarna/Stripe — vi lagrar inte kortnummer)</li>
              <li>IP-adress och teknisk information om din enhet</li>
            </ul>
          </SubSection>

          <SubSection title="Vid skrotningsanmälan">
            <ul className="list-disc pl-5 space-y-1">
              <li>Namn, adress, e-post och telefonnummer</li>
              <li>Fordonsuppgifter: registreringsnummer och VIN (chassinummer)</li>
              <li>Ägandebevis (kontrolleras mot Transportstyrelsen)</li>
            </ul>
          </SubSection>

          <SubSection title="Vid eftersökning (efterlysning av del)">
            <ul className="list-disc pl-5 space-y-1">
              <li>Namn och kontaktuppgifter</li>
              <li>Information om önskad del och fordon</li>
            </ul>
          </SubSection>

          <SubSection title="Vid kontakt med oss">
            <ul className="list-disc pl-5 space-y-1">
              <li>Namn, e-post och telefon</li>
              <li>Innehållet i ditt meddelande</li>
            </ul>
          </SubSection>
        </PolicySection>

        {/* 3. Varför vi behandlar uppgifterna */}
        <PolicySection number="3" title="Varför behandlar vi dina personuppgifter?">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-dark-500)]">
                <th className="text-left py-2 pr-4 text-[var(--color-text-primary)] font-semibold">Ändamål</th>
                <th className="text-left py-2 pr-4 text-[var(--color-text-primary)] font-semibold">Rättslig grund</th>
                <th className="text-left py-2 text-[var(--color-text-primary)] font-semibold">Lagringstid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-dark-600)]">
              <tr>
                <td className="py-2.5 pr-4">Hantera och leverera din beställning</td>
                <td className="py-2.5 pr-4">Avtal</td>
                <td className="py-2.5">7 år (bokföringslagen)</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4">Fakturering och bokföring</td>
                <td className="py-2.5 pr-4">Rättslig förpliktelse</td>
                <td className="py-2.5">7 år (bokföringslagen)</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4">Garantiärenden och reklamationer</td>
                <td className="py-2.5 pr-4">Avtal / berättigat intresse</td>
                <td className="py-2.5">Upp till 2 år efter garantins utgång</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4">Skrotningsregistrering hos Transportstyrelsen</td>
                <td className="py-2.5 pr-4">Rättslig förpliktelse</td>
                <td className="py-2.5">7 år</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4">Besvara dina frågor och förfrågningar</td>
                <td className="py-2.5 pr-4">Berättigat intresse</td>
                <td className="py-2.5">12 månader</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4">Förbättra vår webbplats och tjänster</td>
                <td className="py-2.5 pr-4">Berättigat intresse</td>
                <td className="py-2.5">24 månader (anonymiserad statistik)</td>
              </tr>
            </tbody>
          </table>
        </PolicySection>

        {/* 4. Tredje parter */}
        <PolicySection number="4" title="Delar vi dina uppgifter med tredje part?">
          <p>
            Vi säljer aldrig dina personuppgifter till tredje part. Vi delar
            uppgifter med följande kategorier av mottagare när det krävs för att
            fullgöra vår tjänst:
          </p>
          <ul className="mt-3 space-y-3">
            <ThirdParty title="Betaltjänster" desc="Klarna AB och Stripe Inc. hanterar betalningar. De behandlar betalningsuppgifter under sina egna integritetspolicyer." />
            <ThirdParty title="Frakttjänster" desc="Postnord Sverige AB, DHL Freight (Sweden) AB m.fl. — namn och adress delas för att genomföra leveransen." />
            <ThirdParty title="E-posttjänst" desc="Resend Inc. används för att skicka orderbekräftelser och fakturor. E-postadress och namn delas." />
            <ThirdParty title="Transportstyrelsen" desc="Vid skrotning rapporteras fordonsuppgifter och ägarens namn enligt lag (2007:1101)." />
            <ThirdParty title="Redovisningsbyrå" desc="Delar av ekonomisk information kan delas med vår revisor för bokföring och bokslut." />
          </ul>
          <p className="mt-3 text-sm">
            Alla mottagare är bundna av konfidentialitetsavtal och behandlar
            personuppgifter i enlighet med GDPR.
          </p>
        </PolicySection>

        {/* 5. Dina rättigheter */}
        <PolicySection number="5" title="Dina rättigheter">
          <p>
            Enligt GDPR har du följande rättigheter avseende dina personuppgifter.
            Kontakta oss via <a href="mailto:info@bilskrotscentralen.com" className="text-[var(--color-brand-orange)] hover:underline">info@bilskrotscentralen.com</a> eller
            telefon för att utöva dem. Vi svarar inom 30 dagar.
          </p>
          <div className="mt-4 space-y-3">
            <Right title="Rätt till tillgång (art. 15)" desc="Du har rätt att få besked om vilka personuppgifter vi behandlar om dig och ett kostnadsfritt registerutdrag." />
            <Right title="Rätt till rättelse (art. 16)" desc="Du har rätt att begära att felaktiga eller ofullständiga uppgifter korrigeras." />
            <Right title="Rätt till radering (art. 17)" desc='Du kan begära att vi raderar dina uppgifter ("rätten att bli glömd"), om de inte längre behövs eller om du återkallar ditt samtycke. Lagkrav (t.ex. bokföringslagen) kan innebära att vi måste behålla vissa uppgifter.' />
            <Right title="Rätt till begränsning (art. 18)" desc="Du kan begära att behandlingen av dina uppgifter begränsas under vissa omständigheter." />
            <Right title="Rätt till dataportabilitet (art. 20)" desc="Du har rätt att få ut dina uppgifter i ett maskinläsbart format för att överföra dem till annan aktör." />
            <Right title="Rätt att göra invändningar (art. 21)" desc="Du kan invända mot behandling som grundar sig på berättigat intresse." />
          </div>
          <div className="mt-4 p-3 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-sm">
            <strong>Klagomål:</strong> Om du anser att vi behandlar dina uppgifter felaktigt
            har du rätt att lämna klagomål till{" "}
            <a href="https://www.imy.se" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand-orange)] hover:underline">
              Integritetsskyddsmyndigheten (IMY)
            </a>{" "}
            — imy.se, telefon 08-657 61 00.
          </div>
        </PolicySection>

        {/* 6. Cookies */}
        <PolicySection number="6" title="Cookies och spårning">
          <p>
            Vi använder följande typer av cookies på bilskrotscentralen.com:
          </p>
          <div className="mt-3 space-y-3">
            <CookieRow
              type="Nödvändiga"
              desc="Krävs för att webbplatsen ska fungera: inloggningssession, varukorg och CSRF-skydd. Kan inte stängas av."
              duration="Session / 30 dagar"
            />
            <CookieRow
              type="Funktionella"
              desc="Sparar dina preferenser (t.ex. valuta, språk). Kräver ditt samtycke."
              duration="12 månader"
            />
          </div>
          <p className="mt-3 text-sm">
            Vi använder <strong>inga</strong> spårnings- eller marknadsföringscookies
            (t.ex. Google Analytics, Facebook Pixel). Inga tredjepartscookies för
            reklam används på vår webbplats.
          </p>
        </PolicySection>

        {/* 7. Säkerhet */}
        <PolicySection number="7" title="Säkerhet">
          <p>
            Vi vidtar tekniska och organisatoriska åtgärder för att skydda dina
            personuppgifter mot obehörig åtkomst, förlust eller förstöring. Vår
            webbplats använder HTTPS-kryptering. Känslig betalningsinformation
            lagras aldrig hos oss — den hanteras direkt av Klarna och Stripe i
            deras säkra miljöer (PCI-DSS-certifierade).
          </p>
          <p>
            Vid en personuppgiftsincident som kan medföra hög risk för dig
            underrättar vi dig utan dröjsmål i enlighet med GDPR art. 34.
          </p>
        </PolicySection>

        {/* 8. Ändringar */}
        <PolicySection number="8" title="Ändringar i policyn">
          <p>
            Vi kan komma att uppdatera denna integritetspolicy. Vid väsentliga
            ändringar informerar vi dig via e-post (om vi har din adress) eller
            via ett tydligt meddelande på webbplatsen. Den senaste versionen
            finns alltid tillgänglig på denna sida.
          </p>
        </PolicySection>

      </div>

      {/* CTA */}
      <div className="mt-12 p-6 rounded-xl bg-[var(--color-brand-orange)]/5 border border-[var(--color-brand-orange)]/20 text-center">
        <h3 className="font-bold mb-1">Frågor om hur vi hanterar dina uppgifter?</h3>
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
          Kontakta oss så svarar vi inom 30 dagar.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="tel:017121002" className="btn-secondary">📞 0171-210 02</a>
          <a href="mailto:info@bilskrotscentralen.com" className="btn-primary">✉ info@bilskrotscentralen.com</a>
        </div>
      </div>
    </section>
  );
}

/* ─── Sub-components ─── */

function PolicySection({ number, title, children }: {
  number: string; title: string; children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-black text-[var(--color-text-primary)] mb-4 flex items-baseline gap-3">
        <span className="text-[var(--color-brand-orange)] font-mono text-sm shrink-0">{number}.</span>
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <h3 className="font-semibold text-[var(--color-text-primary)] mb-1.5 text-sm">{title}</h3>
      {children}
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="w-24 text-[var(--color-text-muted)] shrink-0">{label}:</span>
      <span>{value}</span>
    </div>
  );
}

function ThirdParty({ title, desc }: { title: string; desc: string }) {
  return (
    <li className="flex gap-3">
      <span className="w-2 h-2 rounded-full bg-[var(--color-brand-orange)] shrink-0 mt-1.5" />
      <div>
        <span className="font-semibold text-[var(--color-text-primary)]">{title}: </span>
        <span className="text-sm">{desc}</span>
      </div>
    </li>
  );
}

function Right({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-3 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)]">
      <div className="font-semibold text-[var(--color-text-primary)] text-sm mb-0.5">{title}</div>
      <div className="text-sm">{desc}</div>
    </div>
  );
}

function CookieRow({ type, desc, duration }: { type: string; desc: string; duration: string }) {
  return (
    <div className="p-3 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-[var(--color-text-primary)]">{type}</span>
        <span className="text-xs text-[var(--color-text-muted)]">{duration}</span>
      </div>
      <div>{desc}</div>
    </div>
  );
}
