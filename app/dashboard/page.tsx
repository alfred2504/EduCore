import { AnalyticsCards } from "@/components/dashboard/analytics-cards";

import { PerformanceChart } from "@/components/dashboard/performance-chart";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          EduCore AI Dashboard
        </h1>

        <p className="mt-1 text-slate-500">
          Intelligent educational analytics
        </p>
      </div>

      {/* Analytics */}
      <AnalyticsCards />

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