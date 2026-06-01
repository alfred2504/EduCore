"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AssignTeachersPage() {
  const router = useRouter();
  const [classId, setClassId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAssign() {
    if (!classId || !teacherId) {
      toast.error("Select a class and a teacher first");
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
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Failed to assign teacher");
      }

      toast.success("Teacher assigned to class");
      router.refresh();
      setClassId("");
      setTeacherId("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to assign teacher");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Teacher Assignment</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Assign Teachers to Classes</h1>
        <p className="mt-2 text-slate-500">Set or change the teacher responsible for a class.</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Class ID</label>
            <input
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              placeholder="Paste class ID"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Teacher ID</label>
            <input
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              placeholder="Paste teacher ID"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAssign}
          disabled={loading}
          className="mt-6 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Assign Teacher"}
        </button>
      </div>
    </div>
  );
}
