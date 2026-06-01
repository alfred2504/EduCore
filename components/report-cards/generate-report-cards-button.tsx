"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GenerateReportCardsButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    try {
      setLoading(true);
      const response = await fetch("/api/report-cards/generate", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to generate report cards");
      }

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={loading}
      className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
    >
      {loading ? "Generating..." : "Generate Report Cards"}
    </button>
  );
}
