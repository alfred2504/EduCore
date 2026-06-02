"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  subjectId: string;
  classes: { id: string; name: string }[];
  teachers: { id: string; firstName: string; lastName: string }[];
  currentClassId?: string;
  currentTeacherId?: string | null;
}

export function AssignSubjectForm({ subjectId, classes, teachers, currentClassId, currentTeacherId }: Props) {
  const router = useRouter();
  const [classId, setClassId] = useState(currentClassId ?? "");
  const [teacherId, setTeacherId] = useState(currentTeacherId ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);

    try {
      const res = await fetch(`/api/subjects/${subjectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: classId || undefined, teacherId: teacherId || null }),
      });

      if (!res.ok) throw new Error("Failed to assign subject");

      toast.success("Subject updated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update subject");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
      <h3 className="text-lg font-semibold">Assign Subject</h3>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <select value={classId} onChange={(e) => setClassId(e.target.value)} className="rounded-xl border px-3 py-2">
          <option value="">Select class (optional)</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select value={teacherId ?? ""} onChange={(e) => setTeacherId(e.target.value)} className="rounded-xl border px-3 py-2">
          <option value="">Select teacher (optional)</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <button onClick={handleSave} disabled={loading} className="rounded-xl bg-blue-600 px-4 py-2 text-white">
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
