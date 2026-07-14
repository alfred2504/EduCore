import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !["SYSTEM_ADMIN", "SCHOOL_ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const teacher = await prisma.teacher.findUnique({ where: { id } });

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    const timetableTableExistsResult = await prisma.$queryRaw<
      { exists: boolean }[]
    >`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'Timetable'
      ) AS "exists";
    `;

    const hasTimetableTable =
      timetableTableExistsResult?.[0]?.exists ?? false;

    await prisma.$transaction(async (tx) => {
      // A teacher may be assigned to these records. Keep the school records,
      // but remove the assignment before deleting the teacher profile.
      await tx.class.updateMany({ where: { teacherId: id }, data: { teacherId: null } });
      await tx.subject.updateMany({ where: { teacherId: id }, data: { teacherId: null } });

      if (hasTimetableTable) {
        await tx.timetable.updateMany({ where: { teacherId: id }, data: { teacherId: null } });
      } else {
        console.warn("Timetable table missing, skipping timetable cleanup");
      }

      await tx.teacher.delete({ where: { id } });

      if (teacher.userId) {
        await tx.user.delete({ where: { id: teacher.userId } });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("teacher delete error", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
