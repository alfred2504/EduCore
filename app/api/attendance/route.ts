import { prisma } from "@/lib/prisma";

export async function GET() {
  const attendance =
    await prisma.attendance.findMany({
      include: {
        student: true,
        class: true,
      },
    });

  return Response.json(attendance);
}

export async function POST(
  req: Request
) {
  const body = await req.json();

  const attendance =
    await prisma.attendance.create({
      data: {
        ...body,
        date: new Date(body.date),
      },
    });

  return Response.json(attendance);
}