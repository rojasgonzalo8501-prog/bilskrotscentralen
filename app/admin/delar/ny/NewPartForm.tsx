"use client";

import { useState, useTransition } from "react";
import { createPartAction } from "./actions";

type VehicleOpt = {
  id: string;
  stockNumber: string;
  label: string;
};

const CONDITIONS = [
  { value: "NEW",           label: "Ny" },
  { value: "USED_LIKE_NEW", label: "Begagnad (som ny)" },
  { value: "USED_GOOD",     label: "Begagnad (bra)" },
  { value: "USED_OK",       label: "Begagnad (ok)" },
  { value: "USED_POOR",     label: "Begagnad (sliten)" },
];

export default function NewPartForm({ vehicles }: { vehicles: VehicleOpt[] }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    start(async () => {
      try {
        await createPartAction(form);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Något gick fel";
        if (msg.includes("NEXT_REDIRECT")) return;
        setError(msg);
      }
    });
  }

  const input =
    "w-full bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)]";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Bil (donor) *</span>
        <select name="vehicleId" required defaultValue="" className={`${input} mt-1`}>
          <option value="" disabled>
            — Välj bil —
          </option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Namn *</span>
          <input name="name" required placeholder="t.ex. Framstötfångare" className={`${input} mt-1`} />
        </label>
        <label className="block">
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">SKU (valfri — genereras automatiskt)</span>
          <input name="sku" placeholder="t.ex. M-2024-0142-A47" className={`${input} mt-1`} />
        </label>

        <label className="block">
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Pris (kr)</span>
          <input type="number" name="priceSek" min="0" step="1" className={`${input} mt-1`} />
        </label>
        <label className="block">
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">OE-nummer</span>
          <input name="oeNumber" className={`${input} mt-1`} />
        </label>

        <label className="block">
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Skick</span>
          <select name="condition" defaultValue="USED_GOOD" className={`${input} mt-1`}>
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Status</span>
          <select name="status" defaultValue="AVAILABLE" className={`${input} mt-1`}>
            <option value="AVAILABLE">Tillgänglig</option>
            <option value="RESERVED">Reserverad</option>
            <option value="SOLD">Såld</option>
            <option value="WITHDRAWN">Dragen</option>
          </select>
        </label>

        <label className="block">
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Del-kod (Bildelsbasen)</span>
          <input name="partCode" className={`${input} mt-1`} />
        </label>
        <label className="block">
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Position (0–45)</span>
          <input type="number" name="position" min="0" max="45" className={`${input} mt-1`} />
        </label>
      </div>

      <label className="block">
        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Beskrivning / anteckningar</span>
        <textarea name="notes" rows={4} className={`${input} mt-1 resize-y`} placeholder="Beskrivning som visas för kunder, plats i lager, defekter…" />
      </label>

      {error && (
        <div className="rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 px-4 py-3 text-sm text-[var(--color-error)]">
          {error}
        </div>
      )}

      <p className="text-xs text-[var(--color-text-muted)]">
        Bilder laddar du upp efter att delen skapats.
      </p>

      <button type="submit" disabled={pending} className="btn-primary px-5 py-2 rounded-lg text-sm disabled:opacity-50">
        {pending ? "Skapar…" : "Skapa del"}
      </button>
    </form>
  );
}
