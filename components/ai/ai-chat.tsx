"use client";

import { useState } from "react";

export function AIChat() {
  const [message, setMessage] =
    useState("");

  const [reply, setReply] =
    useState("");
  const [error, setError] =
    useState("");

  async function sendMessage() {
    setError("");
    setReply("");

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
            message,
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
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "AI request failed";

      setError(message);
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
        className="mt-4 rounded-xl bg-blue-600 px-6 py-3 text-white"
      >
        Ask AI
      </button>

      {reply && (
        <div className="mt-6 rounded-xl border p-4">
          {reply}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
