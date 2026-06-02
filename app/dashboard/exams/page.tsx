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

interface SubjectFormItem {
  id: string;
  name: string;
  code: string;
  classId: string;
  teacherId: string | null;

  class: {
    name: string;
  };

  teacher?: {
    firstName: string;
    lastName: string;
  };
}

export default async function ExamsPage() {
  const [classes, subjectsRaw, terms, teachers, examsRaw] =
    await Promise.all([
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

  const subjects: SubjectFormItem[] =
    subjectsRaw.map((subject) => ({
      id: subject.id,
      name: subject.name,
      code: subject.code,
      classId: subject.classId,
      teacherId: subject.teacherId,

      class: {
        name: subject.class.name,
      },

      teacher: subject.teacher
        ? {
            firstName: subject.teacher.firstName,
            lastName: subject.teacher.lastName,
          }
        : undefined,
    }));

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
          <h2 className="text-xl font-semibold">
            Exam Schedule
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Manage exams and publishing workflow.
          </p>
        </div>

        <CreateExamForm
          classes={classes}
          subjects={subjects}
          terms={terms}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-[#111827]">
          <h3 className="text-lg font-semibold">
            Academic Terms
          </h3>

          <div className="mt-4 space-y-3">
            {terms.map((term) => (
              <div
                key={term.id}
                className="rounded-lg border p-3"
              >
                <div className="font-semibold">
                  {term.name}
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  {new Date(
                    term.startDate
                  ).toLocaleDateString()}
                  {" - "}
                  {new Date(
                    term.endDate
                  ).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-[#111827]">
          <h3 className="text-lg font-semibold">
            Subjects ({subjects.length})
          </h3>

          <div className="mt-4 space-y-3">
            {subjects.slice(0, 5).map((subject) => (
              <div
                key={subject.id}
                className="rounded-lg border p-3"
              >
                <div className="font-semibold text-sm">
                  {subject.name}
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  {subject.class.name}
                  {" • "}
                  {subject.code}
                </div>

                {subject.teacher && (
                  <div className="mt-1 text-xs text-blue-600">
                    {subject.teacher.firstName}
                    {" "}
                    {subject.teacher.lastName}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-[#111827]">
          <h3 className="text-lg font-semibold">
            Teachers ({teachers.length})
          </h3>

          <div className="mt-4 space-y-3">
            {teachers.slice(0, 5).map((teacher) => (
              <div
                key={teacher.id}
                className="rounded-lg border p-3"
              >
                <div className="font-semibold text-sm">
                  {teacher.firstName}
                  {" "}
                  {teacher.lastName}
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  {teacher.email}
                </div>

                {teacher.subjects.length > 0 && (
                  <div className="mt-2 text-xs text-slate-600">
                    Subjects:{" "}
                    {teacher.subjects
                      .map((s) => s.name)
                      .join(", ")}
                  </div>
                )}
              </div>
            ))}
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

                <td className="px-6 py-4">
                  {exam.subject.name}
                </td>

                <td className="px-6 py-4">
                  {exam.class.name}
                </td>

                <td className="px-6 py-4">
                  {exam.totalMarks}
                </td>

                <td className="px-6 py-4">
                  {exam.published
                    ? "Published"
                    : "Draft"}
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/exams/${exam.id}/marks`}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"
                    >
                      Marks
                    </Link>

                    <Link
                      href={`/dashboard/exams/${exam.id}/results`}
                      className="rounded-lg border px-3 py-2 text-sm"
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