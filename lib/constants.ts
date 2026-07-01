// Canonical enums + display metadata for the QA domain.
// Free-text columns are constrained to these values in the UI.

export const BUG_STATUSES = ["open", "in_progress", "resolved", "closed"] as const;
export type BugStatus = (typeof BUG_STATUSES)[number];

export const INCIDENT_STATUSES = [
  "open",
  "investigating",
  "resolved",
  "closed",
] as const;
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];

export const CAMPAIGN_STATUSES = ["planned", "in_progress", "completed"] as const;
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export const EXECUTION_RESULTS = ["ok", "ko", "not_executed"] as const;
export type ExecutionResult = (typeof EXECUTION_RESULTS)[number];

export const SEVERITIES = ["critical", "major", "minor", "trivial"] as const;
export type Severity = (typeof SEVERITIES)[number];

export const ROLES = ["member", "admin"] as const;

// ---- Display labels (French) ----
export const LABELS: Record<string, string> = {
  open: "Ouvert",
  in_progress: "En cours",
  resolved: "Résolu",
  closed: "Fermé",
  investigating: "En analyse",
  planned: "Planifiée",
  completed: "Terminée",
  ok: "OK",
  ko: "KO",
  not_executed: "Non exécuté",
  critical: "Critique",
  major: "Majeure",
  minor: "Mineure",
  trivial: "Triviale",
  member: "Membre",
  admin: "Admin",
};

export function label(value: string | null | undefined): string {
  if (!value) return "—";
  return LABELS[value] ?? value;
}

// ---- Tailwind class recipes for status badges ----
type Recipe = { dot: string; badge: string; text: string; bar: string };

export const BUG_STATUS_STYLES: Record<string, Recipe> = {
  open: {
    dot: "bg-rose-500",
    badge: "bg-rose-500/10 text-rose-300 ring-rose-400/30",
    text: "text-rose-300",
    bar: "bg-rose-500",
  },
  in_progress: {
    dot: "bg-amber-400",
    badge: "bg-amber-400/10 text-amber-300 ring-amber-400/30",
    text: "text-amber-300",
    bar: "bg-amber-400",
  },
  resolved: {
    dot: "bg-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30",
    text: "text-emerald-300",
    bar: "bg-emerald-400",
  },
  closed: {
    dot: "bg-slate-500",
    badge: "bg-slate-500/10 text-slate-300 ring-slate-400/30",
    text: "text-slate-300",
    bar: "bg-slate-500",
  },
};

export const SEVERITY_STYLES: Record<string, Recipe> = {
  critical: {
    dot: "bg-rose-500",
    badge: "bg-rose-500/10 text-rose-300 ring-rose-400/30",
    text: "text-rose-300",
    bar: "bg-rose-500",
  },
  major: {
    dot: "bg-orange-400",
    badge: "bg-orange-400/10 text-orange-300 ring-orange-400/30",
    text: "text-orange-300",
    bar: "bg-orange-400",
  },
  minor: {
    dot: "bg-amber-300",
    badge: "bg-amber-300/10 text-amber-200 ring-amber-300/30",
    text: "text-amber-200",
    bar: "bg-amber-300",
  },
  trivial: {
    dot: "bg-sky-400",
    badge: "bg-sky-400/10 text-sky-300 ring-sky-400/30",
    text: "text-sky-300",
    bar: "bg-sky-400",
  },
};

export const EXECUTION_STYLES: Record<string, Recipe> = {
  ok: {
    dot: "bg-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30",
    text: "text-emerald-300",
    bar: "bg-emerald-400",
  },
  ko: {
    dot: "bg-rose-500",
    badge: "bg-rose-500/10 text-rose-300 ring-rose-400/30",
    text: "text-rose-300",
    bar: "bg-rose-500",
  },
  not_executed: {
    dot: "bg-slate-500",
    badge: "bg-slate-500/10 text-slate-300 ring-slate-400/30",
    text: "text-slate-300",
    bar: "bg-slate-600",
  },
};

export const INCIDENT_STATUS_STYLES: Record<string, Recipe> = {
  open: {
    dot: "bg-rose-500",
    badge: "bg-rose-500/10 text-rose-300 ring-rose-400/30",
    text: "text-rose-300",
    bar: "bg-rose-500",
  },
  investigating: {
    dot: "bg-amber-400",
    badge: "bg-amber-400/10 text-amber-300 ring-amber-400/30",
    text: "text-amber-300",
    bar: "bg-amber-400",
  },
  resolved: {
    dot: "bg-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30",
    text: "text-emerald-300",
    bar: "bg-emerald-400",
  },
  closed: {
    dot: "bg-slate-500",
    badge: "bg-slate-500/10 text-slate-300 ring-slate-400/30",
    text: "text-slate-300",
    bar: "bg-slate-500",
  },
};

export const CAMPAIGN_STATUS_STYLES: Record<string, Recipe> = {
  planned: {
    dot: "bg-sky-400",
    badge: "bg-sky-400/10 text-sky-300 ring-sky-400/30",
    text: "text-sky-300",
    bar: "bg-sky-400",
  },
  in_progress: {
    dot: "bg-amber-400",
    badge: "bg-amber-400/10 text-amber-300 ring-amber-400/30",
    text: "text-amber-300",
    bar: "bg-amber-400",
  },
  completed: {
    dot: "bg-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30",
    text: "text-emerald-300",
    bar: "bg-emerald-400",
  },
};

export function recipe(map: Record<string, Recipe>, key: string | null | undefined): Recipe {
  if (key && map[key]) return map[key];
  return {
    dot: "bg-slate-500",
    badge: "bg-slate-500/10 text-slate-300 ring-slate-400/30",
    text: "text-slate-300",
    bar: "bg-slate-500",
  };
}
