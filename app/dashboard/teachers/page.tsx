import Link from "next/link";

import { prisma } from "@/lib/prisma";

interface TeacherItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  qualification: string | null;
  createdAt: Date;
}

export default async function TeachersPage() {
  const teachers: TeacherItem[] =
    await prisma.teacher.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Teachers
        </h1>

        <p className="mt-1 text-slate-500">
          Manage teacher records
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">
            Total Teachers
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {teachers.length}
          </h2>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <table className="w-full">
          <thead className="border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 text-left">
                Name
              </th>

              <th className="px-6 py-4 text-left">
                Email
              </th>

              <th className="px-6 py-4 text-left">
                Qualification
              </th>

              <th className="px-6 py-4 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {teachers.map(
              (teacher: TeacherItem) => (
                <tr
                  key={teacher.id}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="px-6 py-4 font-medium">
                    {teacher.firstName}{" "}
                    {teacher.lastName}
                  </td>

                  <td className="px-6 py-4">
                    {teacher.email || "-"}
                  </td>

                  <td className="px-6 py-4">
                    {teacher.qualification || "-"}
                  </td>

                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/teachers/${teacher.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {teachers.length === 0 && (
          <div className="p-10 text-center text-slate-500">
            No teachers found
          </div>
        )}
      </div>
    </div>
  );
}