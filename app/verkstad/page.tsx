import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verkstad i Enköping — Mercedes-specialist | Bilskrotscentralen",
  description:
    "Vår verkstad i Enköping är specialiserad på Mercedes-Benz. Service, reparation, luftfjädring, AC, motor och elektronik. Originaldelar till halva priset.",
};

const SERVICES = [
  { icon: "🔧", title: "Service & underhåll", desc: "Löpande service, oljebyte, bromsservice — alla bilmärken." },
  { icon: "💨", title: "Luftfjädring", desc: "Mercedes Airmatic-specialist. Diagnos, byte och kalibrering." },
  { icon: "❄️", title: "AC-service", desc: "Påfyllning, läcksökning, kompressorbyte. Miljögodkänd köldmedia." },
  { icon: "⚡", title: "Diagnos & elektronik", desc: "Felsökning av styrenheter, kabelhärvor och CAN-bus-fel." },
  { icon: "🛞", title: "Hjul & däck", desc: "Hjulbyten, balansering, fyrhjulsinställning." },
  { icon: "🔩", title: "Motor & transmission", desc: "Motorrenovering, växellådsservice, turboreparation." },
];

export default function VerkstadPage() {
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
            <span className="text-[var(--color-text-secondary)]">Verkstad</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Vår <span className="gradient-text">verkstad</span> i Enköping
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mb-8">
            Mercedes-specialist sedan 1984. Vi lagar det andra verkstäder skickar vidare —
            och vi använder originaldelar från vårt eget lager till halva priset av nytt.
          </p>

          <div className="flex flex-wrap gap-3">
            <a href="tel:017121002" className="btn-primary">📞 Boka tid: 0171-210 02</a>
            <a href="/kontakt" className="btn-secondary">Skicka förfrågan</a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-3">Det vi gör</h2>
          <p className="text-[var(--color-text-secondary)]">Hela bilen, från turbo till AC.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((s) => (
            <div key={s.title} className="card-hover p-6 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)]">
              <div className="text-4xl mb-3">{s.icon}</div>
              <h3 className="font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-dark-800)] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">
            Varför välja vår verkstad?
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 mt-8 text-left">
            <div>
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-bold mb-1">Halva priset</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Vi använder testade originaldelar från eget lager — inte nya delar för fullpris.
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="font-bold mb-1">Mercedes-specialist</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                40 års erfarenhet av Mercedes — vi kan diagnoserna ingen annan klarar.
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🛡️</div>
              <h3 className="font-bold mb-1">Garanti på allt</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Funktionsgaranti på både delar och arbete.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
