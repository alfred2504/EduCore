"use client";
import React from "react";

export default function PromoteButton({ userId }: { userId: string }) {
  const promote = async () => {
    try {
      const res = await fetch('/api/admin/promote-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        const p = await res.json().catch(() => null);
        alert(p?.error ?? 'Failed to promote');
        return;
      }
      alert('Promoted to teacher');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Error promoting user');
    }
  };

  return (
    <button onClick={promote} className="rounded bg-blue-600 px-3 py-1 text-white">
      Promote
    </button>
  );
}
