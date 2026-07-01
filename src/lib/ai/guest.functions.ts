// Guest AI runner — no auth required. Used by guest-mode users. Rate-limiting is honor-system.
import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { SYSTEM_PROMPTS, buildLengthDirective, type FeatureId } from "@/lib/ai/prompts";
import { FEATURES, type FeatureKey } from "@/lib/subscription";

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
});

export const runGuestAi = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const feature = data.feature as FeatureKey;
    if (!(feature in FEATURES)) throw new Error("Unknown feature");

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
    const userText =
      data.userPrompt +
      (attachmentContext ? `\n\n## Attached Context\n${attachmentContext}` : "") +
      buildLengthDirective(data.lengthPreference, data.customWords);

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

    return { text: result.text };
  });
