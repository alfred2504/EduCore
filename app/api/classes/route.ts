import { prisma } from "@/lib/prisma";

import { createClassSchema } from "@/lib/validations/class";

export async function GET() {
  try {
    const classes =
      await prisma.class.findMany({
        include: {
          academicYear: true,
          students: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return Response.json(classes);

  } catch (error) {
    return Response.json(
      {
        error: "Failed to fetch classes",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const validatedData =
      createClassSchema.parse(body);

    const newClass =
      await prisma.class.create({
        data: validatedData,
      });

    return Response.json(newClass);

  } catch (error) {
    return Response.json(
      {
        error: "Failed to create class",
      },
      {
        status: 500,
      }
    );
  }
}