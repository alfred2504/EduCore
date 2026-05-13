// components/layout/topbar.tsx

"use client";

import { Bell, Search } from "lucide-react";
import { ModeToggle } from "./theme-toggle";

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-[#111827]">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell size={20} className="text-slate-600 dark:text-slate-300" />

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <ModeToggle />

        {/* Profile */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700">
          <div className="h-9 w-9 rounded-full bg-blue-600" />

          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-800 dark:text-white">
              Alfred Makura
            </p>

            <p className="text-xs text-slate-500">
              School Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}