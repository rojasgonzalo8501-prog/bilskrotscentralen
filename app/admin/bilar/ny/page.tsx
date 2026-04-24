import type { Metadata } from "next";
import { nextStockNumberAction } from "./actions";
import NyBilForm from "./NyBilForm";

export const metadata: Metadata = { title: "Ny bil — Admin" };

export default async function NyBilPage() {
  const suggestedStockNumber = await nextStockNumberAction();

  return (
    <section>
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <a href="/admin" className="hover:text-[var(--color-brand-orange)] transition-colors">Admin</a>
        <span>›</span>
        <a href="/admin/bilar" className="hover:text-[var(--color-brand-orange)] transition-colors">Bilar</a>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Ny bil</span>
      </nav>

      <h1 className="text-3xl font-black tracking-tight mb-8">
        Registrera <span className="gradient-text">ny bil</span>
      </h1>

      <NyBilForm suggestedStockNumber={suggestedStockNumber} />
    </section>
  );
}
