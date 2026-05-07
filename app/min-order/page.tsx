import type { Metadata } from "next";
import Link from "next/link";
import { FindOrderForm } from "./FindOrderForm";

export const metadata: Metadata = {
  title: "Hitta min order — Bilskrotscentralen",
  robots: { index: false, follow: false },
};

export default function FindOrderPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">📦</div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            Hitta min order
          </h1>
          <p className="text-sm text-slate-600">
            Skriv in e-posten du beställde med så mejlar vi spårningslänkarna
            till alla dina ordrar.
          </p>
        </div>

        <FindOrderForm />

        <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
          <p>
            Behöver du hjälp? Ring{" "}
            <a href="tel:017121002" className="text-[var(--color-brand-orange)] font-semibold">
              0171-210 02
            </a>
          </p>
          <p>
            <Link href="/" className="hover:text-slate-900 transition-colors">
              ← Till startsidan
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
