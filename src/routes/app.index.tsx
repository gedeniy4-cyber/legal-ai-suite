import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { DAILY_LIMITS, TIER_LABELS } from "@/lib/subscription";
import { Mail, FileText, Search, MessageSquare, ListTodo, Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

type Counts = { emails: number; summaries: number; research: number; chats: number; tasks: number };
type HistoryRow = { feature: string; title: string | null; created_at: string };

function Dashboard() {
  const { user, isGuest, tier } = useAuth();
  const [used, setUsed] = useState(0);
  const [counts, setCounts] = useState<Counts>({ emails: 0, summaries: 0, research: 0, chats: 0, tasks: 0 });
  const [recent, setRecent] = useState<HistoryRow[]>([]);
  const limit = DAILY_LIMITS[tier];

  useEffect(() => {
    (async () => {
      if (!user) return;
      const today = new Date().toISOString().slice(0, 10);
      const { data: usage } = await supabase.from("ai_usage").select("count").eq("user_id", user.id).eq("usage_date", today).maybeSingle();
      setUsed(usage?.count ?? 0);
      const { data: hist } = await supabase.from("history").select("feature,title,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
      const rows = (hist ?? []) as HistoryRow[];
      setRecent(rows.slice(0, 5));
      const c: Counts = { emails: 0, summaries: 0, research: 0, chats: 0, tasks: 0 };
      for (const r of rows) {
        if (r.feature === "email") c.emails++;
        else if (r.feature === "summarizer") c.summaries++;
        else if (r.feature === "research") c.research++;
        else if (r.feature === "chat") c.chats++;
        else if (r.feature === "planner") c.tasks++;
      }
      setCounts(c);
    })();
  }, [user]);

  const pct = Number.isFinite(limit) ? Math.min(100, (used / limit) * 100) : 100;

  return (
    <div className="space-y-6 animate-fade-up">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Welcome{user?.displayName ? `, ${user.displayName}` : isGuest ? ", guest" : ""}</h1>
        <p className="text-muted-foreground">Your AI legal workspace at a glance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Plan</div>
          <div className="text-lg font-bold mt-1">{TIER_LABELS[tier]}</div>
          <Link to="/pricing"><Button size="sm" variant="link" className="px-0 text-[--gold]">Change plan →</Button></Link>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">AI Requests Today</div>
          <div className="text-lg font-bold mt-1">{Number.isFinite(limit) ? `${used} / ${limit}` : "Unlimited"}</div>
          {Number.isFinite(limit) && <Progress value={pct} className="mt-2 h-1.5" />}
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Emails Generated</div>
          <div className="text-lg font-bold mt-1">{counts.emails}</div>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Chats</div>
          <div className="text-lg font-bold mt-1">{counts.chats}</div>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2"><CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4"><Sparkles className="h-4 w-4 text-[--gold]" /><h2 className="font-semibold">Quick actions</h2></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { to: "/app/chat", icon: MessageSquare, label: "New chat" },
              { to: "/app/email", icon: Mail, label: "Draft email" },
              { to: "/app/summarizer", icon: FileText, label: "Summarize" },
              { to: "/app/research", icon: Search, label: "Research" },
              { to: "/app/planner", icon: ListTodo, label: "Plan tasks" },
              { to: "/app/prompts", icon: Sparkles, label: "Prompt library" },
            ].map((q) => (
              <Link key={q.to} to={q.to} className="p-4 rounded-xl border border-border hover:border-[--gold]/60 hover:bg-accent/30 transition-colors">
                <q.icon className="h-4 w-4 text-[--gold] mb-2" />
                <div className="text-sm font-medium">{q.label}</div>
              </Link>
            ))}
          </div>
        </CardContent></Card>

        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4"><TrendingUp className="h-4 w-4 text-[--gold]" /><h2 className="font-semibold">Weekly analytics</h2></div>
          {Object.values(counts).every((n) => n === 0) ? (
            <div className="text-sm text-muted-foreground py-8 text-center">Start using Chambers OS to see analytics.</div>
          ) : (
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between"><span>Emails</span><span className="font-semibold">{counts.emails}</span></li>
              <li className="flex justify-between"><span>Summaries</span><span className="font-semibold">{counts.summaries}</span></li>
              <li className="flex justify-between"><span>Research</span><span className="font-semibold">{counts.research}</span></li>
              <li className="flex justify-between"><span>Chats</span><span className="font-semibold">{counts.chats}</span></li>
              <li className="flex justify-between"><span>Tasks</span><span className="font-semibold">{counts.tasks}</span></li>
            </ul>
          )}
        </CardContent></Card>
      </div>

      <Card><CardContent className="pt-6">
        <h2 className="font-semibold mb-3">Recent activity</h2>
        {recent.length === 0 ? (
          <div className="text-sm text-muted-foreground py-6 text-center">No activity yet.</div>
        ) : (
          <ul className="divide-y divide-border/50">
            {recent.map((r, i) => (
              <li key={i} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{r.title ?? r.feature}</div>
                  <div className="text-xs text-muted-foreground">{r.feature} · {new Date(r.created_at).toLocaleString()}</div>
                </div>
                <Link to="/app/history"><Button size="sm" variant="ghost">Open</Button></Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent></Card>
    </div>
  );
}
