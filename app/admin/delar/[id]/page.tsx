import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getBrand } from "@/lib/codelist";
import EditPartForm from "./EditPartForm";
import ImageManager from "./ImageManager";

export const metadata: Metadata = { title: "Redigera del — Admin" };
export const dynamic = "force-dynamic";

export default async function EditPartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const part = await db.part.findUnique({
    where: { id },
    include: {
      vehicle: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!part) notFound();

  const brand = getBrand(part.vehicle.brandSlug);

  return (
    <section className="space-y-8">
      <nav className="text-xs text-[var(--color-text-muted)] flex items-center gap-2">
        <Link href="/admin" className="hover:text-[var(--color-brand-orange)] transition-colors">Admin</Link>
        <span>›</span>
        <Link href="/admin/delar" className="hover:text-[var(--color-brand-orange)] transition-colors">Delar</Link>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)] font-mono">{part.sku}</span>
      </nav>

      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            <span className="gradient-text">{part.name}</span>
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1 flex items-center gap-2">
            <span>{brand?.logo ?? "🚗"}</span>
            <span>
              {brand?.name ?? part.vehicle.brandSlug} {part.vehicle.model}
              {part.vehicle.year ? ` · ${part.vehicle.year}` : ""} · lager {part.vehicle.stockNumber}
            </span>
          </p>
        </div>
      </header>

      <div className="glass rounded-xl p-6">
        <ImageManager
          partId={part.id}
          initial={part.images.map((i) => ({
            id: i.id,
            url: i.url,
            alt: i.alt,
            sortOrder: i.sortOrder,
          }))}
        />
      </div>

      <div className="glass rounded-xl p-6">
        <EditPartForm
          part={{
            id: part.id,
            sku: part.sku,
            name: part.name,
            partCode: part.partCode,
            oeNumber: part.oeNumber,
            position: part.position,
            priceSek: part.priceSek,
            condition: part.condition,
            status: part.status,
            notes: part.notes,
          }}
        />
      </div>
    </section>
  );
}
