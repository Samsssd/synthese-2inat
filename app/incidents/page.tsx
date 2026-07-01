"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Filter,
  History,
  Link2,
  Plus,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { useDashboardStore } from "@/lib/stores/useDashboardStore";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { RowSkeleton } from "@/components/ui/Skeleton";
import { IncidentFormModal } from "@/components/forms/IncidentFormModal";
import {
  INCIDENT_STATUSES,
  SEVERITIES,
  LABELS,
} from "@/lib/constants";
import { cn, formatDateTime, timeAgo } from "@/lib/utils";
import type { IncidentRow } from "@/lib/supabase/tables";

const STATUS_DOT: Record<string, string> = {
  open: "bg-rose-500",
  investigating: "bg-amber-400",
  resolved: "bg-emerald-400",
  closed: "bg-slate-500",
};

export default function IncidentsPage() {
  const { incidents, bugs, loading, error, fetched, fetchDashboard } =
    useDashboardStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const bugsById = useMemo(() => {
    const map = new Map<string, string>();
    bugs.forEach((b) => map.set(b.id, b.title || "Sans titre"));
    return map;
  }, [bugs]);

  const filtered = useMemo(() => {
    return incidents.filter((i) => {
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      if (severityFilter !== "all" && i.severity !== severityFilter) return false;
      return true;
    });
  }, [incidents, statusFilter, severityFilter]);

  const counts = useMemo(
    () => ({
      total: incidents.length,
      active: incidents.filter(
        (i) => i.status === "open" || i.status === "investigating"
      ).length,
      resolved: incidents.filter(
        (i) => i.status === "resolved" || i.status === "closed"
      ).length,
    }),
    [incidents]
  );

  const handleCreated = (incident: IncidentRow) => {
    useDashboardStore.setState((s) => ({
      incidents: [incident, ...s.incidents],
    }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Thème 2"
        title="Rapport d'incidents"
        description="Consultez l'historique chronologique des incidents, leur sévérité et les défauts associés."
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
              Signaler un incident
            </Button>
          </div>
        }
      />

      {/* Mini KPIs */}
      {fetched && !loading && !error && incidents.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "Total", value: counts.total, cls: "text-slate-200" },
            { label: "Actifs", value: counts.active, cls: "text-amber-300" },
            { label: "Résolus", value: counts.resolved, cls: "text-emerald-300" },
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
        <div className="mt-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
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
      {fetched && !loading && !error && incidents.length === 0 && (
        <div className="mt-10">
          <EmptyState
            icon={History}
            title="Aucun incident enregistré"
            description="L'historique des incidents est vide. Signalez un incident pour commencer le suivi."
            className="py-20"
            action={
              <Button variant="primary" size="md" onClick={() => setModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Signaler un incident
              </Button>
            }
          />
        </div>
      )}

      {/* Populated — timeline */}
      {fetched && !loading && !error && incidents.length > 0 && (
        <div className="mt-6">
          {/* Filters */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Filter className="h-3.5 w-3.5" />
              <span>{filtered.length} incident{filtered.length > 1 ? "s" : ""}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
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
                {INCIDENT_STATUSES.map((s) => (
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
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="rounded-lg bg-white/[0.03] px-3 py-1.5 text-xs text-slate-200 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              >
                <option value="all">Toutes sévérités</option>
                {SEVERITIES.map((s) => (
                  <option key={s} value={s}>
                    {LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Timeline */}
          <ol className="relative space-y-0">
            <span className="absolute left-[15px] top-3 bottom-3 w-px bg-gradient-to-b from-white/[0.12] via-white/[0.06] to-transparent" />
            {filtered.map((inc, idx) => (
              <motion.li
                key={inc.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.3) }}
                className="relative pl-10 pb-5 last:pb-0"
              >
                <span
                  className={cn(
                    "absolute left-[8px] top-2 inline-flex h-[18px] w-[18px] items-center justify-center rounded-full ring-4 ring-[var(--background)]",
                    STATUS_DOT[inc.status || ""] || "bg-slate-500"
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                </span>

                <div className="rounded-xl border border-white/[0.07] bg-[var(--surface)]/60 p-4 transition-colors hover:border-white/[0.12] hover:bg-[var(--surface)]/90">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-slate-100">
                        {inc.title || "Sans titre"}
                      </h3>
                      {inc.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {inc.description}
                        </p>
                      )}
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        {inc.bug_id && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] text-slate-400 ring-1 ring-inset ring-white/[0.06]">
                            <Link2 className="h-3 w-3" />
                            {bugsById.get(inc.bug_id) || "Défaut lié"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                      <StatusBadge kind="severity" value={inc.severity} />
                      <StatusBadge kind="incidentStatus" value={inc.status} />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-white/[0.05] pt-2.5 text-[11px] text-slate-600">
                    <span>
                      Survenu le{" "}
                      <span className="text-slate-400">
                        {inc.occurred_at ? formatDateTime(inc.occurred_at) : "—"}
                      </span>
                    </span>
                    <span>{inc.occurred_at ? timeAgo(inc.occurred_at) : ""}</span>
                  </div>
                </div>
              </motion.li>
            ))}
            {filtered.length === 0 && (
              <EmptyState
                title="Aucun incident ne correspond"
                description="Modifiez vos filtres pour élargir la recherche."
                className="mt-2 py-14"
              />
            )}
          </ol>
        </div>
      )}

      <IncidentFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
