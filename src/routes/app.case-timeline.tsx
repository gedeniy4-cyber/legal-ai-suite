import { createFileRoute } from "@tanstack/react-router";
import { AiFeaturePage } from "@/components/ai-feature-page";
export const Route = createFileRoute("/app/case-timeline")({ component: () => (
  <AiFeaturePage
    feature="case_timeline"
    title="Case Timeline Generator"
    description="Extract a chronological timeline of events, filings, and deadlines."
    fields={[
      { id: "case", label: "Case / matter", placeholder: "e.g. Smith v Jones, HC 4567/24" },
      { id: "material", label: "Source material", type: "textarea", rows: 10, placeholder: "Paste pleadings, correspondence, or attach documents." },
    ]}
    buildPrompt={(v) => `Case: ${v.case}\n\nSource material:\n${v.material}`}
  />
)});
