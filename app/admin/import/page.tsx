"use client";

import { useActionState } from "react";
import Link from "next/link";
import { uploadInventoryAction, type ImportActionState } from "./actions";

const initial: ImportActionState = null;

export default function ImportPage() {
  const [state, formAction, pending] = useActionState(
    uploadInventoryAction,
    initial,
  );

  return (
    <section>
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--color-brand-orange)] transition-colors">Hem</Link>
        <span>›</span>
        <a href="/admin" className="hover:text-[var(--color-brand-orange)] transition-colors">Admin</a>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Importera lager</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-black mb-3">
        Importera <span className="gradient-text">lager</span>
      </h1>
      <p className="text-[var(--color-text-secondary)] mb-10 max-w-2xl">
        Ladda upp Adams lagerexport som CSV. Importera <strong>fordonen först</strong>,
        sen delarna — varje del måste referera ett befintligt <code className="text-[var(--color-brand-orange)]">stockNumber</code>.
        Filer kan laddas upp om — uppdaterar befintliga rader istället för att duplicera.
      </p>

      {/* ─── Templates ─── */}
      <div className="glass rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold mb-3">📄 Mallar</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
          Ladda ner, fyll i, ladda upp. Kolumnnamnen i headern måste matcha exakt.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/templates/vehicles_template.csv"
            download
            className="btn-secondary text-sm"
          >
            ⬇ vehicles_template.csv
          </a>
          <a
            href="/templates/parts_template.csv"
            download
            className="btn-secondary text-sm"
          >
            ⬇ parts_template.csv
          </a>
        </div>
      </div>

      {/* ─── Upload form ─── */}
      <form action={formAction} className="glass rounded-xl p-6 mb-8 space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2">Filtyp</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="kind"
                value="vehicles"
                defaultChecked
                className="accent-[var(--color-brand-orange)]"
              />
              <span className="text-sm">Fordon (vehicles)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="kind"
                value="parts"
                className="accent-[var(--color-brand-orange)]"
              />
              <span className="text-sm">Delar (parts)</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="file">
            CSV-fil
          </label>
          <input
            id="file"
            type="file"
            name="file"
            accept=".csv,text/csv"
            required
            className="block w-full text-sm text-[var(--color-text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-brand-orange)] file:text-white file:cursor-pointer hover:file:bg-[var(--color-brand-orange-light)]"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Importerar…" : "Ladda upp & importera"}
        </button>
      </form>

      {/* ─── Result ─── */}
      {state && state.ok && (
        <div className="rounded-xl p-6 border border-[var(--color-success)]/40 bg-[var(--color-success)]/5">
          <h3 className="text-lg font-bold text-[var(--color-success-bright)] mb-3">
            ✓ Import klar — {state.kind === "vehicles" ? "fordon" : "delar"}
          </h3>
          <ul className="text-sm space-y-1">
            <li>
              <strong>{state.result.rowsImported}</strong> rader importerade
            </li>
            {state.result.rowsSkipped > 0 && (
              <li className="text-[var(--color-error)]">
                <strong>{state.result.rowsSkipped}</strong> rader hoppade över
              </li>
            )}
            <li className="text-[var(--color-text-muted)] text-xs">
              Batch ID: <code>{state.result.batchId}</code>
            </li>
          </ul>
          {state.result.errors.length > 0 && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-semibold text-[var(--color-error)]">
                Visa {state.result.errors.length} fel
              </summary>
              <ul className="mt-3 space-y-1 text-xs font-mono">
                {state.result.errors.map((e, i) => (
                  <li key={i} className="text-[var(--color-text-secondary)]">
                    Rad {e.row}: {e.message}
                  </li>
                ))}
              </ul>
            </details>
          )}
          <div className="mt-4">
            <a
              href="/admin/inventory"
              className="text-sm text-[var(--color-brand-orange)] hover:underline"
            >
              Se lagret →
            </a>
          </div>
        </div>
      )}

      {state && !state.ok && (
        <div className="rounded-xl p-6 border border-[var(--color-error)]/40 bg-[var(--color-error)]/5">
          <h3 className="text-lg font-bold text-[var(--color-error)] mb-2">
            ✗ Import misslyckades
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">{state.error}</p>
        </div>
      )}
    </section>
  );
}
