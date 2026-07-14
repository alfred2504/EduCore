"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type AttendanceStudent = {
  id: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
  classId: string | null;
  class: {
    id: string;
    name: string;
  } | null;
};

export function AttendanceEntryForm({
  students,
}: {
  students: AttendanceStudent[];
}) {
  const router = useRouter();
  const [studentId, setStudentId] = useState(
    students[0]?.id ?? ""
  );
  const [status, setStatus] = useState("PRESENT");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === studentId),
    [studentId, students]
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFeedback("");

    if (!selectedStudent?.classId) {
      setFeedback("Selected student must be assigned to a class.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          classId: selectedStudent.classId,
          status,
          date,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Failed to save attendance.");
      }

      setFeedback("Attendance record saved successfully.");
      router.refresh();
    } catch (error) {
      setFeedback(
        (error as { message?: string }).message ??
          "Failed to save attendance."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Enter Attendance</h2>
        <p className="mt-2 text-sm text-slate-500">
          Teachers and administrators can record student attendance here.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Student
          </label>
          <select
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName} ({student.admissionNumber})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Status
          </label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LATE">Late</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {selectedStudent?.class ? (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
            Class: <span className="font-semibold">{selectedStudent.class.name}</span>
          </div>
        ) : null}

        {feedback ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            {feedback}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={saving || !studentId}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Saving attendance..." : "Save Attendance"}
        </button>
      </form>
    </div>
  );
}
