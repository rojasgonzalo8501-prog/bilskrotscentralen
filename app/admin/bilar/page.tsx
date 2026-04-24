import type { Metadata } from "next";
import { db } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getBrand } from "@/lib/codelist";

export const metadata: Metadata = { title: "Bilar — Admin" };
export const dynamic = "force-dynamic";

export default async function BilarPage() {
  const vehicles = await db.vehicle.findMany({
    orderBy: { arrivedAt: "desc" },
    include: { _count: { select: { parts: true } } },
  });

  return (
    <section>
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <a href="/admin" className="hover:text-[var(--color-brand-orange)] transition-colors">Admin</a>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Bilar</span>
      </nav>

      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            <span className="gradient-text">Bilar</span>
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {vehicles.length} fordon registrerade
          </p>
        </div>
        <Link href="/admin/bilar/ny" className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm">
          <Plus size={16} /> Ny bil
        </Link>
      </div>

      {vehicles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-dark-500)] p-12 text-center">
          <div className="text-5xl mb-4">🚗</div>
          <h2 className="text-xl font-bold mb-2">Inga bilar registrerade</h2>
          <p className="text-[var(--color-text-secondary)] text-sm mb-6">Registrera din första bil för demontering.</p>
          <Link href="/admin/bilar/ny" className="btn-primary">+ Registrera bil</Link>
        </div>
      ) : (
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                <tr className="border-b border-[var(--color-dark-500)]">
                  <th className="text-left px-6 py-3 font-semibold">Lagernr</th>
                  <th className="text-left px-6 py-3 font-semibold">Märke / Modell</th>
                  <th className="text-left px-6 py-3 font-semibold">År</th>
                  <th className="text-left px-6 py-3 font-semibold">Reg</th>
                  <th className="text-right px-6 py-3 font-semibold">Delar</th>
                  <th className="text-left px-6 py-3 font-semibold">Status</th>
                  <th className="text-left px-6 py-3 font-semibold">Inkom</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => {
                  const brand = getBrand(v.brandSlug);
                  return (
                    <tr key={v.id} className="border-b border-[var(--color-dark-500)]/50 hover:bg-white/[0.02]">
                      <td className="px-6 py-3 font-mono text-xs">{v.stockNumber}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{brand?.logo ?? "🚗"}</span>
                          <div>
                            <div className="font-semibold">{brand?.name ?? v.brandSlug}</div>
                            <div className="text-xs text-[var(--color-text-muted)]">{v.model}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-[var(--color-text-secondary)]">{v.year ?? "—"}</td>
                      <td className="px-6 py-3 font-mono text-xs">{v.registration ?? "—"}</td>
                      <td className="px-6 py-3 text-right text-[var(--color-brand-orange)] font-semibold">{v._count.parts}</td>
                      <td className="px-6 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          v.status === "DISMANTLING" ? "bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange-light)]" :
                          v.status === "DISMANTLED" ? "bg-[var(--color-success)]/10 text-[var(--color-success-bright)]" :
                          "bg-[var(--color-dark-500)] text-[var(--color-text-muted)]"
                        }`}>
                          {v.status === "DISMANTLING" ? "Demonteras" : v.status === "DISMANTLED" ? "Demonterad" : "Skrotad"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-xs text-[var(--color-text-muted)]">{v.arrivedAt.toISOString().slice(0, 10)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
