import { prisma } from "@/lib/prisma";
import { calculateGPA } from "@/lib/gpa";
import { gradePoints } from "@/lib/grading";
import { rankStudents } from "@/lib/ranking";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  _request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const exam = await prisma.exam.findUnique({
      where: {
        id,
      },
      include: {
        term: true,
        class: true,
      },
    });

    if (!exam) {
      return Response.json(
        { error: "Exam not found" },
        { status: 404 }
      );
    }

    const publishedExam = await prisma.exam.update({
      where: {
        id,
      },
      data: {
        published: true,
      },
    });

    const students = await prisma.student.findMany({
      where: {
        classId: exam.classId,
      },
      include: {
        results: {
          where: {
            exam: {
              termId: exam.termId,
            },
          },
          include: {
            exam: true,
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
              termId: exam.termId,
            },
          },
          create: {
            studentId: student.studentId,
            termId: exam.termId,
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

    return Response.json(publishedExam);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to publish exam",
      },
      {
        status: 500,
      }
    );
  }
}
