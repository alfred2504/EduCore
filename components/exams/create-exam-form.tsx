"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ClassItem = {
  id: string;
  name: string;
};

type SubjectItem = {
  id: string;
  name: string;
  code: string;
  classId: string;
  class: {
    name: string;
  };
  teacher?: {
    firstName: string;
    lastName: string;
  };
};

type TermItem = {
  id: string;
  name: string;
};

interface CreateExamFormProps {
  classes: ClassItem[];
  subjects: SubjectItem[];
  terms: TermItem[];
}

export function CreateExamForm({
  classes,
  subjects,
  terms,
}: CreateExamFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    classId: "",
    subjectId: "",
    termId: "",
    totalMarks: 100,
    examDate: "",
    published: false,
  });

  const filteredSubjects = formData.classId
    ? subjects.filter((s) => s.classId === formData.classId)
    : subjects;

  const selectedSubject = subjects.find((subject) => subject.id === formData.subjectId);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFeedback("");
    setLoading(true);

    try {
      const response = await fetch("/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          totalMarks: Number(formData.totalMarks),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Failed to create exam");
      }

      toast.success("Exam created successfully.");
      setFormData({
        title: "",
        type: "",
        description: "",
        classId: "",
        subjectId: "",
        termId: "",
        totalMarks: 100,
        examDate: "",
        published: false,
      });
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create exam.";
      setFeedback(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
        Create Exam
      </h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Fill in exam details and link to class, subject, and term.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        {/* Title */}
        <input
          type="text"
          placeholder="Exam title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          required
        />

        {/* Type */}
        <input
          type="text"
          placeholder="Exam type (e.g. Midterm, Final)"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          required
        />

        {/* Description */}
        <textarea
          placeholder="Description (optional)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />

        {/* Class & Subject Row */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Class Select */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Class
            </label>
            <select
              value={formData.classId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  classId: e.target.value,
                  subjectId: "",
                })
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              required
            >
              <option value="">Select class</option>
              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {classes.length === 0 && (
              <p className="text-xs text-rose-500 mt-1">No classes available. Create a class first.</p>
            )}
          </div>

          {/* Subject Select */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Subject
            </label>
            <select
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              required
            >
              <option value="">
                {formData.classId ? "Select subject" : "Pick class first"}
              </option>
              {filteredSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            {formData.classId && filteredSubjects.length === 0 && (
              <p className="text-xs text-rose-500 mt-1">No subjects for this class.</p>
            )}
            {selectedSubject?.teacher && (
              <p className="text-xs text-slate-500 mt-2">
                Taught by {selectedSubject.teacher.firstName} {selectedSubject.teacher.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Term & Total Marks Row */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Term Select */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Term
            </label>
            <select
              value={formData.termId}
              onChange={(e) => setFormData({ ...formData, termId: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              required
            >
              <option value="">Select term</option>
              {terms.map((term) => (
                <option key={term.id} value={term.id}>
                  {term.name}
                </option>
              ))}
            </select>
            {terms.length === 0 && (
              <p className="text-xs text-rose-500 mt-1">No terms available. Create a term first.</p>
            )}
          </div>

          {/* Total Marks */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Total Marks
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={formData.totalMarks}
              onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              required
            />
          </div>
        </div>

        {/* Exam Date & Publish Row */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Exam Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Exam Date
            </label>
            <input
              type="date"
              value={formData.examDate}
              onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              required
            />
          </div>

          {/* Publish Checkbox */}
          <div className="flex items-end">
            <label className="inline-flex items-center gap-3 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900 w-full">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="h-5 w-5 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500"
              />
              Publish now
            </label>
          </div>
        </div>

        {/* Error/Feedback */}
        {feedback ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-700/30 dark:bg-rose-950/40 dark:text-rose-200">
            {feedback}
          </p>
        ) : null}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !formData.title || !formData.type || !formData.classId || !formData.subjectId || !formData.termId || !formData.examDate}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creating exam..." : "Create Exam"}
        </button>
      </form>
    </div>
  );
}
