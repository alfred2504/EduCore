import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function GradesPage() {
  const grades = await prisma.grade.findMany({
    include: {
      student: true,
      subject: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  const totalGrades = grades.length;
  const uniqueStudents = new Set(grades.map((grade) => grade.studentId)).size;
  const uniqueSubjects = new Set(grades.map((grade) => grade.subjectId)).size;
  const averageGrade =
    totalGrades > 0
      ? grades.reduce((sum, grade) => sum + grade.score, 0) / totalGrades
      : 0;

  const totalResults = await prisma.examResult.count();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Grades</h1>
          <p className="mt-1 text-slate-500">Academic grading system with student and subject performance.</p>
        </div>
        <Link
          href="/dashboard/results"
          className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          View exam results
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Total grade records</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{totalGrades}</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Students graded</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{uniqueStudents}</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Subjects graded</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{uniqueSubjects}</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Exam results</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{totalResults}</h2>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Average score</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{averageGrade.toFixed(1)}</h2>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <table className="w-full">
          <thead className="border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500">Student</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500">Subject</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500">Score</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 dark:text-white">
                    {grade.student.firstName} {grade.student.lastName}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 dark:text-white">{grade.subject.name}</div>
                  <div className="text-sm text-slate-500">{grade.subject.code}</div>
                </td>
                <td className="px-6 py-4 text-slate-900 dark:text-white">{grade.score.toFixed(1)}</td>
                <td className="px-6 py-4 text-slate-500">{new Date(grade.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}

            {grades.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                  No grade records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
