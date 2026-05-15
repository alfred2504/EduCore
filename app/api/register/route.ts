import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password, role } = body;
    const normalizedEmail = String(email).trim().toLowerCase();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (role !== "TEACHER" && role !== "STUDENT") {
      return NextResponse.json(
        { error: "Registration role must be TEACHER or STUDENT" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role,
        status: "PENDING",
      },
    });

    const userStatus = (user as any).status ?? "PENDING";

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: userStatus,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("/api/register error:", error);
    const message = (error instanceof Error) ? error.message : String(error);
    return NextResponse.json(
      { error: message || "Something went wrong" },
      { status: 500 }
    );
  }
}