import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { CreateExamForm } from "@/components/exams/create-exam-form";

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

interface ClassItem {
  id: string;
  name: string;
}

interface SubjectItem {
  id: string;
  name: string;
  code: string;
  classId: string;
  class: {
    name: string;
  };
  teacher?: {
    firstName: string;
    lastName: string;
  };
}

interface TermItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export default async function ExamsPage() {
  const [classes, subjects, terms, teachers, examsRaw] = await Promise.all([
    prisma.class.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.subject.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        classId: true,
        teacherId: true,
        class: {
          select: {
            name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.term.findMany({
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
      },
      orderBy: {
        startDate: "asc",
      },
    }),
    prisma.teacher.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        subjects: {
          select: {
            id: true,
            name: true,
            class: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        firstName: "asc",
      },
    }),
    prisma.exam.findMany({
      include: {
        subject: true,
        class: true,
        term: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

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

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Exam schedule
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage existing exams and review published status.
          </p>
        </div>

        <CreateExamForm
          classes={classes}
          subjects={subjects}
          terms={terms}
        />
      </div>

      {/* Academic Terms, Subjects & Teachers Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Academic Terms */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <h3 className="text-lg font-semibold">Academic Terms</h3>
          <div className="mt-4 space-y-3">
            {terms.map((term) => (
              <div key={term.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <div className="font-semibold text-slate-900 dark:text-white">{term.name}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {new Date(term.startDate).toLocaleDateString()} - {new Date(term.endDate).toLocaleDateString()}
                </div>
              </div>
            ))}
            {terms.length === 0 && <div className="text-sm text-slate-500">No terms configured</div>}
          </div>
        </div>

        {/* Subjects */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <h3 className="text-lg font-semibold">Subjects ({subjects.length})</h3>
          <div className="mt-4 space-y-3">
            {subjects.slice(0, 5).map((subject) => (
              <div key={subject.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <div className="font-semibold text-slate-900 dark:text-white text-sm">{subject.name}</div>
                <div className="text-xs text-slate-500 mt-1">
                  <span>{subject.class.name}</span> • <span>{subject.code}</span>
                </div>
                {subject.teacher && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {subject.teacher.firstName} {subject.teacher.lastName}
                  </div>
                )}
              </div>
            ))}
            {subjects.length > 5 && (
              <div className="text-xs text-slate-500 pt-2">+{subjects.length - 5} more</div>
            )}
          </div>
        </div>

        {/* Teachers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <h3 className="text-lg font-semibold">Teachers ({teachers.length})</h3>
          <div className="mt-4 space-y-3">
            {teachers.slice(0, 5).map((teacher) => (
              <div key={teacher.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <div className="font-semibold text-slate-900 dark:text-white text-sm">
                  {teacher.firstName} {teacher.lastName}
                </div>
                <div className="text-xs text-slate-500 mt-1">{teacher.email}</div>
                {teacher.subjects.length > 0 && (
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    Subjects: {teacher.subjects.map(s => s.name).join(", ")}
                  </div>
                )}
              </div>
            ))}
            {teachers.length > 5 && (
              <div className="text-xs text-slate-500 pt-2">+{teachers.length - 5} more</div>
            )}
          </div>
        </div>
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
