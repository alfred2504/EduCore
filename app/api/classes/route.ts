import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, level, capacity, academicYearId, academicYearName } = await request.json();

    if (!name?.trim() || !level?.trim() || (!academicYearId && !academicYearName?.trim())) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const parsedCapacity = capacity === "" || capacity === null || capacity === undefined
      ? null
      : Number(capacity);
    if (parsedCapacity !== null && (!Number.isInteger(parsedCapacity) || parsedCapacity < 1)) {
      return NextResponse.json({ error: "Capacity must be a positive whole number" }, { status: 400 });
    }

    const year = academicYearId
      ? await prisma.academicYear.findUnique({ where: { id: academicYearId } })
      : await prisma.academicYear.upsert({
          where: { name: academicYearName.trim() },
          create: { name: academicYearName.trim(), isCurrent: true },
          update: {},
        });

    if (!year) {
      return NextResponse.json({ error: "Selected academic year was not found" }, { status: 400 });
    }

    const created = await prisma.class.create({
      data: {
        name: name.trim(),
        level: level.trim(),
        capacity: parsedCapacity,
        academicYearId: year.id,
      },
    });

    return NextResponse.json(created);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      include: { academicYear: true, students: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(classes);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}
