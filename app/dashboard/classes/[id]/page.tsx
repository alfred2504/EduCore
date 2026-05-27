import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClassDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const classItem = await prisma.class.findUnique({
    where: {
      id,
    },
    include: {
      academicYear: true,
      students: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          admissionNumber: true,
        },
      },
      subjects: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      exams: {
        select: {
          id: true,
          title: true,
          examDate: true,
          published: true,
        },
        orderBy: {
          examDate: "desc",
        },
      },
    },
  });

  if (!classItem) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {classItem.name}
        </h1>

        <p className="mt-1 text-slate-500">
          {classItem.level} • Academic year: {classItem.academicYear.name}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Students</p>
          <h2 className="mt-2 text-4xl font-bold">{classItem.students.length}</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Subjects</p>
          <h2 className="mt-2 text-4xl font-bold">{classItem.subjects.length}</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Capacity</p>
          <h2 className="mt-2 text-4xl font-bold">{classItem.capacity ?? "N/A"}</h2>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-xl font-semibold">Students</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left">Admission Number</th>
                <th className="px-6 py-4 text-left">Name</th>
              </tr>
            </thead>
            <tbody>
              {classItem.students.map((student) => (
                <tr key={student.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-6 py-4">{student.admissionNumber}</td>
                  <td className="px-6 py-4">
                    {student.firstName} {student.lastName}
                  </td>
                </tr>
              ))}
              {classItem.students.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-slate-500" colSpan={2}>
                    No students assigned yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-xl font-semibold">Recent Exams</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {classItem.exams.map((exam) => (
                <tr key={exam.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-6 py-4">{exam.title}</td>
                  <td className="px-6 py-4">{new Date(exam.examDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{exam.published ? "Published" : "Draft"}</td>
                </tr>
              ))}
              {classItem.exams.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-slate-500" colSpan={3}>
                    No exams created for this class yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
