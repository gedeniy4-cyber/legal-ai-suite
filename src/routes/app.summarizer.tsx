import { createFileRoute } from "@tanstack/react-router";
import { AiFeaturePage } from "@/components/ai-feature-page";
export const Route = createFileRoute("/app/summarizer")({ component: () => (
  <AiFeaturePage
    feature="summarizer"
    title="Meeting Summarizer"
    description="Turn transcripts and notes into decisions, action items, and deadlines."
    fields={[
      { id: "context", label: "Meeting context (optional)", placeholder: "e.g. Client strategy meeting, 30 June 2026" },
      { id: "notes", label: "Notes / Transcript", type: "textarea", rows: 10, placeholder: "Paste raw notes or transcript here, or attach a file below." },
    ]}
    buildPrompt={(v) => `Summarize the following meeting.\nContext: ${v.context || "General meeting"}\n\nNotes:\n${v.notes}`}
  />
)});
