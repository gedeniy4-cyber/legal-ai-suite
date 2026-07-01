// Generic feature page used by Email, Summarizer, Research, Contract Review, etc.
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Markdown } from "@/components/markdown";
import { AttachmentPicker, type UIAttachment } from "@/components/attachment-picker";
import { OutputActions } from "@/components/output-actions";
import { LengthSelector } from "@/components/length-selector";
import { ResponsibleAiNotice } from "@/components/responsible-ai-notice";
import { toast } from "sonner";
import { Sparkles, Loader2, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { canAccess, FEATURES, type FeatureKey, TIER_LABELS } from "@/lib/subscription";
import { runAiFeature } from "@/lib/ai/run.functions";
import { runGuestAi } from "@/lib/ai/guest.functions";
import { Link } from "@tanstack/react-router";

export type FieldSpec = { id: string; label: string; type?: "input" | "textarea" | "select"; placeholder?: string; options?: string[]; rows?: number };

export function AiFeaturePage({
  feature,
  title,
  description,
  fields,
  buildPrompt,
  initialPrompt,
}: {
  feature: FeatureKey;
  title: string;
  description: string;
  fields: FieldSpec[];
  buildPrompt: (values: Record<string, string>) => string;
  initialPrompt?: string;
}) {
  const { isGuest, tier } = useAuth();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.id, ""]))
  );
  const [freeform, setFreeform] = useState(initialPrompt ?? "");
  const [attachments, setAttachments] = useState<UIAttachment[]>([]);
  const [length, setLength] = useState("medium");
  const [customWords, setCustomWords] = useState<number | undefined>();
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const locked = !isGuest && !canAccess(tier, feature);

  const run = async (overridePrompt?: string) => {
    const structured = buildPrompt(values).trim();
    const promptBody = [structured, freeform.trim(), overridePrompt?.trim()].filter(Boolean).join("\n\n");
    if (!promptBody) {
      toast.error("Add some input first");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const payload = {
        feature,
        userPrompt: promptBody,
        attachments: attachments.map((a) => ({ name: a.name, mime: a.mime, dataBase64: a.dataBase64, url: a.url })),
        lengthPreference: length,
        customWords,
      };
      const result = isGuest
        ? await runGuestAi({ data: payload })
        : await runAiFeature({ data: payload });
      setOutput(result.text);
      toast.success("Generated");
    } catch (e) {
      toast.error((e as Error).message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (locked) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-4">
        <Lock className="h-12 w-12 mx-auto text-[--gold]" />
        <h1 className="text-2xl font-bold">{title} is a {TIER_LABELS[FEATURES[feature].minTier]} feature</h1>
        <p className="text-muted-foreground">You're currently on {TIER_LABELS[tier]}. Upgrade to unlock this tool and more.</p>
        <Link to="/pricing"><Button size="lg" className="bg-[--gold] text-[--navy-deep] hover:bg-[--gold]/90">Upgrade now</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            {fields.map((f) => (
              <div key={f.id} className="space-y-1.5">
                <label className="text-sm font-medium">{f.label}</label>
                {f.type === "textarea" ? (
                  <Textarea
                    rows={f.rows ?? 3}
                    placeholder={f.placeholder}
                    value={values[f.id]}
                    onChange={(e) => setValues({ ...values, [f.id]: e.target.value })}
                  />
                ) : f.type === "select" ? (
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={values[f.id]}
                    onChange={(e) => setValues({ ...values, [f.id]: e.target.value })}
                  >
                    <option value="">Select...</option>
                    {(f.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <Input
                    placeholder={f.placeholder}
                    value={values[f.id]}
                    onChange={(e) => setValues({ ...values, [f.id]: e.target.value })}
                  />
                )}
              </div>
            ))}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Additional instructions (optional)</label>
              <Textarea rows={4} placeholder="Any extra context, tone, or constraints..." value={freeform} onChange={(e) => setFreeform(e.target.value)} />
            </div>
            <AttachmentPicker attachments={attachments} onChange={setAttachments} />
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <LengthSelector length={length} onLength={setLength} customWords={customWords} onCustomWords={setCustomWords} />
              <Button onClick={() => run()} disabled={loading} className="bg-[--gold] text-[--navy-deep] hover:bg-[--gold]/90">
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                Generate
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4 min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Output</h2>
              {output && (
                <Button size="sm" variant="ghost" onClick={() => setEditing((v) => !v)}>
                  {editing ? "Preview" : "Edit"}
                </Button>
              )}
            </div>
            <div className="flex-1 overflow-auto">
              {loading && (
                <div className="space-y-2 animate-pulse">
                  <div className="h-3 rounded bg-muted w-3/4" />
                  <div className="h-3 rounded bg-muted w-full" />
                  <div className="h-3 rounded bg-muted w-5/6" />
                  <div className="h-3 rounded bg-muted w-2/3" />
                </div>
              )}
              {!loading && !output && (
                <div className="text-sm text-muted-foreground text-center py-16">
                  Fill in the fields, add attachments if needed, and click Generate.
                </div>
              )}
              {output && !editing && <Markdown text={output} />}
              {output && editing && (
                <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-[400px] font-mono text-xs" />
              )}
            </div>
            {output && (
              <OutputActions
                text={output}
                onRegenerate={() => run()}
                onImprove={() => run("Improve the previous response: refine tone, tighten prose, strengthen argumentation.")}
                onExpand={() => run("Expand the previous response with more detail, examples, and supporting reasoning.")}
                filename={`chambers-${feature}`}
              />
            )}
            <ResponsibleAiNotice />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
