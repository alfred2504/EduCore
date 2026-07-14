"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface TeacherItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  qualification: string | null;
  createdAt: Date;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshTeachers = async () => {
    try {
      const res = await fetch("/api/teachers");
      const data = await res.json();
      setTeachers(data || []);
    } catch {
      setTeachers([]);
    }
  };

  const deleteTeacher = async (id: string) => {
    if (!window.confirm("Delete this teacher account?")) return;
    setLoading(true);
    const res = await fetch(`/api/teachers/${id}/delete`, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) {
      const errorBody = await res.json().catch(() => null);
      alert(
        errorBody?.error ||
          "Unable to delete teacher account"
      );
      return;
    }
    await refreshTeachers();
  };

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/teachers", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setTeachers(data || []))
      .catch((error: unknown) => {
        if ((error as { name?: string }).name !== "AbortError") {
          setTeachers([]);
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Teachers
          </h1>

          <p className="mt-1 text-slate-500">
            Manage teacher records
          </p>
        </div>

        <Link
          href="/dashboard/teachers/new"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Add Teacher
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">
            Total Teachers
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {teachers.length}
          </h2>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <table className="w-full">
          <thead className="border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 text-left">
                Name
              </th>

              <th className="px-6 py-4 text-left">
                Email
              </th>

              <th className="px-6 py-4 text-left">
                Qualification
              </th>

              <th className="px-6 py-4 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {teachers.map(
              (teacher: TeacherItem) => (
                <tr
                  key={teacher.id}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="px-6 py-4 font-medium">
                    {teacher.firstName}{" "}
                    {teacher.lastName}
                  </td>

                  <td className="px-6 py-4">
                    {teacher.email || "-"}
                  </td>

                  <td className="px-6 py-4">
                    {teacher.qualification || "-"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/dashboard/teachers/${teacher.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteTeacher(teacher.id)}
                        disabled={loading}
                        className="text-rose-600 hover:underline disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {teachers.length === 0 && (
          <div className="p-10 text-center text-slate-500">
            No teachers found
          </div>
        )}
      </div>
    </div>
  );
}
