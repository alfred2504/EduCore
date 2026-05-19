import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function TeachersPage() {
  const teachers =
    await prisma.teacher.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Teachers
          </h1>

          <p className="mt-1 text-slate-500">
            Teacher management system
          </p>
        </div>

        <Link
          href="/dashboard/teachers/new"
          className="rounded-xl bg-blue-600 px-4 py-2 text-white"
        >
          Add Teacher
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-[#111827]">
        <table className="w-full">
          <thead className="border-b bg-slate-50 dark:bg-[#1f2937]">
            <tr>
              <th className="px-6 py-4 text-left">
                Name
              </th>

              <th className="px-6 py-4 text-left">
                Email
              </th>

              <th className="px-6 py-4 text-left">
                Subject
              </th>

              <th className="px-6 py-4 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {teachers.map((teacher) => (
              <tr
                key={teacher.id}
                className="border-b"
              >
                <td className="px-6 py-4">
                  {teacher.firstName}{" "}
                  {teacher.lastName}
                </td>

                <td className="px-6 py-4">
                  {teacher.email}
                </td>

                <td className="px-6 py-4">
                    {teacher.qualification ?? "-"}
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <Link
                      href={`/dashboard/teachers/${teacher.id}`}
                      className="text-blue-600"
                    >
                      View
                    </Link>

                    <Link
                      href={`/dashboard/teachers/edit/${teacher.id}`}
                      className="text-yellow-600"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}

            {teachers.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No teachers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}