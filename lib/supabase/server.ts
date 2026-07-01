import { createClient as supabaseCreateClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Server-side client safe to import into "use server" actions.
// Uses the anon key (RLS applies). For user-owned rows the action calls
// auth.getUser() and stamps user_id when a session is available.
export function createServerClient() {
  return supabaseCreateClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
