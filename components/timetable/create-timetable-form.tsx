"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  classes: { id: string; name: string }[];
  subjects: { id: string; name: string }[];
  teachers: { id: string; firstName: string; lastName: string }[];
}

export function CreateTimetableForm({ classes, subjects, teachers }: Props) {
  const router = useRouter();
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!classId || !subjectId || !day || !startTime || !endTime) {
      toast.error("Fill required fields");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/timetables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId, subjectId, teacherId: teacherId || undefined, day, startTime, endTime }),
      });

      if (!res.ok) throw new Error("Failed to create timetable");

      toast.success("Timetable created");
      router.refresh();
      setClassId("");
      setSubjectId("");
      setTeacherId("");
      setDay("");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create timetable");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Create Timetable Slot</h3>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <select value={classId} onChange={(e) => setClassId(e.target.value)} className="rounded-xl border px-3 py-2">
          <option value="">Select class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="rounded-xl border px-3 py-2">
          <option value="">Select subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className="rounded-xl border px-3 py-2">
          <option value="">Select teacher (optional)</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
          ))}
        </select>

        <input value={day} onChange={(e) => setDay(e.target.value)} placeholder="Day (e.g., Monday)" className="rounded-xl border px-3 py-2" />
        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="rounded-xl border px-3 py-2" />
        <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="rounded-xl border px-3 py-2" />
      </div>

      <div className="mt-4">
        <button onClick={handleCreate} disabled={loading} className="rounded-xl bg-blue-600 px-4 py-2 text-white">
          {loading ? "Saving..." : "Create Slot"}
        </button>
      </div>
    </div>
  );
}
