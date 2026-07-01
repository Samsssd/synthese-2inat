import { cn } from "@/lib/utils";

type Accent = "emerald" | "rose" | "amber" | "sky" | "violet" | "slate";

const ACCENTS: Record<Accent, { text: string; chip: string; glow: string }> = {
  emerald: {
    text: "text-emerald-400",
    chip: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
    glow: "from-emerald-500/10",
  },
  rose: {
    text: "text-rose-400",
    chip: "bg-rose-500/10 text-rose-300 ring-rose-400/20",
    glow: "from-rose-500/10",
  },
  amber: {
    text: "text-amber-400",
    chip: "bg-amber-400/10 text-amber-300 ring-amber-400/20",
    glow: "from-amber-500/10",
  },
  sky: {
    text: "text-sky-400",
    chip: "bg-sky-400/10 text-sky-300 ring-sky-400/20",
    glow: "from-sky-500/10",
  },
  violet: {
    text: "text-violet-400",
    chip: "bg-violet-400/10 text-violet-300 ring-violet-400/20",
    glow: "from-violet-500/10",
  },
  slate: {
    text: "text-slate-300",
    chip: "bg-slate-500/10 text-slate-300 ring-slate-400/20",
    glow: "from-slate-500/10",
  },
};

export function StatCard({
  label,
  value,
  unit,
  hint,
  accent = "emerald",
  icon: Icon,
  className,
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  hint?: React.ReactNode;
  accent?: Accent;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  const a = ACCENTS[accent];
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[var(--surface)]/80 p-5 backdrop-blur transition-colors hover:border-white/[0.12]",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br to-transparent opacity-60 blur-2xl",
          a.glow
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </p>
        {Icon && (
          <span
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-inset",
              a.chip
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <div className="relative mt-3 flex items-baseline gap-1">
        <span
          className={cn(
            "font-mono text-3xl font-semibold tabular-nums tracking-tight",
            a.text
          )}
        >
          {value}
        </span>
        {unit && (
          <span className="text-sm font-medium text-slate-500">{unit}</span>
        )}
      </div>
      {hint && (
        <p className="relative mt-1 text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}
