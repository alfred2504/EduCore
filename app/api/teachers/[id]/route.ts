import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _req: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  const teacher = await prisma.teacher.findUnique({
    where: {
      id,
    },
    include: {
      subjects: true,
    },
  });

  if (!teacher) {
    return Response.json(
      {
        error: "Teacher not found",
      },
      {
        status: 404,
      }
    );
  }

  return Response.json(teacher);
}

export async function PATCH(
  req: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = body.phone ? String(body.phone).trim() : null;
    const qualification = body.qualification
      ? String(body.qualification).trim()
      : null;

    if (!firstName || !lastName || !email) {
      return Response.json(
        {
          error: "First name, last name, and email are required",
        },
        {
          status: 400,
        }
      );
    }

    const teacher = await prisma.teacher.update({
      where: {
        id,
      },
      data: {
        firstName,
        lastName,
        email,
        phone,
        qualification,
      },
    });

    return Response.json(teacher);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return Response.json(
        {
          error: "Teacher not found",
        },
        {
          status: 404,
        }
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json(
        {
          error: "Email already exists",
        },
        {
          status: 409,
        }
      );
    }

    console.error(error);

    return Response.json(
      {
        error: "Failed to update teacher",
      },
      {
        status: 500,
      }
    );
  }
}
