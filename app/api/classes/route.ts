import { prisma } from "@/lib/prisma";

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

    const {
      name,
      level,
      capacity,
      academicYearId,
    } = body;

    const newClass =
      await prisma.class.create({
        data: {
          name,
          level,
          capacity,
          academicYearId,
        },
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