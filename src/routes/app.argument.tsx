import { createFileRoute } from "@tanstack/react-router";
import { AiFeaturePage } from "@/components/ai-feature-page";
export const Route = createFileRoute("/app/argument")({ component: () => (
  <AiFeaturePage
    feature="argument"
    title="Argument Builder"
    description="Build a structured argument with anticipated counter-arguments and rebuttals."
    fields={[
      { id: "position", label: "Position to advance", type: "textarea", rows: 3, placeholder: "e.g. The restraint of trade is unenforceable as against public policy." },
      { id: "authorities", label: "Known authorities (optional)", type: "textarea", rows: 3, placeholder: "e.g. Basson v Chilwan; Magna Alloys" },
      { id: "context", label: "Context", type: "textarea", rows: 3 },
    ]}
    buildPrompt={(v) => `Position: ${v.position}\nAuthorities: ${v.authorities}\nContext: ${v.context}`}
  />
)});
