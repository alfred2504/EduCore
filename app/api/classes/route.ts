import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";

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
    console.error(error);

    return Response.json(
      {
        error:
          "Failed to fetch classes",
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
    const body =
      await req.json();

    const validatedData =
      createClassSchema.parse(body);

    const newClass =
      await prisma.class.create({
        data: validatedData,
      });

    return Response.json(
      newClass
    );

  } catch (error: unknown) {

    // Zod validation errors
    if (
      error instanceof ZodError
    ) {
      return Response.json(
        {
          error:
            error.issues[0]
              ?.message ||
            "Invalid class payload",
        },
        {
          status: 400,
        }
      );
    }

    // Prisma foreign key errors
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2003"
    ) {
      return Response.json(
        {
          error:
            "Selected academic year does not exist",
        },
        {
          status: 400,
        }
      );
    }

    console.error(error);

    return Response.json(
      {
        error:
          "Failed to create class",
      },
      {
        status: 500,
      }
    );
  }
}
