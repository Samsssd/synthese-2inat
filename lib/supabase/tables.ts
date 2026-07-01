// Central registry of every Supabase table for this app.
// Use TABLES.* everywhere — never type a raw table-name string.

export const TABLES = {
  users: "app_828e9e48_users",
  bugs: "app_828e9e48_bugs",
  incidents: "app_828e9e48_incidents",
  testCampaigns: "app_828e9e48_test_campaigns",
  testExecutions: "app_828e9e48_test_executions",
} as const;

export type UserRow = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: string | null;
  created_at: string;
};

export type BugRow = {
  id: string;
  title: string | null;
  description: string | null;
  status: string | null;
  severity: string | null;
  assigned_to: string | null;
  created_at: string;
};

export type IncidentRow = {
  id: string;
  user_id: string | null;
  title: string | null;
  description: string | null;
  occurred_at: string | null;
  severity: string | null;
  status: string | null;
  bug_id: string | null;
  created_at: string;
};

export type TestCampaignRow = {
  id: string;
  name: string | null;
  objective_total: number | null;
  status: string | null;
  created_at: string;
};

export type TestExecutionRow = {
  id: string;
  user_id: string | null;
  test_case_name: string | null;
  status: string | null;
  campaign_id: string | null;
  executed_at: string | null;
  created_at: string;
};
