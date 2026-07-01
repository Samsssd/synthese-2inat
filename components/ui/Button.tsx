"use client";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

export function buttonClasses(
  variant: ButtonVariant = "secondary",
  size: ButtonSize = "md",
  className?: string
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-50",
    size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm",
    variant === "primary" &&
      "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:shadow-emerald-500/30 active:scale-[0.98]",
    variant === "secondary" &&
      "bg-white/[0.04] text-slate-200 ring-1 ring-inset ring-white/10 hover:bg-white/[0.08] hover:ring-white/20 active:scale-[0.98]",
    variant === "ghost" && "text-slate-300 hover:bg-white/[0.06] hover:text-white",
    variant === "danger" &&
      "bg-rose-500/10 text-rose-300 ring-1 ring-inset ring-rose-400/30 hover:bg-rose-500/20 active:scale-[0.98]",
    className
  );
}

export function Button({
  variant,
  size,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
}
