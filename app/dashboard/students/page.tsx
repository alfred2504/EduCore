"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface StudentItem {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string | null;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshStudents = async () => {
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(data || []);
    } catch {
      setStudents([]);
    }
  };

  const deleteStudent = async (id: string) => {
    if (!window.confirm("Delete this student account?")) return;
    setLoading(true);
    const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) {
      alert("Unable to delete student account");
      return;
    }
    await refreshStudents();
  };

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/students", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setStudents(data || []))
      .catch((error: unknown) => {
        if ((error as { name?: string }).name !== "AbortError") {
          setStudents([]);
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Students
          </h1>

          <p className="mt-1 text-slate-500">
            Manage student records
          </p>
        </div>
        <Link
          href="/register/student"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Add Student
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <table className="min-w-[720px] w-full">
          <thead className="border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 text-left">
                Admission No
              </th>

              <th className="px-6 py-4 text-left">
                Student
              </th>

              <th className="px-6 py-4 text-left">
                Gender
              </th>

              <th className="px-6 py-4 text-left">
                Email
              </th>
            </tr>
          </thead>

          <tbody>
            {students.map(
              (
                student: StudentItem
              ) => (
                <tr
                  key={student.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                >
                  <td className="px-6 py-4">
                    {
                      student.admissionNumber
                    }
                  </td>

                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/students/${student.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {
                        student.firstName
                      }{" "}
                      {
                        student.lastName
                      }
                    </Link>
                  </td>

                  <td className="px-6 py-4">
                    {student.gender}
                  </td>

                  <td className="px-6 py-4">
                    {student.email ||
                      "-"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteStudent(student.id)}
                      disabled={loading}
                      className="text-rose-600 hover:underline disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {students.length ===
          0 && (
          <div className="p-10 text-center text-slate-500">
            No students found
          </div>
        )}
      </div>
    </div>
  );
}
