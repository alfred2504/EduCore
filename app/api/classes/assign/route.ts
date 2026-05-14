import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const {
      studentId,
      classId,
    } = body;

    const updatedStudent =
      await prisma.student.update({
        where: {
          id: studentId,
        },

        data: {
          classId,
        },
      });

    return Response.json(
      updatedStudent
    );

  } catch (error) {
    return Response.json(
      {
        error:
          "Failed to assign student",
      },
      {
        status: 500,
      }
    );
  }
}