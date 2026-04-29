import type { Metadata } from "next";
import Link from "next/link";
import { metals, categoryLabels, pricesUpdatedAt, type MetalCategory } from "@/lib/metal-prices";
import { MetalForm } from "./MetalForm";

export const metadata: Metadata = {
  title: "Metallinköp — privat & företag | Bilskrotscentralen",
  description:
    "Vi köper alla typer av metallskrot — järn, aluminium, koppar, mässing, bly, kablar, elektronik, batterier. Inlämning på Magasingatan 2 i Enköping eller hämtning vid större mängder. Dagspriser, ingen kontanthantering.",
};

const CATEGORY_ORDER: MetalCategory[] = [
  "ferro",
  "non-ferro",
  "kabel",
  "elektronik",
  "batteri",
  "ädelmetall-light",
];

function fmtSekKg(price: number): string {
  if (price === 0) return "Per styck — ring";
  return `${price.toLocaleString("sv-SE")} kr/kg`;
}

export default function MetallinkopPage() {
  // Group by category
  const byCategory = new Map<MetalCategory, typeof metals>();
  for (const m of metals) {
    const arr = byCategory.get(m.category) ?? [];
    arr.push(m);
    byCategory.set(m.category, arr);
  }
  const orderedCategories = CATEGORY_ORDER.filter((c) => byCategory.has(c));

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden pt-12 pb-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/montering.jpeg"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-dark-900)]/85 via-[var(--color-dark-900)]/80 to-[var(--color-dark-900)]/95" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500 opacity-[0.08] rounded-full blur-[140px]" />

        <div className="relative max-w-5xl mx-auto px-4">
          <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--color-brand-orange)]">
              Hem
            </Link>
            <span>›</span>
            <span className="text-[var(--color-text-secondary)]">Metallinköp</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-300 mb-4">
            🌱 Återvinning · privat och företag
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-5 max-w-3xl">
            Vi köper <span className="gradient-text">all typ av metall</span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mb-8">
            Järn, aluminium, koppar, mässing, kablar, elektronik, batterier — vi tar emot allt.
            Inlämning på Magasingatan 2 i Enköping. Hämtning vid större mängder. Inga kontanter,
            allt går via Swish eller bankgiro.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#prislista"
              className="btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold"
            >
              Se dagspriser ↓
            </a>
            <a
              href="#forfragan"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)] transition-all"
            >
              Skicka förfrågan →
            </a>
            <a
              href="tel:+46171210002"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-brand-orange)] transition-all"
            >
              📞 0171-210 02
            </a>
          </div>
        </div>
      </section>

      {/* ─── CO2 / återvinnings-band ─── */}
      <section className="border-y border-[var(--color-dark-500)] bg-[var(--color-dark-800)]/50">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <Stat
            value="9 kg"
            label="CO2 sparat per kg återvunnen aluminium"
            sub="vs. nyutvunnen"
          />
          <Stat
            value="75 %"
            label="mindre energi vid återvinning av järn"
            sub="vs. malmbrytning"
          />
          <Stat
            value="100 %"
            label="av metallen återvinns till nytt material"
            sub="ingen blir avfall"
          />
        </div>
      </section>

      {/* ─── Prislista ─── */}
      <section id="prislista" className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight mb-1">
              <span className="gradient-text">Dagspriser</span>
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Indikativt pris — slutpris bestäms vid vägning och sortering. Uppdaterat:{" "}
              <strong>{pricesUpdatedAt}</strong>.
            </p>
          </div>
          <a
            href="#forfragan"
            className="text-sm font-semibold text-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange-light)]"
          >
            Inte säker? Skicka förfrågan →
          </a>
        </div>

        <div className="space-y-10">
          {orderedCategories.map((cat) => {
            const items = byCategory.get(cat)!;
            return (
              <div key={cat}>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-4 pb-2 border-b border-[var(--color-dark-500)]">
                  {categoryLabels[cat]}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-xl border border-[var(--color-dark-500)] bg-[var(--color-dark-700)]/60 p-4 hover:border-[var(--color-brand-orange)]/40 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{m.icon}</span>
                          <h4 className="font-bold text-sm">{m.name}</h4>
                        </div>
                        <span className="text-sm font-black text-[var(--color-brand-orange)] whitespace-nowrap">
                          {fmtSekKg(m.pricePerKgSek)}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] mb-2">{m.subtitle}</p>
                      {m.co2SavedPerKg > 0 && (
                        <div className="text-[11px] text-emerald-400/80 font-medium">
                          🌱 sparar {m.co2SavedPerKg} kg CO2 per kg
                        </div>
                      )}
                      {m.note && (
                        <p className="text-[11px] text-[var(--color-text-muted)] italic mt-2">
                          {m.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Hur det funkar ─── */}
      <section className="bg-[var(--color-dark-800)]/40 border-y border-[var(--color-dark-500)]">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-black tracking-tight mb-10 text-center">
            Så funkar det
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <Step
              n={1}
              title="Lämna in eller boka hämtning"
              desc="Kör in på Magasingatan 2 i Enköping under öppettider. Vid större mängder bokar vi hämtning — ring eller skicka förfrågan."
            />
            <Step
              n={2}
              title="Vi väger och sorterar"
              desc="Du får ett kvitto direkt och ett fast pris baserat på dagens noteringar. Legitimation krävs enligt lag."
            />
            <Step
              n={3}
              title="Betalning via Swish eller bankgiro"
              desc="Privatpersoner får Swish, företag betalas till bankgiro. Inga kontanter — vi följer lag (2014:799)."
            />
          </div>
        </div>
      </section>

      {/* ─── Företagslösning ─── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-brand-orange)]/10 border border-[var(--color-brand-orange)]/30 text-xs font-semibold text-[var(--color-brand-orange)] mb-4">
              För företag
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-4">
              Återkommande hämtning för verkstäder, rivningsfirmor och industri
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Vi sätter upp containrar, gör veckovis tömning och betalar direkt till bankgiro.
              Du får hållbarhetsrapport per kvartal — kg återvunnet × kg CO2 sparat — som kan
              användas i er årsrapport.
            </p>
            <ul className="space-y-2 text-sm">
              {[
                "Egen kontaktperson",
                "Containrar och bigbags på plats",
                "Hållbarhetsrapport för CSRD/årsredovisning",
                "Ramavtal med fasta påslag",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[var(--color-dark-500)] bg-[var(--color-dark-700)]/60 p-6">
            <h3 className="font-bold mb-3">Kontakta företagsavdelningen</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-5">
              Berätta vilka volymer ni har så återkommer vi med upplägg samma dag.
            </p>
            <div className="space-y-3">
              <a
                href="tel:+46171210002"
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-dark-800)] hover:bg-[var(--color-dark-600)] transition-all"
              >
                <span className="text-sm font-semibold">📞 0171-210 02</span>
                <span className="text-xs text-[var(--color-text-muted)]">vard 8–17</span>
              </a>
              <a
                href="mailto:foretag@bilskrotscentralen.com"
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-dark-800)] hover:bg-[var(--color-dark-600)] transition-all"
              >
                <span className="text-sm font-semibold">✉️ foretag@bilskrots…</span>
                <span className="text-xs text-[var(--color-text-muted)]">svar inom 1 dag</span>
              </a>
              <a
                href="#forfragan"
                className="flex items-center justify-center p-3 rounded-lg bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-dark)] text-white transition-all"
              >
                <span className="text-sm font-semibold">Eller skicka förfrågan ↓</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Förfrågan ─── */}
      <section id="forfragan" className="bg-[var(--color-dark-800)]/40 border-t border-[var(--color-dark-500)]">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-black tracking-tight mb-3 text-center">
            Skicka <span className="gradient-text">förfrågan</span>
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] text-center mb-10">
            Vi återkommer med pris och nästa steg inom en arbetsdag.
          </p>
          <MetalForm />
        </div>
      </section>

      {/* ─── Adress / öppettider ─── */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-[var(--color-dark-500)] bg-[var(--color-dark-700)]/60 p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
              Inlämningsadress
            </div>
            <div className="font-bold mb-1">Bilskrotscentralen</div>
            <div className="text-sm text-[var(--color-text-secondary)]">Magasingatan 2</div>
            <div className="text-sm text-[var(--color-text-secondary)]">745 32 Enköping</div>
            <a
              href="https://maps.google.com/?q=Magasingatan+2+Enk%C3%B6ping"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-xs text-[var(--color-brand-orange)] hover:underline font-semibold"
            >
              Öppna i Google Maps →
            </a>
          </div>
          <div className="rounded-xl border border-[var(--color-dark-500)] bg-[var(--color-dark-700)]/60 p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
              Öppettider
            </div>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Måndag–Fredag</span>
                <span className="font-semibold">08:00–17:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Lördag</span>
                <span className="font-semibold">10:00–14:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Söndag</span>
                <span className="text-[var(--color-text-muted)]">Stängt</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div>
      <div className="text-3xl sm:text-4xl font-black gradient-text mb-1">{value}</div>
      <div className="text-sm font-semibold">{label}</div>
      {sub && <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{sub}</div>}
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-brand-orange)]/10 border border-[var(--color-brand-orange)]/30 text-[var(--color-brand-orange)] font-black text-lg mb-3">
        {n}
      </div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-text-secondary)]">{desc}</p>
    </div>
  );
}
