import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kontakt — Bilskrotscentralen i Enköping",
  description:
    "Kontakta Bilskrotscentralen i Enköping. Telefon, e-post, öppettider och adress. Vi finns i Mälardalen sedan 1984.",
};

export default function KontaktPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-10 pb-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/verkstad-hero.jpeg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />

        <div className="relative max-w-4xl mx-auto px-4">
          <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--color-brand-orange)]">Hem</Link>
            <span>›</span>
            <span className="text-[var(--color-text-secondary)]">Kontakt</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Hör av <span className="gradient-text">dig</span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Adam svarar själv i telefonen. Inget callcenter, inget vänteband.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          <ContactCard
            icon="📞"
            label="Telefon"
            value="0171-210 02"
            href="tel:017121002"
            note="Mån–Tors 08:00–17:00 · Fre 08:00–15:00 · Lör 10:00–14:00"
          />
          <ContactCard
            icon="✉️"
            label="E-post"
            value="info@bilskrotscentralen.se"
            href="mailto:info@bilskrotscentralen.se"
            note="Svar inom 24 h på vardagar"
          />
          <ContactCard
            icon="📍"
            label="Besöksadress"
            value="Magasingatan 2, 749 35 Enköping"
            href="https://maps.google.com/?q=Magasingatan+2+Enköping"
            note="Öppet för visning efter överenskommelse"
          />
          <ContactCard
            icon="💼"
            label="B2B & verkstäder"
            value="b2b@bilskrotscentralen.se"
            href="mailto:b2b@bilskrotscentralen.se"
            note="Volymrabatt och fakturabetalning"
          />
        </div>

        <div className="mt-12 glass rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-4">Öppettider</h2>
          <table className="w-full text-sm">
            <tbody className="text-[var(--color-text-secondary)]">
              {[
                ["Måndag–Torsdag", "08:00 — 17:00"],
                ["Fredag", "08:00 — 15:00"],
                ["Lördag", "10:00 — 14:00"],
                ["Söndag", "Stängt"],
                ["Helgdagar", "Stängt"],
              ].map(([day, hours]) => (
                <tr key={day} className="border-b border-[var(--color-dark-500)]/50 last:border-0">
                  <td className="py-3">{day}</td>
                  <td className="py-3 text-right text-[var(--color-text-primary)] font-semibold">{hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
  note,
}: {
  icon: string;
  label: string;
  value: string;
  href: string;
  note: string;
}) {
  return (
    <a
      href={href}
      className="card-hover p-6 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] block group"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">{label}</div>
      <div className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-orange)] transition-colors mb-2">
        {value}
      </div>
      <div className="text-xs text-[var(--color-text-muted)]">{note}</div>
    </a>
  );
}
