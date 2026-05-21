import Link from "next/link";

import { prisma } from "@/lib/prisma";

interface StudentItem {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string | null;
}

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

      {/* Students Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <table className="w-full">
          <thead className="border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                Admission No
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                Student
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                Gender
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email
              </th>
            </tr>
          </thead>

          <tbody>
            {students.map(
              (
                student: StudentItem
              ) => (
                <tr
                  key={student.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                >
                  {/* Admission Number */}
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                    {
                      student.admissionNumber
                    }
                  </td>

                  {/* Student Name */}
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/students/${student.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {
                        student.firstName
                      }{" "}
                      {
                        student.lastName
                      }
                    </Link>
                  </td>

                  {/* Gender */}
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                    {student.gender}
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                    {student.email ||
                      "-"}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {/* Empty State */}
        {students.length ===
          0 && (
          <div className="p-10 text-center text-slate-500">
            No students found
          </div>
        )}
      </div>
    </div>
  );
}