import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { studentId, classId } = await request.json();

    if (!studentId || !classId) {
      return NextResponse.json({ error: "Missing studentId or classId" }, { status: 400 });
    }

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: { classId },
    });

    return NextResponse.json(updatedStudent);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to assign student" }, { status: 500 });
  }
}
