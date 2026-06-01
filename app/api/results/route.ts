import { prisma } from "@/lib/prisma";
import { calculateGrade, gradePoints } from "@/lib/grading";

export async function GET() {
  try {
    const results = await prisma.examResult.findMany({
      include: {
        exam: true,
        student: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(results);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to fetch results",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const marks = Number(body.marks);
    const grade = body.grade ?? calculateGrade(marks);
    const points = body.points ?? gradePoints(marks);

    const result = await prisma.examResult.upsert({
      where: {
        examId_studentId: {
          examId: body.examId,
          studentId: body.studentId,
        },
      },
      create: {
        examId: body.examId,
        studentId: body.studentId,
        marks,
        grade,
        points,
        remarks: body.remarks,
      },
      update: {
        marks,
        grade,
        points,
        remarks: body.remarks,
      },
    });

    return Response.json(result);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to create result",
      },
      {
        status: 500,
      }
    );
  }
}