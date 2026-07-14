import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ResultsPage() {
  const results = await prisma.examResult.findMany({
    include: {
      student: true,
      exam: {
        include: {
          subject: true,
          class: true,
          term: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalGrades = await prisma.grade.count();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Results</h1>
          <p className="mt-1 text-slate-500">Student exam results and grading history.</p>
        </div>
        <Link
          href="/dashboard/grades"
          className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          View grade records
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Total results</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{results.length}</h2>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Grade records</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{totalGrades}</h2>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <table className="w-full">
          <thead className="border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 text-left">Student</th>
              <th className="px-6 py-4 text-left">Exam</th>
              <th className="px-6 py-4 text-left">Class</th>
              <th className="px-6 py-4 text-left">Marks</th>
              <th className="px-6 py-4 text-left">Grade</th>
            </tr>
          </thead>

          <tbody>
            {results.map((result) => (
              <tr key={result.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-6 py-4">
                  {result.student.firstName} {result.student.lastName}
                </td>
                <td className="px-6 py-4">{result.exam.title}</td>
                <td className="px-6 py-4">{result.exam.class.name}</td>
                <td className="px-6 py-4">{result.marks}</td>
                <td className="px-6 py-4">{result.grade ?? "-"}</td>
              </tr>
            ))}

            {results.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
