import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

type StudentWithRelations = {
  firstName: string;
  lastName: string;
  grades: Array<{ score: number }>;
  attendances: Array<unknown>;
};

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
  const avgAttendanceRate = (summary.reduce((acc, s) => acc + s.attendance, 0) / total) * 100;

  const riskStudents = summary
    .filter((s) => s.averageGrade < 50 || s.attendance < 0.75)
    .map((s) => `${s.name} (grade ${s.averageGrade.toFixed(1)}, attendance ${(s.attendance * 100).toFixed(0)}%)`)
    .slice(0, 10);

  return [
    "AI quota exceeded. Showing locally generated insights.",
    "",
    `Academic trend: Average score is ${avgGrade.toFixed(1)}.`,
    `Attendance trend: Average attendance is ${avgAttendanceRate.toFixed(1)}%.`,
    riskStudents.length > 0
      ? `Risk students: ${riskStudents.join(", ")}.`
      : "Risk students: none detected by local rules.",
    "Recommendations:",
    "1) Schedule targeted support for students below 50 average grade.",
    "2) Contact guardians for students below 75% attendance.",
    "3) Review class-level trends weekly and intervene early.",
  ].join("\n");
}

export async function GET() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not set");
      return Response.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    const students = (await prisma.student.findMany({
      include: { grades: true, attendances: true },
    })) as StudentWithRelations[];

    const summary = students.map((student: StudentWithRelations) => ({
      name: student.firstName + " " + student.lastName,
      averageGrade:
        student.grades.length > 0
          ? student.grades.reduce((acc: number, g: { score: number }) => acc + g.score, 0) /
            student.grades.length
          : 0,
      attendance: (student.attendances as any)?.length ?? 0,
    }));

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
            { role: "system", content: "You are an educational AI analyst." },
            {
              role: "user",
              content: `Analyze this school data and provide:\n- risk students\n- attendance insights\n- academic trends\n- recommendations\n\n${JSON.stringify(summary)}`,
            },
          ],
        });
        break;
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!completion) {
      const status = lastError?.status ?? lastError?.response?.status;
      const message = String(lastError?.message ?? "").toLowerCase();
      const isQuotaError = status === 429 || message.includes("quota") || message.includes("billing");

      if (isQuotaError) {
        return Response.json({ insights: buildLocalInsights(summary), fallback: "local", reason: "quota" });
      }

      throw lastError ?? new Error("No OpenAI model call succeeded");
    }

    const insights =
      completion?.choices?.[0]?.message?.content ??
      (completion as any)?.output?.[0]?.content?.[0]?.text ??
      null;

    return Response.json({ insights });
  } catch (error: any) {
    console.error("/api/ai/insights error:", error);

    const detail = error?.response?.data ?? error?.response ?? null;

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