import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_req: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !["SYSTEM_ADMIN", "SCHOOL_ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const student = await prisma.student.findUnique({ where: { id } });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    await prisma.student.delete({ where: { id } });
    if (student.userId) {
      await prisma.user.deleteMany({ where: { id: student.userId } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("student delete error", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
