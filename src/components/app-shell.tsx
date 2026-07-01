import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { FEATURES, TIER_LABELS, DAILY_LIMITS, canAccess, type FeatureKey } from "@/lib/subscription";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Mail, FileText, ListTodo, Search, MessageSquare, Scale, FileSearch, Clock, Gavel,
  Quote, MessagesSquare, PenTool, LayoutDashboard, History as HistoryIcon, BookOpen,
  Settings, Menu, X, LogOut, Sparkles,
} from "lucide-react";

const NAV: Array<{ label: string; to: string; icon: typeof Mail; feature?: FeatureKey }> = [
  { label: "Dashboard", to: "/app", icon: LayoutDashboard },
  { label: "AI Chat", to: "/app/chat", icon: MessageSquare, feature: "chat" },
  { label: "Email Generator", to: "/app/email", icon: Mail, feature: "email" },
  { label: "Meeting Summarizer", to: "/app/summarizer", icon: FileText, feature: "summarizer" },
  { label: "Task Planner", to: "/app/planner", icon: ListTodo, feature: "planner" },
  { label: "Research", to: "/app/research", icon: Search, feature: "research" },
  { label: "Contract Review", to: "/app/contract-review", icon: Scale, feature: "contract_review" },
  { label: "Document Explainer", to: "/app/doc-explainer", icon: FileSearch, feature: "doc_explainer" },
  { label: "Case Timeline", to: "/app/case-timeline", icon: Clock, feature: "case_timeline" },
  { label: "Court Preparation", to: "/app/court-prep", icon: Gavel, feature: "court_prep" },
  { label: "Citation Formatter", to: "/app/citation", icon: Quote, feature: "citation" },
  { label: "Argument Builder", to: "/app/argument", icon: MessagesSquare, feature: "argument" },
  { label: "Writing Coach", to: "/app/writing-coach", icon: PenTool, feature: "writing_coach" },
  { label: "Prompt Library", to: "/app/prompts", icon: BookOpen },
  { label: "History", to: "/app/history", icon: HistoryIcon },
  { label: "Settings", to: "/app/settings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isGuest, tier, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const limit = DAILY_LIMITS[tier];

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 h-screen z-40 w-72 shrink-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform overflow-y-auto",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="px-6 py-5 flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[--gold] to-[--gold-soft] grid place-items-center shrink-0">
            <Sparkles className="h-5 w-5 text-[--navy-deep]" />
          </div>
          <div className="min-w-0">
            <div className="font-bold tracking-tight truncate">Chambers OS</div>
            <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">{TIER_LABELS[tier]}</div>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="px-3 pb-4 space-y-0.5">
          {NAV.map((n) => {
            const active = pathname === n.to || (n.to !== "/app" && pathname.startsWith(n.to));
            const locked = n.feature ? !canAccess(tier, n.feature) : false;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  active ? "bg-sidebar-accent text-sidebar-primary" : "hover:bg-sidebar-accent/60",
                  locked && "opacity-50"
                )}
              >
                <n.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{n.label}</span>
                {locked && <span className="ml-auto text-[10px] uppercase tracking-widest text-[--gold]">Pro</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/70 mb-2">
            {isGuest ? "Guest mode" : user?.email ?? "Signed in"}
          </div>
          {Number.isFinite(limit) ? (
            <div className="text-xs text-sidebar-foreground/70 mb-3">Daily limit: {limit}</div>
          ) : (
            <div className="text-xs text-[--gold] mb-3">Unlimited AI</div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4 mr-2" /> {isGuest ? "Exit guest" : "Sign out"}
          </Button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 glass border-b border-border/60 px-4 lg:px-8 py-3 flex items-center gap-3">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-sm text-muted-foreground">Chambers OS</div>
          <div className="ml-auto flex items-center gap-2">
            {isGuest && (
              <Link to="/auth" className="text-xs px-3 py-1.5 rounded-full bg-[--gold] text-[--navy-deep] font-semibold hover:opacity-90">
                Save your work — Sign up
              </Link>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
