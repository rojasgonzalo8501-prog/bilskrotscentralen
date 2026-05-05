import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import type { PartStatus } from "@/lib/generated/prisma/enums";
import { PartsBulkTable } from "./PartsBulkTable";

export const metadata: Metadata = { title: "Delar — Admin" };
export const dynamic = "force-dynamic";

export default async function DelarPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const status = sp.status ?? "AVAILABLE";
  const q = sp.q ?? "";
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const pageSize = 50;

  const VALID_STATUSES = new Set(["AVAILABLE", "RESERVED", "SOLD", "WITHDRAWN"]);
  const where = {
    ...(status !== "all" && VALID_STATUSES.has(status)
      ? { status: status as PartStatus }
      : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { sku: { contains: q } },
            { oeNumber: { contains: q } },
          ],
        }
      : {}),
  };

  const [parts, total] = await Promise.all([
    db.part.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { vehicle: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.part.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <section>
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <Link href="/admin" className="hover:text-[var(--color-brand-orange)] transition-colors">Admin</Link>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Delar</span>
      </nav>

      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            <span className="gradient-text">Delar</span>
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {total.toLocaleString("sv-SE")} delar matchar filter
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/delar/ny" className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm">
            + Ny del
          </Link>
          <Link
            href="/admin/import"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)] transition-colors"
          >
            ⬆ Importera delar
          </Link>
          <a
            href="/api/admin/export/delar"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)] transition-colors"
          >
            ⬇ Exportera CSV
          </a>
        </div>
      </div>

      {/* Filters */}
      <form method="get" className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Sök SKU, namn, OE-nummer…"
          className="flex-1 min-w-48 bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)]"
        />
        <select
          name="status"
          defaultValue={status}
          className="bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)]"
        >
          <option value="all">Alla statusar</option>
          <option value="AVAILABLE">Tillgängliga</option>
          <option value="RESERVED">Reserverade</option>
          <option value="SOLD">Sålda</option>
          <option value="WITHDRAWN">Dragna</option>
        </select>
        <button type="submit" className="btn-primary px-4 py-2 text-sm rounded-lg">
          Filtrera
        </button>
      </form>

      {parts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-dark-500)] p-12 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-xl font-bold mb-2">Inga delar hittades</h2>
          <p className="text-[var(--color-text-secondary)] text-sm">
            {total === 0
              ? "Importera delar via CSV för att komma igång."
              : "Prova ett annat filter eller sökord."}
          </p>
        </div>
      ) : (
        <>
          <PartsBulkTable
            parts={parts.map((p) => ({
              id: p.id,
              sku: p.sku,
              name: p.name,
              oeNumber: p.oeNumber,
              priceSek: p.priceSek,
              status: p.status,
              condition: p.condition,
              vehicle: {
                brandSlug: p.vehicle.brandSlug,
                model: p.vehicle.model,
                year: p.vehicle.year,
              },
            }))}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-[var(--color-text-muted)]">
                Sida {page} av {totalPages} ({total.toLocaleString("sv-SE")} totalt)
              </div>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`?status=${status}&q=${q}&page=${page - 1}`}
                    className="px-3 py-1.5 text-xs rounded-lg border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)] transition-colors"
                  >
                    ← Föregående
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`?status=${status}&q=${q}&page=${page + 1}`}
                    className="px-3 py-1.5 text-xs rounded-lg border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)] transition-colors"
                  >
                    Nästa →
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
