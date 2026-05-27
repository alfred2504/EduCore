import { prisma } from "@/lib/prisma";

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

    const result = await prisma.examResult.create({
      data: {
        examId: body.examId,
        studentId: body.studentId,
        marks: body.marks,
        grade: body.grade,
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