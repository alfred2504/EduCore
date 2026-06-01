import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { classId, teacherId } = body;

    if (!classId || !teacherId) {
      return Response.json(
        { error: "classId and teacherId are required" },
        { status: 400 }
      );
    }

    const updatedClass = await prisma.class.update({
      where: { id: classId },
      data: { teacherId },
      include: {
        academicYear: true,
        teacher: true,
        students: true,
      },
    });

    return Response.json(updatedClass);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to assign teacher to class" },
      { status: 500 }
    );
  }
}
