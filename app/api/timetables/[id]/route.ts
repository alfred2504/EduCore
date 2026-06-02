import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  classId: z.string().optional(),
  subjectId: z.string().optional(),
  teacherId: z.string().nullable().optional(),
  day: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const data = updateSchema.parse(body);

    const updated = await prisma.timetable.update({
      where: {
        id,
      },
      data: {
        ...(data.classId
          ? { classId: data.classId }
          : {}),

        ...(data.subjectId
          ? { subjectId: data.subjectId }
          : {}),

        ...(data.teacherId !== undefined
          ? { teacherId: data.teacherId }
          : {}),

        ...(data.day
          ? { day: data.day }
          : {}),

        ...(data.startTime
          ? {
              startTime: new Date(
                data.startTime
              ),
            }
          : {}),

        ...(data.endTime
          ? {
              endTime: new Date(
                data.endTime
              ),
            }
          : {}),
      },
    });

    return NextResponse.json(
      updated
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          "Failed to update timetable",
      },
      {
        status: 400,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await context.params;

    await prisma.timetable.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          "Failed to delete timetable",
      },
      {
        status: 500,
      }
    );
  }
}