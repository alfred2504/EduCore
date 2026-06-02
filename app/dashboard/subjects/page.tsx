import { prisma } from "@/lib/prisma";
import { CreateSubjectForm } from "@/components/subjects/create-subject-form";

interface TeacherItem {
  id: string;
  firstName: string;
  lastName: string;
}

interface ClassItem {
  id: string;
  name: string;
}

interface SubjectItem {
  id: string;
  name: string;
  code: string;
  class: ClassItem;
  teacher: TeacherItem | null;
}

export default async function SubjectsPage() {
  const [subjects, classes, teachers] = await Promise.all([
    prisma.subject.findMany({
      include: {
        class: true,
        teacher: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.class.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.teacher.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
      orderBy: {
        firstName: "asc",
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Subjects
        </h1>

        <p className="mt-1 text-slate-500">
          Subject management
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <CreateSubjectForm classes={classes} teachers={teachers} />

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="px-6 py-4 text-left">Subject</th>
                <th className="px-6 py-4 text-left">Code</th>
                <th className="px-6 py-4 text-left">Class</th>
                <th className="px-6 py-4 text-left">Teacher</th>
              </tr>
            </thead>

            <tbody>
              {subjects.map((subject: SubjectItem) => (
                <tr key={subject.id} className="border-b">
                  <td className="px-6 py-4">{subject.name}</td>
                  <td className="px-6 py-4">{subject.code}</td>
                  <td className="px-6 py-4">{subject.class.name}</td>
                  <td className="px-6 py-4">
                    {subject.teacher ? `${subject.teacher.firstName} ${subject.teacher.lastName}` : "No teacher assigned"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {subjects.length === 0 && (
            <div className="p-10 text-center text-slate-500">No subjects found</div>
          )}
        </div>
      </div>
    </div>
  );
}