import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const totalStudents =
    await prisma.user.count({
      where: {
        role: "STUDENT",
        status: "APPROVED",
      },
    });

  const totalTeachers =
    await prisma.user.count({
      where: {
        role: "TEACHER",
        status: "APPROVED",
      },
    });

  const totalAdmins =
    await prisma.user.count({
      where: {
        role: {
          in: ["SYSTEM_ADMIN", "SCHOOL_ADMIN"],
        },
        status: "APPROVED",
      },
    });

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>

        <p className="mt-1 text-slate-500">
          Overview of your institution
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Students */}
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">
            Students
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">
            {totalStudents}
          </h2>
        </div>

        {/* Teachers */}
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">
            Teachers
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">
            {totalTeachers}
          </h2>
        </div>

        {/* Admins */}
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">
            School Admins
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">
            {totalAdmins}
          </h2>
        </div>
      </div>
    </div>
  );
}