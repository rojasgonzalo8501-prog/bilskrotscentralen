"use client";

import { useState, useTransition } from "react";
import { updateLeadStatus, appendLeadNote, assignLeadToMe } from "./actions";

const STATUS_BUTTONS = [
  { status: "IN_PROGRESS", label: "Markera pågår", cls: "bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25" },
  { status: "ANSWERED",    label: "✓ Markera besvarad", cls: "bg-blue-500/15 text-blue-300 border-blue-500/30 hover:bg-blue-500/25" },
  { status: "WON",         label: "🏆 Vunnen (kund köpte)", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25" },
  { status: "LOST",        label: "Förlorad", cls: "bg-[var(--color-dark-500)] text-[var(--color-text-muted)] border-[var(--color-dark-400)] hover:bg-[var(--color-dark-400)]" },
] as const;

export function LeadActions({
  leadId,
  currentStatus,
  isAssigned,
}: {
  leadId: string;
  currentStatus: string;
  isAssigned: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function setStatus(status: string) {
    setError(null);
    startTransition(async () => {
      const r = await updateLeadStatus(leadId, status);
      if (!r.ok) setError(r.error);
    });
  }

  function takeOwnership() {
    setError(null);
    startTransition(async () => {
      const r = await assignLeadToMe(leadId);
      if (!r.ok) setError(r.error);
    });
  }

  return (
    <div className="space-y-2">
      {!isAssigned && (
        <button
          type="button"
          onClick={takeOwnership}
          disabled={pending}
          className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold border border-[var(--color-brand-orange)]/40 bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange-light)] hover:bg-[var(--color-brand-orange)]/20 disabled:opacity-50 transition-colors"
        >
          ✋ Ta över ärendet
        </button>
      )}

      {STATUS_BUTTONS.map((b) => {
        const isCurrent = b.status === currentStatus;
        return (
          <button
            key={b.status}
            type="button"
            onClick={() => setStatus(b.status)}
            disabled={pending || isCurrent}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold border transition-colors disabled:opacity-50 ${b.cls}`}
          >
            {isCurrent ? "● " : ""}{b.label}
          </button>
        );
      })}

      {error && (
        <p className="text-xs text-rose-400 mt-2">{error}</p>
      )}
    </div>
  );
}

export function NoteForm({ leadId }: { leadId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!text.trim()) return;
    setError(null);
    startTransition(async () => {
      const r = await appendLeadNote(leadId, text);
      if (!r.ok) setError(r.error);
      else setText("");
    });
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Lägg till anteckning… (t.ex. 'Ringt — väntar på svar')"
        className="w-full px-3 py-2 bg-[var(--color-dark-800)] border border-[var(--color-dark-500)] rounded-lg text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors resize-y"
      />
      <div className="flex items-center justify-between gap-2">
        <button
          type="submit"
          disabled={pending || !text.trim()}
          className="btn-primary text-sm px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {pending ? "Sparar…" : "+ Lägg till"}
        </button>
        {error && <p className="text-xs text-rose-400">{error}</p>}
      </div>
    </form>
  );
}
