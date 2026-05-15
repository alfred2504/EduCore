import { prisma } from "@/lib/prisma";

export async function GET() {
  const parents =
    await prisma.parent.findMany({
      include: {
        students: {
          include: {
            student: true,
          },
        },
      },
    });

  return Response.json(parents);
}

export async function POST(
  req: Request
) {
  const body = await req.json();

  const parent =
    await prisma.parent.create({
      data: body,
    });

  return Response.json(parent);
}