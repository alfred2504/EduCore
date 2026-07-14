import { generateModelText, isModelUnavailable } from "@/lib/ai/model";
import { prisma } from "@/lib/prisma";

type StudentWithRelations = {
  firstName: string;
  lastName: string;
  grades: Array<{ score: number }>;
  attendances: Array<{ status: "PRESENT" | "ABSENT" | "LATE" }>;
};

type StudentSummary = {
  name: string;
  averageGrade: number | null;
  attendance: number | null;
  gradeCount: number;
  attendanceCount: number;
};

function buildLocalInsights(summary: StudentSummary[]) {
  if (summary.length === 0) return "No student records found. Add students, grades, and attendance to generate insights.";

  const studentsWithGrades = summary.filter((student) => student.averageGrade !== null);
  const studentsWithAttendance = summary.filter((student) => student.attendance !== null);
  const averageGrade = studentsWithGrades.length
    ? studentsWithGrades.reduce((total, student) => total + (student.averageGrade ?? 0), 0) / studentsWithGrades.length
    : null;
  const averageAttendance = studentsWithAttendance.length
    ? (studentsWithAttendance.reduce((total, student) => total + (student.attendance ?? 0), 0) / studentsWithAttendance.length) * 100
    : null;
  const atRisk = summary
    .filter((student) => (student.averageGrade !== null && student.averageGrade < 50) || (student.attendance !== null && student.attendance < 0.75))
    .map((student) => `${student.name} (${student.averageGrade === null ? "no grades" : `grade ${student.averageGrade.toFixed(1)}`}, ${student.attendance === null ? "no attendance" : `attendance ${(student.attendance * 100).toFixed(0)}%`})`)
    .slice(0, 10);
  const missingData = summary
    .filter((student) => student.averageGrade === null || student.attendance === null)
    .map((student) => student.name)
    .slice(0, 10);

  return [
    "Showing locally generated insights because the external AI model is unavailable.",
    averageGrade === null ? "Academic trend: no grade records have been entered yet." : `Academic trend: average score is ${averageGrade.toFixed(1)} across ${studentsWithGrades.length} student(s) with grades.`,
    averageAttendance === null ? "Attendance trend: no attendance records have been entered yet." : `Attendance trend: average attendance is ${averageAttendance.toFixed(1)}% across ${studentsWithAttendance.length} student(s) with attendance records.`,
    atRisk.length ? `Students needing review: ${atRisk.join(", ")}.` : "No students meet the local review threshold.",
    missingData.length ? `Data to complete: add missing grades or attendance for ${missingData.join(", ")}.` : null,
    "Recommended next steps: schedule targeted support for confirmed low performance, contact guardians for attendance below 75%, and review class-level trends weekly.",
  ].filter(Boolean).join("\n\n");
}

export async function generateAIInsights() {
  const students = (await prisma.student.findMany({ include: { grades: true, attendances: true } })) as StudentWithRelations[];
  const summary: StudentSummary[] = students.map((student) => ({
    name: `${student.firstName} ${student.lastName}`,
    averageGrade: student.grades.length ? student.grades.reduce((total, grade) => total + grade.score, 0) / student.grades.length : null,
    attendance: student.attendances.length ? student.attendances.filter((item) => item.status !== "ABSENT").length / student.attendances.length : null,
    gradeCount: student.grades.length,
    attendanceCount: student.attendances.length,
  }));

  try {
    return {
      insights: await generateModelText({
        system: "You are an educational data analyst. Give concise, practical, non-diagnostic school-level guidance. Do not invent facts beyond the supplied data.",
        prompt: `Analyze this school data. Include learners needing review, attendance insights, academic trends, and three actionable recommendations.\n\n${JSON.stringify(summary)}`,
      }),
      fallback: null,
    };
  } catch (error) {
    if (!isModelUnavailable(error)) throw error;
    return { insights: buildLocalInsights(summary), fallback: "local", reason: "model_unavailable" };
  }
}
