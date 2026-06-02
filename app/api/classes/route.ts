import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, level, capacity, academicYearId } = await request.json();

    if (!name || !level || !academicYearId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const created = await prisma.class.create({
      data: {
        name,
        level,
        capacity: capacity ?? null,
        academicYearId,
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
