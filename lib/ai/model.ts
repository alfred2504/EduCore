import "server-only";

import { getOpenAIClient } from "@/lib/openai";

type CompletionLike = {
  choices?: Array<{ message?: { content?: string | null } }>;
  output?: Array<{ content?: Array<{ text?: string | null }> }>;
};

type ModelFailure = { status?: number; message?: string };

function getText(result: unknown) {
  const completion = result as CompletionLike;
  return completion.choices?.[0]?.message?.content?.trim() ?? completion.output?.[0]?.content?.[0]?.text?.trim() ?? null;
}

export function isModelUnavailable(error: unknown) {
  const knownError = error as ModelFailure;
  const message = knownError.message?.toLowerCase() ?? "";
  return knownError.status === 401 || knownError.status === 429 || message.includes("api key") || message.includes("quota") || message.includes("billing");
}

/** Calls the configured model and falls back to supported economical models. */
export async function generateModelText({ system, prompt }: { system: string; prompt: string }) {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

  const models = [process.env.OPENAI_MODEL, "gpt-4.1-mini", "gpt-4o-mini"].filter(Boolean) as string[];
  const openai = getOpenAIClient();
  let lastError: unknown;

  for (const model of [...new Set(models)]) {
    try {
      const result = await openai.chat.completions.create({
        model,
        messages: [{ role: "system", content: system }, { role: "user", content: prompt }],
      });
      const text = getText(result);
      if (text) return text;
      lastError = new Error("The AI service returned an empty response");
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("No AI model call succeeded");
}
