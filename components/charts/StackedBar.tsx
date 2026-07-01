"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Segment = {
  key: string;
  value: number;
  cls: string;
};

/**
 * Horizontal stacked bar representing test-execution distribution
 * (OK / KO / Non exécuté) relative to the campaign objective total.
 */
export function StackedBar({
  ok,
  ko,
  notExecuted,
  objective,
  height = "h-3",
  className,
}: {
  ok: number;
  ko: number;
  notExecuted: number;
  objective: number;
  height?: string;
  className?: string;
}) {
  const executed = ok + ko;
  const total = Math.max(objective, executed, 1);

  const segments: Segment[] = [
    { key: "ok", value: ok, cls: "bg-emerald-400" },
    { key: "ko", value: ko, cls: "bg-rose-500" },
    { key: "ne", value: notExecuted, cls: "bg-slate-600/70" },
  ];

  return (
    <div
      className={cn(
        "flex w-full overflow-hidden rounded-full bg-white/[0.04] ring-1 ring-inset ring-white/[0.06]",
        height,
        className
      )}
    >
      {segments.map((s) => {
        const pct = (s.value / total) * 100;
        if (pct <= 0) return null;
        return (
          <motion.div
            key={s.key}
            className={cn("h-full first:rounded-l-full last:rounded-r-full", s.cls)}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
          />
        );
      })}
      {executed === 0 && notExecuted === 0 && (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-[10px] text-slate-600">Aucune donnée</span>
        </div>
      )}
    </div>
  );
}
