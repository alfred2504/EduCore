"use client";

import { useState } from "react";

export function AIChat() {
  const [message, setMessage] =
    useState("");

  const [reply, setReply] =
    useState("");

  async function sendMessage() {
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

    const data =
      await res.json();

    setReply(data.reply);
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
    </div>
  );
}