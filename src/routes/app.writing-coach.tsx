import { createFileRoute } from "@tanstack/react-router";
import { AiFeaturePage } from "@/components/ai-feature-page";
export const Route = createFileRoute("/app/writing-coach")({ component: () => (
  <AiFeaturePage
    feature="writing_coach"
    title="Legal Writing Coach"
    description="Feedback and a revised version to sharpen your legal writing."
    fields={[
      { id: "audience", label: "Target reader", placeholder: "e.g. Judge, client, senior partner" },
      { id: "text", label: "Draft text", type: "textarea", rows: 10, placeholder: "Paste your writing here." },
    ]}
    buildPrompt={(v) => `Audience: ${v.audience}\n\nDraft:\n${v.text}`}
  />
)});
