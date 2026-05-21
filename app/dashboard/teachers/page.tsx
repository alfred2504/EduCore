import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/get-session";
import CreateTeacherButton from "./create-teacher-button";
import type { Teacher, User } from "@prisma/client";

export default async function TeachersPage() {
  const teachers: Teacher[] = await prisma.teacher.findMany({
    orderBy: { createdAt: "desc" },
  });

  const roleOnlyUsers: User[] = await prisma.user.findMany({
    where: {
      role: "TEACHER",
      teacher: { is: null },
    },
    orderBy: { createdAt: "desc" },
  });

  const session = await getSession();
  const role = (session?.user as any)?.role as string | undefined;
  const isAdmin = role === "SYSTEM_ADMIN" || role === "SCHOOL_ADMIN";

  const anyRows = teachers.length > 0 || roleOnlyUsers.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teachers</h1>
          <p className="mt-1 text-slate-500">Teacher management system</p>
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
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Subject</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {teachers.map((teacher: Teacher) => (
              <tr key={teacher.id} className="border-b">
                <td className="px-6 py-4">
                  {teacher.firstName} {teacher.lastName}
                </td>
                <td className="px-6 py-4">{teacher.email}</td>
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

            {roleOnlyUsers.map((u: User) => (
              <tr key={u.id} className="border-b">
                <td className="px-6 py-4">
                  {u.name}{" "}
                  <span className="text-sm text-slate-400">
                    (user only)
                  </span>
                </td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">-</td>
                <td className="px-6 py-4">
                  <div className="flex gap-3 items-center">
                    {isAdmin ? (
                      <CreateTeacherButton userId={u.id} />
                    ) : (
                      <span className="text-sm text-slate-400">
                        Admin only
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {!anyRows && (
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