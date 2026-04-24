import type { Metadata } from "next";
import Link from "next/link";
import BilrutorForm from "./BilrutorForm";

export const metadata: Metadata = {
  title: "Bilrutor",
  description:
    "Nya bilrutor till alla bilmärken. Vindruta, bakruta, sidoruta, taklucka — med elvärme, regnsensor, HUD, akustikglas och mer. Bilskrotscentralen levererar och monterar i Enköping.",
};

const GLASS_TYPES = [
  {
    icon: "🪟",
    title: "Vindruta",
    desc: "Standard, tonad, akustisk eller HUD-kompatibel. Med eller utan regnsensor, kamera, elvärme och Lane Departure Warning.",
    features: ["Regnsensor", "HUD", "ADAS-kamera", "Elvärme", "Akustik"],
  },
  {
    icon: "🔲",
    title: "Bakruta",
    desc: "Med elvärme, antenn (DAB/FM), kamera eller mörk toning. Originalkvalitet för alla modeller.",
    features: ["Elvärme", "DAB-antenn", "Backkamera", "Tonad"],
  },
  {
    icon: "◻️",
    title: "Sidoruta",
    desc: "Fast eller öppningsbar. Framsäte, baksäte och bagageutrymme. Finns i standard-, akustik- och solskyddsglas.",
    features: ["Akustikglas", "Solskydd", "Tonad", "Laminerad"],
  },
  {
    icon: "⬛",
    title: "Taklucka",
    desc: "Glas till panoramatak, soltak och takluckor. Vi hittar rätt glas oavsett storlek och modell.",
    features: ["Panorama", "Soltak", "UV-skydd", "Tonad"],
  },
];

const FEATURES = [
  { icon: "🌧️", title: "Regnsensor",        desc: "Aktiverar vindrutetorkarna automatiskt vid regn." },
  { icon: "📡", title: "DAB-antenn",          desc: "Inbyggd digitalradioantenn i bakrutan eller vindrutepackningen." },
  { icon: "🔊", title: "Akustikglas",         desc: "Ljuddämpande laminerat glas — märkbart tystare kupé." },
  { icon: "☀️", title: "Solskyddsglas",       desc: "UV- och värmeskyddande beläggning — håller kupén svalare." },
  { icon: "🔥", title: "Elvärmd vindruta",    desc: "Avfrostar vindrutor på sekunder — ingen skrapa." },
  { icon: "🖥️", title: "HUD-kompatibel",      desc: "Speciellt glas som reflekterar Head-Up Display korrekt." },
  { icon: "📷", title: "ADAS-kamera",         desc: "Stöd för lane departure, city safety och automatbroms." },
  { icon: "🌑", title: "Tonat glas",          desc: "Grönt, blått eller mörkt — vi har alla toningsgrader." },
];

const BRANDS = [
  "Mercedes-Benz", "Volvo", "BMW", "Audi", "Volkswagen",
  "Toyota", "Ford", "Opel", "Peugeot", "Renault",
  "Skoda", "Seat", "Hyundai", "Kia", "Nissan",
  "Honda", "Mazda", "Citroën", "Fiat", "Porsche",
  "Lexus", "Subaru", "Mitsubishi", "Suzuki", "Jeep",
  "Land Rover", "Jaguar", "Tesla", "Volvo", "Saab",
];

const STEPS = [
  { n: "1", title: "Kontakta oss", desc: "Ring eller fyll i formuläret nedan med regnummer och vilken ruta du behöver." },
  { n: "2", title: "Vi fixar rätt ruta", desc: "Vi identifierar exakt rätt ruta med alla rätt features — leverans 1–2 dagar." },
  { n: "3", title: "Montering samma dag", desc: "Boka tid hos oss i Enköping. Monteras på plats, klar samma dag." },
];

export default function BilrutorPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <img
          src="/images/vindruta.jpeg"
          alt="Bilruta Bilskrotscentralen"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-900/80" />

        <div className="relative max-w-5xl mx-auto px-4 text-white">
          <nav className="text-xs text-gray-300 mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--color-brand-orange)]">Hem</Link>
            <span>›</span>
            <span className="text-gray-200">Bilrutor</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-brand-orange)]/30 border border-[var(--color-brand-orange)]/40 text-[var(--color-brand-orange-light)] text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-orange)] animate-pulse" />
            Nya rutor till alla bilar
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Nya bilrutor till <span className="gradient-text">alla bilar</span>
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mb-6">
            Vindruta, bakruta, sidoruta eller taklucka — med elvärme, regnsensor, HUD, akustikglas, ADAS-kamera och mer. Vi levererar och monterar till alla bilmärken och modeller.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {["Elvärmd vindruta", "HUD", "Regnsensor", "Akustikglas", "Solskyddsglas", "ADAS-kamera", "DAB-antenn", "Tonat glas"].map((f) => (
              <span key={f} className="px-3 py-1 rounded-full bg-[var(--color-brand-orange)]/20 border border-[var(--color-brand-orange)]/30 text-[var(--color-brand-orange-light)] text-xs font-medium">
                {f}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="tel:017121002" className="btn-primary px-8 py-3.5 text-sm inline-flex items-center gap-2">
              📞 Ring oss — 0171-210 02
            </a>
            <a href="#forfragan" className="btn-secondary px-8 py-3.5 text-sm inline-flex items-center gap-2">
              Skicka förfrågan →
            </a>
          </div>
        </div>
      </section>

      {/* ─── Glass types ─── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-black mb-2">Vilken ruta behöver du?</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-8">Alla typer av bilglas — nya och med rätt specifikationer för din bil.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GLASS_TYPES.map((g) => (
            <div key={g.title} className="p-6 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)]/40 transition-colors flex flex-col gap-3">
              <span className="text-3xl">{g.icon}</span>
              <h3 className="font-bold text-base">{g.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed flex-1">{g.desc}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {g.features.map((f) => (
                  <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-brand-orange)]/10 border border-[var(--color-brand-orange)]/20 text-[var(--color-brand-orange-light)] font-medium">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features grid ─── */}
      <section className="bg-[var(--color-dark-800)] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-black mb-2">Tillval & funktioner</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-8">
            Vi levererar rutor med precis rätt specifikation för din bil — berätta vad du har så hittar vi rätt.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-5 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)]/30 transition-colors">
                <span className="text-2xl block mb-3">{f.icon}</span>
                <h3 className="font-bold text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REQUEST FORM ─── */}
      <section id="forfragan" className="max-w-5xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-black mb-2">Skicka en förfrågan</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Fyll i formuläret så återkommer vi med pris och leveranstid — oftast inom några timmar.
          </p>
        </div>
        <div className="glass rounded-2xl p-6 sm:p-8">
          <BilrutorForm />
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="bg-[var(--color-dark-800)] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-black mb-2">Så funkar det</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-10">Enkelt från förfrågan till monterad ruta.</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-brand-orange)] flex items-center justify-center font-black text-white text-sm shrink-0">
                  {s.n}
                </div>
                <div>
                  <h3 className="font-bold mb-1">{s.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Brands ─── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-black mb-2">Vi har rutor till alla bilmärken</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-8">
          Ring med ditt regnummer — vi hittar rätt ruta oavsett märke och modell.
        </p>
        <div className="flex flex-wrap gap-2">
          {[...new Set(BRANDS)].map((brand) => (
            <span key={brand} className="px-3 py-1.5 rounded-full bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-sm text-[var(--color-text-secondary)] font-medium">
              {brand}
            </span>
          ))}
          <span className="px-3 py-1.5 rounded-full bg-[var(--color-brand-orange)]/10 border border-[var(--color-brand-orange)]/20 text-sm text-[var(--color-brand-orange-light)] font-medium">
            + alla övriga märken
          </span>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-[var(--color-dark-800)] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-2xl border border-[var(--color-brand-orange)]/20 bg-gradient-to-r from-[var(--color-brand-orange)]/10 via-[var(--color-dark-700)] to-[var(--color-brand-orange)]/10 p-8 sm:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-black mb-3">Redo att byta ruta?</h2>
                <p className="text-[var(--color-text-secondary)] mb-2">
                  Ring oss med ditt regnummer så ger vi dig pris direkt. Montering sker på vår verkstad i Enköping — oftast klar samma dag.
                </p>
              </div>
              <div className="space-y-3">
                <a href="tel:017121002" className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-dark)] text-white font-bold transition-colors">
                  <span className="text-xl">📞</span>
                  <span>0171-210 02</span>
                </a>
                <a href="#forfragan" className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-dark-600)] border border-[var(--color-dark-400)] hover:border-[var(--color-brand-orange)] text-[var(--color-text-primary)] font-medium transition-colors">
                  <span className="text-xl">📋</span>
                  <span>Skicka förfrågan online</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
