import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { classId, teacherId } = await request.json();

    if (!classId) {
      return NextResponse.json({ error: "Missing classId" }, { status: 400 });
    }

    const updatedClass = await prisma.class.update({
      where: { id: classId },
      data: { teacherId: teacherId ?? null },
      include: {
        academicYear: true,
        teacher: true,
        students: true,
      },
    });

    return NextResponse.json(updatedClass);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to assign teacher to class" }, { status: 500 });
  }
}
