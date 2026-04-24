"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Img = { id: string; url: string; alt: string | null; sortOrder: number };

export default function ImageManager({ partId, initial }: { partId: string; initial: Img[] }) {
  const router = useRouter();
  const [images, setImages] = useState<Img[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, start] = useTransition();

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch(`/api/admin/parts/${partId}/images`, { method: "POST", body: fd });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `Upload misslyckades (${res.status})`);
        }
        const img: Img = await res.json();
        setImages((cur) => [...cur, img]);
      }
      start(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload misslyckades");
    } finally {
      setUploading(false);
    }
  }

  async function remove(imageId: string) {
    if (!confirm("Ta bort bilden?")) return;
    setError(null);
    const res = await fetch(`/api/admin/parts/${partId}/images?imageId=${imageId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setError("Kunde inte ta bort bilden");
      return;
    }
    setImages((cur) => cur.filter((i) => i.id !== imageId));
    start(() => router.refresh());
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          Bilder ({images.length}/20)
        </h2>
        <label className="btn-primary inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs cursor-pointer">
          {uploading ? "Laddar upp…" : "+ Lägg till"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            disabled={uploading || images.length >= 20}
            onChange={(e) => upload(e.currentTarget.files)}
            className="hidden"
          />
        </label>
      </div>

      {images.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-dark-500)] p-8 text-center text-sm text-[var(--color-text-muted)]">
          Inga bilder ännu. Lägg till JPEG/PNG/WebP (max 10 MB per fil).
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group rounded-lg overflow-hidden border border-[var(--color-dark-500)] aspect-square bg-[var(--color-dark-700)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt ?? ""} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(img.id)}
                className="absolute top-1 right-1 w-7 h-7 rounded-full bg-black/70 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--color-error)]"
                aria-label="Ta bort bild"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 px-3 py-2 text-xs text-[var(--color-error)]">
          {error}
        </div>
      )}

    </div>
  );
}
