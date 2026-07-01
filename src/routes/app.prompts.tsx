import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PROMPT_LIBRARY } from "@/lib/ai/prompts";

const FEATURE_ROUTES: Record<string, string> = {
  email: "/app/email", research: "/app/research", court_prep: "/app/court-prep", chat: "/app/chat",
};

export const Route = createFileRoute("/app/prompts")({ component: PromptLibrary });

function PromptLibrary() {
  const navigate = useNavigate();
  const cats = Array.from(new Set(PROMPT_LIBRARY.map((p) => p.category)));
  return (
    <div className="space-y-6 animate-fade-up">
      <header>
        <h1 className="text-3xl font-bold">Prompt Library</h1>
        <p className="text-muted-foreground">Ready-made prompts to jump-start any task.</p>
      </header>
      {cats.map((cat) => (
        <div key={cat}>
          <h2 className="text-sm uppercase tracking-widest text-[--gold] mb-3">{cat}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {PROMPT_LIBRARY.filter((p) => p.category === cat).map((p) => (
              <Card key={p.title}><CardContent className="pt-5 flex flex-col gap-3">
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-muted-foreground mt-1 line-clamp-3">{p.prompt}</div>
                </div>
                <Button size="sm" variant="outline" className="self-start" onClick={() => {
                  const route = FEATURE_ROUTES[p.feature] ?? "/app/chat";
                  sessionStorage.setItem("chambers.prefill", p.prompt);
                  navigate({ to: route });
                }}>Use prompt →</Button>
              </CardContent></Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
