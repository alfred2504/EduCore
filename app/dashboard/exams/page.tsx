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

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <table className="w-full">
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
              </tr>
            ))}

            {exams.length === 0 && (
              <tr>
                <td
                  colSpan={5}
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
