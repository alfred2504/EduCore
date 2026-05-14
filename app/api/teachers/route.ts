import { prisma } from "@/lib/prisma";

export async function GET() {
  const teachers =
    await prisma.teacher.findMany({
      include: {
        subjects: true,
      },
    });

  return Response.json(teachers);
}

export async function POST(
  req: Request
) {
  const body = await req.json();

  const teacher =
    await prisma.teacher.create({
      data: body,
    });

  return Response.json(teacher);
}