import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { getBrand } from "@/lib/codelist";
import NewPartForm from "./NewPartForm";

export const metadata: Metadata = { title: "Ny del — Admin" };
export const dynamic = "force-dynamic";

export default async function NewPartPage() {
  const vehicles = await db.vehicle.findMany({
    where: { status: { in: ["DISMANTLING", "DISMANTLED"] } },
    orderBy: { arrivedAt: "desc" },
    take: 200,
  });

  const options = vehicles.map((v) => {
    const brand = getBrand(v.brandSlug);
    return {
      id: v.id,
      stockNumber: v.stockNumber,
      label: `${v.stockNumber} — ${brand?.name ?? v.brandSlug} ${v.model}${v.year ? ` (${v.year})` : ""}`,
    };
  });

  return (
    <section className="space-y-6">
      <nav className="text-xs text-[var(--color-text-muted)] flex items-center gap-2">
        <Link href="/admin" className="hover:text-[var(--color-brand-orange)] transition-colors">Admin</Link>
        <span>›</span>
        <Link href="/admin/delar" className="hover:text-[var(--color-brand-orange)] transition-colors">Delar</Link>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Ny del</span>
      </nav>

      <header>
        <h1 className="text-3xl font-black tracking-tight">
          <span className="gradient-text">Ny del</span>
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Skapa en del kopplad till en befintlig donorbil.
        </p>
      </header>

      {options.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-dark-500)] p-12 text-center">
          <h2 className="text-lg font-bold mb-2">Inga bilar i lager</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            Lägg till en donorbil innan du skapar delar.
          </p>
          <Link href="/admin/bilar/ny" className="btn-primary inline-flex px-4 py-2 rounded-lg text-sm">
            + Lägg till bil
          </Link>
        </div>
      ) : (
        <div className="glass rounded-xl p-6">
          <NewPartForm vehicles={options} />
        </div>
      )}
    </section>
  );
}
