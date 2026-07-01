"use server";

import { createServerClient } from "@/lib/supabase/server";
import { TABLES } from "@/lib/supabase/tables";
import type {
  BugRow,
  IncidentRow,
  TestCampaignRow,
  TestExecutionRow,
} from "@/lib/supabase/tables";
import {
  bugInsertSchema,
  bugUpdateSchema,
} from "@/lib/schemas/bug";
import {
  incidentInsertSchema,
  incidentUpdateSchema,
} from "@/lib/schemas/incident";
import {
  testCampaignInsertSchema,
  testCampaignUpdateSchema,
} from "@/lib/schemas/testCampaign";
import {
  testExecutionInsertSchema,
  testExecutionUpdateSchema,
} from "@/lib/schemas/testExecution";
import type { InsertBug, UpdateBug } from "@/lib/schemas/bug";
import type {
  InsertIncident,
  UpdateIncident,
} from "@/lib/schemas/incident";
import type {
  InsertTestCampaign,
  UpdateTestCampaign,
} from "@/lib/schemas/testCampaign";
import type {
  InsertTestExecution,
  UpdateTestExecution,
} from "@/lib/schemas/testExecution";

type Result<T> = { data: T } | { error: string };

async function currentUserId(): Promise<string | null> {
  const client = createServerClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  return user?.id ?? null;
}

function firstIssue(zodError: { issues: { message: string }[] }): string {
  return zodError.issues[0]?.message ?? "Données invalides.";
}

// ============================================================
// BUGS
// ============================================================

export async function createBug(input: InsertBug): Promise<Result<BugRow>> {
  const parsed = bugInsertSchema.safeParse(input);
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const client = createServerClient();
  const { data, error } = await client
    .from(TABLES.bugs)
    .insert(parsed.data)
    .select()
    .single();
  if (error) return { error: error.message };
  return { data: data as BugRow };
}

export async function updateBug(
  id: string,
  input: UpdateBug
): Promise<Result<BugRow>> {
  const parsed = bugUpdateSchema.safeParse(input);
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const client = createServerClient();
  const { data, error } = await client
    .from(TABLES.bugs)
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();
  if (error) return { error: error.message };
  return { data: data as BugRow };
}

export async function deleteBug(id: string): Promise<Result<{ id: string }>> {
  const client = createServerClient();
  const { error } = await client.from(TABLES.bugs).delete().eq("id", id);
  if (error) return { error: error.message };
  return { data: { id } };
}

// ============================================================
// INCIDENTS
// ============================================================

export async function createIncident(
  input: InsertIncident
): Promise<Result<IncidentRow>> {
  const parsed = incidentInsertSchema.safeParse(input);
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const userId = await currentUserId();
  const client = createServerClient();
  const payload = { ...parsed.data, user_id: parsed.data.user_id ?? userId };
  const { data, error } = await client
    .from(TABLES.incidents)
    .insert(payload)
    .select()
    .single();
  if (error) return { error: error.message };
  return { data: data as IncidentRow };
}

export async function updateIncident(
  id: string,
  input: UpdateIncident
): Promise<Result<IncidentRow>> {
  const parsed = incidentUpdateSchema.safeParse(input);
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const client = createServerClient();
  const { data, error } = await client
    .from(TABLES.incidents)
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();
  if (error) return { error: error.message };
  return { data: data as IncidentRow };
}

export async function deleteIncident(
  id: string
): Promise<Result<{ id: string }>> {
  const client = createServerClient();
  const { error } = await client.from(TABLES.incidents).delete().eq("id", id);
  if (error) return { error: error.message };
  return { data: { id } };
}

// ============================================================
// TEST CAMPAIGNS
// ============================================================

export async function createTestCampaign(
  input: InsertTestCampaign
): Promise<Result<TestCampaignRow>> {
  const parsed = testCampaignInsertSchema.safeParse(input);
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const client = createServerClient();
  const { data, error } = await client
    .from(TABLES.testCampaigns)
    .insert(parsed.data)
    .select()
    .single();
  if (error) return { error: error.message };
  return { data: data as TestCampaignRow };
}

export async function updateTestCampaign(
  id: string,
  input: UpdateTestCampaign
): Promise<Result<TestCampaignRow>> {
  const parsed = testCampaignUpdateSchema.safeParse(input);
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const client = createServerClient();
  const { data, error } = await client
    .from(TABLES.testCampaigns)
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();
  if (error) return { error: error.message };
  return { data: data as TestCampaignRow };
}

export async function deleteTestCampaign(
  id: string
): Promise<Result<{ id: string }>> {
  const client = createServerClient();
  const { error } = await client
    .from(TABLES.testCampaigns)
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };
  return { data: { id } };
}

// ============================================================
// TEST EXECUTIONS
// ============================================================

export async function createTestExecution(
  input: InsertTestExecution
): Promise<Result<TestExecutionRow>> {
  const parsed = testExecutionInsertSchema.safeParse(input);
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const userId = await currentUserId();
  const client = createServerClient();
  const payload = { ...parsed.data, user_id: parsed.data.user_id ?? userId };
  const { data, error } = await client
    .from(TABLES.testExecutions)
    .insert(payload)
    .select()
    .single();
  if (error) return { error: error.message };
  return { data: data as TestExecutionRow };
}

export async function updateTestExecution(
  id: string,
  input: UpdateTestExecution
): Promise<Result<TestExecutionRow>> {
  const parsed = testExecutionUpdateSchema.safeParse(input);
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const client = createServerClient();
  const { data, error } = await client
    .from(TABLES.testExecutions)
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();
  if (error) return { error: error.message };
  return { data: data as TestExecutionRow };
}

export async function deleteTestExecution(
  id: string
): Promise<Result<{ id: string }>> {
  const client = createServerClient();
  const { error } = await client
    .from(TABLES.testExecutions)
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };
  return { data: { id } };
}
