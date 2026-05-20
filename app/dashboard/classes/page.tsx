import Link from "next/link";

import { prisma } from "@/lib/prisma";

interface ClassItem {
  id: string;
  name: string;
  level: string;
  capacity: number | null;
  students: {
    id: string;
  }[];
}

export default async function ClassesPage() {
  const classesRaw = await prisma.class.findMany({
    include: {
      students: true,
      academicYear: true,
    },
  });

  const classes = classesRaw.map((c) => ({
    id: c.id,
    name: c.name,
    level: c.level,
    capacity: c.capacity as number | null,
    students: (c.students || []).map((s) => ({ id: s.id })),
  })) as ClassItem[];

  const academicYears =
    await prisma.academicYear.findMany();

  const totalStudents =
    classes.reduce(
      (
        acc: number,
        item: ClassItem
      ) =>
        acc +
        item.students.length,
      0
    );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Classes
        </h1>

        <p className="mt-1 text-slate-500">
          Academic class management
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">
            Total Classes
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {classes.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">
            Total Students
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {totalStudents}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">
            Academic Years
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {academicYears.length}
          </h2>
        </div>
      </div>

      {/* Classes Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <table className="w-full">
          <thead className="border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 text-left">
                Class
              </th>

              <th className="px-6 py-4 text-left">
                Level
              </th>

              <th className="px-6 py-4 text-left">
                Students
              </th>

              <th className="px-6 py-4 text-left">
                Capacity
              </th>
            </tr>
          </thead>

          <tbody>
            {classes.map(
              (item: ClassItem) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/classes/${item.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {item.name}
                    </Link>
                  </td>

                  <td className="px-6 py-4">
                    {item.level}
                  </td>

                  <td className="px-6 py-4">
                    {
                      item.students
                        .length
                    }
                  </td>

                  <td className="px-6 py-4">
                    {item.capacity}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}