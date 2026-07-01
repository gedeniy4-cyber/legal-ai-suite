import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Markdown } from "@/components/markdown";
import { Star, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

type Row = { id: string; feature: string; title: string | null; output: string | null; favorite: boolean; created_at: string };

export const Route = createFileRoute("/app/history")({ component: History });

function History() {
  const { user, isGuest } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("history").select("id,feature,title,output,favorite,created_at").eq("user_id", user.id).order("created_at", { ascending: false });
    setRows((data ?? []) as Row[]);
  };
  useEffect(() => { load(); }, [user]);

  const toggleFav = async (id: string, v: boolean) => {
    await supabase.from("history").update({ favorite: v }).eq("id", id);
    load();
  };
  const del = async (id: string) => {
    await supabase.from("history").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };

  const filtered = rows.filter((r) => !q || (r.title ?? "").toLowerCase().includes(q.toLowerCase()) || r.feature.includes(q.toLowerCase()));

  if (isGuest) {
    return <div className="max-w-2xl py-16 text-center space-y-3">
      <h1 className="text-2xl font-bold">History requires an account</h1>
      <p className="text-muted-foreground">Guest sessions don't save to the cloud. Sign up to keep your work.</p>
    </div>;
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <header>
        <h1 className="text-3xl font-bold">History</h1>
        <p className="text-muted-foreground">Every generation you've made.</p>
      </header>
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
      </div>
      {filtered.length === 0 ? (
        <Card><CardContent className="pt-10 pb-10 text-center text-muted-foreground">No history yet.</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => (
            <Card key={r.id}><CardContent className="pt-4">
              <div className="flex items-center justify-between gap-3">
                <button className="text-left flex-1 min-w-0" onClick={() => setOpen(open === r.id ? null : r.id)}>
                  <div className="font-medium truncate">{r.title ?? r.feature}</div>
                  <div className="text-xs text-muted-foreground">{r.feature} · {new Date(r.created_at).toLocaleString()}</div>
                </button>
                <Button size="icon" variant="ghost" onClick={() => toggleFav(r.id, !r.favorite)}>
                  <Star className={`h-4 w-4 ${r.favorite ? "fill-[--gold] text-[--gold]" : ""}`} />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => del(r.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
              {open === r.id && r.output && (
                <div className="mt-4 p-4 rounded-lg bg-muted/40 max-h-96 overflow-auto"><Markdown text={r.output} /></div>
              )}
            </CardContent></Card>
          ))}
        </div>
      )}
    </div>
  );
}
