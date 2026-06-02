import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      include: { class: true, teacher: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(subjects);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, code, classId, teacherId } = await request.json();

    if (!name || !code || !classId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const created = await prisma.subject.create({
      data: { name, code, classId, teacherId: teacherId ?? null },
    });

    return NextResponse.json(created);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 });
  }
}