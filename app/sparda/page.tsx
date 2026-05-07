import type { Metadata } from "next";
import { SpardaClient } from "./SpardaClient";

export const metadata: Metadata = {
  title: "Sparda delar — Bilskrotscentralen",
  description:
    "Dina sparade bildelar — kom tillbaka när du är redo att slå till.",
  robots: { index: false, follow: false },
};

export default function SpardaPage() {
  return (
    <main className="min-h-screen bg-[var(--color-dark-900)]">
      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <div className="mb-8">
          <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">
            Min lista
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            <span className="gradient-text">Sparda delar</span>
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Sparade lokalt på den här enheten — ingen inloggning krävs.
          </p>
        </div>

        <SpardaClient />
      </div>
    </main>
  );
}
