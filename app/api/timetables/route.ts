import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  classId: z.string(),
  subjectId: z.string(),
  teacherId: z.string().optional(),
  day: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export async function GET() {
  try {
    const items = await prisma.timetable.findMany({
      include: { class: true, subject: true, teacher: true },
      orderBy: { day: "asc" },
    });

    return NextResponse.json(items);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch timetables" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = createSchema.parse(body);

    const created = await prisma.timetable.create({
      data: {
        classId: data.classId,
        subjectId: data.subjectId,
        teacherId: data.teacherId ?? null,
        day: data.day,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
      },
    });

    return NextResponse.json(created);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create timetable" }, { status: 400 });
  }
}
