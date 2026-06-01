import { prisma } from "@/lib/prisma";
import { getOpenAIClient } from "@/lib/openai";

type StudentWithRelations = {
  firstName: string;
  lastName: string;
  grades: Array<{ score: number }>;
  attendances: Array<{ status: "PRESENT" | "ABSENT" | "LATE" }>;
};

type OpenAIInsightsCompletionLike = {
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

function getOpenAIInsights(result: unknown) {
  const completion = result as OpenAIInsightsCompletionLike;

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

function buildLocalInsights(
  summary: Array<{ name: string; averageGrade: number; attendance: number }>
) {
  const total = summary.length;

  if (total === 0) {
    return [
      "No student records found.",
      "Add students, grades, and attendance to generate AI insights.",
    ].join("\n");
  }

  const avgGrade = summary.reduce((acc, s) => acc + s.averageGrade, 0) / total;
  const avgAttendanceRate =
    (summary.reduce((acc, s) => acc + s.attendance, 0) / total) * 100;

  const riskStudents = summary
    .filter((s) => s.averageGrade < 50 || s.attendance < 0.75)
    .map(
      (s) =>
        `${s.name} (grade ${s.averageGrade.toFixed(1)}, attendance ${(
          s.attendance * 100
        ).toFixed(0)}%)`
    )
    .slice(0, 10);

  return [
    "Showing locally generated insights.",
    "",
    `Academic trend: Average score is ${avgGrade.toFixed(1)}.`,
    `Attendance trend: Average attendance is ${avgAttendanceRate.toFixed(1)}%.`,
    riskStudents.length > 0
      ? `Risk students: ${riskStudents.join(", ")}.`
      : "Risk students: none detected by local rules.",
    "Recommendations:",
    "1. Schedule targeted support for students below 50 average grade.",
    "2. Contact guardians for students below 75% attendance.",
    "3. Review class-level trends weekly and intervene early.",
  ].join("\n");
}

export async function generateAIInsights() {
  const students = (await prisma.student.findMany({
    include: { grades: true, attendances: true },
  })) as StudentWithRelations[];

  const summary = students.map((student) => ({
    name: student.firstName + " " + student.lastName,
    averageGrade:
      student.grades.length > 0
        ? student.grades.reduce((acc, g) => acc + g.score, 0) /
          student.grades.length
        : 0,
    attendance:
      student.attendances.length > 0
        ? student.attendances.filter((attendance) => attendance.status !== "ABSENT")
            .length / student.attendances.length
        : 0,
  }));

  if (!process.env.OPENAI_API_KEY) {
    return {
      insights: buildLocalInsights(summary),
      fallback: "local",
      reason: "missing_api_key",
    };
  }

  const openai = getOpenAIClient();
  const modelsToTry = [
    process.env.OPENAI_MODEL,
    "gpt-4o-mini",
    "gpt-4.1-mini",
  ].filter(Boolean) as string[];

  let completion: unknown = null;
  let lastError: unknown = null;

  for (const model of [...new Set(modelsToTry)]) {
    try {
      completion = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: "You are an educational AI analyst." },
          {
            role: "user",
            content: `Analyze this school data and provide:\n- risk students\n- attendance insights\n- academic trends\n- recommendations\n\n${JSON.stringify(
              summary
            )}`,
          },
        ],
      });
      break;
    } catch (err: unknown) {
      lastError = err;
    }
  }

  if (!completion) {
    const status = getErrorStatus(lastError);
    const message = String((lastError as ErrorLike)?.message ?? "").toLowerCase();
    const isQuotaError =
      status === 429 || message.includes("quota") || message.includes("billing");

    if (isQuotaError) {
      return {
        insights: buildLocalInsights(summary),
        fallback: "local",
        reason: "quota",
      };
    }

    throw lastError ?? new Error("No OpenAI model call succeeded");
  }

  return { insights: getOpenAIInsights(completion) };
}
