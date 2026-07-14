import Link from "next/link";

import { prisma } from "@/lib/prisma";

interface ClassItem {
  id: string;
  name: string;
  level: string;
  capacity: number | null;
  teacher: {
    firstName: string;
    lastName: string;
  } | null;
  students: {
    id: string;
  }[];
}

export default async function ClassesPage() {
  const classesRaw = await prisma.class.findMany({
    include: {
      teacher: true,
      students: true,
      academicYear: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const classes = classesRaw.map((c) => ({
    id: c.id,
    name: c.name,
    level: c.level,
    capacity: c.capacity,
    teacher: c.teacher
      ? {
          firstName: (c.teacher as {
            firstName: string;
            lastName: string;
          }).firstName,
          lastName: (c.teacher as {
            firstName: string;
            lastName: string;
          }).lastName,
        }
      : null,
    students: c.students.map((student) => ({ id: student.id })),
  })) as ClassItem[];

  const academicYears = await prisma.academicYear.findMany();

  const totalStudents = classes.reduce((acc, item) => acc + item.students.length, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Classes</h1>
          <p className="mt-1 text-slate-500">Academic class management</p>
        </div>
        <Link
          href="/dashboard/classes/register"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Add Class
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Total Classes</p>
          <h2 className="mt-2 text-4xl font-bold">{classes.length}</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Total Students</p>
          <h2 className="mt-2 text-4xl font-bold">{totalStudents}</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Academic Years</p>
          <h2 className="mt-2 text-4xl font-bold">{academicYears.length}</h2>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <table className="w-full">
          <thead className="border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 text-left">Class</th>
              <th className="px-6 py-4 text-left">Level</th>
              <th className="px-6 py-4 text-left">Students</th>
              <th className="px-6 py-4 text-left">Teacher</th>
              <th className="px-6 py-4 text-left">Capacity</th>
            </tr>
          </thead>

          <tbody>
            {classes.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-6 py-4">
                  <Link href={`/dashboard/classes/${item.id}`} className="font-medium text-blue-600 hover:underline">
                    {item.name}
                  </Link>
                </td>

                <td className="px-6 py-4">{item.level}</td>

                <td className="px-6 py-4">{item.students.length}</td>

                <td className="px-6 py-4">
                  {item.teacher ? `${item.teacher.firstName} ${item.teacher.lastName}` : "Unassigned"}
                </td>

                <td className="px-6 py-4">{item.capacity ?? "N/A"}</td>
              </tr>
            ))}

            {classes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  No classes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
