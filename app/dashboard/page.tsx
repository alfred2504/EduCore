import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { AnalyticsCards } from "@/components/dashboard/analytics-cards";
import { prisma } from "@/lib/prisma";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { PerformanceChart } from "@/components/dashboard/performance-chart";

export default async function DashboardPage() {
  const session =
    await getServerSession(authOptions);

  const userName =
    session?.user?.name ?? "User";
  const totalStudents = await prisma.student.count();

  const activeStudents = await prisma.student.count({
    where: {
      user: {
        status: "ACTIVE",
      },
    },
  });

  const inactiveStudents = totalStudents - activeStudents;

  const totalTeachers = await prisma.teacher.count();

  const activeTeachers = await prisma.teacher.count({
    where: {
      user: {
        status: "ACTIVE",
      },
    },
  });

  const inactiveTeachers = totalTeachers - activeTeachers;

  const totalAdmins = await prisma.user.count({
    where: {
      role: {
        in: ["SYSTEM_ADMIN", "SCHOOL_ADMIN"],
      },
    },
  });

  const activeAdmins = await prisma.user.count({
    where: {
      role: {
        in: ["SYSTEM_ADMIN", "SCHOOL_ADMIN"],
      },
      status: "ACTIVE",
    },
  });

  const inactiveAdmins = totalAdmins - activeAdmins;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <WelcomeBanner name={userName} />

      {/* Analytics */}
      <AnalyticsCards
        totalStudents={totalStudents}
        activeStudents={activeStudents}
        inactiveStudents={inactiveStudents}
        totalTeachers={totalTeachers}
        activeTeachers={activeTeachers}
        inactiveTeachers={inactiveTeachers}
        totalAdmins={totalAdmins}
        activeAdmins={activeAdmins}
        inactiveAdmins={inactiveAdmins}
      />

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        <PerformanceChart />

        {/* AI Insights */}
        <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 shadow-sm">
          <h2 className="text-2xl font-bold">
            EduCore AI Insights
          </h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-white p-4 dark:bg-[#111827]">
              <p className="text-sm text-slate-500">
                Performance Prediction
              </p>

              <h3 className="mt-2 font-semibold">
                Academic performance
                trending upward
              </h3>
            </div>

            <div className="rounded-xl bg-white p-4 dark:bg-[#111827]">
              <p className="text-sm text-slate-500">
                Attendance Analysis
              </p>

              <h3 className="mt-2 font-semibold">
                Attendance stability
                improving
              </h3>
            </div>

            <div className="rounded-xl bg-white p-4 dark:bg-[#111827]">
              <p className="text-sm text-slate-500">
                Risk Detection
              </p>

              <h3 className="mt-2 font-semibold">
                No critical academic
                risks detected
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}