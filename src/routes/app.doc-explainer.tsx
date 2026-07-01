import { createFileRoute } from "@tanstack/react-router";
import { AiFeaturePage } from "@/components/ai-feature-page";
export const Route = createFileRoute("/app/doc-explainer")({ component: () => (
  <AiFeaturePage
    feature="doc_explainer"
    title="Legal Document Explainer"
    description="Translate complex legal documents into plain language for any audience."
    fields={[
      { id: "audience", label: "Audience", placeholder: "e.g. First-time home buyer, non-lawyer client" },
      { id: "doc", label: "Document text (or attach)", type: "textarea", rows: 10, placeholder: "Paste the document or attach it below." },
    ]}
    buildPrompt={(v) => `Audience: ${v.audience}\n\nDocument:\n${v.doc}`}
  />
)});
