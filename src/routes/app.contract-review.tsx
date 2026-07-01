import { createFileRoute } from "@tanstack/react-router";
import { AiFeaturePage } from "@/components/ai-feature-page";
export const Route = createFileRoute("/app/contract-review")({ component: () => (
  <AiFeaturePage
    feature="contract_review"
    title="Contract Review"
    description="Identify risks, missing clauses, and suggested redlines."
    fields={[
      { id: "party", label: "Reviewing on behalf of", placeholder: "e.g. The buyer" },
      { id: "goals", label: "Commercial goals", type: "textarea", rows: 3, placeholder: "e.g. Cap our liability, ensure IP assignment on termination" },
      { id: "contract", label: "Contract text (or attach file)", type: "textarea", rows: 10, placeholder: "Paste the contract or attach it below." },
    ]}
    buildPrompt={(v) => `Reviewing on behalf of: ${v.party}\nCommercial goals: ${v.goals}\n\nContract:\n${v.contract}`}
  />
)});
