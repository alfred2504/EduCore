import { generateAIInsights } from "@/lib/ai/insights";

type ErrorLike = {
  message?: string;
  response?: {
    status?: number;
    data?: unknown;
  };
};

function getErrorDetail(error: unknown) {
  const knownError = error as ErrorLike;

  return knownError.response?.data ?? knownError.response ?? null;
}

export async function GET() {
  try {
    return Response.json(await generateAIInsights());
  } catch (error: unknown) {
    console.error("/api/ai/insights error:", error);

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
