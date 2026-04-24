import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Köpvillkor — Bilskrotscentralen i Sverige AB",
  description:
    "Fullständiga köpvillkor för Bilskrotscentralen i Sverige AB. Garanti, retur, ångerrätt, betalning och leverans enligt distansavtalslagen.",
};

export default function KopvillkorPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 pt-10 pb-20">
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--color-brand-orange)]">Hem</Link>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Köpvillkor</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-black mb-2">
        <span className="gradient-text">Köpvillkor</span>
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-10">
        Senast uppdaterad: april 2026 · Bilskrotscentralen i Sverige AB
      </p>

      <div className="space-y-10 text-[var(--color-text-secondary)] leading-relaxed">

        {/* 1. Allmänt */}
        <PolicySection number="1" title="Allmänt">
          <p>
            Dessa köpvillkor gäller för köp hos Bilskrotscentralen i Sverige AB,
            org.nr 556634-0815, Magasingatan 2, 749 35 Enköping, via vår
            webbshop och telefon. Bolaget är godkänt för F-skatt och momsregistrerat
            (SE556634081501).
          </p>
          <p>
            Genom att genomföra ett köp accepterar du dessa villkor i sin helhet.
            Villkoren reglerar förhållandet mellan Bilskrotscentralen och dig som konsument
            eller företagskund. För konsumenter gäller även distansavtalslagen (2005:59)
            och konsumentköplagen.
          </p>
          <InfoBox>
            <strong>Kontaktuppgifter:</strong><br />
            Telefon: 0171-210 02<br />
            E-post: info@bilskrotscentralen.se<br />
            Öppettider: Mån–Tors 08:00–17:00, Fredagar 08:00–15:00<br />
            Besöksadress: Magasingatan 2, 749 35 Enköping
          </InfoBox>
        </PolicySection>

        {/* 2. Priser */}
        <PolicySection number="2" title="Priser och moms">
          <p>
            Alla priser på webbshoppen anges i svenska kronor (SEK) inklusive
            25 % mervärdesskatt om inget annat anges. Vi tillämpar vinstmarginalbeskattning
            (VMB) på begagnade bildelar i enlighet med mervärdesskattelagen, vilket
            innebär att momsen beräknas på vinstmarginalen, inte hela försäljningspriset.
          </p>
          <p>
            Vi förbehåller oss rätten att korrigera eventuella felskrivningar i priser
            eller produktbeskrivningar. Vid uppenbar felprisättning kontaktar vi dig
            innan ordern behandlas.
          </p>
          <p>
            En expeditionsavgift på 49 kr tillkommer på varje order för hantering
            och administration.
          </p>
        </PolicySection>

        {/* 3. Betalning */}
        <PolicySection number="3" title="Betalning">
          <p>Följande betalningsalternativ erbjuds:</p>
          <ul className="list-none space-y-2 mt-2">
            <PayItem icon="🟡" title="Klarna" desc="Faktura (30 dagar), delbetalning eller direktbetalning med kort via Klarna. Kreditprövning kan förekomma." />
            <PayItem icon="💳" title="Visa / Mastercard" desc="Kortbetalning via Stripe. Säker betalning med 3D Secure." />
            <PayItem icon="📱" title="Swish" desc="Swish-nummer: 123 512 67 68. Ange ordernumret som meddelande." />
            <PayItem icon="🏦" title="Bankgiro" desc="Bankgiro: 5497-3441. Ange ordernumret som referens. Ordern skickas när betalningen är bokförd." />
          </ul>
          <p className="mt-3">
            Betalning måste vara genomförd innan varan avsänds, om inte annat har
            avtalats skriftligen.
          </p>
        </PolicySection>

        {/* 4. Frakt och leverans */}
        <PolicySection number="4" title="Frakt och leverans">
          <p>
            Vi levererar till hela Sverige. Leveranstid är normalt 1–3 arbetsdagar
            från det att betalning mottagits och ordern behandlats.
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Fri frakt vid order över 500 kr (inkl. moms)</li>
            <li>Frakt 99 kr vid order under 500 kr (Postnord paket till utlämningsställe)</li>
            <li>Tunga delar (motorer, växellådor, bakaxlar): Fraktkostnad offereras separat</li>
          </ul>
          <p className="mt-3">
            Outlösta paket som returneras till oss debiteras frakt + returfrakt samt en
            hanteringskostnad på 20 % av detaljpriset.
          </p>
          <p>
            Paket hålls på utlämningsstället i 14 dagar. Hämtas de inte ut inom den
            tiden behandlas de som outlösta.
          </p>
        </PolicySection>

        {/* 5. Ångerrätt */}
        <PolicySection number="5" title="Ångerrätt (14 dagar)">
          <div className="p-4 rounded-lg bg-[var(--color-success)]/5 border border-[var(--color-success)]/20 mb-4">
            <p className="font-semibold text-[var(--color-success-bright)]">
              Som konsument har du 14 dagars ångerrätt från den dag du mottagit varan,
              enligt distansavtalslagen (2005:59).
            </p>
          </div>
          <p>
            Vill du utnyttja ångerrätten måste du meddela oss detta <strong>per telefon</strong> på
            0171-210 02 <em>innan</em> du returnerar varan. Vi mottar inte returer mot
            postförskott eller efterkrav.
          </p>
          <p>
            Ångerrätten gäller <strong>inte</strong> för:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Varor som monterats, provkörts eller på annat sätt inte kan återförsäljas i ursprungligt skick</li>
            <li>Begagnade elektronikkomponenter, förgasare och insprutningsdelar</li>
            <li>Nya hembeställda (speciellt beställda) varor</li>
            <li>Kuranta delar i vilka ingrepp gjorts utan vårt medgivande</li>
          </ul>
          <p className="mt-3">
            Du ansvarar för returkostnaden. Spara alltid ditt inlämningskvitto — du ansvarar
            för försändelsen tills den når oss.
          </p>
          <p>
            Återbetalning sker inom 30 dagar från det att vi mottagit den returnerade varan
            och godkänt returen. En returavgift på <strong>20 % av detaljpriset, lägst 100 kr</strong>,
            avräknas vid återbetalningen för hantering och kontroll.
          </p>
        </PolicySection>

        {/* 6. Retur */}
        <PolicySection number="6" title="Retur och returvillkor">
          <p>
            Vid retur ska du som kund <strong>ALLTID kontakta oss per telefon</strong> (0171-210 02)
            <em> innan</em> du skickar tillbaka varan. Ring oss, <strong>inte e-post</strong> — det
            är viktigt att vi kan hantera ditt ärende snabbt och korrekt.
          </p>
          <h3 className="font-semibold text-[var(--color-text-primary)] mt-4 mb-2">Krav för godkänd retur:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ifylld retursedel ska följa med paketet</li>
            <li>Originalkvitto eller kopia måste bifogas</li>
            <li>Varan ska paketeras på exakt samma sätt som vid leveransen</li>
            <li>Retur sker <em>inte</em> som postförskott eller efterkrav — sådana paket löses inte ut</li>
          </ul>
          <h3 className="font-semibold text-[var(--color-text-primary)] mt-4 mb-2">Returer vi inte godkänner:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Varor utan kvitto, efterkrav, faktura eller följesedel (kopia godkänns)</li>
            <li>Begagnade elektronikkomponenter, förgasare och insprutningsdelar</li>
            <li>Nya hembeställda varor</li>
            <li>Delar med ingrepp utförda utan vårt medgivande</li>
          </ul>
          <p className="mt-3">
            <strong>Returavgift:</strong> 20 % av detaljpriset avräknas vid återbetalning,
            lägst 100 kr. Alternativt kan vi erbjuda utbyte mot likvärdig vara om sådan
            finns att tillgå.
          </p>
        </PolicySection>

        {/* 7. Garanti */}
        <PolicySection number="7" title="Garanti">
          <p>
            Kvitto/faktura gäller som garantibevis — spara alltid ditt kvitto.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div className="p-4 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)]">
              <div className="font-semibold text-[var(--color-text-primary)] mb-2">Motor, växellåda &amp; bakaxel</div>
              <div className="text-2xl font-black text-[var(--color-brand-orange)]">30 dagar</div>
              <div className="text-xs mt-1">från leveransdatum</div>
            </div>
            <div className="p-4 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)]">
              <div className="font-semibold text-[var(--color-text-primary)] mb-2">Övriga begagnade delar</div>
              <div className="text-2xl font-black text-[var(--color-brand-orange)]">8 dagar</div>
              <div className="text-xs mt-1">från leveransdatum</div>
            </div>
            <div className="p-4 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)]">
              <div className="font-semibold text-[var(--color-text-primary)] mb-2">Nya bil-batterier</div>
              <div className="text-2xl font-black text-[var(--color-brand-orange)]">2 år</div>
              <div className="text-xs mt-1">garantibevis krävs</div>
            </div>
            <div className="p-4 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)]">
              <div className="font-semibold text-[var(--color-text-primary)] mb-2">Ny kompressor luftbälg</div>
              <div className="text-2xl font-black text-[var(--color-brand-orange)]">1 år</div>
              <div className="text-xs mt-1">garantibevis krävs</div>
            </div>
          </div>
          <p className="mt-4">
            Garantin innefattar byte till likvärdig del eller vara, om inte annat avtalats.
            Garantin gäller inte för:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Fel orsakat av felaktig montering</li>
            <li>Fel orsakat av olyckshändelse, vanvård eller onormal användning</li>
            <li>Tävlingsverksamhet och trimning räknas som onormal användning</li>
            <li>Skador som uppstått efter leveranstidpunkten</li>
            <li>Slitagedelar (spännrullar, remmar, vattenpumpar, bromsbelägg m.m.)</li>
          </ul>
          <p className="mt-3">
            Köparen har ej rätt till ersättning för indirekta skador eller följdskador såsom
            utebliven vinst, uteblivna intäkter eller utgifter för demonterings- och
            monteringskostnader.
          </p>
        </PolicySection>

        {/* 8. Reklamation */}
        <PolicySection number="8" title="Reklamation">
          <p>
            Felaktig vara ska reklameras inom <strong>14 dagar från leveransdatum</strong>.
            Kontakta oss per telefon (0171-210 02) med ordernummer och en beskrivning av felet.
            Bifoga gärna bild eller video för snabbare handläggning.
          </p>
          <p>
            <strong>Transportskada:</strong> Uppstår skada under frakten ska reklamation
            göras <em>omgående</em> direkt till berörd fraktfirma. Synliga skador på förpackningen
            ska anmärkas vid mottagandet.
          </p>
          <p>
            Köparen har ej rätt till ersättning för indirekta skador eller följdskador till följd
            av en felaktig vara.
          </p>
        </PolicySection>

        {/* 9. Ansvarsbegränsning */}
        <PolicySection number="9" title="Ansvarsbegränsning">
          <p>
            Säljaren ansvarar inte för direkta eller indirekta skador som orsakats av:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Felaktig montering av köparen eller tredje part</li>
            <li>Olyckshändelser, vanvård eller onormal användning</li>
            <li>Tävlingsverksamhet, trimning eller modifieringar</li>
            <li>Omständigheter utanför säljarens kontroll (force majeure)</li>
          </ul>
          <p className="mt-3">
            Säljaren ersätter inte kostnader för demontering eller montering i fordon
            under några omständigheter.
          </p>
        </PolicySection>

        {/* 10. Tvist */}
        <PolicySection number="10" title="Tvist och tillämplig lag">
          <p>
            Dessa villkor lyder under svensk lag. Vid tvist som inte kan lösas i samförstånd
            kan du som konsument vända dig till{" "}
            <a
              href="https://www.arn.se"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-brand-orange)] hover:underline"
            >
              Allmänna reklamationsnämnden (ARN)
            </a>. Vi förbinder oss att följa ARN:s rekommendationer.
          </p>
          <p>
            Du kan även använda EU:s plattform för onlinetvistlösning (ODR):{" "}
            <a
              href="https://ec.europa.eu/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-brand-orange)] hover:underline"
            >
              ec.europa.eu/odr
            </a>.
          </p>
          <p>
            Tvister prövas i första hand av Enköpings tingsrätt, om ARN inte är tillämpligt.
          </p>
        </PolicySection>

      </div>

      {/* Footer CTA */}
      <div className="mt-14 p-6 rounded-xl bg-[var(--color-brand-orange)]/5 border border-[var(--color-brand-orange)]/20 text-center">
        <h3 className="font-bold mb-1">Frågor om villkoren?</h3>
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
          Ring oss så reder vi ut det direkt.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="tel:017121002" className="btn-primary">📞 0171-210 02</a>
          <a href="mailto:info@bilskrotscentralen.se" className="btn-secondary">✉ info@bilskrotscentralen.se</a>
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

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 p-4 rounded-lg bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-sm">
      {children}
    </div>
  );
}

function PayItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="text-xl shrink-0">{icon}</span>
      <div>
        <span className="font-semibold text-[var(--color-text-primary)]">{title}</span>
        <span className="text-sm ml-2">{desc}</span>
      </div>
    </li>
  );
}
