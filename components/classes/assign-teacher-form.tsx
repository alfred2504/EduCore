"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  classId: string;
  currentTeacherId?: string | null;
  teachers: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
}

export function AssignTeacherForm({ classId, currentTeacherId, teachers }: Props) {
  const router = useRouter();
  const [teacherId, setTeacherId] = useState(currentTeacherId ?? "");
  const [loading, setLoading] = useState(false);

  async function handleAssign() {
    if (!teacherId) {
      toast.error("Select a teacher first");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/classes/assign-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId, teacherId }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign teacher");
      }

      toast.success("Teacher assigned to class");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to assign teacher");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Assign Class Teacher</h3>
      <p className="mt-1 text-sm text-slate-500">Set the teacher responsible for this class.</p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <select
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="">Select teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.firstName} {teacher.lastName} ({teacher.email})
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={loading}
          onClick={handleAssign}
          className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Assign Teacher"}
        </button>
      </div>
    </div>
  );
}
