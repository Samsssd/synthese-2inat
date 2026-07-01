-- ============================================================
-- Synthèse — QA dashboard (app_828e9e48)
-- Idempotent DDL: GRANT + RLS + permissive policies for every table.
-- ============================================================

-- 1. Users (profile table — id mirrors auth.users)
CREATE TABLE IF NOT EXISTS public.app_828e9e48_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  phone text,
  role text default 'member',
  created_at timestamptz not null default now()
);

-- 2. Bugs
CREATE TABLE IF NOT EXISTS public.app_828e9e48_bugs (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  status text,
  severity text,
  assigned_to uuid references public.app_828e9e48_users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- 3. Incidents (depends on users + bugs)
CREATE TABLE IF NOT EXISTS public.app_828e9e48_incidents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.app_828e9e48_users(id) on delete set null,
  title text,
  description text,
  occurred_at timestamptz,
  severity text,
  status text,
  bug_id uuid references public.app_828e9e48_bugs(id) on delete set null,
  created_at timestamptz not null default now()
);

-- 4. Test campaigns
CREATE TABLE IF NOT EXISTS public.app_828e9e48_test_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text,
  objective_total integer,
  status text,
  created_at timestamptz not null default now()
);

-- 5. Test executions (depends on users + test_campaigns)
CREATE TABLE IF NOT EXISTS public.app_828e9e48_test_executions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.app_828e9e48_users(id) on delete set null,
  test_case_name text,
  status text,
  campaign_id uuid references public.app_828e9e48_test_campaigns(id) on delete cascade,
  executed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Grants + Row Level Security + permissive policies
-- ============================================================

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'app_828e9e48_users',
    'app_828e9e48_bugs',
    'app_828e9e48_incidents',
    'app_828e9e48_test_campaigns',
    'app_828e9e48_test_executions'
  ]
  LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO anon;', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated;', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', t || '_anon_all', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO anon USING (true) WITH CHECK (true);',
      t || '_anon_all', t
    );

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', t || '_auth_all', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true);',
      t || '_auth_all', t
    );
  END LOOP;
END $$;
