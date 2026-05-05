import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kunder — Admin" };

export default function KunderPage() {
  return (
    <section>
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <a href="/admin" className="hover:text-[var(--color-brand-orange)] transition-colors">Admin</a>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Kunder</span>
      </nav>

      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            <span className="gradient-text">Kunder</span>
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Kundregister och orderhistorik
          </p>
        </div>
        <a
          href="/api/admin/export/kunder"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)] transition-colors"
        >
          ⬇ Exportera CSV
        </a>
      </div>

      <div className="rounded-xl border border-dashed border-[var(--color-dark-500)] p-16 text-center max-w-lg mx-auto">
        <div className="text-5xl mb-4">👤</div>
        <h2 className="text-xl font-bold mb-2">Inga kunder registrerade</h2>
        <p className="text-[var(--color-text-secondary)] text-sm max-w-sm mx-auto mb-6">
          Kundregister byggs upp automatiskt när den första ordern kommer in via kassan.
          Kunder som skapar konto visas också här.
        </p>
        <a href="/admin" className="btn-primary text-sm px-5">
          ← Tillbaka till Dashboard
        </a>
      </div>
    </section>
  );
}
