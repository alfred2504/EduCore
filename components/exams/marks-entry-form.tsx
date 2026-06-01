"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { calculateGrade, gradePoints } from "@/lib/grading";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
};

type Exam = {
  id: string;
  title: string;
  type: string;
  totalMarks: number;
  published: boolean;
  subject: {
    name: string;
  };
  class: {
    name: string;
  };
};

type ExistingResult = {
  studentId: string;
  marks: number;
  grade: string | null;
  points: number | null;
  remarks: string | null;
};

interface MarksEntryFormProps {
  exam: Exam;
  students: Student[];
  existingResults: ExistingResult[];
}

export function MarksEntryForm({
  exam,
  students,
  existingResults,
}: MarksEntryFormProps) {
  const router = useRouter();
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [marks, setMarks] = useState("");
  const [remarks, setRemarks] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  const numericMarks = Number(marks);
  const derivedGrade = Number.isFinite(numericMarks)
    ? calculateGrade(numericMarks)
    : "-";
  const derivedPoints = Number.isFinite(numericMarks)
    ? gradePoints(numericMarks)
    : 0;

  const currentResult = useMemo(
    () => existingResults.find((result) => result.studentId === studentId),
    [existingResults, studentId]
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFeedback("");
    setSaving(true);

    try {
      const response = await fetch("/api/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examId: exam.id,
          studentId,
          marks: Number(marks),
          remarks,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Failed to save marks");
      }

      setFeedback("Result saved successfully.");
      setMarks("");
      setRemarks("");
      router.refresh();
    } catch (error) {
      const knownError = error as { message?: string };
      setFeedback(knownError.message ?? "Failed to save marks.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
              Exam
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {exam.title}
            </h1>
            <p className="mt-2 text-slate-500">
              {exam.subject.name} • {exam.class.name} • {exam.type}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            Total marks: <span className="font-semibold text-slate-900 dark:text-white">{exam.totalMarks}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <label htmlFor="studentId" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Select Student
            </label>
            <select
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} ({student.admissionNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="marks" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Enter Marks
            </label>
            <input
              id="marks"
              type="number"
              min="0"
              max={exam.totalMarks}
              step="0.01"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              placeholder={`0 - ${exam.totalMarks}`}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="remarks" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Remarks
            </label>
            <textarea
              id="remarks"
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              placeholder="Optional teacher remarks"
            />
          </div>

          <div className="rounded-2xl border border-blue-500/15 bg-blue-50/80 p-4 text-sm text-slate-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-slate-200">
            <div className="flex items-center justify-between gap-4">
              <span>Auto grade</span>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">{derivedGrade}</span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-4">
              <span>Grade points</span>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">{derivedPoints.toFixed(1)}</span>
            </div>
          </div>

          {feedback ? (
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              {feedback}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={saving || !studentId || marks === ""}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saving result..." : "Save Result"}
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Current Student Result
          </h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex justify-between gap-4">
              <span>Marks</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {currentResult?.marks ?? "-"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Grade</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {currentResult?.grade ?? "-"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Points</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {currentResult?.points ?? "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-sm">
          <p className="text-sm uppercase tracking-[0.18em] text-white/60">
            Workflow
          </p>
          <div className="mt-4 space-y-3 text-sm text-white/85">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Select the learner</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Enter marks and remarks</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Save the result for admin review</div>
          </div>
        </div>
      </div>
    </div>
  );
}
