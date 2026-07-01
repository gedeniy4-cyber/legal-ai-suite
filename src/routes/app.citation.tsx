import { createFileRoute } from "@tanstack/react-router";
import { AiFeaturePage } from "@/components/ai-feature-page";
export const Route = createFileRoute("/app/citation")({ component: () => (
  <AiFeaturePage
    feature="citation"
    title="Citation Formatter"
    description="Convert scrappy references into clean, properly formatted citations."
    fields={[
      { id: "style", label: "Citation style", type: "select", options: ["OSCOLA", "Bluebook", "South African case-law style", "APA legal", "Harvard legal"] },
      { id: "raw", label: "Raw references", type: "textarea", rows: 8, placeholder: "Paste rough references, one per line." },
    ]}
    buildPrompt={(v) => `Style: ${v.style}\n\nReferences:\n${v.raw}`}
  />
)});
