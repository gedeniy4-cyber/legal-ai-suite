import { createFileRoute } from "@tanstack/react-router";
import { AiFeaturePage } from "@/components/ai-feature-page";
export const Route = createFileRoute("/app/court-prep")({ component: () => (
  <AiFeaturePage
    feature="court_prep"
    title="Court Preparation Assistant"
    description="Case theory, cross-examination plan, and a complete court-ready pack."
    fields={[
      { id: "role", label: "Your role", type: "select", options: ["Plaintiff/Applicant", "Defendant/Respondent", "Prosecutor", "Defence"] },
      { id: "matter", label: "Matter overview", type: "textarea", rows: 4, placeholder: "e.g. Construction dispute over defective works, R3.2m in issue" },
      { id: "witness", label: "Witness(es) to prepare for", type: "textarea", rows: 3, placeholder: "e.g. Expert engineer for the respondent" },
    ]}
    buildPrompt={(v) => `Role: ${v.role}\nMatter: ${v.matter}\nWitness(es): ${v.witness}`}
  />
)});
