"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  MinusCircle,
  Plus,
  RefreshCw,
  ShieldAlert,
  Target,
  XCircle,
} from "lucide-react";
import {
  useDashboardStore,
  computeCampaignProgress,
} from "@/lib/stores/useDashboardStore";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { StackedBar } from "@/components/charts/StackedBar";
import { CampaignFormModal } from "@/components/forms/CampaignFormModal";
import { ExecutionFormModal } from "@/components/forms/ExecutionFormModal";
import { CAMPAIGN_STATUSES, LABELS } from "@/lib/constants";
import { cn, timeAgo } from "@/lib/utils";
import type { TestCampaignRow, TestExecutionRow } from "@/lib/supabase/tables";

export default function CampaignsPage() {
  const {
    testCampaigns,
    testExecutions,
    loading,
    error,
    fetched,
    fetchDashboard,
  } = useDashboardStore();

  const [campaignModal, setCampaignModal] = useState(false);
  const [execModal, setExecModal] = useState<{
    open: boolean;
    campaign: TestCampaignRow | null;
  }>({ open: false, campaign: null });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const progress = useMemo(
    () => computeCampaignProgress(testCampaigns, testExecutions),
    [testCampaigns, testExecutions]
  );

  const filteredProgress = useMemo(() => {
    if (statusFilter === "all") return progress;
    return progress.filter((p) => p.campaign.status === statusFilter);
  }, [progress, statusFilter]);

  const executionsByCampaign = useMemo(() => {
    const map = new Map<string, TestExecutionRow[]>();
    testExecutions.forEach((e) => {
      if (!e.campaign_id) return;
      const arr = map.get(e.campaign_id) ?? [];
      arr.push(e);
      map.set(e.campaign_id, arr);
    });
    return map;
  }, [testExecutions]);

  const totals = useMemo(() => {
    const totalObjective = progress.reduce((s, p) => s + p.objective, 0);
    const totalOk = progress.reduce((s, p) => s + p.ok, 0);
    const totalKo = progress.reduce((s, p) => s + p.ko, 0);
    const totalExecuted = totalOk + totalKo;
    return {
      campaigns: testCampaigns.length,
      objective: totalObjective,
      executed: totalExecuted,
      remaining: Math.max(0, totalObjective - totalExecuted),
    };
  }, [progress, testCampaigns]);

  const handleCampaignCreated = (campaign: TestCampaignRow) => {
    useDashboardStore.setState((s) => ({
      testCampaigns: [campaign, ...s.testCampaigns],
    }));
  };

  const handleExecutionCreated = (execution: TestExecutionRow) => {
    useDashboardStore.setState((s) => ({
      testExecutions: [execution, ...s.testExecutions],
    }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Thème 3"
        title="Campagnes de test"
        description="Suivez l'avancement de l'exécution des cas de test — OK, KO, Non exécuté — par rapport à l'objectif total de chaque campagne."
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
              onClick={() => setCampaignModal(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouvelle campagne
            </Button>
          </div>
        }
      />

      {/* Summary strip */}
      {fetched && !loading && !error && testCampaigns.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Campagnes", value: totals.campaigns, cls: "text-slate-200" },
            { label: "Objectif total", value: totals.objective, cls: "text-sky-300" },
            { label: "Cas exécutés", value: totals.executed, cls: "text-emerald-300" },
            { label: "Restant", value: totals.remaining, cls: "text-amber-300" },
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
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} className="h-48" />
          ))}
        </div>
      )}

      {/* Empty */}
      {fetched && !loading && !error && testCampaigns.length === 0 && (
        <div className="mt-10">
          <EmptyState
            icon={Target}
            title="Aucune campagne de test"
            description="Créez votre première campagne de test et définissez un objectif total de cas à exécuter pour suivre l'avancement."
            className="py-20"
            action={
              <Button variant="primary" size="md" onClick={() => setCampaignModal(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Créer une campagne
              </Button>
            }
          />
        </div>
      )}

      {/* Populated */}
      {fetched && !loading && !error && testCampaigns.length > 0 && (
        <div className="mt-6">
          {/* Status filter */}
          <div className="mb-5 flex items-center gap-1 self-start rounded-lg bg-white/[0.03] p-1 ring-1 ring-inset ring-white/[0.06]">
            <button
              onClick={() => setStatusFilter("all")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition",
                statusFilter === "all"
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              Toutes ({progress.length})
            </button>
            {CAMPAIGN_STATUSES.map((s) => {
              const count = progress.filter((p) => p.campaign.status === s).length;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition",
                    statusFilter === s
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  {LABELS[s]} ({count})
                </button>
              );
            })}
          </div>

          {/* Campaign cards */}
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredProgress.map((p, idx) => {
              const isExpanded = expandedId === p.campaign.id;
              const execs = executionsByCampaign.get(p.campaign.id) ?? [];
              const passPct =
                p.objective > 0 ? Math.round((p.executed / p.objective) * 100) : 0;
              return (
                <motion.div
                  key={p.campaign.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.3) }}
                  className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[var(--surface)]/60 transition-colors hover:border-white/[0.12]"
                >
                  {/* Header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold text-white">
                          {p.campaign.name || "Sans nom"}
                        </h3>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <StatusBadge kind="campaignStatus" value={p.campaign.status} />
                          <span className="text-xs text-slate-500">
                            Objectif :{" "}
                            <span className="font-mono font-medium text-slate-300">
                              {p.objective}
                            </span>{" "}
                            cas
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-mono text-2xl font-semibold tabular-nums text-white">
                          {passPct}
                          <span className="text-sm text-slate-500">%</span>
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                          exécuté
                        </p>
                      </div>
                    </div>

                    {/* Stacked bar */}
                    <div className="mt-4">
                      <StackedBar
                        ok={p.ok}
                        ko={p.ko}
                        notExecuted={p.notExecuted}
                        objective={p.objective}
                        height="h-3"
                      />
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {[
                          {
                            label: "OK",
                            value: p.ok,
                            icon: CheckCircle2,
                            cls: "text-emerald-300",
                            ring: "ring-emerald-400/20 bg-emerald-400/[0.06]",
                          },
                          {
                            label: "KO",
                            value: p.ko,
                            icon: XCircle,
                            cls: "text-rose-300",
                            ring: "ring-rose-400/20 bg-rose-500/[0.06]",
                          },
                          {
                            label: "Non exécuté",
                            value: p.notExecuted,
                            icon: MinusCircle,
                            cls: "text-slate-300",
                            ring: "ring-slate-400/20 bg-slate-500/[0.06]",
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className={cn(
                              "rounded-lg px-3 py-2 ring-1 ring-inset",
                              item.ring
                            )}
                          >
                            <div className="flex items-center gap-1.5">
                              <item.icon className={cn("h-3 w-3", item.cls)} />
                              <span className="text-[10px] font-medium text-slate-400">
                                {item.label}
                              </span>
                            </div>
                            <p className={cn("mt-0.5 font-mono text-lg font-semibold tabular-nums", item.cls)}>
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer actions */}
                    <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3">
                      <button
                        onClick={() =>
                          setExpandedId(isExpanded ? null : p.campaign.id)
                        }
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 transition hover:text-slate-200"
                      >
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform",
                            isExpanded && "rotate-180"
                          )}
                        />
                        {execs.length} exécution{execs.length > 1 ? "s" : ""}
                      </button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          setExecModal({ open: true, campaign: p.campaign })
                        }
                        className="gap-1.5"
                      >
                        <Plus className="h-3 w-3" />
                        Enregistrer un cas
                      </Button>
                    </div>
                  </div>

                  {/* Expandable executions list */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden border-t border-white/[0.06] bg-black/20"
                      >
                        {execs.length === 0 ? (
                          <p className="px-5 py-6 text-center text-xs text-slate-600">
                            Aucune exécution enregistrée pour cette campagne.
                          </p>
                        ) : (
                          <ul className="divide-y divide-white/[0.04]">
                            {execs.slice(0, 12).map((e) => (
                              <li
                                key={e.id}
                                className="flex items-center gap-3 px-5 py-2.5"
                              >
                                <span
                                  className={cn(
                                    "h-1.5 w-1.5 shrink-0 rounded-full",
                                    e.status === "ok"
                                      ? "bg-emerald-400"
                                      : e.status === "ko"
                                      ? "bg-rose-500"
                                      : "bg-slate-500"
                                  )}
                                />
                                <span className="flex-1 truncate text-sm text-slate-300">
                                  {e.test_case_name || "Cas sans nom"}
                                </span>
                                <StatusBadge kind="execution" value={e.status} />
                                <span className="hidden text-[11px] text-slate-600 sm:inline">
                                  {e.executed_at ? timeAgo(e.executed_at) : "—"}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {filteredProgress.length === 0 && (
            <EmptyState
              title="Aucune campagne ne correspond"
              description="Modifiez le filtre de statut pour élargir la recherche."
              className="mt-2 py-14"
            />
          )}
        </div>
      )}

      <CampaignFormModal
        open={campaignModal}
        onClose={() => setCampaignModal(false)}
        onCreated={handleCampaignCreated}
      />
      {execModal.campaign && (
        <ExecutionFormModal
          open={execModal.open}
          onClose={() => setExecModal({ open: false, campaign: null })}
          onCreated={handleExecutionCreated}
          campaignId={execModal.campaign.id}
          campaignName={execModal.campaign.name || "Sans nom"}
        />
      )}
    </div>
  );
}
