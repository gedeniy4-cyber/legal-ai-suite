// App-internal AI runner. One entry point for all non-streaming features.
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { z } from "zod";
import { SYSTEM_PROMPTS, buildLengthDirective, type FeatureId } from "@/lib/ai/prompts";
import { DAILY_LIMITS, FEATURES, canAccess, type FeatureKey, type Tier } from "@/lib/subscription";

const AttachmentSchema = z.object({
  name: z.string(),
  mime: z.string(),
  dataBase64: z.string().optional(),
  url: z.string().optional(),
});

const InputSchema = z.object({
  feature: z.string(),
  userPrompt: z.string().min(1),
  attachments: z.array(AttachmentSchema).optional(),
  lengthPreference: z.string().optional(),
  customWords: z.number().optional(),
  saveTitle: z.string().optional(),
});

export const runAiFeature = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const feature = data.feature as FeatureKey;
    if (!(feature in FEATURES)) throw new Error("Unknown feature");

    // Load user tier
    const { data: profile } = await supabase.from("profiles").select("tier").eq("id", userId).maybeSingle();
    const tier = (profile?.tier ?? "basic") as Tier;

    // Access check
    if (!canAccess(tier, feature)) {
      throw new Error(`This feature requires ${FEATURES[feature].minTier}. Upgrade to unlock.`);
    }

    // Usage check (unless unlimited)
    const limit = DAILY_LIMITS[tier];
    if (Number.isFinite(limit)) {
      const today = new Date().toISOString().slice(0, 10);
      const { data: usage } = await supabase
        .from("ai_usage")
        .select("count")
        .eq("user_id", userId)
        .eq("usage_date", today)
        .eq("bucket", "standard")
        .maybeSingle();
      const used = usage?.count ?? 0;
      if (used >= limit) {
        throw new Error("You have reached today's AI limit. Upgrade for more requests.");
      }
    }

    // Build prompt + attachments (server-only imports inside handler)
    const { extractAttachmentText } = await import("@/lib/attachments.server");
    const { createGateway, DEFAULT_MODEL } = await import("@/lib/ai/gateway.server");

    let attachmentContext = "";
    const imageParts: Array<{ type: "image"; image: string }> = [];
    for (const a of data.attachments ?? []) {
      if (a.mime.startsWith("image/") && a.dataBase64) {
        imageParts.push({ type: "image", image: `data:${a.mime};base64,${a.dataBase64}` });
      } else {
        attachmentContext += await extractAttachmentText(a);
      }
    }

    const system = SYSTEM_PROMPTS[feature as FeatureId] ?? SYSTEM_PROMPTS.chat;
    const lengthDirective = buildLengthDirective(data.lengthPreference, data.customWords);
    const userText =
      data.userPrompt +
      (attachmentContext ? `\n\n## Attached Context\n${attachmentContext}` : "") +
      lengthDirective;

    const gateway = createGateway();
    const model = gateway(DEFAULT_MODEL);

    const result = await generateText({
      model,
      system,
      messages: [
        {
          role: "user",
          content: imageParts.length
            ? ([{ type: "text", text: userText }, ...imageParts] as never)
            : userText,
        },
      ],
    });

    // Increment usage
    if (Number.isFinite(limit)) {
      const today = new Date().toISOString().slice(0, 10);
      const { data: existing } = await supabase
        .from("ai_usage")
        .select("id,count")
        .eq("user_id", userId)
        .eq("usage_date", today)
        .eq("bucket", "standard")
        .maybeSingle();
      if (existing) {
        await supabase.from("ai_usage").update({ count: existing.count + 1 }).eq("id", existing.id);
      } else {
        await supabase.from("ai_usage").insert({ user_id: userId, usage_date: today, bucket: "standard", count: 1 });
      }
    }

    // Save history
    await supabase.from("history").insert({
      user_id: userId,
      feature,
      title: data.saveTitle ?? data.userPrompt.slice(0, 80),
      prompt: { text: data.userPrompt, attachments: (data.attachments ?? []).map((a) => a.name) },
      output: result.text,
      metadata: { model: DEFAULT_MODEL, length: data.lengthPreference, customWords: data.customWords },
    });

    return { text: result.text };
  });
