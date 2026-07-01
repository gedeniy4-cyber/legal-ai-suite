import { createFileRoute } from "@tanstack/react-router";
import { AiFeaturePage } from "@/components/ai-feature-page";
export const Route = createFileRoute("/app/email")({ component: () => (
  <AiFeaturePage
    feature="email"
    title="Legal Email Generator"
    description="Draft polished legal correspondence in seconds."
    fields={[
      { id: "recipient", label: "Recipient", placeholder: "e.g. Mr J. Nkosi, Opposing Counsel" },
      { id: "matter", label: "Matter / Reference", placeholder: "e.g. Nkosi v Standard Bank, Case 12345/24" },
      { id: "purpose", label: "Purpose", type: "textarea", rows: 3, placeholder: "e.g. Request a 14-day extension for discovery" },
      { id: "tone", label: "Tone", type: "select", options: ["Formal", "Professional & warm", "Firm", "Conciliatory", "Urgent"] },
    ]}
    buildPrompt={(v) => `Draft a legal email.\n- Recipient: ${v.recipient}\n- Matter: ${v.matter}\n- Purpose: ${v.purpose}\n- Tone: ${v.tone || "Professional"}`}
  />
)});
