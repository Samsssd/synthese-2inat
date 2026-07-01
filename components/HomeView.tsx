"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  AlertOctagon,
  ArrowRight,
  ArrowUpRight,
  Bug,
  CheckCircle2,
  ClipboardList,
  History,
  RefreshCw,
  ShieldAlert,
  Soup,
  Target,
  XCircle,
} from "lucide-react";
import { useDashboardStore, computeGlobalProgress } from "@/lib/stores/useDashboardStore";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton, RowSkeleton } from "@/components/ui/Skeleton";
import { Donut } from "@/components/charts/Donut";
import { StackedBar } from "@/components/charts/StackedBar";
import { Button } from "@/components/ui/Button";
import { SEVERITIES, BUG_STATUSES, label } from "@/lib/constants";
import { timeAgo, cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function HomeView() {
  const {
    bugs,
    incidents,
    testCampaigns,
    testExecutions,
    loading,
    error,
    fetched,
    fetchDashboard,
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const global = computeGlobalProgress(testCampaigns, testExecutions);

  // ---- Derived bug metrics ----
  const openBugs = bugs.filter(
    (b) => b.status === "open" || b.status === "in_progress"
  );
  const criticalBugs = bugs.filter((b) => b.severity === "critical");
  const openIncidents = incidents.filter(
    (i) => i.status === "open" || i.status === "investigating"
  );

  const severityCounts = SEVERITIES.map((sev) => ({
    sev,
    count: bugs.filter((b) => b.severity === sev).length,
  }));
  const maxSeverity = Math.max(1, ...severityCounts.map((s) => s.count));

  const statusCounts = BUG_STATUSES.map((st) => ({
    st,
    count: bugs.filter((b) => b.status === st).length,
  }));

  const recentBugs = bugs.slice(0, 5);
  const recentIncidents = incidents.slice(0, 5);

  const isEmpty =
    fetched &&
    !loading &&
    bugs.length === 0 &&
    incidents.length === 0 &&
    testCampaigns.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Cockpit qualité"
        title="Vue d'ensemble de la qualité"
        description="Centralisez l'analyse des défauts, l'historique des incidents et l'avancement des campagnes de test pour piloter la qualité logicielle."
        actions={
          <Button
            variant="secondary"
            size="md"
            onClick={() => fetchDashboard()}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Actualiser
          </Button>
        }
      />

      {/* Algerian loubia spotlight */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="mt-8 rounded-3xl border border-orange-400/20 bg-gradient-to-br from-orange-500/[0.08] to-[var(--surface)]/60 p-6"
      >
        <div className="mb-5 flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-300 ring-1 ring-inset ring-orange-400/20">
            <Soup className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-white">
              Pause loubia
            </h2>
            <p className="text-xs text-slate-500">
              La soupe de haricots blancs à l'algérienne
            </p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-slate-400">
          La loubia est un plat familial algérien, mijoté lentement avec des
          haricots blancs, une sauce tomate parfumée et des épices douces.
          On l'accompagne souvent d'une bonne baguette pour saucer jusqu'à
          la dernière goutte.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Haricots blancs", desc: "Le cœur du plat" },
            { label: "Tomate & ail", desc: "Base de sauce" },
            { label: "Cumin & paprika", desc: "Parfums chauds" },
            { label: "Merguez optionnelle", desc: "Touche gourmande" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-inset ring-white/[0.06]"
            >
              <p className="text-sm font-medium text-slate-200">
                {item.label}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ---------- ERROR ---------- */}
      {error && (
        <div className="mt-8 rounded-2xl border border-rose-400/20 bg-rose-500/[0.06] p-5">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-300">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-rose-200">
                Impossible de charger les données
              </p>
              <p className="mt-1 text-xs text-rose-300/70">{error}</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => fetchDashboard()}>
              Réessayer
            </Button>
          </div>
        </div>
      )}

      {/* ---------- LOADING ---------- */}
      {loading && !fetched && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <RowSkeleton key={i} />
              ))}
            </div>
            <CardSkeleton className="h-72" />
          </div>
        </div>
      )}

      {/* ---------- EMPTY ---------- */}
      {isEmpty && (
        <div className="mt-10">
          <EmptyState
            icon={ClipboardList}
            title="Aucune donnée de qualité pour le moment"
            description="Une fois les défauts, incidents et campagnes de test renseignés, votre cockpit qualité s'affichera ici avec graphiques et synthèses."
            className="py-20"
          />
        </div>
      )}

      {/* ---------- POPULATED ---------- */}
      {fetched && !loading && !error && !isEmpty && (
        <div className="mt-8 space-y-8">
          {/* KPI strip */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="grid grid-cols-2 gap-4 lg:grid-cols-4"
          >
            <StatCard
              label="Défauts ouverts"
              value={openBugs.length}
              unit={`/ ${bugs.length}`}
              hint={`${criticalBugs.length} critique${criticalBugs.length > 1 ? "s" : ""}`}
              accent="rose"
              icon={Bug}
            />
            <StatCard
              label="Incidents actifs"
              value={openIncidents.length}
              unit={`/ ${incidents.length}`}
              hint="En cours de traitement"
              accent="amber"
              icon={History}
            />
            <StatCard
              label="Cas exécutés"
              value={global.totalExecuted}
              unit={`/ ${global.totalObjective}`}
              hint={`${global.totalNotExecuted} restant${global.totalNotExecuted > 1 ? "s" : ""}`}
              accent="sky"
              icon={Target}
            />
            <StatCard
              label="Taux de réussite"
              value={Math.round(global.passRate)}
              unit="%"
              hint={`${global.totalOk} OK · ${global.totalKo} KO`}
              accent="emerald"
              icon={CheckCircle2}
            />
          </motion.section>

          {/* Theme 3 — Execution progress (headline) */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[var(--surface)]/60 p-6 sm:p-8"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/[0.06] blur-3xl" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">
              {/* Donut */}
              <div className="flex shrink-0 flex-col items-center justify-center gap-3 lg:w-64">
                <Donut
                  value={global.totalObjective > 0 ? (global.totalExecuted / global.totalObjective) * 100 : 0}
                  size={160}
                  stroke={14}
                  color="#34d399"
                  label="Progression"
                  sublabel={`${global.totalExecuted} / ${global.totalObjective}`}
                />
                <p className="text-center text-xs text-slate-500">
                  Avancement global vs objectif
                </p>
              </div>

              {/* Breakdown */}
              <div className="flex-1">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Avancement d'exécution
                    </h2>
                    <p className="text-sm text-slate-400">
                      Répartition des cas de test — OK, KO, Non exécuté
                    </p>
                  </div>
                  <Link
                    href="/campagnes"
                    className="hidden items-center gap-1 text-xs font-medium text-emerald-400 transition hover:text-emerald-300 sm:inline-flex"
                  >
                    Voir les campagnes <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <StackedBar
                  ok={global.totalOk}
                  ko={global.totalKo}
                  notExecuted={global.totalNotExecuted}
                  objective={global.totalObjective}
                  height="h-4"
                />

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    {
                      key: "ok",
                      label: "OK",
                      value: global.totalOk,
                      icon: CheckCircle2,
                      cls: "text-emerald-300",
                      ring: "ring-emerald-400/20 bg-emerald-400/[0.07]",
                    },
                    {
                      key: "ko",
                      label: "KO",
                      value: global.totalKo,
                      icon: XCircle,
                      cls: "text-rose-300",
                      ring: "ring-rose-400/20 bg-rose-500/[0.07]",
                    },
                    {
                      key: "ne",
                      label: "Non exécuté",
                      value: global.totalNotExecuted,
                      icon: ArrowUpRight,
                      cls: "text-slate-300",
                      ring: "ring-slate-400/20 bg-slate-500/[0.07]",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className={cn(
                        "rounded-xl p-4 ring-1 ring-inset",
                        item.ring
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className={cn("h-4 w-4", item.cls)} />
                        <span className="text-xs font-medium text-slate-400">
                          {item.label}
                        </span>
                      </div>
                      <p className={cn("mt-2 font-mono text-2xl font-semibold tabular-nums", item.cls)}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Two-column: Bugs analysis + Incidents timeline */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Theme 1 — Bug analysis */}
            <motion.section
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="rounded-3xl border border-white/[0.07] bg-[var(--surface)]/60 p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-300 ring-1 ring-inset ring-rose-400/20">
                    <Bug className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-white">Analyse des défauts</h2>
                    <p className="text-xs text-slate-500">Statut & sévérité</p>
                  </div>
                </div>
                <Link
                  href="/bugs"
                  className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 transition hover:text-emerald-300"
                >
                  Tout voir <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Severity distribution */}
              <div className="space-y-2.5">
                {severityCounts.map((s) => {
                  const sevColors: Record<string, string> = {
                    critical: "bg-rose-500",
                    major: "bg-orange-400",
                    minor: "bg-amber-300",
                    trivial: "bg-sky-400",
                  };
                  return (
                    <div key={s.sev} className="flex items-center gap-3">
                      <span className="w-16 text-xs font-medium text-slate-400">
                        {label(s.sev)}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
                        <motion.div
                          className={cn("h-full rounded-full", sevColors[s.sev])}
                          initial={{ width: 0 }}
                          animate={{ width: `${(s.count / maxSeverity) * 100}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                      <span className="w-6 text-right font-mono text-sm font-medium tabular-nums text-slate-300">
                        {s.count}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Status chips */}
              <div className="mt-5 flex flex-wrap gap-2">
                {statusCounts.map((s) => (
                  <div
                    key={s.st}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.03] px-2.5 py-1 text-xs text-slate-400 ring-1 ring-inset ring-white/[0.06]"
                  >
                    <StatusBadge kind="bugStatus" value={s.st} />
                    <span className="font-mono font-medium text-slate-200">{s.count}</span>
                  </div>
                ))}
              </div>

              {/* Recent bugs */}
              <div className="mt-5 border-t border-white/[0.06] pt-4">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Défauts récents
                </p>
                {recentBugs.length === 0 ? (
                  <p className="py-4 text-center text-xs text-slate-600">Aucun défaut</p>
                ) : (
                  <ul className="space-y-1">
                    {recentBugs.map((b) => (
                      <li key={b.id}>
                        <Link
                          href="/bugs"
                          className="group flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-white/[0.03]"
                        >
                          <AlertOctagon className="h-3.5 w-3.5 shrink-0 text-slate-600 group-hover:text-rose-400" />
                          <span className="flex-1 truncate text-sm text-slate-300 group-hover:text-white">
                            {b.title || "Sans titre"}
                          </span>
                          <StatusBadge kind="severity" value={b.severity} />
                          <span className="hidden text-[11px] text-slate-600 sm:inline">
                            {timeAgo(b.created_at)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.section>

            {/* Theme 2 — Incidents timeline */}
            <motion.section
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="rounded-3xl border border-white/[0.07] bg-[var(--surface)]/60 p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300 ring-1 ring-inset ring-amber-400/20">
                    <History className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-white">Rapport d'incidents</h2>
                    <p className="text-xs text-slate-500">Historique chronologique</p>
                  </div>
                </div>
                <Link
                  href="/incidents"
                  className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 transition hover:text-emerald-300"
                >
                  Tout voir <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {recentIncidents.length === 0 ? (
                <EmptyState
                  title="Aucun incident"
                  description="L'historique des incidents apparaîtra ici."
                  className="py-10"
                />
              ) : (
                <ol className="relative space-y-0">
                  <span className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-amber-400/30 via-white/[0.06] to-transparent" />
                  {recentIncidents.map((inc, idx) => (
                    <li key={inc.id} className="relative pl-7 pb-4 last:pb-0">
                      <span
                        className={cn(
                          "absolute left-0 top-1.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-[var(--surface)]",
                          inc.status === "resolved" || inc.status === "closed"
                            ? "bg-emerald-400"
                            : inc.status === "investigating"
                            ? "bg-amber-400"
                            : "bg-rose-500"
                        )}
                      />
                      <Link href="/incidents" className="group block">
                        <p className="text-sm font-medium text-slate-200 group-hover:text-white">
                          {inc.title || "Sans titre"}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <StatusBadge kind="severity" value={inc.severity} />
                          <StatusBadge kind="incidentStatus" value={inc.status} />
                          <span className="text-[11px] text-slate-600">
                            {inc.occurred_at ? timeAgo(inc.occurred_at) : "—"}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
            </motion.section>
          </div>

          {/* Per-campaign progress bars */}
          {global.progress.length > 0 && (
            <motion.section
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="rounded-3xl border border-white/[0.07] bg-[var(--surface)]/60 p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white">Progression par campagne</h2>
                  <p className="text-xs text-slate-500">Cas exécutés vs objectif total</p>
                </div>
                <Link
                  href="/campagnes"
                  className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 transition hover:text-emerald-300"
                >
                  Gérer <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="space-y-4">
                {global.progress.slice(0, 6).map((p) => (
                  <div key={p.campaign.id}>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-sm font-medium text-slate-200">
                          {p.campaign.name || "Sans nom"}
                        </span>
                        <StatusBadge kind="campaignStatus" value={p.campaign.status} />
                      </div>
                      <span className="shrink-0 font-mono text-xs tabular-nums text-slate-400">
                        {p.ok} OK · {p.ko} KO · {p.executed}/{p.objective}
                      </span>
                    </div>
                    <StackedBar
                      ok={p.ok}
                      ko={p.ko}
                      notExecuted={p.notExecuted}
                      objective={p.objective}
                      height="h-2.5"
                    />
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Algerian loubia spotlight */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={5}
            className="rounded-3xl border border-white/[0.07] bg-[var(--surface)]/60 p-6"
          >
            <div className="mb-5 flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-300 ring-1 ring-inset ring-orange-400/20">
                <Soup className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-white">
                  Pause loubia
                </h2>
                <p className="text-xs text-slate-500">
                  La soupe de haricots blancs à l'algérienne
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-400">
              La loubia est un plat familial algérien, mijoté lentement avec des
              haricots blancs, une sauce tomate parfumée et des épices douces.
              On l'accompagne souvent d'une bonne baguette pour saucer jusqu'à
              la dernière goutte.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Haricots blancs", desc: "Le cœur du plat" },
                { label: "Tomate & ail", desc: "Base de sauce" },
                { label: "Cumin & paprika", desc: "Parfums chauds" },
                { label: "Merguez optionnelle", desc: "Touche gourmande" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-inset ring-white/[0.06]"
                >
                  <p className="text-sm font-medium text-slate-200">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      )}
    </div>
  );
}