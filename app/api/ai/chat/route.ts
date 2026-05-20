import { openai } from "@/lib/openai";

type OpenAIChatCompletionLike = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  output?: Array<{
    content?: Array<{
      text?: string | null;
    }>;
  }>;
};

type ErrorLike = {
  message?: string;
  status?: number;
  response?: {
    status?: number;
    data?: unknown;
  };
};

function getOpenAIReply(result: unknown) {
  const completion = result as OpenAIChatCompletionLike;

  return (
    completion.choices?.[0]?.message?.content ??
    completion.output?.[0]?.content?.[0]?.text ??
    null
  );
}

function getErrorStatus(error: unknown) {
  const knownError = error as ErrorLike;

  return knownError.status ?? knownError.response?.status;
}

function getErrorDetail(error: unknown) {
  const knownError = error as ErrorLike;

  return knownError.response?.data ?? knownError.response ?? null;
}

function buildLocalChatReply(message: string) {
  const snippet = (message || "").slice(0, 300);
  return (
    "AI quota exceeded — local fallback reply.\n" +
    "I couldn't reach the external AI service right now, but here's a simple response based on your message:\n\n" +
    snippet
  );
}

export async function POST(
  req: Request
) {
  try {
    const body = (await req.json()) as { message?: string };
    const message = body.message ?? "";

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not set");
      return Response.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    const modelsToTry = [process.env.OPENAI_MODEL, "gpt-4o-mini", "gpt-4.1-mini"].filter(
      Boolean
    ) as string[];

    let completion: unknown = null;
    let lastError: unknown = null;

    for (const model of [...new Set(modelsToTry)]) {
      try {
        completion = await openai.chat.completions.create({
          model,
          messages: [
            {
              role: "system",
              content: "You are EduCore AI Assistant.",
            },
            { role: "user", content: message },
          ],
        });
        break;
      } catch (err: unknown) {
        lastError = err;
      }
    }

    if (!completion) {
      const status = getErrorStatus(lastError);
      const messageText = String((lastError as ErrorLike)?.message ?? "").toLowerCase();
      const isQuotaError = status === 429 || messageText.includes("quota") || messageText.includes("billing");

      if (isQuotaError) {
        return Response.json({ reply: buildLocalChatReply(message), fallback: "local", reason: "quota" });
      }

      throw lastError ?? new Error("No OpenAI model call succeeded");
    }

    const reply = getOpenAIReply(completion);

    return Response.json({ reply });
  } catch (error: unknown) {
    console.error("/api/ai/chat error:", error);

    const detail = getErrorDetail(error);
    const knownError = error as ErrorLike;

    return Response.json(
      {
        error: knownError.message ?? String(error),
        status: knownError.response?.status ?? 500,
        detail,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json(
    { error: "Method Not Allowed. Send a POST with { message } to this endpoint." },
    { status: 405, headers: { Allow: "POST" } }
  );
}