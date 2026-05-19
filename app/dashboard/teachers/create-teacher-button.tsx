"use client";
import React from "react";

export default function CreateTeacherButton({ userId }: { userId: string }) {
  const createRecord = async () => {
    try {
      const res = await fetch('/api/admin/promote-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        const p = await res.json().catch(() => null);
        alert(p?.error ?? 'Failed to create teacher record');
        return;
      }
      alert('Teacher record created');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Error creating teacher record');
    }
  };

  return (
    <button onClick={createRecord} className="rounded bg-blue-600 px-3 py-1 text-white">
      Create record
    </button>
  );
}
