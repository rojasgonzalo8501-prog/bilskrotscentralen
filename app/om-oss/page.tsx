import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Om oss — Bilskrotscentralen sedan 1984",
  description:
    "Bilskrotscentralen är Mälardalens ledande bildemontering sedan 1984. Adam tog över verksamheten för 5 år sedan och driver den vidare med samma passion.",
};

export default function OmOssPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-10 pb-12">
        <img src="/images/montering.jpeg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--color-brand-orange)] opacity-[0.05] rounded-full blur-[120px]" />

        <div className="relative max-w-4xl mx-auto px-4">
          <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--color-brand-orange)]">Hem</Link>
            <span>›</span>
            <span className="text-[var(--color-text-secondary)]">Om oss</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-6">
            Över 40 år av <span className="gradient-text">passion för bilar</span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
            Bilskrotscentralen är en familjedriven bildemontering i Enköping med rötter
            ända tillbaka till 1984. Sedan dess har vi specialiserat oss på Mercedes-Benz
            och vuxit till att bli Mälardalens mest pålitliga bildemontering.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16">

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[
            { v: "1984", l: "Verksamheten grundad" },
            { v: "2 000+", l: "Demonterade Mercedes" },
            { v: "30 000+", l: "Delar i lager" },
          ].map((s) => (
            <div key={s.l} className="text-center p-6 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)]">
              <div className="text-3xl font-black text-[var(--color-brand-orange)] mb-1">{s.v}</div>
              <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="prose prose-invert text-[var(--color-text-secondary)] leading-relaxed space-y-4">
          <h2 className="text-2xl font-black text-[var(--color-text-primary)]">Vår historia</h2>
          <p>
            Verksamheten grundades i mitten av 1980-talet med en enkel övertygelse: begagnade
            Mercedes-delar är lika bra som nya — om de testas ordentligt. Sedan starten har vi
            demonterat tusentals bilar och hjälpt kunder i hela Sverige att hitta rätt del
            till rätt pris.
          </p>
          <p>
            För fem år sedan tog Adam över verksamheten och driver den vidare med samma
            engagemang och kärlek till bilar som alltid. Idag är vi fortfarande ett litet,
            dedikerat team — och det är precis som det ska vara.
          </p>

          <h2 className="text-2xl font-black text-[var(--color-text-primary)]">Vad vi gör</h2>
          <p>
            Vi köper bilar — företrädesvis Mercedes — som är skadade, slitna eller färdigkörda.
            Vi demonterar dem för hand, testar varje fungerande komponent, fotograferar och
            lagerlägger den. Sen säljer vi delarna vidare till verkstäder, bilhandlare och
            privatpersoner i hela Sverige.
          </p>
          <p>
            Vi är en <strong>auktoriserad bildemontering</strong> godkänd av Transportstyrelsen.
            Det betyder att vi får hantera miljöfarligt avfall, sköta avregistreringar och
            utfärda mottagningsbevis — och garanterar att din bil hanteras lagligt och miljöriktigt.
          </p>
          <p>
            Har du en fråga om en del? Du pratar direkt med Adam eller någon i hans team —
            folk som faktiskt har skruvat på bilen som delen suttit i. Ring oss på{" "}
            <a href="tel:017121002" className="text-[var(--color-brand-orange)] hover:underline">0171-210 02</a>.
          </p>
        </div>
      </section>
    </>
  );
}
