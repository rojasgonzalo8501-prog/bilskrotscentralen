import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "B2B-portal — för verkstäder och bilhandlare | Bilskrotscentralen",
  description:
    "Är du verkstad eller bilhandlare? Få verkstadspriser, prioriterad eftersökning, fakturabetalning och dedikerad kontaktperson. Mercedes-specialist sedan 1984.",
};

export default function B2BPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-10 pb-12">
        <img src="/images/verkstad-hero.jpeg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--color-brand-orange)] opacity-[0.05] rounded-full blur-[120px]" />

        <div className="relative max-w-5xl mx-auto px-4">
          <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--color-brand-orange)]">Hem</Link>
            <span>›</span>
            <span className="text-[var(--color-text-secondary)]">B2B</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-brand-orange)]/30 bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange-light)] text-xs font-semibold tracking-wider uppercase mb-6">
            För verkstäder · bilhandlare · försäkringsbolag
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            <span className="gradient-text">B2B-portal</span> — för proffs
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mb-8">
            Verkstadspriser, prioriterad eftersökning, fakturabetalning och en dedikerad kontaktperson.
            Vi är Mälardalens största lager av begagnade Mercedes-delar.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: "💼",
              title: "Verkstadspriser",
              desc: "Upp till 25 % rabatt på lagerlistpris vid registrerat företagskonto. Volymrabatt vid återkommande köp.",
            },
            {
              icon: "⚡",
              title: "Prioriterad eftersökning",
              desc: "Vi släpper allt och letar din del. Svar inom 2 timmar på kontorstid. Direktnummer till Adam.",
            },
            {
              icon: "📄",
              title: "Faktura 30 dagar",
              desc: "Slipp Swish och Klarna — vi fakturerar månatligen efter sedvanlig kreditkontroll.",
            },
            {
              icon: "🚚",
              title: "Daglig leverans",
              desc: "Egen rutt i Mälardalen vissa dagar — paketet är hos er när verkstaden öppnar morgonen efter.",
            },
            {
              icon: "🛡️",
              title: "Garanti på allt",
              desc: "Samma funktionsgaranti som privatkunder — men med snabbreklamation och ersättning på timmen.",
            },
            {
              icon: "👨‍🔧",
              title: "Dedikerad kontaktperson",
              desc: "Adam personligen, eller ett av hans team, är er kontakt. Inget callcenter.",
            },
          ].map((b) => (
            <div key={b.title} className="p-6 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)]">
              <div className="text-4xl mb-3">{b.icon}</div>
              <h3 className="font-bold text-lg mb-2">{b.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-dark-800)] py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Bli B2B-kund</h2>
          <p className="text-[var(--color-text-secondary)] mb-8">
            Skicka ett mejl med organisationsnummer och kort beskrivning av verksamheten —
            vi öppnar ett konto inom 24 h.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:b2b@bilskrotscentralen.com" className="btn-primary">✉️ b2b@bilskrotscentralen.com</a>
            <a href="tel:017121002" className="btn-secondary">📞 0171-210 02</a>
          </div>
        </div>
      </section>
    </>
  );
}
