import type { Metadata } from "next";

export const metadata: Metadata = { title: "Förfrågningar — Admin" };

export default function EftersokAdminPage() {
  return (
    <section>
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <a href="/admin" className="hover:text-[var(--color-brand-orange)] transition-colors">Admin</a>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Förfrågningar</span>
      </nav>

      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            <span className="gradient-text">Förfrågningar</span>
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Inkomna eftersökningar från kunder
          </p>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <InfoCard
          icon="📨"
          title="Eftersökningar via e-post"
          desc="Kunder skickar förfrågningar via formuläret på /eftersok. Dessa hamnar i din inkorg på eftersok@bilskrotscentralen.se."
        />
        <InfoCard
          icon="📞"
          title="Telefonsamtal"
          desc="Förfrågningar som kommer in via telefon loggas manuellt när telefonsystemet är kopplat."
        />
        <InfoCard
          icon="💬"
          title="Meddelandehantering"
          desc="I nästa fas kopplas formuläret mot databasen så att alla ärenden hanteras härifrån."
        />
      </div>

      <div className="rounded-xl border border-dashed border-[var(--color-dark-500)] p-12 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold mb-2">Förfrågan-inkorg kommer snart</h2>
        <p className="text-[var(--color-text-secondary)] text-sm max-w-md mx-auto mb-6">
          Just nu skickas eftersökningar direkt till din e-post. När meddelandemodulen
          är aktiv visas alla inkomna förfrågningar och deras status här.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="mailto:eftersok@bilskrotscentralen.se"
            className="btn-primary text-sm px-5"
          >
            Öppna e-post →
          </a>
          <a href="/eftersok" className="btn-secondary text-sm px-5" target="_blank" rel="noopener noreferrer">
            Se kundformuläret
          </a>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] p-5">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold mb-1 text-sm">{title}</h3>
      <p className="text-xs text-[var(--color-text-muted)]">{desc}</p>
    </div>
  );
}
