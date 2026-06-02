import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  teacherId: z.string().nullable().optional(),
  classId: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const data = updateSchema.parse(body);

    const updated = await prisma.subject.update({
      where: { id },
      data: {
        ...(data.teacherId !== undefined ? { teacherId: data.teacherId } : {}),
        ...(data.classId ? { classId: data.classId } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update subject" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.subject.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete subject" }, { status: 500 });
  }
}
