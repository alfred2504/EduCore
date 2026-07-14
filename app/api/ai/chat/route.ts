import { getServerSession } from "next-auth";
import { z } from "zod";

import { generateModelText, isModelUnavailable } from "@/lib/ai/model";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const chatSchema = z.object({ message: z.string().trim().min(1, "Enter a question.").max(2_000) });

function buildLocalChatReply(message: string, snapshot: string) {
  return [
    "The external AI service is unavailable, so this response uses EduCore's local guidance.",
    snapshot,
    `For your question: ${message}`,
    "Use the school snapshot to identify the affected learners, review recent attendance and assessment records, then agree on one measurable next action with the relevant teacher or guardian.",
  ].join("\n\n");
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER"].includes(session.user.role)) {
      return Response.json({ error: "You are not authorized to use EduCore AI." }, { status: 403 });
    }

    const { message } = chatSchema.parse(await req.json());
    const [studentCount, teacherCount, attendance] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.attendance.findMany({ select: { status: true }, take: 500, orderBy: { date: "desc" } }),
    ]);
    const presentRate = attendance.length
      ? Math.round((attendance.filter((item) => item.status !== "ABSENT").length / attendance.length) * 100)
      : null;
    const snapshot = `School snapshot: ${studentCount} students, ${teacherCount} teachers, and ${presentRate === null ? "no attendance records" : `${presentRate}% present or late across the latest ${attendance.length} attendance records`}.`;

    try {
      const reply = await generateModelText({
        system: "You are EduCore AI, an assistant for authorised school staff. Provide concise, practical educational guidance. Do not diagnose students, infer protected characteristics, or fabricate records. Remind staff to verify records before acting.",
        prompt: `${snapshot}\n\nStaff question: ${message}`,
      });
      return Response.json({ reply, source: "model" });
    } catch (error) {
      if (!isModelUnavailable(error)) throw error;
      return Response.json({ reply: buildLocalChatReply(message, snapshot), source: "local", reason: "model_unavailable" });
    }
  } catch (error) {
    const message = error instanceof z.ZodError ? error.issues[0]?.message : "Unable to process the AI request.";
    return Response.json({ error: message }, { status: error instanceof z.ZodError ? 400 : 500 });
  }
}

export async function GET() {
  return Response.json({ error: "Method Not Allowed. Send a POST with { message } to this endpoint." }, { status: 405, headers: { Allow: "POST" } });
}
