import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center",
        className
      )}
    >
      {Icon && (
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-400 ring-1 ring-inset ring-white/10">
          <Icon className="h-6 w-6" />
        </span>
      )}
      <p className="text-sm font-medium text-slate-200">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
