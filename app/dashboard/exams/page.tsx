import Link from "next/link";

import { prisma } from "@/lib/prisma";

interface ExamItem {
  id: string;
  title: string;
  published: boolean;
  totalMarks: number;
  examDate: Date;

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
  const examsRaw =
    await prisma.exam.findMany({
      include: {
        class: true,
        subject: true,
        term: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  const exams =
    examsRaw as ExamItem[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Exams</h1>

        <p className="mt-1 text-slate-500">Exam management</p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-6 py-4 text-left">Exam</th>

              <th className="px-6 py-4 text-left">Subject</th>

              <th className="px-6 py-4 text-left">Class</th>

              <th className="px-6 py-4 text-left">Term</th>

              <th className="px-6 py-4 text-left">Published</th>
            </tr>
          </thead>

          <tbody>
            {exams.map((exam: ExamItem) => (
              <tr key={exam.id} className="border-b">
                <td className="px-6 py-4">
                  <Link href={`/dashboard/exams/${exam.id}`} className="text-blue-600">
                    {exam.title}
                  </Link>
                </td>

                <td className="px-6 py-4">{exam.subject.name}</td>

                <td className="px-6 py-4">{exam.class.name}</td>

                <td className="px-6 py-4">{exam.term.name}</td>

                <td className="px-6 py-4">{exam.published ? "Published" : "Draft"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
