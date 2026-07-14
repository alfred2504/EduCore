import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] ?? "New",
    lastName: parts.slice(1).join(" ") || "User",
  };
}

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "SYSTEM_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id } });
      if (!user) throw new Error("REGISTRATION_NOT_FOUND");
      if (user.role !== "TEACHER" && user.role !== "STUDENT") {
        throw new Error("UNSUPPORTED_ROLE");
      }

      if (user.role === "TEACHER") {
        const name = splitName(user.name);
        await tx.teacher.upsert({
          where: { userId: user.id },
          create: { ...name, email: user.email, userId: user.id },
          update: { firstName: name.firstName, lastName: name.lastName, email: user.email },
        });
      } else {
        const student = await tx.student.findFirst({
          where: { OR: [{ userId: user.id }, { email: user.email }] },
          select: { id: true },
        });

        if (!student) throw new Error("STUDENT_PROFILE_INCOMPLETE");

        await tx.student.update({
          where: { id: student.id },
          data: { userId: user.id, email: user.email },
        });
      }

      return tx.user.update({ where: { id: user.id }, data: { status: "APPROVED" } });
    });

    return NextResponse.json({ id: result.id, status: result.status, profileReady: true });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "REGISTRATION_NOT_FOUND") {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }
    if (code === "STUDENT_PROFILE_INCOMPLETE") {
      return NextResponse.json(
        { error: "This student must complete their profile before their registration can be approved." },
        { status: 400 }
      );
    }
    if (code === "UNSUPPORTED_ROLE") {
      return NextResponse.json({ error: "Only student and teacher registrations can be approved here." }, { status: 400 });
    }

    console.error("registration approval error", error);
    return NextResponse.json({ error: "Unable to approve registration" }, { status: 500 });
  }
}
