import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import { createStudentSchema } from "@/lib/validations/student";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const validatedData =
      createStudentSchema.parse(body);

    const registrationUser = validatedData.email
      ? await prisma.user.findFirst({
          where: {
            email: validatedData.email.toLowerCase(),
            role: "STUDENT",
          },
          select: { id: true },
        })
      : null;

    const student =
      await prisma.student.create({
        data: {
          ...validatedData,

          email: validatedData.email || undefined,

          userId: registrationUser?.id,

          dateOfBirth: new Date(
            validatedData.dateOfBirth
          ),
        },
      });

    return Response.json(student);

  } catch (error: unknown) {
    console.log(error);

    // Handle Prisma known errors with clearer HTTP statuses
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Unique constraint failed
      if (error.code === "P2002") {
        return Response.json(
          {
            error: "Unique constraint failed",
            target: error.meta?.target ?? null,
          },
          { status: 409 }
        );
      }

      // Can't reach database server
      if (error.code === "P1001") {
        return Response.json(
          { error: "Database connection error" },
          { status: 503 }
        );
      }
    }

    return Response.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const students =
      await prisma.student.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return Response.json(students);

  } catch {
    return Response.json(
      {
        error: "Failed to fetch students",
      },
      {
        status: 500,
      }
    );
  }
}
