import { prisma } from "@/lib/prisma";
import { calculateGPA } from "@/lib/gpa";
import { gradePoints } from "@/lib/grading";
import { rankStudents } from "@/lib/ranking";

export async function POST() {
  try {
    const publishedExams = await prisma.exam.findMany({
      where: { published: true },
      select: {
        termId: true,
        classId: true,
      },
      distinct: ["termId", "classId"],
    });

    for (const examGroup of publishedExams) {
      const students = await prisma.student.findMany({
        where: { classId: examGroup.classId },
        include: {
          results: {
            where: {
              exam: {
                termId: examGroup.termId,
              },
            },
          },
        },
      });

      const rankedStudents = rankStudents(
        students.map((student) => {
          const points = student.results
            .map((result) => result.points ?? gradePoints(result.marks))
            .filter((point) => Number.isFinite(point));

          return {
            studentId: student.id,
            gpa: calculateGPA(points),
          };
        })
      );

      await Promise.all(
        rankedStudents.map((student) =>
          prisma.reportCard.upsert({
            where: {
              studentId_termId: {
                studentId: student.studentId,
                termId: examGroup.termId,
              },
            },
            create: {
              studentId: student.studentId,
              termId: examGroup.termId,
              gpa: student.gpa,
              position: student.position,
              published: true,
            },
            update: {
              gpa: student.gpa,
              position: student.position,
              published: true,
            },
          })
        )
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to generate report cards" },
      { status: 500 }
    );
  }
}
