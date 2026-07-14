import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const teachers = await prisma.teacher.findMany({
    include: {
      subjects: true,
    },
  });

  return Response.json(teachers);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { firstName, lastName, email, phone, qualification, password } = body;

  if (!firstName || !lastName || !email) {
    return Response.json({ error: "First name, last name, and email are required" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return Response.json({ error: "A user with this email already exists" }, { status: 409 });
  }

  const generatedPassword = password || `${firstName.toLowerCase()}${lastName.toLowerCase()}123`;
  const hashedPassword = await bcrypt.hash(generatedPassword, 10);

  const user = await prisma.user.create({
    data: {
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      role: "TEACHER",
      status: "APPROVED",
    },
  });

  const teacher = await prisma.teacher.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      qualification,
      userId: user.id,
    },
  });

  return Response.json({
    teacher,
    user,
    password: generatedPassword,
  });
}