import { getServerSession } from "next-auth";
import { z } from "zod";

import { generateModelText, isModelUnavailable } from "@/lib/ai/model";
import { authOptions } from "@/lib/auth";

const commentSchema = z.object({
  gpa: z.coerce.number().min(0).max(4),
  attendance: z.coerce.number().min(0).max(100),
  subjectsPassed: z.coerce.number().int().min(0).optional(),
  studentName: z.string().trim().min(1).max(120).optional(),
});

function buildFallbackComment(gpa: number, attendance: number) {
  if (gpa >= 3.5 && attendance >= 85) return "Strong academic progress and consistent attendance. Continue to build on these positive habits.";
  if (gpa >= 2.5) return "Good progress is evident. Focus on consistent attendance and targeted revision to strengthen results further.";
  return "Additional academic support and a clear attendance plan are recommended to help improve progress.";
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER"].includes(session.user.role)) {
      return Response.json({ error: "You are not authorized to generate report comments." }, { status: 403 });
    }

    const data = commentSchema.parse(await req.json());
    try {
      const comment = await generateModelText({
        system: "Write one concise, professional, strengths-based school report comment. Do not diagnose, make guarantees, or mention AI.",
        prompt: `Student: ${data.studentName ?? "The student"}\nGPA: ${data.gpa}\nAttendance: ${data.attendance}%\nSubjects passed: ${data.subjectsPassed ?? "not supplied"}`,
      });
      return Response.json({ comment, source: "model" });
    } catch (error) {
      if (!isModelUnavailable(error)) throw error;
      return Response.json({ comment: buildFallbackComment(data.gpa, data.attendance), source: "local", reason: "model_unavailable" });
    }
  } catch (error) {
    const message = error instanceof z.ZodError ? error.issues[0]?.message : "Failed to generate an academic comment.";
    return Response.json({ error: message }, { status: error instanceof z.ZodError ? 400 : 500 });
  }
}
