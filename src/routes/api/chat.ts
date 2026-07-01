import { createFileRoute } from "@tanstack/react-router";
import { streamText, convertToModelMessages, type UIMessage } from "ai";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: UIMessage[] };
        const messages = body.messages;
        if (!Array.isArray(messages)) return new Response("Missing messages", { status: 400 });

        const { createGateway, DEFAULT_MODEL } = await import("@/lib/ai/gateway.server");
        const { SYSTEM_PROMPTS } = await import("@/lib/ai/prompts");

        const gateway = createGateway();
        const model = gateway(DEFAULT_MODEL);

        const result = streamText({
          model,
          system: SYSTEM_PROMPTS.chat,
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse();
      },
    },
  },
});
