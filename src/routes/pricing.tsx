import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { TIER_LABELS, TIER_PRICE_ZAR, formatZAR, type Tier } from "@/lib/subscription";
import { toast } from "sonner";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — Chambers OS" }, { name: "description", content: "Chambers OS plans in South African Rand. Basic free, Pro R299, Premium from R699." }] }),
  component: Pricing,
});

const PLANS: Array<{ tier: Tier; name: string; features: string[]; note?: string }> = [
  { tier: "basic", name: "Basic", features: ["10 AI requests / day", "Legal Email Generator", "Meeting Summarizer", "Limited AI Chat", "Recent history"] },
  { tier: "pro", name: "Pro", features: ["Everything in Basic", "50 AI requests / day", "Task Planner", "Research Assistant", "Unlimited history", "Priority processing", "Export documents"] },
  { tier: "premium_single", name: "Premium — Single", features: ["Unlimited AI", "All Premium tools", "Saved workspaces", "Priority AI"] },
  { tier: "premium_family", name: "Premium — Family (5)", features: ["Everything in Premium Single", "Up to 5 users", "Shared workspaces"] },
  { tier: "premium_business", name: "Premium — Business", features: ["Everything above", "Team analytics", "Admin controls", "Early-access features"], note: "Starts from" },
];

function Pricing() {
  const { setDemoTier } = useAuth();
  const navigate = useNavigate();

  const choose = (t: Tier) => {
    setDemoTier(t);
    toast.success(`Subscription activated: ${TIER_LABELS[t]}`);
    navigate({ to: "/app" });
  };

  return (
    <div className="min-h-screen bg-[--navy-deep] text-white p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-10 animate-fade-up">
        <header className="text-center">
          <div className="text-xs uppercase tracking-widest text-[--gold] mb-2">Pricing in ZAR</div>
          <h1 className="text-4xl font-black">Choose your plan</h1>
          <p className="text-white/60 mt-2">Simulated payment — instant activation.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLANS.map((p) => (
            <Card key={p.tier} className="glass border-white/10">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <div className="font-bold text-white">{p.name}</div>
                  <div className="text-3xl font-black text-white mt-2">
                    {p.note && <span className="text-sm font-normal text-white/50">{p.note} </span>}
                    {formatZAR(TIER_PRICE_ZAR[p.tier])}<span className="text-sm font-normal text-white/50">/mo</span>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-white/70">
                  {p.features.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-[--gold] shrink-0 mt-0.5" />{f}</li>)}
                </ul>
                <Button className="w-full bg-[--gold] text-[--navy-deep] hover:bg-[--gold]/90" onClick={() => choose(p.tier)}>Choose {p.name}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center text-xs text-white/40">By Yondela Gedeni · Sponsored by CAPACITI</div>
      </div>
    </div>
  );
}
