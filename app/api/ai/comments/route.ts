import { getOpenAIClient } from "@/lib/openai";

function buildFallbackComment(gpa: number) {
  if (gpa >= 3.5) return "Excellent academic performance.";
  if (gpa >= 2.5) return "Good progress demonstrated.";

  return "Additional support recommended.";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const gpa = Number(body.gpa ?? 0);
    const attendance = Number(body.attendance ?? 0);
    const subjectsPassed = body.subjectsPassed ?? "unknown";
    const studentName = body.studentName ?? "The student";

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({
        comment: buildFallbackComment(gpa),
      });
    }

    try {
      const openai = getOpenAIClient();
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "Generate a concise professional teacher-style academic comment for a school report card.",
          },
          {
            role: "user",
            content: `Student Name: ${studentName}\nStudent GPA: ${gpa}\nAttendance: ${attendance}%\nSubjects Passed: ${subjectsPassed}\nWrite one short teacher-style comment.`,
          },
        ],
      });

      const comment = completion.choices[0]?.message?.content?.trim();

      return Response.json({
        comment: comment || buildFallbackComment(gpa),
      });
    } catch {
      return Response.json({
        comment: buildFallbackComment(gpa),
      });
    }
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to generate academic comment",
      },
      {
        status: 500,
      }
    );
  }
}
