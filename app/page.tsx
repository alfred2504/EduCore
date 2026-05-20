import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  Layers3,
  Menu,
  Search,
  Star,
  Users,
  Zap,
} from "lucide-react";

const stats = [
  {
    value: "04 Dashboards",
    icon: LayoutDashboard,
  },
  {
    value: "100+ Screens",
    icon: Layers3,
  },
];

const featurePills = [
  "Student Records",
  "Attendance",
  "Grades",
  "Timetable",
];

function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[760px] rounded-[2rem] border border-white/60 bg-[#f7f9ff] p-3 shadow-[0_35px_120px_rgba(0,0,0,0.35)] lg:rotate-[-8deg] lg:translate-x-6 lg:translate-y-3">
      <div className="overflow-hidden rounded-[1.6rem] bg-white text-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-sm">
              <BookOpen size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none text-slate-900">
                EduCore
              </p>
              <p className="text-[11px] text-slate-500">
                Global International
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Menu size={16} />
            <span className="hidden rounded-full border border-slate-200 px-3 py-1 text-[11px] font-medium text-slate-500 md:inline-flex">
              Academic Year 2024 / 2025
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[220px_minmax(0,1fr)]">
          <aside className="border-r border-slate-200 bg-slate-50/95 p-4">
            <div className="mb-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    EduCore
                  </p>
                  <p className="text-[11px] text-slate-500">
                    School OS
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              <div className="rounded-xl bg-blue-50 px-3 py-2 text-blue-600">
                Dashboard
              </div>
              <div className="rounded-xl px-3 py-2 hover:bg-slate-100">
                Students
              </div>
              <div className="rounded-xl px-3 py-2 hover:bg-slate-100">
                Teachers
              </div>
              <div className="rounded-xl px-3 py-2 hover:bg-slate-100">
                Classes
              </div>
              <div className="rounded-xl px-3 py-2 hover:bg-slate-100">
                Subjects
              </div>
              <div className="rounded-xl px-3 py-2 hover:bg-slate-100">
                Attendance
              </div>
            </div>
          </aside>

          <main className="bg-white p-4">
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2">
              <Search size={15} className="text-slate-400" />
              <span className="text-sm text-slate-400">
                Search
              </span>
            </div>

            <div className="rounded-[1.6rem] bg-[#111827] px-4 py-4 text-white shadow-lg">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">
                    Welcome Back, Mr. Herald
                  </p>
                  <p className="text-xs text-white/65">
                    Have a good day at work.
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <Star size={14} className="text-amber-300" />
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                ["3654", "Total Students", "3643", "11", "#f97316"],
                ["284", "Total Teachers", "254", "30", "#3b82f6"],
                ["162", "Total Staff", "161", "1", "#22c55e"],
              ].map(([count, label, active, inactive, accent]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xl font-bold text-slate-900">
                        {count}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {label}
                      </p>
                    </div>
                    <div
                      className="h-8 w-8 rounded-xl"
                      style={{ backgroundColor: `${accent}20` }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      Active: {active}
                    </span>
                    <span>
                      Inactive: {inactive}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Fees Collection
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Quarterly overview
                  </p>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
                  Last 8 Quarter
                </div>
              </div>

              <div className="flex h-40 items-end gap-3 rounded-2xl bg-gradient-to-t from-slate-50 to-white px-4 py-3">
                {[48, 58, 52, 65, 59, 71, 64, 57, 72, 68].map((height, index) => (
                  <div key={`${height}-${index}`} className="flex flex-1 items-end justify-center">
                    <div
                      className="w-full max-w-[32px] rounded-t-xl bg-gradient-to-t from-blue-600 to-blue-400 shadow-sm"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-[1fr_220px] gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Schedules
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Academic calendar
                    </p>
                  </div>
                  <div className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-600">
                    Add New
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <div key={`${day}-${index}`} className="py-1">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[11px] text-slate-500">
                  {Array.from({ length: 28 }, (_, index) => index + 1).map((day) => (
                    <div
                      key={day}
                      className={`rounded-lg py-1.5 ${day === 18 || day === 19 ? "bg-blue-600 text-white" : day === 11 ? "bg-slate-100 text-slate-900" : ""}`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">
                    Attendance
                  </p>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-500">
                    Today
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  {[
                    ["28", "Emergency"],
                    ["01", "Absent"],
                    ["01", "Late"],
                  ].map(([number, label]) => (
                    <div key={label} className="rounded-2xl bg-slate-50 px-2 py-3">
                      <p className="text-base font-bold text-slate-900">{number}</p>
                      <p className="mt-1 text-[10px] text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-end justify-center">
                  <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-blue-600 to-cyan-400">
                    <div className="absolute inset-4 rounded-full bg-white" />
                    <div className="absolute inset-0 rounded-full border-[12px] border-transparent border-r-white/90 border-b-white/90 rotate-45" />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#4763e8_0%,_#243b98_38%,_#14255f_100%)] text-white">
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10 lg:px-10">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <section className="max-w-2xl">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-[1.8rem] bg-white/12 shadow-[0_20px_50px_rgba(0,0,0,0.25)] ring-1 ring-white/20 backdrop-blur">
                <div className="relative flex h-14 w-14 rotate-[-12deg] items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-500 shadow-lg">
                  <div className="absolute -right-0.5 bottom-0 h-5 w-5 rotate-45 rounded-sm bg-white" />
                  <div className="absolute left-1 top-1 h-8 w-5 rounded-t-full bg-white/90" />
                </div>
              </div>
              <div>
                <p className="text-5xl font-semibold tracking-tight sm:text-6xl">
                  EduCore
                </p>
              </div>
            </div>

            <div className="mt-12 max-w-xl space-y-5">
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                School, Education &amp;
                <br />
                University Management
              </h1>

              <div className="inline-block border-b-4 border-cyan-300 pb-1">
                <p className="text-3xl font-extrabold text-cyan-300 sm:text-4xl lg:text-5xl">
                  Admin Template
                </p>
              </div>

              <p className="max-w-lg text-lg leading-8 text-white/78 sm:text-xl">
                A polished school administration cover inspired by the EduCore
                dashboard system, designed to set the tone before login.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-5 text-2xl font-semibold sm:gap-8 sm:text-3xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 size={26} fill="currentColor" />
                </div>
                <span>04 Dashboards</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 size={26} fill="currentColor" />
                </div>
                <span>100+ Screens</span>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {featurePills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur"
                >
                  {pill}
                </span>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:-translate-y-0.5 hover:bg-cyan-50"
              >
                Enter Dashboard
                <ChevronRight size={16} />
              </Link>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white/90 backdrop-blur">
                <Zap size={16} className="text-cyan-300" />
                Modern school OS for admissions, results, and attendance
              </div>
            </div>
          </section>

          <section className="relative">
            <div className="absolute -left-10 top-10 h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl" />
            <div className="absolute -right-4 bottom-10 h-32 w-32 rounded-full bg-blue-200/20 blur-2xl" />
            <DashboardMockup />
          </section>
        </div>
      </div>
    </main>
  );
}
