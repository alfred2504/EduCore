"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type SubjectItem = {
  id: string;
  name: string;
  code: string;
  teacherId: string | null;
  class: {
    name: string;
  };
};

interface AssignSubjectToTeacherFormProps {
  teacherId: string;
  subjects: SubjectItem[];
}

export function AssignSubjectToTeacherForm({ teacherId, subjects }: AssignSubjectToTeacherFormProps) {
  const router = useRouter();
  const [subjectId, setSubjectId] = useState("");
  const [loading, setLoading] = useState(false);

  const availableSubjects = subjects.filter((subject) => subject.teacherId !== teacherId);

  async function handleAssign() {
    if (!subjectId) {
      toast.error("Select a subject to assign.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/subjects/${subjectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Failed to assign subject.");
      }

      toast.success("Subject assigned to teacher.");
      setSubjectId("");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to assign subject.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Assign Subject</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Pick a subject and assign it to this teacher.</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="">Select subject</option>
          {availableSubjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name} ({subject.class.name})
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={loading || !subjectId}
          onClick={handleAssign}
          className="rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Assigning..." : "Assign Subject"}
        </button>
      </div>

      {availableSubjects.length === 0 && (
        <p className="mt-4 text-sm text-slate-500">No available subjects to assign. Create a subject first.</p>
      )}
    </div>
  );
}
