import { prisma } from "@/lib/prisma";

export async function GET() {
  const requests =
    await prisma.procurementRequest.findMany({
      include: {
        vendor: true,
      },
    });

  return Response.json(requests);
}

export async function POST(
  req: Request
) {
  const body = await req.json();

  const request =
    await prisma.procurementRequest.create({
      data: body,
    });

  return Response.json(request);
}