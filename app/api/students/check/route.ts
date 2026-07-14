import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const admissionNumber = url.searchParams.get(
    "admissionNumber"
  );

  if (!admissionNumber) {
    return Response.json(
      { error: "admissionNumber is required" },
      { status: 400 }
    );
  }

  try {
    const student = await prisma.student.findUnique({
      where: { admissionNumber },
      select: { id: true },
    });

    return Response.json({ exists: !!student });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Failed to check admission number" },
      { status: 500 }
    );
  }
}
