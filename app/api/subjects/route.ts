import { prisma } from "@/lib/prisma";

export async function GET() {
  const subjects =
    await prisma.subject.findMany({
      include: {
        class: true,
        teacher: true,
      },
    });

  return Response.json(subjects);
}

export async function POST(
  req: Request
) {
  const body = await req.json();

  const subject =
    await prisma.subject.create({
      data: body,
    });

  return Response.json(subject);
}