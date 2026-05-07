import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Search, Mail, Phone, Package, Car } from "lucide-react";

export const metadata: Metadata = { title: "Förfrågningar — Admin" };
export const dynamic = "force-dynamic";

type StatusFilter = "all" | "open" | "new" | "in_progress" | "answered" | "won" | "lost";

const STATUS_PILL: Record<string, { label: string; cls: string }> = {
  NEW:         { label: "Ny",       cls: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  IN_PROGRESS: { label: "Pågår",    cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  ANSWERED:    { label: "Besvarad", cls: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  WON:         { label: "Vunnen",   cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  LOST:        { label: "Förlorad", cls: "bg-[var(--color-dark-500)] text-[var(--color-text-muted)] border-[var(--color-dark-400)]" },
};

const KIND_PILL: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  PRICE_INQUIRY: {
    label: "Pris-förfrågan",
    cls: "bg-[var(--color-brand-orange)]/15 text-[var(--color-brand-orange-light)]",
    icon: <Package size={11} />,
  },
  EFTERSOK: {
    label: "Eftersökning",
    cls: "bg-blue-500/15 text-blue-300",
    icon: <Search size={11} />,
  },
};

function formatDate(d: Date) {
  const now = Date.now();
  const diff = now - d.getTime();
  if (diff < 60_000) return "just nu";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min sen`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} h sen`;
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)} dagar sen`;
  return d.toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
}

export default async function EftersokAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: StatusFilter; q?: string }>;
}) {
  const { status: statusFilter = "open", q = "" } = await searchParams;

  type LeadStatusLiteral = "NEW" | "IN_PROGRESS" | "ANSWERED" | "WON" | "LOST";
  const openStatuses: LeadStatusLiteral[] = ["NEW", "IN_PROGRESS"];
  const statusWhere: { status?: LeadStatusLiteral | { in: LeadStatusLiteral[] } } = (() => {
    switch (statusFilter) {
      case "all":         return {};
      case "open":        return { status: { in: openStatuses } };
      case "new":         return { status: "NEW" };
      case "in_progress": return { status: "IN_PROGRESS" };
      case "answered":    return { status: "ANSWERED" };
      case "won":         return { status: "WON" };
      case "lost":        return { status: "LOST" };
    }
  })();

  const term = q.trim();
  const searchWhere = term
    ? {
        OR: [
          { name:     { contains: term, mode: "insensitive" } },
          { email:    { contains: term, mode: "insensitive" } },
          { phone:    { contains: term } },
          { sku:      { contains: term, mode: "insensitive" } },
          { regnr:    { contains: term, mode: "insensitive" } },
          { partName: { contains: term, mode: "insensitive" } },
          { message:  { contains: term, mode: "insensitive" } },
        ],
      }
    : {};

  const [leads, counts] = await Promise.all([
    db.lead.findMany({
      where: { ...statusWhere, ...searchWhere },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { assignedTo: { select: { name: true, username: true } } },
    }),
    Promise.all([
      db.lead.count({ where: { status: { in: openStatuses } } }),
      db.lead.count({ where: { status: "NEW" } }),
      db.lead.count({ where: { status: "IN_PROGRESS" } }),
      db.lead.count({ where: { status: "ANSWERED" } }),
      db.lead.count({ where: { status: "WON" } }),
      db.lead.count({ where: { status: "LOST" } }),
      db.lead.count(),
    ]).then(([open, newC, inProg, answered, won, lost, all]) => ({ open, newC, inProg, answered, won, lost, all })),
  ]);

  const tabs: { key: StatusFilter; label: string; count: number }[] = [
    { key: "open",        label: "Öppna",     count: counts.open },
    { key: "new",         label: "Nya",       count: counts.newC },
    { key: "in_progress", label: "Pågår",     count: counts.inProg },
    { key: "answered",    label: "Besvarade", count: counts.answered },
    { key: "won",         label: "Vunna",     count: counts.won },
    { key: "lost",        label: "Förlorade", count: counts.lost },
    { key: "all",         label: "Alla",      count: counts.all },
  ];

  return (
    <section>
      <nav className="text-xs text-[var(--color-text-muted)] mb-6 flex items-center gap-2">
        <Link href="/admin" className="hover:text-[var(--color-brand-orange)] transition-colors">Admin</Link>
        <span>›</span>
        <span className="text-[var(--color-text-secondary)]">Förfrågningar</span>
      </nav>

      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            <span className="gradient-text">Förfrågningar</span>
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Eftersökningar och pris-förfrågningar från kunder.
          </p>
        </div>
        <a
          href="/api/admin/export/eftersok"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border border-[var(--color-dark-500)] hover:border-[var(--color-brand-orange)] transition-colors"
        >
          ⬇ Exportera CSV
        </a>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map((t) => {
          const isActive = t.key === statusFilter;
          return (
            <Link
              key={t.key}
              href={`/admin/eftersok?status=${t.key}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-[var(--color-brand-orange)] text-white"
                  : "bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] text-[var(--color-text-secondary)] hover:border-[var(--color-brand-orange)]/40"
              }`}
            >
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                isActive ? "bg-white/20" : "bg-[var(--color-dark-800)]"
              }`}>
                {t.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Search */}
      <form action="/admin/eftersok" method="get" className="mb-5 flex gap-2">
        <input type="hidden" name="status" value={statusFilter} />
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Sök namn, e-post, SKU, regnr…"
            className="w-full pl-9 pr-3 py-2 bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] rounded-lg text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors"
          />
        </div>
        {q && (
          <Link
            href={`/admin/eftersok?status=${statusFilter}`}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] self-center px-2"
          >
            Rensa
          </Link>
        )}
      </form>

      {/* Inbox */}
      <div className="rounded-xl bg-[var(--color-dark-700)] border border-[var(--color-dark-500)] overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">📭</div>
            <div className="text-sm font-semibold mb-1">Inga förfrågningar matchar</div>
            <p className="text-xs text-[var(--color-text-muted)]">
              {q ? `Inget resultat för "${q}".` : "När kunder skickar in förfrågningar dyker de upp här."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-dark-500)]">
            {leads.map((lead) => {
              const kind = KIND_PILL[lead.kind];
              const status = STATUS_PILL[lead.status];
              return (
                <Link
                  key={lead.id}
                  href={`/admin/eftersok/${lead.id}`}
                  className="block px-5 py-4 hover:bg-[var(--color-dark-600)] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-2 shrink-0 min-w-[60px]">
                      <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-bold ${kind.cls}`}>
                        {kind.icon}
                        {kind.label}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-sm">{lead.name}</span>
                        <span className={`inline-flex items-center text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold border ${status.cls}`}>
                          {status.label}
                        </span>
                        {lead.assignedTo && (
                          <span className="text-[10px] text-[var(--color-text-muted)]">
                            → {lead.assignedTo.name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] mb-2 flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          <Mail size={11} /> {lead.email}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Phone size={11} /> {lead.phone}
                        </span>
                        {lead.sku && (
                          <span className="inline-flex items-center gap-1 font-mono">
                            <Package size={11} /> {lead.sku}
                          </span>
                        )}
                        {(lead.brand || lead.model || lead.regnr) && (
                          <span className="inline-flex items-center gap-1">
                            <Car size={11} />
                            {[lead.brand, lead.model, lead.year, lead.regnr].filter(Boolean).join(" ")}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                        {lead.message}
                      </p>
                    </div>

                    <div className="text-xs text-[var(--color-text-muted)] shrink-0 whitespace-nowrap">
                      {formatDate(lead.createdAt)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {leads.length === 100 && (
        <p className="text-xs text-[var(--color-text-muted)] mt-4 text-center">
          Visar de 100 senaste. Använd sökrutan för att hitta äldre.
        </p>
      )}
    </section>
  );
}
