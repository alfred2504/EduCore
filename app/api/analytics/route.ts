import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const students =
      await prisma.student.count();

    const teachers =
      await prisma.teacher.count();

    const classes =
      await prisma.class.count();

    const grades =
      await prisma.grade.findMany();

    const attendance =
      await prisma.attendance.findMany();

    const averageGrade =
      grades.length > 0
        ? grades.reduce(
            (acc, item) =>
              acc + item.score,
            0
          ) / grades.length
        : 0;

    const attendanceRate =
      attendance.length > 0
        ? (
            (attendance.filter(
              (a) =>
                a.status ===
                "PRESENT"
            ).length /
              attendance.length) *
            100
          ).toFixed(1)
        : 0;

    return Response.json({
      students,
      teachers,
      classes,

      averageGrade:
        averageGrade.toFixed(1),

      attendanceRate,
    });

  } catch (error) {
    return Response.json(
      {
        error:
          "Failed to load analytics",
      },
      {
        status: 500,
      }
    );
  }
}