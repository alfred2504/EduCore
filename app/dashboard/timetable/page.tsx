import { prisma } from "@/lib/prisma";
import { CreateTimetableForm } from "@/components/timetable/create-timetable-form";

export default async function TimetablePage() {
  const [timetables, classes, subjects, teachers, terms] = await Promise.all([
    prisma.timetable.findMany({
      include: {
        class: true,
        subject: true,
        teacher: true,
      },
      orderBy: { day: "asc" },
    }),
    prisma.class.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.subject.findMany({
      select: { id: true, name: true, code: true, class: { select: { name: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.teacher.findMany({
      select: { id: true, firstName: true, lastName: true, email: true },
      orderBy: { firstName: "asc" },
    }),
    prisma.term.findMany({
      select: { id: true, name: true, startDate: true, endDate: true },
      orderBy: { startDate: "asc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Timetable Management</h1>
        <p className="mt-1 text-slate-500">View and create timetable slots</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <div className="text-sm text-slate-500">Total Classes</div>
          <div className="text-2xl font-bold mt-1">{classes.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <div className="text-sm text-slate-500">Total Subjects</div>
          <div className="text-2xl font-bold mt-1">{subjects.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <div className="text-sm text-slate-500">Total Teachers</div>
          <div className="text-2xl font-bold mt-1">{teachers.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <div className="text-sm text-slate-500">Scheduled Slots</div>
          <div className="text-2xl font-bold mt-1">{timetables.length}</div>
        </div>
      </div>

      {/* Create Form and Reference Data */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <CreateTimetableForm classes={classes} subjects={subjects} teachers={teachers} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Academic Terms */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
            <h3 className="text-lg font-semibold mb-4">Academic Terms</h3>
            <div className="grid gap-3">
              {terms.map((term) => (
                <div key={term.id} className="flex items-start justify-between border-b pb-3 last:border-b-0">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{term.name}</div>
                    <div className="text-sm text-slate-500 mt-1">
                      {new Date(term.startDate).toLocaleDateString()} - {new Date(term.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              {terms.length === 0 && (
                <div className="text-slate-500 text-sm">No academic terms configured</div>
              )}
            </div>
          </div>

          {/* Teachers List */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
            <h3 className="text-lg font-semibold mb-4">Teachers ({teachers.length})</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="border-b pb-3 last:border-b-0">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {teacher.firstName} {teacher.lastName}
                  </div>
                  <div className="text-sm text-slate-500">{teacher.email}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Subjects List */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
            <h3 className="text-lg font-semibold mb-4">Subjects ({subjects.length})</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {subjects.map((subject) => (
                <div key={subject.id} className="border-b pb-3 last:border-b-0">
                  <div className="font-semibold text-slate-900 dark:text-white text-sm">{subject.name}</div>
                  <div className="text-sm text-slate-500">
                    {subject.class.name} • {subject.code}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled Slots */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111827] overflow-hidden">
        <div className="border-b p-6">
          <h3 className="text-lg font-semibold">Scheduled Slots ({timetables.length})</h3>
        </div>
        <div className="p-6">
          {timetables.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {timetables.map((t) => (
                <div key={t.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700 hover:shadow-md transition">
                  <div className="font-semibold text-slate-900 dark:text-white">{t.class.name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    📚 {t.subject.name}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    📅 {t.day}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    🕐 {new Date(t.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {new Date(t.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div className="text-sm mt-2 font-medium">
                    👨‍🏫 {t.teacher ? `${t.teacher.firstName} ${t.teacher.lastName}` : <span className="text-slate-500">Unassigned</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              No timetable slots scheduled yet. Create one using the form.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
