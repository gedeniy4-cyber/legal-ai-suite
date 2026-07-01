// Custom app layout that permits guest access. Not using _authenticated/ because guests must work fully.
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/app")({
  ssr: false,
  component: AppLayout,
});

function AppLayout() {
  const { user, isGuest, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user && !isGuest) {
      navigate({ to: "/auth" });
    }
  }, [user, isGuest, loading, navigate]);

  if (loading || (!user && !isGuest)) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-[--gold]" />
      </div>
    );
  }

  return <AppShell><Outlet /></AppShell>;
}
