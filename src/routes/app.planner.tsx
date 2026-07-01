import { createFileRoute } from "@tanstack/react-router";
import { AiFeaturePage } from "@/components/ai-feature-page";
export const Route = createFileRoute("/app/planner")({ component: () => (
  <AiFeaturePage
    feature="planner"
    title="Task Planner"
    description="Turn your task list into a prioritised, time-blocked schedule."
    fields={[
      { id: "tasks", label: "Tasks (one per line, include deadlines if any)", type: "textarea", rows: 8, placeholder: "e.g. Draft heads of argument — due Fri\nCall client re: settlement — this week" },
      { id: "hours", label: "Working hours", placeholder: "e.g. 08:00 – 18:00, Mon–Fri" },
      { id: "constraints", label: "Constraints / preferences", type: "textarea", rows: 3, placeholder: "e.g. Court appearance Thursday morning" },
    ]}
    buildPrompt={(v) => `Build a prioritized daily & weekly plan.\nWorking hours: ${v.hours}\nConstraints: ${v.constraints}\n\nTasks:\n${v.tasks}`}
  />
)});
