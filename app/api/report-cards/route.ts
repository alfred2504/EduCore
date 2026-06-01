import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reportCards = await prisma.reportCard.findMany({
      include: {
        student: true,
        term: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(reportCards);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to fetch report cards",
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

    const reportCard = await prisma.reportCard.create({
      data: {
        studentId: body.studentId,
        termId: body.termId,
        gpa: body.gpa,
        position: body.position,
        teacherComment: body.teacherComment ?? body.remarks,
        aiComment: body.aiComment,
      },
    });

    return Response.json(reportCard);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to create report card",
      },
      {
        status: 500,
      }
    );
  }
}
