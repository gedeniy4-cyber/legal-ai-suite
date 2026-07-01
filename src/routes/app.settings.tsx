import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { LANGUAGES } from "@/lib/i18n";
import { TIER_LABELS, type Tier } from "@/lib/subscription";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings")({ component: Settings });

function Settings() {
  const { user, isGuest, tier, setDemoTier } = useAuth();
  const [lang, setLang] = useState("en");
  const [name, setName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setLang(localStorage.getItem("chambers.lang") ?? "en");
  }, []);

  const saveProfile = async () => {
    if (!user) return;
    await supabase.from("profiles").update({ display_name: name, language: lang }).eq("id", user.id);
    if (typeof window !== "undefined") localStorage.setItem("chambers.lang", lang);
    toast.success("Saved");
  };

  const clearHistory = async () => {
    if (!user) return;
    if (!confirm("Delete all history? This cannot be undone.")) return;
    await supabase.from("history").delete().eq("user_id", user.id);
    toast.success("History cleared");
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="space-y-6 animate-fade-up max-w-3xl">
      <header>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </header>

      <Card><CardContent className="pt-6 space-y-4">
        <h2 className="font-semibold">Profile</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Display name</label>
            <input className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <input className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm" disabled value={user?.email ?? "Guest"} />
          </div>
        </div>
        <Button onClick={saveProfile} disabled={isGuest} className="bg-[--gold] text-[--navy-deep] hover:bg-[--gold]/90">Save</Button>
      </CardContent></Card>

      <Card><CardContent className="pt-6 space-y-4">
        <h2 className="font-semibold">Appearance & Language</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Language</label>
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{LANGUAGES.map((l) => <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="outline" onClick={toggleTheme}>Toggle dark mode</Button>
          </div>
        </div>
      </CardContent></Card>

      <Card><CardContent className="pt-6 space-y-4">
        <h2 className="font-semibold">Subscription</h2>
        <p className="text-sm text-muted-foreground">Current: <strong>{TIER_LABELS[tier]}</strong> {isGuest && "(guest mode: unlimited)"}</p>
        <div className="flex flex-wrap gap-2">
          {(["basic", "pro", "premium_single", "premium_family", "premium_business"] as Tier[]).map((t) => (
            <Button key={t} size="sm" variant={t === tier ? "default" : "outline"} onClick={() => { setDemoTier(t); toast.success(`Switched to ${TIER_LABELS[t]}`); }}>
              {TIER_LABELS[t]}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">This is a simulated payment flow — no charge is made.</p>
      </CardContent></Card>

      <Card><CardContent className="pt-6 space-y-3">
        <h2 className="font-semibold">Data</h2>
        <Button variant="destructive" onClick={clearHistory} disabled={isGuest}>Delete all history</Button>
      </CardContent></Card>
    </div>
  );
}
