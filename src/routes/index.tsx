import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles, Mail, FileText, ListTodo, Search, MessageSquare, Scale, Check, Star, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { TIER_PRICE_ZAR, formatZAR } from "@/lib/subscription";

const CYCLE = [
  "By Yondela Gedeni",
  "Sponsored by CAPACITI",
  "Built for South African legal minds",
];

export const Route = createFileRoute("/")({
  component: Landing,
});

function CyclingText() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % CYCLE.length), 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="h-6 overflow-hidden text-sm uppercase tracking-widest text-[--gold]">
      <div className="transition-transform duration-500" style={{ transform: `translateY(-${i * 24}px)` }}>
        {CYCLE.map((c) => <div key={c} className="h-6">{c}</div>)}
      </div>
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-[--navy-deep] text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto flex items-center gap-4 px-6 py-5">
        <div className="flex items-center gap-2 font-bold text-lg">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[--gold] to-[--gold-soft] grid place-items-center">
            <Sparkles className="h-4 w-4 text-[--navy-deep]" />
          </div>
          Chambers OS
        </div>
        <div className="hidden md:flex items-center gap-6 ml-8 text-sm text-white/70">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
          <a href="#testimonials" className="hover:text-white">Testimonials</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/auth"><Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">Sign in</Button></Link>
          <Link to="/app"><Button className="bg-[--gold] text-[--navy-deep] hover:bg-[--gold]/90">Launch Workspace</Button></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="absolute inset-0 -z-10 opacity-40">
          <div className="absolute top-20 left-1/4 h-96 w-96 rounded-full bg-[--gold]/20 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-[140px]" />
        </div>

        <div className="text-center max-w-4xl mx-auto animate-fade-up">
          <CyclingText />
          <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
            The AI <span className="gold-text">Operating System</span><br />for Modern Legal Professionals.
          </h1>
          <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
            Draft legal emails, summarize meetings, plan matters, research authorities, and prepare for court — all in one intelligent workspace built for lawyers.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/app"><Button size="lg" className="bg-[--gold] text-[--navy-deep] hover:bg-[--gold]/90 font-semibold">
              Launch Workspace <ArrowRight className="ml-2 h-4 w-4" />
            </Button></Link>
            <a href="mailto:hello@chambersos.com"><Button size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">Book Demo</Button></a>
          </div>
          <div className="mt-6 text-xs text-white/50">No credit card required · Free guest mode · South African Rand pricing</div>
        </div>

        {/* Animated dashboard preview */}
        <div className="mt-16 max-w-5xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-2 shadow-2xl">
            <div className="rounded-xl bg-[--navy-deep] p-6 min-h-[380px] grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Mail, label: "Legal Emails", value: "Drafted 24" },
                { icon: FileText, label: "Meetings Summarized", value: "12 this week" },
                { icon: Search, label: "Research Queries", value: "48 resolved" },
              ].map((c, i) => (
                <div key={c.label} className="glass rounded-xl p-4 animate-float" style={{ animationDelay: `${i * 0.4}s` }}>
                  <c.icon className="h-5 w-5 text-[--gold] mb-3" />
                  <div className="text-xs text-white/60">{c.label}</div>
                  <div className="text-lg font-bold text-white">{c.value}</div>
                </div>
              ))}
              <div className="sm:col-span-3 rounded-xl bg-white/5 p-4 relative overflow-hidden">
                <div className="text-xs text-white/60 mb-2">AI Legal Research · Streaming</div>
                <div className="space-y-2">
                  <div className="h-3 rounded bg-white/10 w-full animate-shimmer" />
                  <div className="h-3 rounded bg-white/10 w-11/12 animate-shimmer" />
                  <div className="h-3 rounded bg-white/10 w-4/5 animate-shimmer" />
                  <div className="h-3 rounded bg-white/10 w-2/3 animate-shimmer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="text-xs uppercase tracking-widest text-[--gold] mb-2">Features</div>
          <h2 className="text-4xl font-bold text-white">Everything a modern practice needs</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Mail, title: "Legal Email Generator", body: "Draft polished correspondence with the right tone in seconds." },
            { icon: FileText, title: "Meeting Summarizer", body: "Turn transcripts into decisions, action items, and deadlines." },
            { icon: ListTodo, title: "Task Planner", body: "Prioritized daily schedules matched to your working hours." },
            { icon: Search, title: "Research Assistant", body: "Structured research with authorities and recommendations." },
            { icon: MessageSquare, title: "AI Legal Chat", body: "Persistent conversations with attachments and long-form output." },
            { icon: Scale, title: "Contract & Court Tools", body: "Contract review, case timelines, argument builder and more (Premium)." },
          ].map((f) => (
            <Card key={f.title} className="glass border-white/10 hover:border-[--gold]/40 transition-colors">
              <CardContent className="pt-6">
                <f.icon className="h-6 w-6 text-[--gold] mb-3" />
                <h3 className="font-semibold text-white">{f.title}</h3>
                <p className="text-sm text-white/60 mt-2">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="text-xs uppercase tracking-widest text-[--gold] mb-2">Loved by legal professionals</div>
          <h2 className="text-4xl font-bold text-white">From students to Senior Counsel</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Thandiwe M.", role: "Candidate Attorney", quote: "Cut my email drafting time in half. Meeting summaries are eerily accurate." },
            { name: "Adv. Sipho R.", role: "Advocate, Johannesburg Bar", quote: "The court prep assistant is my new junior. Structured, thorough, fast." },
            { name: "Ntombi D.", role: "LLB Student, UCT", quote: "Best study tool I've found. Explains complex cases without dumbing them down." },
          ].map((t) => (
            <Card key={t.name} className="glass border-white/10">
              <CardContent className="pt-6">
                <div className="flex gap-0.5 mb-3">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-[--gold] text-[--gold]" />)}</div>
                <p className="text-white/80 text-sm">"{t.quote}"</p>
                <div className="mt-4 text-xs">
                  <div className="text-white font-semibold">{t.name}</div>
                  <div className="text-white/50">{t.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="text-xs uppercase tracking-widest text-[--gold] mb-2">Pricing in ZAR</div>
          <h2 className="text-4xl font-bold text-white">Plans for every stage</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { tier: "basic" as const, name: "Basic", tagline: "For students & starters", features: ["10 AI requests / day", "Legal Email Generator", "Meeting Summarizer", "Limited AI Chat", "Recent history"] },
            { tier: "pro" as const, name: "Pro", tagline: "For practitioners", highlight: true, features: ["Everything in Basic", "50 AI requests / day", "Task Planner", "Research Assistant", "Unlimited history", "Priority processing", "Export documents"] },
            { tier: "premium_single" as const, name: "Premium", tagline: "For power users & firms", features: ["Unlimited AI", "Contract Review", "Case Timeline Generator", "Court Preparation", "Citation Formatter", "Writing Coach", "Team workspaces (Business)"] },
          ].map((p) => (
            <Card key={p.tier} className={`glass border-white/10 ${p.highlight ? "ring-2 ring-[--gold]" : ""} relative`}>
              {p.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-[--gold] text-[--navy-deep] px-3 py-1 rounded-full font-semibold">Most popular</div>}
              <CardContent className="pt-6 space-y-4">
                <div>
                  <div className="text-lg font-bold text-white">{p.name}</div>
                  <div className="text-xs text-white/50">{p.tagline}</div>
                </div>
                <div className="text-3xl font-black text-white">{formatZAR(TIER_PRICE_ZAR[p.tier])}<span className="text-sm font-normal text-white/50">/mo</span></div>
                <ul className="space-y-2 text-sm text-white/70">
                  {p.features.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-[--gold] shrink-0 mt-0.5" /> {f}</li>)}
                </ul>
                <Link to="/pricing" className="block"><Button className="w-full bg-[--gold] text-[--navy-deep] hover:bg-[--gold]/90">Choose {p.name}</Button></Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-6 text-sm text-white/50">
          Premium: Single {formatZAR(699)}/mo · Family (5 users) {formatZAR(1499)}/mo · Business from {formatZAR(4999)}/mo
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-10">Questions</h2>
        <Accordion type="single" collapsible className="text-white">
          <AccordionItem value="a"><AccordionTrigger>Is Chambers OS a substitute for legal advice?</AccordionTrigger><AccordionContent className="text-white/70">No. Chambers OS is an assistant. All outputs must be reviewed and verified by a qualified legal professional before use.</AccordionContent></AccordionItem>
          <AccordionItem value="b"><AccordionTrigger>Can I use it as a guest?</AccordionTrigger><AccordionContent className="text-white/70">Yes — guest mode is fully functional and unlimited. Sign up any time to save your history and access more features.</AccordionContent></AccordionItem>
          <AccordionItem value="c"><AccordionTrigger>Which languages are supported?</AccordionTrigger><AccordionContent className="text-white/70">Interface language options include English, isiZulu, isiXhosa, Afrikaans, Sesotho, Xitsonga, Setswana, Portuguese, French, German, and Spanish.</AccordionContent></AccordionItem>
          <AccordionItem value="d"><AccordionTrigger>What files can I attach?</AccordionTrigger><AccordionContent className="text-white/70">PDF, DOCX, TXT, Markdown, images (vision-analysed), and pasted URLs. Attachments are unlimited.</AccordionContent></AccordionItem>
        </Accordion>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-10 py-10 text-center text-sm text-white/50">
        <div className="mb-2 gold-text font-bold">Chambers OS</div>
        <div>By Yondela Gedeni · Sponsored by CAPACITI</div>
        <div className="mt-2 text-xs">© {new Date().getFullYear()} Chambers OS. All rights reserved.</div>
      </footer>
    </div>
  );
}
