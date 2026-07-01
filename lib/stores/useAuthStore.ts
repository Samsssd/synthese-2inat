"use client";

import { create } from "zustand";
import { createElement, Fragment, useEffect } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { TABLES } from "@/lib/supabase/tables";

export type AuthUser = {
  id: string;
  email: string;
  full_name?: string;
};

interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  init: () => Promise<() => void>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

function mapUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email ?? "",
    full_name: (user.user_metadata?.full_name as string) || undefined,
  };
}

async function upsertProfile(session: Session) {
  const user = session.user;
  const fullName = (user.user_metadata?.full_name as string) || null;
  await supabase
    .from(TABLES.users)
    .upsert(
      { id: user.id, email: user.email ?? "", full_name: fullName },
      { onConflict: "id" }
    );
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  initialized: false,

  init: async () => {
    if (get().initialized) return () => {};
    set({ initialized: true });

    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (session) {
      await upsertProfile(session);
      set({ user: mapUser(session.user), session, loading: false });
    } else {
      set({ user: null, session: null, loading: false });
    }

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          await upsertProfile(session);
          set({ user: mapUser(session.user), session, loading: false });
        } else {
          set({ user: null, session: null, loading: false });
        }
      }
    );

    return () => sub.subscription.unsubscribe();
  },

  signIn: async (email, password) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      set({ loading: false });
      return { error: error.message };
    }
    if (data.session) {
      await upsertProfile(data.session);
      set({ user: mapUser(data.user!), session: data.session, loading: false });
    }
    return {};
  },

  signUp: async (email, password, fullName) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) {
      set({ loading: false });
      return { error: error.message };
    }
    if (data.session) {
      await upsertProfile(data.session);
      set({ user: mapUser(data.user!), session: data.session, loading: false });
      return {};
    }
    // No session returned — fall back to sign-in with the same credentials.
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      set({ loading: false });
      return { error: signInError.message };
    }
    if (signInData.session) {
      await upsertProfile(signInData.session);
      set({
        user: mapUser(signInData.user!),
        session: signInData.session,
        loading: false,
      });
    }
    return {};
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const init = useAuthStore((s) => s.init);
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    init().then((c) => {
      cleanup = c;
    });
    return () => cleanup?.();
  }, [init]);
  return createElement(Fragment, null, children);
}
