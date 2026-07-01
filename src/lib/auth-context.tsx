// Global auth + guest + tier context.
import { useEffect, useState, useCallback, type ReactNode } from "react";
import { createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tier } from "@/lib/subscription";

type AuthUser = { id: string; email: string | null; displayName: string | null };

type AuthState = {
  user: AuthUser | null;
  isGuest: boolean;
  tier: Tier;
  loading: boolean;
  signOut: () => Promise<void>;
  enterGuest: () => void;
  exitGuest: () => void;
  setDemoTier: (t: Tier) => void;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthState>({} as AuthState);

const GUEST_KEY = "chambers.guest";
const DEMO_TIER_KEY = "chambers.demoTier";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [tier, setTier] = useState<Tier>("basic");
  const [loading, setLoading] = useState(true);

  const loadTier = useCallback(async (uid: string, email: string | null) => {
    if (email === "creator@chambersos.com") {
      setTier("premium_business");
      return;
    }
    const { data } = await supabase.from("profiles").select("tier").eq("id", uid).maybeSingle();
    setTier((data?.tier as Tier) ?? "basic");
  }, []);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      setUser({ id: data.user.id, email: data.user.email ?? null, displayName: (data.user.user_metadata?.full_name as string) ?? null });
      setIsGuest(false);
      await loadTier(data.user.id, data.user.email ?? null);
    } else if (typeof window !== "undefined" && localStorage.getItem(GUEST_KEY)) {
      setIsGuest(true);
      const demo = localStorage.getItem(DEMO_TIER_KEY) as Tier | null;
      setTier(demo ?? "premium_business"); // guest is unlimited per spec
    } else {
      setUser(null);
      setIsGuest(false);
    }
    setLoading(false);
  }, [loadTier]);

  useEffect(() => {
    refresh();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        refresh();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    if (typeof window !== "undefined") localStorage.removeItem(GUEST_KEY);
    setUser(null);
    setIsGuest(false);
    setTier("basic");
  }, []);

  const enterGuest = useCallback(() => {
    if (typeof window !== "undefined") localStorage.setItem(GUEST_KEY, "1");
    setIsGuest(true);
    setTier("premium_business");
  }, []);

  const exitGuest = useCallback(() => {
    if (typeof window !== "undefined") localStorage.removeItem(GUEST_KEY);
    setIsGuest(false);
  }, []);

  const setDemoTier = useCallback(async (t: Tier) => {
    setTier(t);
    if (typeof window !== "undefined") localStorage.setItem(DEMO_TIER_KEY, t);
    if (user) {
      await supabase.from("profiles").update({ tier: t }).eq("id", user.id);
    }
  }, [user]);

  return (
    <Ctx.Provider value={{ user, isGuest, tier, loading, signOut, enterGuest, exitGuest, setDemoTier, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
