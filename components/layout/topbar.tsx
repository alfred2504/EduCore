"use client";

import { signOut } from "next-auth/react";

interface TopbarProps {
  name: string;
  role: string;
}

export function Topbar({
  name,
  role,
}: TopbarProps) {
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-[#111827]">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          EduCore AI
        </h2>

        <p className="text-sm text-slate-500">
          One system. Total control.
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* User */}
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {name}
          </p>

          <p className="text-xs text-slate-500">
            {role}
          </p>
        </div>

        {/* Avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
          {name.charAt(0)}
        </div>

        {/* Logout */}
        <button
          onClick={() =>
            signOut({
              callbackUrl: "/login",
            })
          }
          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}