import { prisma } from "@/lib/prisma";

export async function GET() {
  const grades =
    await prisma.grade.findMany({
      include: {
        student: true,
        subject: true,
      },
    });

  return Response.json(grades);
}

export async function POST(
  req: Request
) {
  const body = await req.json();

  const grade =
    await prisma.grade.create({
      data: body,
    });

  return Response.json(grade);
}