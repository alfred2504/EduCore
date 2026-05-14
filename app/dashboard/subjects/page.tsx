import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type SubjectWithRelations = Prisma.SubjectGetPayload<{
  include: {
    class: true;
    teacher: true;
  };
}>;

export default async function SubjectsPage() {
  const subjects =
    await prisma.subject.findMany({
      include: {
        class: true,
        teacher: true,
      },
    });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Subjects
        </h1>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left">
                Subject
              </th>

              <th className="px-4 py-3 text-left">
                Code
              </th>

              <th className="px-4 py-3 text-left">
                Class
              </th>

              <th className="px-4 py-3 text-left">
                Teacher
              </th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((subject: SubjectWithRelations) => (
              <tr key={subject.id}>
                <td className="px-4 py-3">
                  {subject.name}
                </td>

                <td className="px-4 py-3">
                  {subject.code}
                </td>

                <td className="px-4 py-3">
                  {subject.class.name}
                </td>

                <td className="px-4 py-3">
                  {subject.teacher
                    ? `${subject.teacher.firstName} ${subject.teacher.lastName}`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}