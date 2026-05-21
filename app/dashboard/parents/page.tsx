import { prisma } from "@/lib/prisma";

interface StudentItem {
  id: string;
}

interface ParentItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  students: StudentItem[];
}

export default async function ParentsPage() {
  const parents =
    await prisma.parent.findMany({
      include: {
        students: true,
      },
    });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Parents
        </h1>

        <p className="mt-2 text-slate-500">
          Parent portal management
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {parents.map(
          (
            parent: ParentItem
          ) => (
            <div
              key={parent.id}
              className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]"
            >
              <h2 className="text-xl font-bold">
                {
                  parent.firstName
                }{" "}
                {
                  parent.lastName
                }
              </h2>

              <p className="mt-1 text-slate-500">
                {parent.email}
              </p>

              <div className="mt-4">
                <h3 className="font-semibold">
                  Students
                </h3>

                <ul className="mt-2 space-y-2">
                  {parent.students
                    .length > 0 ? (
                    <li className="text-slate-600 dark:text-slate-400">
                      {
                        parent
                          .students
                          .length
                      }{" "}
                      student(s)
                      linked
                    </li>
                  ) : (
                    <li className="text-slate-500">
                      No students
                      linked
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}