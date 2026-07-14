"use client";

import { useState } from "react";

export function AIChat() {
  const [message, setMessage] =
    useState("");

  const [reply, setReply] =
    useState("");
  const [error, setError] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"model" | "local" | "">("");

  async function sendMessage() {
    setError("");
    setReply("");
    setSource("");
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setError("Enter a question before asking EduCore AI.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "/api/ai/chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: trimmedMessage,
          }),
        }
      );

      const contentType =
        res.headers.get("content-type") ??
        "";

      if (
        !contentType.includes(
          "application/json"
        )
      ) {
        throw new Error(
          `AI endpoint returned status ${res.status}`
        );
      }

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(
          data.error ??
            `AI endpoint returned status ${res.status}`
        );
      }

      setReply(data.reply ?? "");
      setSource(data.source === "local" ? "local" : "model");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "AI request failed";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-6 dark:bg-[#111827]">
      <h2 className="mb-4 text-xl font-bold">
        EduCore AI Assistant
      </h2>

      <textarea
        value={message}
        onChange={(e) =>
          setMessage(
            e.target.value
          )
        }
        className="w-full rounded-xl border p-4"
        rows={4}
        placeholder="Ask EduCore AI..."
      />

      <button
        onClick={sendMessage}
        disabled={loading}
        className="mt-4 rounded-xl bg-blue-600 px-6 py-3 text-white disabled:opacity-60"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {reply && (
        <div className="mt-6 rounded-xl border p-4">
          {reply}
        </div>
      )}

      {source === "local" && (
        <p className="mt-3 text-sm text-amber-700 dark:text-amber-300">
          Showing local guidance because the external AI model is currently unavailable.
        </p>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
