import Link from "next/link";

import { prisma } from "@/lib/prisma";

interface ExamItem {
  id: string;
  title: string;
  type: string;
  totalMarks: number;
  published: boolean;

  class: {
    name: string;
  };

  subject: {
    name: string;
  };

  term: {
    name: string;
  };
}

export default async function ExamsPage() {
  const examsRaw = await prisma.exam.findMany({
    include: {
      subject: true,
      class: true,
      term: true,
    },
  });

  const exams = examsRaw as ExamItem[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Exams
        </h1>

        <p className="mt-2 text-slate-500">
          Exam management system
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <table className="min-w-[760px] w-full">
          <thead className="border-b">
            <tr>
              <th className="px-6 py-4 text-left">
                Exam
              </th>

              <th className="px-6 py-4 text-left">
                Subject
              </th>

              <th className="px-6 py-4 text-left">
                Class
              </th>

              <th className="px-6 py-4 text-left">
                Total Marks
              </th>

              <th className="px-6 py-4 text-left">
                Status
              </th>

              <th className="px-6 py-4 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {exams.map((exam: ExamItem) => (
              <tr
                key={exam.id}
                className="border-b"
              >
                <td className="px-6 py-4">
                  {exam.title}
                </td>

                <td className="px-6 py-4">{exam.subject.name}</td>

                <td className="px-6 py-4">{exam.class.name}</td>

                <td className="px-6 py-4">{exam.totalMarks}</td>

                <td className="px-6 py-4">{exam.published ? "Published" : "Draft"}</td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/exams/${exam.id}/marks`}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Marks
                    </Link>
                    <Link
                      href={`/dashboard/exams/${exam.id}/results`}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Results
                    </Link>
                  </div>
                </td>
              </tr>
            ))}

            {exams.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-slate-500"
                >
                  No exams found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
