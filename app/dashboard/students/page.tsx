import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function StudentsPage() {
  const students =
    await prisma.student.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Students
        </h1>

        <p className="mt-1 text-slate-500">
          Manage student records
        </p>
      </div>

      <div className="flex items-center justify-end">
        <Link
          href="/register/student"
          className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Register Student
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <table className="w-full">
          <thead className="border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Admission No
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Student
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Gender
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Email
              </th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b border-slate-100 dark:border-slate-800"
              >
                <td className="px-6 py-4">
                  {
                    student.admissionNumber
                  }
                </td>

                <td className="px-6 py-4">
                  {student.firstName}{" "}
                  {student.lastName}
                </td>

                <td className="px-6 py-4">
                  {student.gender}
                </td>

                <td className="px-6 py-4">
                  {student.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}