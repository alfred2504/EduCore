import { getOpenAIClient } from "@/lib/openai";

export async function generateReport(
  data: unknown
) {
  const openai = getOpenAIClient();

  const completion =
    await openai.chat.completions.create({
      model: "gpt-4.1-mini",

      messages: [
        {
          role: "system",

          content:
            "Generate professional school reports.",
        },

        {
          role: "user",

          content: JSON.stringify(
            data
          ),
        },
      ],
    });

  return completion
    .choices[0]
    .message.content;
}
