import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { buildDocentSystemPrompt } from "@/lib/ai-docent-prompt";

export const maxDuration = 30;

export async function POST(req: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "GOOGLE_GENERATIVE_AI_API_KEY가 설정되지 않았습니다. .env.local을 확인해 주세요.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: buildDocentSystemPrompt(),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    sendReasoning: false,
  });
}
