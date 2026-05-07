/**
 * Order status timeline — used on the guest tracking page
 * (/min-order/[orderNumber]) and inside the customer portal
 * (/konto/ordrar/[orderNumber]).
 *
 * Shows five steps from "Beställd" → "Levererad" with the current
 * step highlighted and the rest dimmed. Cancelled / refunded states
 * render a separate panel since they break the linear progression.
 */

const TIMELINE = [
  { key: "PENDING",    label: "Beställd",  icon: "📝" },
  { key: "CONFIRMED",  label: "Betald",    icon: "💳" },
  { key: "PROCESSING", label: "Packas",    icon: "📦" },
  { key: "SHIPPED",    label: "Skickad",   icon: "🚚" },
  { key: "DELIVERED",  label: "Levererad", icon: "✅" },
] as const;

const STATUS_INDEX: Record<string, number> = {
  PENDING:    0,
  CONFIRMED:  1,
  PROCESSING: 2,
  SHIPPED:    3,
  DELIVERED:  4,
};

const NARRATIVES: Record<string, string> = {
  PENDING:    "Vi väntar på att din betalning ska bekräftas.",
  CONFIRMED:  "Tack! Vi börjar plocka din order inom 1–2 arbetsdagar.",
  PROCESSING: "Din order packas just nu.",
  SHIPPED:    "Din order är skickad. Spårningsnummer skickas via mejl när vi har det.",
  DELIVERED:  "Din order är levererad. Vi hoppas att du är nöjd!",
};

/**
 * Tailwind variants. The "light" theme is for the guest tracking page
 * which is on a white card; "dark" is for the admin/portal which sits
 * on the app's dark background.
 */
type Theme = "light" | "dark";

const THEMES: Record<Theme, {
  card: string;
  reachedRing: string;
  notReachedRing: string;
  reachedText: string;
  notReachedText: string;
  connectorOn: string;
  connectorOff: string;
  narrative: string;
  cancelledCard: string;
  cancelledTitle: string;
  cancelledBody: string;
}> = {
  light: {
    card:           "bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm",
    reachedRing:    "bg-emerald-500 text-white",
    notReachedRing: "bg-slate-100 text-slate-400 border border-slate-200",
    reachedText:    "text-slate-900",
    notReachedText: "text-slate-400",
    connectorOn:    "bg-emerald-500",
    connectorOff:   "bg-slate-200",
    narrative:      "text-slate-600",
    cancelledCard:  "bg-rose-50 border border-rose-200 rounded-2xl p-6",
    cancelledTitle: "text-rose-700",
    cancelledBody:  "text-rose-700",
  },
  dark: {
    card:           "glass rounded-xl p-6",
    reachedRing:    "bg-emerald-500 text-white",
    notReachedRing: "bg-[var(--color-dark-700)] text-[var(--color-text-muted)] border border-[var(--color-dark-500)]",
    reachedText:    "text-[var(--color-text-primary)]",
    notReachedText: "text-[var(--color-text-muted)]",
    connectorOn:    "bg-emerald-500",
    connectorOff:   "bg-[var(--color-dark-500)]",
    narrative:      "text-[var(--color-text-secondary)]",
    cancelledCard:  "rounded-xl p-6 border border-rose-500/30 bg-rose-500/10",
    cancelledTitle: "text-rose-300",
    cancelledBody:  "text-rose-200",
  },
};

export function OrderStatusTimeline({
  status,
  theme = "light",
}: {
  status: string;
  theme?: Theme;
}) {
  const t = THEMES[theme];

  if (status === "CANCELLED" || status === "REFUNDED") {
    return (
      <div className={t.cancelledCard}>
        <h2 className={`font-bold mb-1 ${t.cancelledTitle}`}>
          {status === "CANCELLED" ? "Avbruten" : "Återbetald"}
        </h2>
        <p className={`text-sm ${t.cancelledBody}`}>
          Den här ordern är inte längre aktiv. Frågor? Ring oss på 0171-210 02.
        </p>
      </div>
    );
  }

  const idx = STATUS_INDEX[status] ?? 0;

  return (
    <div className={t.card}>
      <h2 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-6">
        Status
      </h2>
      <ol className="grid grid-cols-5 gap-2 sm:gap-4">
        {TIMELINE.map((step, i) => {
          const reached = i <= idx;
          const current = i === idx;
          return (
            <li key={step.key} className="flex flex-col items-center text-center relative">
              {i > 0 && (
                <span
                  className={`absolute top-5 right-1/2 w-full h-0.5 -z-0 ${
                    i <= idx ? t.connectorOn : t.connectorOff
                  }`}
                  aria-hidden
                />
              )}
              <span
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-base mb-2 ${
                  current
                    ? `${t.reachedRing} ring-4 ring-emerald-500/30`
                    : reached
                    ? t.reachedRing
                    : t.notReachedRing
                }`}
              >
                {step.icon}
              </span>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider leading-tight ${
                  reached ? t.reachedText : t.notReachedText
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
      <p className={`text-sm leading-relaxed mt-6 text-center ${t.narrative}`}>
        {NARRATIVES[status]}
      </p>
    </div>
  );
}
