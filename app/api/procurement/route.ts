import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.procurementRequest.findMany({ include: { vendor: true }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(items);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch procurement requests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, amount, vendorId } = await request.json();

    if (!title || amount == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const created = await prisma.procurementRequest.create({
      data: {
        title,
        description: description ?? null,
        amount: Number(amount),
        vendorId: vendorId ?? null,
        status: "PENDING",
      },
    });

    return NextResponse.json(created);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create procurement request" }, { status: 500 });
  }
}