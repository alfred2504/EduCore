import Link from "next/link";
import { notFound } from "next/navigation";

import { PublishExamButton } from "@/components/exams/publish-exam-button";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExamResultsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const exam = await prisma.exam.findUnique({
    where: {
      id,
    },
    include: {
      subject: true,
      class: true,
      term: true,
      results: {
        include: {
          student: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!exam) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
            Exam Results
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            {exam.title}
          </h1>
          <p className="mt-2 text-slate-500">
            {exam.subject.name} • {exam.class.name} • {exam.term.name}
          </p>
        </div>

        <div className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-[#111827] sm:w-auto">
          <PublishExamButton examId={exam.id} published={exam.published} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Total Marks</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {exam.totalMarks}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Results Entered</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {exam.results.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Status</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {exam.published ? "Published" : "Draft"}
          </h2>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <table className="min-w-[720px] w-full">
          <thead className="border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 text-left">Student</th>
              <th className="px-6 py-4 text-left">Marks</th>
              <th className="px-6 py-4 text-left">Grade</th>
              <th className="px-6 py-4 text-left">Points</th>
              <th className="px-6 py-4 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {exam.results.map((result) => (
              <tr key={result.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-6 py-4">
                  {result.student.firstName} {result.student.lastName}
                </td>
                <td className="px-6 py-4">{result.marks}</td>
                <td className="px-6 py-4">{result.grade ?? "-"}</td>
                <td className="px-6 py-4">{result.points ?? "-"}</td>
                <td className="px-6 py-4">{result.remarks ?? "-"}</td>
              </tr>
            ))}

            {exam.results.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  No results entered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/dashboard/exams/${exam.id}/marks`}
          className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
        >
          Enter Marks
        </Link>
      </div>
    </div>
  );
}
