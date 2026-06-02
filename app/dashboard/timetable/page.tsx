import { prisma } from "@/lib/prisma";
import { CreateTimetableForm } from "@/components/timetable/create-timetable-form";

export default async function TimetablePage() {
  const timetables = await prisma.timetable.findMany({ include: { class: true, subject: true, teacher: true }, orderBy: { day: "asc" } });

  const classes = await prisma.class.findMany({ select: { id: true, name: true } });
  const subjects = await prisma.subject.findMany({ select: { id: true, name: true } });
  const teachers = await prisma.teacher.findMany({ select: { id: true, firstName: true, lastName: true } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Timetable</h1>
        <p className="mt-1 text-slate-500">View and create timetable slots</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CreateTimetableForm classes={classes} subjects={subjects} teachers={teachers} />

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <h3 className="text-lg font-semibold">Scheduled Slots</h3>
          <div className="mt-4 space-y-3">
            {timetables.map((t) => (
              <div key={t.id} className="rounded-lg border p-3">
                <div className="font-semibold">{t.class.name} — {t.subject.name}</div>
                <div className="text-sm text-slate-500">{t.day} • {new Date(t.startTime).toLocaleTimeString()} - {new Date(t.endTime).toLocaleTimeString()}</div>
                <div className="text-sm">Teacher: {t.teacher ? `${t.teacher.firstName} ${t.teacher.lastName}` : "Unassigned"}</div>
              </div>
            ))}

            {timetables.length === 0 && <div className="text-slate-500">No timetable slots yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
