// app/dashboard/sidebar.tsx

"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardList,
  Package,
  BrainCircuit,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Students",
    href: "/dashboard/students",
    icon: Users,
  },
  {
    title: "Teachers",
    href: "/dashboard/teachers",
    icon: GraduationCap,
  },
  {
    title: "Results",
    href: "/dashboard/results",
    icon: ClipboardList,
  },
  {
    title: "Procurement",
    href: "/dashboard/procurement",
    icon: Package,
  },
  {
    title: "AI Insights",
    href: "/dashboard/analytics",
    icon: BrainCircuit,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[260px] border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-[#111827] lg:flex lg:flex-col">
      {/* Logo */}
      <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-blue-600">
          EduCore
        </h1>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          One system. Total control.
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                pathname === item.href
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              <Icon size={18} />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}