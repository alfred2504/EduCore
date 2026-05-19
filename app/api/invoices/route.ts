import { prisma } from "@/lib/prisma";

export async function GET() {
  const invoices =
    await prisma.invoice.findMany({
      include: {
        student: true,
        payments: true,
      },
    });

  return Response.json(invoices);
}

export async function POST(
  req: Request
) {
  const body = await req.json();

  const invoice =
    await prisma.invoice.create({
      data: {
        ...body,
        dueDate: new Date(
          body.dueDate
        ),
      },
    });

  return Response.json(invoice);
}