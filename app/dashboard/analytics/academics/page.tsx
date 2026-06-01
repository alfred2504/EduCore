import { prisma } from "@/lib/prisma";

export default async function AcademicAnalyticsPage() {
  const grades = await prisma.grade.findMany();
  const attendance = await prisma.attendance.findMany();
  const exams = await prisma.exam.findMany({
    include: {
      class: true,
      subject: true,
    },
    take: 12,
  });

  const averageGrade =
    grades.length > 0
      ? grades.reduce((acc, grade) => acc + grade.score, 0) / grades.length
      : 0;

  const attendanceRate =
    attendance.length > 0
      ? (attendance.filter((item) => item.status === "PRESENT").length / attendance.length) * 100
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
          Academic Analytics
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
          Academic Performance Overview
        </h1>
        <p className="mt-2 text-slate-500">
          GPA, attendance, subject performance, and class comparison snapshots.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">GPA Trend</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{averageGrade.toFixed(1)}</h2>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Attendance Trend</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{attendanceRate.toFixed(0)}%</h2>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Subject Performance</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{grades.length}</h2>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Class Comparison</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{exams.length}</h2>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
          <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">GPA Trend</h2>
          </div>
          <div className="p-6 text-sm text-slate-500">
            Term 1, Term 2, and Term 3 trend visualization can be connected to chart data here.
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
          <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Attendance Trend</h2>
          </div>
          <div className="p-6 text-sm text-slate-500">
            Monthly attendance analytics can be wired to a chart component here.
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Subject Performance Snapshot</h2>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
          {exams.map((exam) => (
            <div key={exam.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm text-slate-500">{exam.subject.name}</p>
              <h3 className="mt-2 font-semibold text-slate-900 dark:text-white">{exam.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{exam.class.name}</p>
            </div>
          ))}
          {exams.length === 0 && <p className="text-sm text-slate-500">No academic data available yet.</p>}
        </div>
      </div>
    </div>
  );
}
