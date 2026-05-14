import { prisma } from "@/lib/prisma";

export default async function ClassesPage() {
  const classes =
    await prisma.class.findMany({
      include: {
        students: true,
        academicYear: true,
      },
    });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Classes
        </h1>

        <p className="mt-1 text-slate-500">
          Manage academic classes
        </p>
      </div>

      {/* Table */}
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
                Academic Year
              </th>

              <th className="px-6 py-4 text-left">
                Students
              </th>
            </tr>
          </thead>

          <tbody>
            {classes.map((classItem) => (
              <tr
                key={classItem.id}
                className="border-b border-slate-100 dark:border-slate-800"
              >
                <td className="px-6 py-4">
                  {classItem.name}
                </td>

                <td className="px-6 py-4">
                  {classItem.level}
                </td>

                <td className="px-6 py-4">
                  {
                    classItem
                      .academicYear.name
                  }
                </td>

                <td className="px-6 py-4">
                  {
                    classItem.students
                      .length
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}