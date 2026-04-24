import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sidan hittades inte — Bilskrotscentralen",
};

export default function NotFound() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-7xl mb-6">🔩</div>
      <h1 className="text-4xl font-black mb-3">
        <span className="gradient-text">404</span> — Sidan hittades inte
      </h1>
      <p className="text-[var(--color-text-secondary)] text-lg mb-8">
        Delen du letar efter kanske är slutsåld, eller så har länken ändrats.
        Prova att söka bland våra tillgängliga delar.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/bildelar" className="btn-primary">
          Sök bildelar →
        </Link>
        <a
          href="/eftersok"
          className="px-6 py-3 rounded-xl border border-[var(--color-dark-500)] text-[var(--color-text-secondary)] hover:border-[var(--color-brand-orange)] hover:text-[var(--color-text-primary)] transition-all font-semibold"
        >
          Skicka eftersökning
        </a>
      </div>
      <p className="mt-10 text-sm text-[var(--color-text-muted)]">
        Hittar du fortfarande inte? Ring oss på{" "}
        <a href="tel:+46171210002" className="text-[var(--color-brand-orange)] hover:underline">
          0171-210 02
        </a>
      </p>
    </section>
  );
}
