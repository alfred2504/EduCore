import { prisma } from "@/lib/prisma";

import { GenerateReportCardsButton } from "@/components/report-cards/generate-report-cards-button";

export default async function ReportCardsPage() {
  const reportCards = await prisma.reportCard.findMany({
    include: {
      student: true,
      term: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Academic Reports</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Report Cards</h1>
        <p className="mt-2 text-slate-500">Published term reports generated from exam publishing.</p>
      </div>

      <div>
        <GenerateReportCardsButton />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Total Report Cards</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{reportCards.length}</h2>
        </div>
      </div>

      <div className="space-y-4">
        {reportCards.map((reportCard) => (
          <div key={reportCard.id} className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {reportCard.student.firstName} {reportCard.student.lastName}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{reportCard.term.name}</p>
              </div>
              <div className="text-sm text-slate-500">
                GPA {reportCard.gpa ?? 0} • Position {reportCard.position ?? "-"}
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="text-sm text-slate-500">Teacher Comment</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{reportCard.teacherComment ?? "No teacher comment."}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="text-sm text-slate-500">AI Comment</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{reportCard.aiComment ?? "No AI comment."}</p>
              </div>
            </div>
          </div>
        ))}

        {reportCards.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm dark:bg-[#111827]">
            No report cards published yet.
          </div>
        )}
      </div>
    </div>
  );
}
