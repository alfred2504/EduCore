import { prisma } from "@/lib/prisma";

interface TeacherItem {
  id: string;
  firstName: string;
  lastName: string;
}

interface SubjectItem {
  id: string;
  name: string;
  code: string;
  teacher: TeacherItem | null;
}

export default async function SubjectsPage() {
  const subjects = await prisma.subject.findMany({
    include: {
      teacher: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Subjects
        </h1>

        <p className="mt-1 text-slate-500">
          Subject management
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <table className="w-full">
          <thead className="border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 text-left">
                Subject
              </th>

              <th className="px-6 py-4 text-left">
                Code
              </th>

              <th className="px-6 py-4 text-left">
                Teachers
              </th>
            </tr>
          </thead>

          <tbody>
            {subjects.map(
              (
                subject: SubjectItem
              ) => (
                <tr
                  key={subject.id}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="px-6 py-4 font-medium">
                    {subject.name}
                  </td>

                  <td className="px-6 py-4">
                    {subject.code}
                  </td>

                  <td className="px-6 py-4">
                    {subject.teacher
                      ? `${subject.teacher.firstName} ${subject.teacher.lastName}`
                      : "No teacher assigned"}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {subjects.length ===
          0 && (
          <div className="p-10 text-center text-slate-500">
            No subjects found
          </div>
        )}
      </div>
    </div>
  );
}