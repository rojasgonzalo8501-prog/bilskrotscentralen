import type { Metadata } from "next";
import Link from "next/link";
import { EftersokForm } from "./EftersokForm";

export const metadata: Metadata = {
  title: "Eftersök en bildel — vi hittar exakt det du söker",
  description:
    "Hittar du inte din bildel? Skicka en eftersökning så letar vi i vårt fysiska lager med 30 000+ delar. Svar inom 24 h. Helt gratis.",
};

export default function EftersokPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-10 pb-12">
        <img src="/images/diagnos.jpeg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--color-brand-orange)] opacity-[0.05] rounded-full blur-[120px]" />

        <div className="relative max-w-4xl mx-auto px-4">
          <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--color-brand-orange)]">Hem</Link>
            <span>›</span>
            <span className="text-[var(--color-text-secondary)]">Eftersökning</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            <span className="gradient-text">Eftersök</span> en bildel
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mb-8">
            Vi har 30 000+ delar i fysiskt lager — varav bara en del är digitaliserade än.
            Skicka en eftersökning så letar Adam personligen. Svar inom 24 h. Helt gratis.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-20">
        <EftersokForm />

        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          {[
            { icon: "⏱️", title: "Svar inom 24 h", desc: "Adam återkommer personligen" },
            { icon: "🆓", title: "Helt gratis", desc: "Inga åtaganden, inga avgifter" },
            { icon: "🔍", title: "Vi söker fysiskt", desc: "I hela lagret, inte bara online" },
          ].map((b) => (
            <div key={b.title} className="p-5 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-center">
              <div className="text-3xl mb-2">{b.icon}</div>
              <h3 className="font-semibold mb-1">{b.title}</h3>
              <p className="text-xs text-[var(--color-text-muted)]">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
        {label}
        {required && " *"}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-xl text-base placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-all"
      />
    </label>
  );
}
