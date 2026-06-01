import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        class: true,
        subject: true,
        term: true,
        results: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(exams);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to fetch exams",
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

    const exam = await prisma.exam.create({
      data: {
        title: body.title,
        type: body.type,
        description: body.description,
        classId: body.classId,
        subjectId: body.subjectId,
        termId: body.termId,
        totalMarks: body.totalMarks ?? 100,
        published: body.published ?? false,
        examDate: new Date(body.examDate),
      },
    });

    return Response.json(exam);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to create exam",
      },
      {
        status: 500,
      }
    );
  }
}