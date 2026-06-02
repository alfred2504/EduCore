"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ClassItem = {
  id: string;
  name: string;
};

type TeacherItem = {
  id: string;
  firstName: string;
  lastName: string;
};

interface CreateSubjectFormProps {
  classes: ClassItem[];
  teachers: TeacherItem[];
}

export function CreateSubjectForm({ classes, teachers }: CreateSubjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    classId: "",
    teacherId: "",
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!formData.name || !formData.code || !formData.classId) {
      toast.error("Please fill subject name, code, and class.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          code: formData.code,
          classId: formData.classId,
          teacherId: formData.teacherId || null,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Failed to create subject.");
      }

      toast.success("Subject created successfully.");
      setFormData({ name: "", code: "", classId: "", teacherId: "" });
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create subject.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Create Subject</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Create a subject and assign it to a class immediately.</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <input
          type="text"
          placeholder="Subject name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          required
        />

        <input
          type="text"
          placeholder="Subject code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          required
        />

        <select
          value={formData.classId}
          onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          required
        >
          <option value="">Select class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={formData.teacherId}
          onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="">Assign teacher (optional)</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
          ))}
        </select>

        {classes.length === 0 && (
          <p className="text-xs text-rose-500">No classes available. Create a class before adding subjects.</p>
        )}

        <button
          type="submit"
          disabled={loading || !formData.name || !formData.code || !formData.classId}
          className="rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating subject..." : "Create Subject"}
        </button>
      </form>
    </div>
  );
}
