import { openai } from "@/lib/openai";

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
    const body = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not set");
      return Response.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    const modelsToTry = [process.env.OPENAI_MODEL, "gpt-4o-mini", "gpt-4.1-mini"].filter(
      Boolean
    ) as string[];

    let completion: any = null;
    let lastError: any = null;

    for (const model of [...new Set(modelsToTry)]) {
      try {
        completion = await openai.chat.completions.create({
          model,
          messages: [
            {
              role: "system",
              content: "You are EduCore AI Assistant.",
            },
            { role: "user", content: body.message },
          ],
        });
        break;
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!completion) {
      const status = lastError?.status ?? lastError?.response?.status;
      const messageText = String(lastError?.message ?? "").toLowerCase();
      const isQuotaError = status === 429 || messageText.includes("quota") || messageText.includes("billing");

      if (isQuotaError) {
        return Response.json({ reply: buildLocalChatReply(body.message), fallback: "local", reason: "quota" });
      }

      throw lastError ?? new Error("No OpenAI model call succeeded");
    }

    const reply =
      completion?.choices?.[0]?.message?.content ??
      (completion as any)?.output?.[0]?.content?.[0]?.text ??
      null;

    return Response.json({ reply });
  } catch (error: any) {
    console.error("/api/ai/chat error:", error);

    const detail =
      error?.response?.data ?? error?.response ?? null;

    return Response.json(
      {
        error: error?.message ?? String(error),
        status: error?.response?.status ?? 500,
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