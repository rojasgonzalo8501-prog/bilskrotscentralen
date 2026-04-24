"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { savePartAction, deletePartAction } from "./actions";

type Part = {
  id: string;
  sku: string;
  name: string;
  partCode: string | null;
  oeNumber: string | null;
  position: number | null;
  priceSek: number | null;
  condition: string;
  status: string;
  notes: string | null;
};

const CONDITIONS: { value: string; label: string }[] = [
  { value: "NEW",           label: "Ny" },
  { value: "USED_LIKE_NEW", label: "Begagnad (som ny)" },
  { value: "USED_GOOD",     label: "Begagnad (bra)" },
  { value: "USED_OK",       label: "Begagnad (ok)" },
  { value: "USED_POOR",     label: "Begagnad (sliten)" },
];

const STATUSES: { value: string; label: string }[] = [
  { value: "AVAILABLE", label: "Tillgänglig" },
  { value: "RESERVED",  label: "Reserverad" },
  { value: "SOLD",      label: "Såld" },
  { value: "WITHDRAWN", label: "Dragen" },
];

export default function EditPartForm({ part }: { part: Part }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    start(async () => {
      try {
        await savePartAction(part.id, form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Något gick fel");
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Radera ${part.sku}? Detta går inte att ångra.`)) return;
    start(() => deletePartAction(part.id));
  }

  const input =
    "w-full bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)]";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">SKU</span>
          <input
            value={part.sku}
            readOnly
            className={`${input} opacity-60 cursor-not-allowed mt-1`}
          />
        </label>
        <label className="block">
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Namn *</span>
          <input name="name" defaultValue={part.name} required className={`${input} mt-1`} />
        </label>

        <label className="block">
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Pris (kr)</span>
          <input
            type="number"
            name="priceSek"
            min="0"
            step="1"
            defaultValue={part.priceSek ?? ""}
            className={`${input} mt-1`}
          />
        </label>
        <label className="block">
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">OE-nummer</span>
          <input name="oeNumber" defaultValue={part.oeNumber ?? ""} className={`${input} mt-1`} />
        </label>

        <label className="block">
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Skick *</span>
          <select name="condition" defaultValue={part.condition} className={`${input} mt-1`}>
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Status *</span>
          <select name="status" defaultValue={part.status} className={`${input} mt-1`}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Del-kod (Bildelsbasen)</span>
          <input name="partCode" defaultValue={part.partCode ?? ""} className={`${input} mt-1`} />
        </label>
        <label className="block">
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Position (0–45)</span>
          <input
            type="number"
            name="position"
            min="0"
            max="45"
            defaultValue={part.position ?? ""}
            className={`${input} mt-1`}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Anteckningar (visas även publikt som beskrivning)</span>
        <textarea
          name="notes"
          rows={5}
          defaultValue={part.notes ?? ""}
          className={`${input} mt-1 resize-y`}
          placeholder="T.ex. plats i lagret, defekter, eller beskrivning för kunder…"
        />
      </label>

      {error && (
        <div className="rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 px-4 py-3 text-sm text-[var(--color-error)]">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          className="text-sm text-[var(--color-error)] hover:underline disabled:opacity-50"
        >
          Radera del
        </button>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-[var(--color-success-bright)]">✓ Sparat</span>}
          <button type="submit" disabled={pending} className="btn-primary px-5 py-2 rounded-lg text-sm disabled:opacity-50">
            {pending ? "Sparar…" : "Spara ändringar"}
          </button>
        </div>
      </div>
    </form>
  );
}
