import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Garanti & reklamation — Bilskrotscentralen i Sverige AB",
  description:
    "Garantivillkor för begagnade bildelar. Motor och växellåda 30 dagar. Övriga delar 8 dagar. Kvitto/faktura gäller som garantibevis.",
};

export default function GarantiPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-10 pb-12">
        <img src="/images/verkstad-hero.jpeg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--color-brand-orange)] opacity-[0.05] rounded-full blur-[120px]" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center justify-center gap-2">
            <Link href="/" className="hover:text-[var(--color-brand-orange)]">Hem</Link>
            <span>›</span>
            <span className="text-[var(--color-text-secondary)]">Garanti</span>
          </nav>
          <div className="text-6xl mb-6">🛡️</div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Garanti &amp; <span className="gradient-text">reklamation</span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-xl mx-auto">
            Kvitto/faktura gäller som garantibevis. Spara alltid ditt köpbevis.
          </p>
        </div>
      </section>

      {/* Guarantee periods */}
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <h2 className="text-xl font-black text-center mb-6">Garantitider</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GuaranteeCard
            emoji="⚙️"
            title="Motor, växellåda & bakaxel"
            period="30 dagar"
            sub="från leveransdatum"
            color="orange"
          />
          <GuaranteeCard
            emoji="🔩"
            title="Övriga begagnade delar"
            period="8 dagar"
            sub="från leveransdatum"
            color="orange"
          />
          <GuaranteeCard
            emoji="🔋"
            title="Nya bil-batterier"
            period="2 år"
            sub="garantibevis krävs"
            color="green"
          />
          <GuaranteeCard
            emoji="💨"
            title="Ny kompressor luftbälg"
            period="1 år"
            sub="garantibevis krävs"
            color="green"
          />
        </div>
      </section>

      {/* Covered / Not covered */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-xl bg-[var(--color-success)]/5 border border-[var(--color-success)]/20">
            <h3 className="font-bold text-[var(--color-success-bright)] mb-3">✅ Vad garantin täcker</h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li className="flex gap-2"><span>•</span>Funktionsfel på komponenten</li>
              <li className="flex gap-2"><span>•</span>Dolda fel som uppstår under garantiperioden</li>
              <li className="flex gap-2"><span>•</span>Utbyte mot likvärdig del om möjligt</li>
              <li className="flex gap-2"><span>•</span>Återbetalning om utbyte ej kan ske</li>
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/20">
            <h3 className="font-bold text-red-400 mb-3">❌ Vad garantin inte täcker</h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li className="flex gap-2"><span>•</span>Fel vid felaktig montering</li>
              <li className="flex gap-2"><span>•</span>Olyckshändelse, vanvård, onormal användning</li>
              <li className="flex gap-2"><span>•</span>Tävlingsverksamhet och trimning</li>
              <li className="flex gap-2"><span>•</span>Slitagedelar (remmar, spännrullar, bromsbelägg m.m.)</li>
              <li className="flex gap-2"><span>•</span>Demonterings- och monteringskostnader</li>
              <li className="flex gap-2"><span>•</span>Utebliven vinst eller följdskador</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Reklamation process */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <div className="glass rounded-2xl p-8">
          <h2 className="text-2xl font-black mb-6">Så reklamerar du — steg för steg</h2>
          <div className="space-y-5">
            <Step n={1} title="Ring oss på 0171-210 02">
              Kontakta oss per <strong>telefon</strong> (inte e-post) med ditt ordernummer
              och en beskrivning av felet. Har du bild eller video — skicka gärna det i
              ett SMS eller WhatsApp så kan vi ofta godkänna ärendet direkt.
            </Step>
            <Step n={2} title="Vi bedömer ärendet">
              Vi går igenom felet och avgör om det täcks av garantin. I de flesta fall
              löser vi det under samtalet.
            </Step>
            <Step n={3} title="Skicka tillbaka delen">
              Vi skickar en instruktion för hur du returnerar varan. Paketetera den på
              samma sätt som den anlände. Bifoga alltid kvitto eller faktura.
            </Step>
            <Step n={4} title="Utbyte eller återbetalning">
              När vi mottagit och godkänt returen erbjuder vi i första hand utbyte mot
              likvärdig del. Om ingen likvärdig del finns sker återbetalning inom 30 dagar.
            </Step>
          </div>
          <div className="mt-6 p-4 rounded-xl bg-[var(--color-brand-orange)]/5 border border-[var(--color-brand-orange)]/20 text-sm text-[var(--color-text-secondary)]">
            <strong className="text-[var(--color-text-primary)]">Reklamationstid:</strong> Felaktig vara ska reklameras inom{" "}
            <strong>14 dagar från leveransdatum</strong>. En reklamation som görs inom en
            månad från att felet märktes anses alltid vara gjord i rimlig tid (konsumentköplagen).
          </div>
        </div>
      </section>

      {/* Transport damage */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-3">🚚 Transportskada</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Uppstår synlig skada vid leveransen — kontrollera alltid förpackningen
            <strong> innan</strong> du signerar mottagandet. Anmärk skadan direkt till
            chaufför/fraktfirma. Vid dold transportskada ska reklamation göras{" "}
            <strong>omgående</strong> till fraktfirman, och senast inom 7 dagar.
            Vi hjälper gärna till med reklamationsprocessen — ring oss.
          </p>
        </div>
      </section>

      {/* Full policy text */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="space-y-6 text-[var(--color-text-secondary)] text-sm leading-relaxed">
          <div className="border-t border-[var(--color-dark-500)] pt-6">
            <h2 className="font-bold text-[var(--color-text-primary)] mb-3 text-base">Fullständiga garantivillkor</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">Garantibevis</h3>
                <p>
                  Kvitto/Faktura gäller som GARANTIBEVIS och ska sparas under hela garantitiden.
                  För Nya Bil-Batterier och Nya Kompressor Luftbälg gäller garantibeviset
                  uteslutande för dessa produkter.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">Ansvarsbegränsning</h3>
                <p>
                  Säljaren ansvarar inte för fel som orsakats av felaktig montering.
                  Säljaren ansvarar inte heller för fel som orsakats av olyckshändelser,
                  vanvård, onormal användning eller liknande efter tidpunkten för varans
                  avlämnande. Med onormal användning avses bland annat tävlingsverksamhet
                  och trimning.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">Följdskador</h3>
                <p>
                  Köparen har ej rätt till ersättning för indirekta skador eller följdskador
                  såsom utebliven vinst, uteblivna intäkter, indirekta kostnader o.s.v.
                  Säljaren ersätter inte heller utgifter för demonterings- och monteringskostnader.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">Uteslutna varor</h3>
                <p>
                  Begagnade och nya elektronikkomponenter, förgasare, insprutningsdelar
                  och nya hembeställda varor återtas ej och omfattas inte av garantin.
                  Kuranta delar i vilka ingrepp gjorts utan vårt medgivande återtas inte heller.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">Alternativ till återbetalning</h3>
                <p>
                  Alternativt ersätter vi varan med en likvärdig vara om sådan finns att
                  tillgå. I annat fall återbetalas beloppet mot uppvisande av köpehandling/kvitto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <div className="p-6 rounded-xl bg-[var(--color-brand-orange)]/5 border border-[var(--color-brand-orange)]/20 text-center">
          <h3 className="font-bold mb-2">Frågor? Ring Adam direkt.</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-5">
            Vi löser de flesta ärenden under ett samtal.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:017121002" className="btn-primary">📞 0171-210 02</a>
            <a href="mailto:info@bilskrotscentralen.se" className="btn-secondary">✉️ info@bilskrotscentralen.se</a>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-4">
            Mån–Tors 08:00–17:00 &nbsp;·&nbsp; Fredagar 08:00–15:00
          </p>
        </div>
      </section>
    </>
  );
}

function GuaranteeCard({ emoji, title, period, sub, color }: {
  emoji: string; title: string; period: string; sub: string;
  color: "orange" | "green";
}) {
  const accent = color === "orange" ? "var(--color-brand-orange)" : "var(--color-success-bright)";
  return (
    <div className="glass rounded-xl p-5 text-center">
      <div className="text-3xl mb-3">{emoji}</div>
      <div className="text-xs text-[var(--color-text-muted)] mb-2 min-h-[2.5rem] flex items-center justify-center">{title}</div>
      <div className="text-3xl font-black mb-0.5" style={{ color: accent }}>{period}</div>
      <div className="text-xs text-[var(--color-text-muted)]">{sub}</div>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-[var(--color-brand-orange)] text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
        {n}
      </div>
      <div>
        <div className="font-semibold text-[var(--color-text-primary)] mb-1">{title}</div>
        <p className="text-sm text-[var(--color-text-secondary)]">{children}</p>
      </div>
    </div>
  );
}
