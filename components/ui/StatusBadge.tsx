import { cn } from "@/lib/utils";
import {
  recipe,
  BUG_STATUS_STYLES,
  INCIDENT_STATUS_STYLES,
  CAMPAIGN_STATUS_STYLES,
  SEVERITY_STYLES,
  EXECUTION_STYLES,
  label,
} from "@/lib/constants";

type BadgeKind =
  | "bugStatus"
  | "incidentStatus"
  | "campaignStatus"
  | "severity"
  | "execution";

const KIND_MAP: Record<
  BadgeKind,
  Record<string, { dot: string; badge: string; text: string; bar: string }>
> = {
  bugStatus: BUG_STATUS_STYLES,
  incidentStatus: INCIDENT_STATUS_STYLES,
  campaignStatus: CAMPAIGN_STATUS_STYLES,
  severity: SEVERITY_STYLES,
  execution: EXECUTION_STYLES,
};

export function StatusBadge({
  kind,
  value,
  className,
}: {
  kind: BadgeKind;
  value: string | null | undefined;
  className?: string;
}) {
  const r = recipe(KIND_MAP[kind], value);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset whitespace-nowrap",
        r.badge,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", r.dot)} />
      {label(value)}
    </span>
  );
}
