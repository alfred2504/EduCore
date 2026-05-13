import { prisma } from "@/lib/prisma";

import { createStudentSchema } from "@/lib/validations/student";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const validatedData =
      createStudentSchema.parse(body);

    const student =
      await prisma.student.create({
        data: {
          ...validatedData,

          dateOfBirth: new Date(
            validatedData.dateOfBirth
          ),
        },
      });

    return Response.json(student);

  } catch (error) {
    console.log(error);

    return Response.json(
      {
        error: "Failed to create student",
      },
      {
        status: 500,
      }
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

  } catch (error) {
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