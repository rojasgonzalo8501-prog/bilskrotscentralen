import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Mail, Phone, Package, Car, FileText, ExternalLink } from "lucide-react";
import { LeadActions, NoteForm } from "./LeadActions";

export const metadata: Metadata = { title: "Förfrågan — Admin" };
export const dynamic = "force-dynamic";

const STATUS_PILL: Record<string, { label: string; cls: string }> = {
  NEW:         { label: "Ny",       cls: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  IN_PROGRESS: { label: "Pågår",    cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  ANSWERED:    { label: "Besvarad", cls: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  WON:         { label: "Vunnen",   cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  LOST:        { label: "Förlorad", cls: "bg-[var(--color-dark-500)] text-[var(--color-text-muted)] border-[var(--color-dark-400)]" },
};

const KIND_LABEL: Record<string, string> = {
  PRICE_INQUIRY: "Pris-förfrågan",
  EFTERSOK: "Eftersökning",
};

function fmtFullDate(d: Date) {
  return d.toLocaleString("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await db.lead.findUnique({
    where: { id },
    include: { assignedTo: { select: { name: true, username: true } } },
  });

  if (!lead) notFound();

  const status = STATUS_PILL[lead.status];
  const replySubject = lead.sku
    ? `Re: Pris-förfrågan ${lead.sku} — Bilskrotscentralen`
    : `Re: Eftersökning ${lead.brand ?? ""} ${lead.model ?? ""} — Bilskrotscentralen`;
  const replyBody = `Hej ${lead.name},\n\nTack för din förfrågan!\n\n[skriv svaret här]\n\nMed vänlig hälsning\nAdam — Bilskrotscentralen\n0171-210 02`;
  const mailtoHref = `mailto:${lead.email}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`;

  return (
    <section>
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <Link href="/admin" className="hover:text-[var(--color-brand-orange)]">Admin</Link>
        <span>›</span>
        <Link href="/admin/eftersok" className="hover:text-[var(--color-brand-orange)]">Förfrågningar</Link>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)] truncate">{lead.name}</span>
      </nav>

      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">
            {KIND_LABEL[lead.kind] ?? lead.kind}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            {lead.partName ?? lead.name}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-bold border ${status.cls}`}>
              {status.label}
            </span>
            {lead.assignedTo && (
              <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">
                Tilldelad: {lead.assignedTo.name}
              </span>
            )}
            <span className="text-xs text-[var(--color-text-muted)]">
              · Inkom {fmtFullDate(lead.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[2fr,1fr] gap-6">
        {/* Left — message + notes */}
        <div className="space-y-5">
          {/* Customer message */}
          <div className="rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] p-5">
            <h2 className="font-bold mb-3 flex items-center gap-2">
              <FileText size={16} /> Meddelande från kund
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap leading-relaxed">
              {lead.message}
            </p>
          </div>

          {/* Notes */}
          <div className="rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] p-5">
            <h2 className="font-bold mb-3">Anteckningar</h2>
            {lead.notes ? (
              <pre className="text-xs text-[var(--color-text-secondary)] whitespace-pre-wrap font-sans leading-relaxed mb-4 max-h-[400px] overflow-y-auto">
                {lead.notes}
              </pre>
            ) : (
              <p className="text-xs text-[var(--color-text-muted)] mb-4 italic">
                Inga anteckningar ännu.
              </p>
            )}
            <NoteForm leadId={lead.id} />
          </div>
        </div>

        {/* Right — actions + context */}
        <div className="space-y-5">
          {/* Quick reply */}
          <div className="rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] p-5">
            <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              Svara
            </h3>
            <a
              href={mailtoHref}
              className="btn-primary block text-center py-3 rounded-lg text-sm"
            >
              📧 Öppna svar i e-post
            </a>
            <a
              href={`tel:${lead.phone}`}
              className="block text-center mt-2 text-sm font-semibold text-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange-light)]"
            >
              📞 Ring {lead.phone}
            </a>
          </div>

          {/* Status actions */}
          <div className="rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] p-5">
            <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              Åtgärder
            </h3>
            <LeadActions
              leadId={lead.id}
              currentStatus={lead.status}
              isAssigned={Boolean(lead.assignedToId)}
            />
          </div>

          {/* Customer context */}
          <div className="rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] p-5">
            <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              Kontakt
            </h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Namn</dt>
                <dd className="font-semibold">{lead.name}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">E-post</dt>
                <dd>
                  <a href={`mailto:${lead.email}`} className="text-[var(--color-brand-orange)] hover:underline inline-flex items-center gap-1">
                    <Mail size={12} /> {lead.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Telefon</dt>
                <dd>
                  <a href={`tel:${lead.phone}`} className="text-[var(--color-brand-orange)] hover:underline inline-flex items-center gap-1">
                    <Phone size={12} /> {lead.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          {/* Vehicle / Part context */}
          {(lead.sku || lead.regnr || lead.brand || lead.model) && (
            <div className="rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] p-5">
              <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                Bil & del
              </h3>
              <dl className="space-y-2 text-sm">
                {lead.sku && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">SKU</dt>
                    <dd>
                      <a
                        href={`/bildelar/${lead.sku}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[var(--color-brand-orange)] hover:underline inline-flex items-center gap-1"
                      >
                        <Package size={12} /> {lead.sku}
                        <ExternalLink size={10} />
                      </a>
                    </dd>
                  </div>
                )}
                {lead.partName && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Del</dt>
                    <dd className="font-semibold">{lead.partName}</dd>
                  </div>
                )}
                {(lead.brand || lead.model || lead.year) && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Bil</dt>
                    <dd className="inline-flex items-center gap-1">
                      <Car size={12} />
                      {[lead.brand, lead.model, lead.year].filter(Boolean).join(" ")}
                    </dd>
                  </div>
                )}
                {lead.regnr && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Regnr</dt>
                    <dd className="font-mono">{lead.regnr}</dd>
                  </div>
                )}
                {lead.vin && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">VIN</dt>
                    <dd className="font-mono text-xs">{lead.vin}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
