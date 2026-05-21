import { prisma } from "@/lib/prisma";

export async function AnalyticsCards() {
  const totalStudents =
    await prisma.student.count();

  const activeStudents =
    await prisma.student.count({
      where: {
        user: {
          status: "ACTIVE",
        },
      },
    });

  const inactiveStudents =
    totalStudents - activeStudents;

  const totalTeachers =
    await prisma.teacher.count();

  const activeTeachers =
    await prisma.teacher.count({
      where: {
        user: {
          status: "ACTIVE",
        },
      },
    });

  const inactiveTeachers =
    totalTeachers - activeTeachers;

  // Admin count (users with role SYSTEM_ADMIN or SCHOOL_ADMIN)
  const totalAdmins =
    await prisma.user.count({
      where: {
        role: {
          in: ["SYSTEM_ADMIN", "SCHOOL_ADMIN"],
        },
      },
    });

  const activeAdmins =
    await prisma.user.count({
      where: {
        role: {
          in: ["SYSTEM_ADMIN", "SCHOOL_ADMIN"],
        },
        status: "ACTIVE",
      },
    });

  const inactiveAdmins =
    totalAdmins - activeAdmins;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Students Card */}
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Students
            </p>
            <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">
              {totalStudents}
            </h2>
            <div className="mt-4 space-y-1 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Active / Inactive:</span>
                <span className="font-medium">
                  {activeStudents} / {inactiveStudents}
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
            <div className="h-8 w-8 rounded bg-green-500/20"></div>
          </div>
        </div>
      </div>

      {/* Teachers Card */}
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Teachers
            </p>
            <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">
              {totalTeachers}
            </h2>
            <div className="mt-4 space-y-1 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Active / Inactive:</span>
                <span className="font-medium">
                  {activeTeachers} / {inactiveTeachers}
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
            <div className="h-8 w-8 rounded bg-blue-500/20"></div>
          </div>
        </div>
      </div>

      {/* Admin Staff Card */}
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Admins
            </p>
            <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">
              {totalAdmins}
            </h2>
            <div className="mt-4 space-y-1 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Active / Inactive:</span>
                <span className="font-medium">
                  {activeAdmins} / {inactiveAdmins}
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
            <div className="h-8 w-8 rounded bg-purple-500/20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}