"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PublishExamButtonProps {
  examId: string;
  published: boolean;
}

export function PublishExamButton({
  examId,
  published,
}: PublishExamButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function handlePublish() {
    setLoading(true);
    setFeedback("");

    try {
      const response = await fetch(`/api/exams/${examId}/publish`, {
        method: "POST",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Failed to publish exam");
      }

      setFeedback("Exam published successfully.");
      router.refresh();
    } catch (error) {
      const knownError = error as { message?: string };
      setFeedback(knownError.message ?? "Failed to publish exam.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={handlePublish}
        disabled={loading || published}
        className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {published ? "Published" : loading ? "Publishing..." : "Publish Exam"}
      </button>

      {feedback ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">{feedback}</p>
      ) : null}
    </div>
  );
}
