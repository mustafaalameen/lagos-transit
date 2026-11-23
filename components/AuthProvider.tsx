"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";

type AuthState = { session: Session | null; loading: boolean; error: string | null };
const AuthContext = createContext<AuthState | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ session: null, loading: true, error: null });

  useEffect(() => {
    let active = true;
    let eventReceived = false;
    let unsubscribe: (() => void) | undefined;
    const failed = () => {
      if (active) setState({ session: null, loading: false, error: "Account services are unavailable. Please refresh and try again." });
    };
    try {
      const client = getSupabase();
      const { data } = client.auth.onAuthStateChange((_event, session) => {
        eventReceived = true;
        if (active) setState({ session, loading: false, error: null });
      });
      unsubscribe = () => data.subscription.unsubscribe();
      client.auth.getSession().then(({ data, error }) => {
        if (!active || eventReceived) return;
        if (error) failed();
        else setState({ session: data.session, loading: false, error: null });
      }).catch(failed);
    } catch {
      failed();
    }
    return () => { active = false; unsubscribe?.(); };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const state = useContext(AuthContext);
  if (!state) throw new Error("useAuth must be used inside AuthProvider.");
  return state;
}
