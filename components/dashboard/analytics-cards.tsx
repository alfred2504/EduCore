import { prisma } from "@/lib/prisma";

export async function AnalyticsCards() {
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

  const avgGrade =
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
      : "0";

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {/* Students */}
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
        <p className="text-sm text-slate-500">
          Students
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          {students}
        </h2>
      </div>

      {/* Teachers */}
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
        <p className="text-sm text-slate-500">
          Teachers
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          {teachers}
        </h2>
      </div>

      {/* GPA */}
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
        <p className="text-sm text-slate-500">
          Average Grade
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          {avgGrade.toFixed(1)}%
        </h2>
      </div>

      {/* Attendance */}
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
        <p className="text-sm text-slate-500">
          Attendance Rate
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          {attendanceRate}%
        </h2>
      </div>
    </div>
  );
}