import { createFileRoute } from "@tanstack/react-router";
import { AiFeaturePage } from "@/components/ai-feature-page";
export const Route = createFileRoute("/app/research")({ component: () => (
  <AiFeaturePage
    feature="research"
    title="Legal Research Assistant"
    description="Structured research briefs with authorities, analysis, and recommendations."
    fields={[
      { id: "question", label: "Research question", type: "textarea", rows: 3, placeholder: "e.g. Is a restraint of trade enforceable if it lacks a geographic scope?" },
      { id: "jurisdiction", label: "Jurisdiction", placeholder: "e.g. South Africa" },
      { id: "objective", label: "Objective", type: "textarea", rows: 3, placeholder: "e.g. Preparing an opinion for a client considering enforcement" },
    ]}
    buildPrompt={(v) => `Research question: ${v.question}\nJurisdiction: ${v.jurisdiction}\nObjective: ${v.objective}`}
  />
)});
