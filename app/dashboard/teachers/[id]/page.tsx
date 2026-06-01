import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TeacherDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const teacher = await prisma.teacher.findUnique({
    where: {
      id,
    },
    include: {
      classes: {
        select: {
          id: true,
          name: true,
          level: true,
        },
      },
      subjects: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      user: {
        select: {
          id: true,
          role: true,
          status: true,
        },
      },
    },
  });

  if (!teacher) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {teacher.firstName} {teacher.lastName}
          </h1>

          <p className="mt-1 text-slate-500">
            Teacher profile
          </p>
        </div>

        <Link
          href={`/dashboard/teachers/edit/${teacher.id}`}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Edit
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Email</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
            {teacher.email}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Qualification</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
            {teacher.qualification || "-"}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Subjects</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
            {teacher.subjects.length}
          </h2>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-xl font-semibold">Assigned Subjects</h2>
        </div>

        <table className="w-full">
          <thead className="border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 text-left">Subject</th>
              <th className="px-6 py-4 text-left">Code</th>
            </tr>
          </thead>

          <tbody>
            {teacher.subjects.map((subject) => (
              <tr key={subject.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-6 py-4">{subject.name}</td>
                <td className="px-6 py-4">{subject.code}</td>
              </tr>
            ))}
            {teacher.subjects.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-slate-500" colSpan={2}>
                  No subjects assigned yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-xl font-semibold">Assigned Classes</h2>
        </div>

        <table className="w-full">
          <thead className="border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 text-left">Class</th>
              <th className="px-6 py-4 text-left">Level</th>
            </tr>
          </thead>

          <tbody>
            {teacher.classes.map((classItem) => (
              <tr key={classItem.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-6 py-4">{classItem.name}</td>
                <td className="px-6 py-4">{classItem.level}</td>
              </tr>
            ))}
            {teacher.classes.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-slate-500" colSpan={2}>
                  No classes assigned yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
