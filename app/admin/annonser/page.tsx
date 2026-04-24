import type { Metadata } from "next";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Annonser — Admin" };
export const dynamic = "force-dynamic";

export default async function AnnonserPage() {
  const [partCount, availableCount, vehicleCount] = await Promise.all([
    db.part.count(),
    db.part.count({ where: { status: "AVAILABLE" } }),
    db.vehicle.count(),
  ]);

  const channels = [
    {
      name: "Bildelsbasen",
      href: "https://www.bildelsbasen.se",
      desc: "Sveriges ledande marknadsplats för begagnade bildelar. Exportera lagerlistan i Bildelsbasen-format.",
      icon: "🏪",
      status: "Manuell export",
    },
    {
      name: "Blocket",
      href: "https://www.blocket.se",
      desc: "Publicera enskilda delar eller hela demonterade bilar direkt på Blocket.",
      icon: "📢",
      status: "Manuell",
    },
    {
      name: "Bilweb",
      href: "https://www.bilweb.se",
      desc: "Kompletterande kanal för begagnade reservdelar.",
      icon: "🌐",
      status: "Manuell",
    },
  ];

  return (
    <section>
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <a href="/admin" className="hover:text-[var(--color-brand-orange)] transition-colors">Admin</a>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Annonser</span>
      </nav>

      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            <span className="gradient-text">Annonser</span>
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Publicera lagret på externa marknadsplatser
          </p>
        </div>
      </div>

      {/* Lager-snapshot */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-xl p-5">
          <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Tillgängliga delar
          </div>
          <div className="text-2xl font-black text-[var(--color-brand-orange)]">
            {availableCount.toLocaleString("sv-SE")}
          </div>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Delar totalt
          </div>
          <div className="text-2xl font-black">{partCount.toLocaleString("sv-SE")}</div>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Fordon i lager
          </div>
          <div className="text-2xl font-black">{vehicleCount.toLocaleString("sv-SE")}</div>
        </div>
      </div>

      {availableCount === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-dark-500)] p-12 text-center mb-8">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-xl font-bold mb-2">Inget lager att annonsera</h2>
          <p className="text-[var(--color-text-secondary)] text-sm mb-6">
            Importera delar via CSV innan du publicerar på externa kanaler.
          </p>
          <a href="/admin/import" className="btn-primary text-sm px-5">
            ⬆ Importera lager →
          </a>
        </div>
      ) : (
        <div className="rounded-xl bg-[var(--color-success)]/5 border border-[var(--color-success)]/30 p-4 mb-8 flex items-center gap-3">
          <span className="text-2xl">✓</span>
          <div>
            <div className="font-semibold text-[var(--color-success-bright)]">
              {availableCount.toLocaleString("sv-SE")} delar redo att annonseras
            </div>
            <div className="text-xs text-[var(--color-text-muted)]">
              Exportera nedan eller lägg in manuellt på respektive plattform.
            </div>
          </div>
        </div>
      )}

      {/* Kanaler */}
      <h2 className="font-bold mb-4">Annonskanaler</h2>
      <div className="space-y-3 mb-10">
        {channels.map((ch) => (
          <div
            key={ch.name}
            className="flex items-center gap-4 rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] p-5"
          >
            <div className="text-3xl shrink-0">{ch.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold">{ch.name}</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{ch.desc}</div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-dark-500)] text-[var(--color-text-muted)]">
                {ch.status}
              </span>
              <a
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs px-3 py-1.5"
              >
                Öppna →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Kommande: automatisk export */}
      <div className="rounded-xl border border-dashed border-[var(--color-dark-500)] p-8 text-center">
        <div className="text-3xl mb-3">🤖</div>
        <h3 className="font-bold mb-1">Automatisk export — kommer snart</h3>
        <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto">
          I nästa fas genereras Bildelsbasen-kompatibel XML automatiskt och kan laddas ner eller skickas direkt via API.
        </p>
      </div>
    </section>
  );
}
