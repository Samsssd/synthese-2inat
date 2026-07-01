"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/tables";
import type {
  BugRow,
  IncidentRow,
  TestCampaignRow,
  TestExecutionRow,
} from "@/lib/supabase/tables";
import { bugsArraySchema } from "@/lib/schemas/bug";
import { incidentsArraySchema } from "@/lib/schemas/incident";
import { testCampaignsArraySchema } from "@/lib/schemas/testCampaign";
import { testExecutionsArraySchema } from "@/lib/schemas/testExecution";

export type CampaignProgress = {
  campaign: TestCampaignRow;
  ok: number;
  ko: number;
  notExecuted: number;
  executed: number;
  objective: number;
  passRate: number;
};

export type GlobalProgress = {
  totalOk: number;
  totalKo: number;
  totalNotExecuted: number;
  totalObjective: number;
  totalExecuted: number;
  passRate: number;
  progress: CampaignProgress[];
};

interface DashboardState {
  bugs: BugRow[];
  incidents: IncidentRow[];
  testCampaigns: TestCampaignRow[];
  testExecutions: TestExecutionRow[];
  loading: boolean;
  error: string | null;
  fetched: boolean;
  fetchDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  bugs: [],
  incidents: [],
  testCampaigns: [],
  testExecutions: [],
  loading: false,
  error: null,
  fetched: false,

  fetchDashboard: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const [bugsRes, incidentsRes, campaignsRes, executionsRes] =
        await Promise.all([
          supabase
            .from(TABLES.bugs)
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from(TABLES.incidents)
            .select("*")
            .order("occurred_at", { ascending: false, nullsFirst: false }),
          supabase
            .from(TABLES.testCampaigns)
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from(TABLES.testExecutions)
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

      if (bugsRes.error) throw bugsRes.error;
      if (incidentsRes.error) throw incidentsRes.error;
      if (campaignsRes.error) throw campaignsRes.error;
      if (executionsRes.error) throw executionsRes.error;

      const bugs = bugsArraySchema.parse(bugsRes.data ?? []);
      const incidents = incidentsArraySchema.parse(incidentsRes.data ?? []);
      const testCampaigns = testCampaignsArraySchema.parse(
        campaignsRes.data ?? []
      );
      const testExecutions = testExecutionsArraySchema.parse(
        executionsRes.data ?? []
      );

      set({
        bugs,
        incidents,
        testCampaigns,
        testExecutions,
        loading: false,
        fetched: true,
      });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Une erreur est survenue.",
        loading: false,
        fetched: true,
      });
    }
  },
}));

// ---- Aggregation helpers (pure functions, usable in any component) ----

export function computeCampaignProgress(
  campaigns: TestCampaignRow[],
  executions: TestExecutionRow[]
): CampaignProgress[] {
  return campaigns.map((campaign) => {
    const execs = executions.filter((e) => e.campaign_id === campaign.id);
    const ok = execs.filter((e) => e.status === "ok").length;
    const ko = execs.filter((e) => e.status === "ko").length;
    const objective = campaign.objective_total ?? 0;
    const executed = ok + ko;
    const notExecuted = Math.max(0, objective - executed);
    const passRate = executed > 0 ? (ok / executed) * 100 : 0;
    return { campaign, ok, ko, notExecuted, executed, objective, passRate };
  });
}

export function computeGlobalProgress(
  campaigns: TestCampaignRow[],
  executions: TestExecutionRow[]
): GlobalProgress {
  const progress = computeCampaignProgress(campaigns, executions);
  const totalOk = progress.reduce((s, p) => s + p.ok, 0);
  const totalKo = progress.reduce((s, p) => s + p.ko, 0);
  const totalObjective = progress.reduce((s, p) => s + p.objective, 0);
  const totalExecuted = totalOk + totalKo;
  const totalNotExecuted = Math.max(0, totalObjective - totalExecuted);
  const passRate = totalExecuted > 0 ? (totalOk / totalExecuted) * 100 : 0;
  return {
    totalOk,
    totalKo,
    totalNotExecuted,
    totalObjective,
    totalExecuted,
    passRate,
    progress,
  };
}
