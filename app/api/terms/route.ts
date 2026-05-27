import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const terms = await prisma.term.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(terms);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to fetch terms",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const term = await prisma.term.create({
      data: {
        name: body.name,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      },
    });

    return Response.json(term);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to create term",
      },
      {
        status: 500,
      }
    );
  }
}