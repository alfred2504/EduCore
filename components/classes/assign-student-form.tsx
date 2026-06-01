"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  classId: string;
  students: {
    id: string;
    firstName: string;
    lastName: string;
    admissionNumber: string;
  }[];
}

export function AssignStudentForm({ classId, students }: Props) {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAssign() {
    if (!studentId) {
      toast.error("Select a student first");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/classes/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, classId }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign student");
      }

      toast.success("Student assigned to class");
      setStudentId("");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to assign student");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Assign Student</h3>
      <p className="mt-1 text-sm text-slate-500">Move a student into this class.</p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="">Select student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.firstName} {student.lastName} ({student.admissionNumber})
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={loading}
          onClick={handleAssign}
          className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Assigning..." : "Assign Student"}
        </button>
      </div>
    </div>
  );
}
