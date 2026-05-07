import type { Metadata } from "next";
import Link from "next/link";
import { AnslutForm } from "./AnslutForm";

export const metadata: Metadata = {
  title: "Anslut din verkstad — B2B-portal | Bilskrotscentralen",
  description:
    "Verkstäder och bilhandlare: ansök om B2B-konto för nettopriser, faktura 30 dagar och prioriterad eftersökning. Mercedes-specialist sedan 1984.",
};

const PERKS = [
  { icon: "💰", title: "Nettopriser",          desc: "Upp till 30 % rabatt mot konsumentpris på rörelsehela sortimentet." },
  { icon: "📄", title: "Faktura 30 dagar",     desc: "Kreditkonto efter godkännande. Slipper hantera kortbetalningar." },
  { icon: "🔍", title: "Prioriterad eftersökning", desc: "Adam letar personligen — svar inom samma dag, inte 24 h." },
  { icon: "🚚", title: "Expressfrakt Mälardalen", desc: "Eftermiddagsorder kan plockas upp eller levereras nästa morgon." },
  { icon: "🛡️", title: "Utökad garanti",       desc: "12 månaders garanti på Mercedes-original (vs 6 mån för konsument)." },
  { icon: "👤", title: "Dedikerad kontakt",     desc: "Du når samma person varje gång — kortast möjliga svarsväg." },
];

export default function AnslutPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-10 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-dark-900)] via-[var(--color-dark-900)] to-[var(--color-dark-800)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--color-brand-orange)] opacity-[0.07] rounded-full blur-[120px]" />

        <div className="relative max-w-4xl mx-auto px-4">
          <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--color-brand-orange)]">Hem</Link>
            <span>›</span>
            <Link href="/b2b" className="hover:text-[var(--color-brand-orange)]">B2B</Link>
            <span>›</span>
            <span className="text-[var(--color-text-secondary)]">Anslut</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-brand-orange)]/30 bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange-light)] text-xs font-semibold tracking-wider uppercase mb-5">
            För verkstäder
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Anslut din <span className="gradient-text">verkstad</span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl">
            Tre dagar — så snabbt brukar det ta från ansökan till godkänt
            B2B-konto. Inga avgifter, inget bindande. Vi ringer upp för en
            kort genomgång innan vi öppnar.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {PERKS.map((p) => (
            <div
              key={p.title}
              className="rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] p-5"
            >
              <div className="text-2xl mb-2">{p.icon}</div>
              <h3 className="font-bold text-sm mb-1">{p.title}</h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <AnslutForm />

        <p className="text-xs text-[var(--color-text-muted)] text-center mt-6">
          Frågor först? Ring{" "}
          <a href="tel:017121002" className="text-[var(--color-brand-orange)] font-semibold">
            0171-210 02
          </a>{" "}
          eller maila{" "}
          <a href="mailto:info@bilskrotscentralen.com" className="text-[var(--color-brand-orange)] font-semibold">
            info@bilskrotscentralen.com
          </a>
          .
        </p>
      </section>
    </>
  );
}
