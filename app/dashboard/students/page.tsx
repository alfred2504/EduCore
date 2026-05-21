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
  teachers: TeacherItem[];
}

export default async function SubjectsPage() {
  const subjects =
    await prisma.subject.findMany({
      include: {
        teachers: true,
      },
      orderBy: {
        name: "asc",
      },
    });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Subjects
        </h1>

        <p className="mt-1 text-slate-500">
          Subject management
        </p>
      </div>

      {/* Subjects Table */}
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
                    {subject.teachers
                      .length > 0
                      ? subject.teachers
                          .map(
                            (
                              teacher
                            ) =>
                              `${teacher.firstName} ${teacher.lastName}`
                          )
                          .join(
                            ", "
                          )
                      : "No teachers assigned"}
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