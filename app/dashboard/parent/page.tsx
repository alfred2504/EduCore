import { prisma } from "@/lib/prisma";

export default async function ParentDashboardPage() {
  const reportCards = await prisma.reportCard.findMany({
    include: {
      student: true,
      term: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  const examResults = await prisma.examResult.findMany({
    include: {
      student: true,
      exam: {
        include: {
          subject: true,
          term: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
          Parent Academic Portal
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
          Parent Dashboard
        </h1>
        <p className="mt-2 text-slate-500">
          View student performance, report cards, and recent exam results.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Report Cards</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{reportCards.length}</h2>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Exam Results</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{examResults.length}</h2>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Academic Status</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Active</h2>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
          <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Report Cards</h2>
          </div>
          <div className="space-y-4 p-6">
            {reportCards.map((reportCard) => (
              <div key={reportCard.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {reportCard.student.firstName} {reportCard.student.lastName}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {reportCard.term.name} • GPA {reportCard.gpa ?? 0} • Position {reportCard.position ?? "-"}
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {reportCard.teacherComment ?? reportCard.aiComment ?? "No comment available."}
                </p>
              </div>
            ))}
            {reportCards.length === 0 && <p className="text-sm text-slate-500">No report cards available.</p>}
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
          <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Exam Results</h2>
          </div>
          <div className="space-y-4 p-6">
            {examResults.map((result) => (
              <div key={result.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {result.student.firstName} {result.student.lastName}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {result.exam.title} • {result.exam.subject.name} • {result.exam.term.name}
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Marks {result.marks} • Grade {result.grade ?? "-"} • Points {result.points ?? "-"}
                </p>
              </div>
            ))}
            {examResults.length === 0 && <p className="text-sm text-slate-500">No exam results available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
