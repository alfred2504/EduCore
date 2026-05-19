import { prisma } from "@/lib/prisma";

export async function GET() {
  const payments =
    await prisma.payment.findMany({
      include: {
        invoice: true,
      },
    });

  return Response.json(payments);
}

export async function POST(
  req: Request
) {
  const body = await req.json();

  const payment =
    await prisma.payment.create({
      data: body,
    });

  return Response.json(payment);
}