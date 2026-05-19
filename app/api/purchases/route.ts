import { prisma } from "@/lib/prisma";

export async function GET() {
  const procurementRequests =
    await prisma.procurementRequest.findMany({
      include: {
        vendor: true,
      },
    });

  return Response.json(procurementRequests);
}

export async function POST(
  req: Request
) {
  const body = await req.json();

  const procurementRequest =
    await prisma.procurementRequest.create({
      data: body,
    });

  return Response.json(procurementRequest);
}