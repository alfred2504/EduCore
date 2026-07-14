import { generateAIInsights } from "@/lib/ai/insights";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
    const session = await getServerSession(authOptions);
    if (!session?.user || !["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER"].includes(session.user.role)) {
      return Response.json({ error: "You are not authorized to view AI insights." }, { status: 403 });
    }
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
