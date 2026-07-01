"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertOctagon,
  Bug as BugIcon,
  Filter,
  Plus,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { useDashboardStore } from "@/lib/stores/useDashboardStore";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton, RowSkeleton } from "@/components/ui/Skeleton";
import { BugFormModal } from "@/components/forms/BugFormModal";
import {
  BUG_STATUSES,
  SEVERITIES,
  LABELS,
} from "@/lib/constants";
import { cn, timeAgo } from "@/lib/utils";
import type { BugRow } from "@/lib/supabase/tables";

const SEVERITY_ACCENT: Record<string, string> = {
  critical: "border-l-rose-500",
  major: "border-l-orange-400",
  minor: "border-l-amber-300",
  trivial: "border-l-sky-400",
};

export default function BugsPage() {
  const { bugs, loading, error, fetched, fetchDashboard } = useDashboardStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const filtered = useMemo(() => {
    return bugs.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (severityFilter !== "all" && b.severity !== severityFilter) return false;
      return true;
    });
  }, [bugs, statusFilter, severityFilter]);

  const counts = useMemo(
    () => ({
      total: bugs.length,
      open: bugs.filter((b) => b.status === "open" || b.status === "in_progress").length,
      critical: bugs.filter((b) => b.severity === "critical").length,
    }),
    [bugs]
  );

  const handleCreated = (bug: BugRow) => {
    useDashboardStore.setState((s) => ({
      bugs: [bug, ...s.bugs],
    }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Thème 1"
        title="Analyse des défauts"
        description="Suivez l'ensemble des défauts avec leur statut et leur niveau de sévérité pour prioriser les corrections."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => fetchDashboard()}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              <span className="hidden sm:inline">Actualiser</span>
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setModalOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouveau défaut
            </Button>
          </div>
        }
      />

      {/* Mini KPIs */}
      {fetched && !loading && !error && bugs.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "Total défauts", value: counts.total, cls: "text-slate-200" },
            { label: "Ouverts", value: counts.open, cls: "text-rose-300" },
            { label: "Critiques", value: counts.critical, cls: "text-rose-400" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl border border-white/[0.07] bg-[var(--surface)]/60 px-4 py-3"
            >
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                {kpi.label}
              </p>
              <p className={cn("mt-1 font-mono text-2xl font-semibold tabular-nums", kpi.cls)}>
                {kpi.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/[0.06] p-5">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-300">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-rose-200">Erreur de chargement</p>
              <p className="mt-1 text-xs text-rose-300/70">{error}</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => fetchDashboard()}>
              Réessayer
            </Button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && !fetched && (
        <div className="mt-6 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/[0.07] bg-[var(--surface)]/60"
            >
              <RowSkeleton />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {fetched && !loading && !error && bugs.length === 0 && (
        <div className="mt-10">
          <EmptyState
            icon={BugIcon}
            title="Aucun défaut enregistré"
            description="Créez votre premier défaut pour commencer le suivi qualité."
            className="py-20"
            action={
              <Button variant="primary" size="md" onClick={() => setModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Créer un défaut
              </Button>
            }
          />
        </div>
      )}

      {/* Populated */}
      {fetched && !loading && !error && bugs.length > 0 && (
        <div className="mt-6">
          {/* Filters */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Filter className="h-3.5 w-3.5" />
              <span>{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Status filter */}
              <div className="flex items-center gap-1 rounded-lg bg-white/[0.03] p-1 ring-1 ring-inset ring-white/[0.06]">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition",
                    statusFilter === "all"
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  Tous
                </button>
                {BUG_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-xs font-medium transition",
                      statusFilter === s
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    {LABELS[s]}
                  </button>
                ))}
              </div>
              {/* Severity filter */}
              <Select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="!w-auto !py-1.5 text-xs"
              >
                <option value="all">Toutes sévérités</option>
                {SEVERITIES.map((s) => (
                  <option key={s} value={s}>
                    {LABELS[s]}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* List */}
          <div className="space-y-2">
            {filtered.map((bug, i) => (
              <motion.div
                key={bug.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                className={cn(
                  "group relative overflow-hidden rounded-xl border border-white/[0.07] border-l-2 bg-[var(--surface)]/60 p-4 transition-colors hover:border-white/[0.12] hover:bg-[var(--surface)]/90",
                  SEVERITY_ACCENT[bug.severity || ""] || "border-l-slate-600"
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-slate-500 ring-1 ring-inset ring-white/[0.06]">
                    <AlertOctagon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-medium text-slate-100 group-hover:text-white">
                        {bug.title || "Sans titre"}
                      </h3>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <StatusBadge kind="severity" value={bug.severity} />
                        <StatusBadge kind="bugStatus" value={bug.status} />
                      </div>
                    </div>
                    {bug.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {bug.description}
                      </p>
                    )}
                    <p className="mt-2 text-[11px] text-slate-600">
                      Créé {timeAgo(bug.created_at)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <EmptyState
                title="Aucun défaut ne correspond"
                description="Modifiez vos filtres pour élargir la recherche."
                className="py-14"
              />
            )}
          </div>
        </div>
      )}

      <BugFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
