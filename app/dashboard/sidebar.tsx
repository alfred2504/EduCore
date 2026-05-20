"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardList,
  Package,
  BrainCircuit,
  Settings,
  ChevronDown,
  Plus,
  UserPlus,
} from "lucide-react";

import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER"],
  },
  {
    title: "Classes",
    href: "/dashboard/classes",
    icon: GraduationCap,
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER"],
  },
  {
    title: "Students",
    href: "/dashboard/students",
    icon: Users,
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER"],
  },
  {
    title: "Teachers",
    href: "/dashboard/teachers",
    icon: GraduationCap,
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN"],
  },
  {
    title: "Results",
    href: "/dashboard/results",
    icon: ClipboardList,
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER"],
  },
  {
    title: "Procurement",
    href: "/dashboard/procurement",
    icon: Package,
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN"],
  },
  {
    title: "AI Insights",
    href: "/dashboard/ai",
    icon: BrainCircuit,
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN"],
  },
  {
    title: "Approvals",
    href: "/dashboard/approvals",
    icon: Settings,
    roles: ["SYSTEM_ADMIN"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["SYSTEM_ADMIN"],
  },
];

interface SidebarProps {
  role: string;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [classesOpen, setClassesOpen] = useState(false);
  const [studentsOpen, setStudentsOpen] = useState(false);

  useEffect(() => {
    setClassesOpen(
      pathname.startsWith("/dashboard/classes") ||
        pathname.startsWith("/dashboard/classes/register")
    );

    setStudentsOpen(
      pathname.startsWith("/dashboard/students") ||
        pathname.startsWith("/register/student")
    );
  }, [pathname]);

  const filteredMenu = menuItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="hidden w-[260px] border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-[#111827] lg:flex lg:flex-col">
      <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-blue-600">EduCore</h1>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Intelligent School OS
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredMenu.map((item) => {
          const Icon = item.icon;

          if (item.title === "Classes") {
            const isActive =
              pathname.startsWith("/dashboard/classes") ||
              pathname.startsWith("/dashboard/classes/register");

            return (
              <div key={item.href} className="space-y-1">
                <button
                  type="button"
                  onClick={() => setClassesOpen((open) => !open)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} />
                    Classes
                  </span>

                  <ChevronDown
                    size={16}
                    className={cn(
                      "transition-transform duration-200",
                      classesOpen && "rotate-180"
                    )}
                  />
                </button>

                {classesOpen && (
                  <div className="space-y-1 pl-4">
                    <Link
                      href="/dashboard/classes/register"
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                        pathname.startsWith(
                          "/dashboard/classes/register"
                        )
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      )}
                    >
                      <Plus size={18} />
                      Register Class
                    </Link>

                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                        pathname === "/dashboard/classes"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      )}
                    >
                      <Icon size={18} />
                      Manage class records
                    </Link>
                  </div>
                )}
              </div>
            );
          }

          if (item.title === "Students") {
            const isActive =
              pathname.startsWith("/dashboard/students") ||
              pathname.startsWith("/register/student");

            return (
              <div key={item.href} className="space-y-1">
                <button
                  type="button"
                  onClick={() => setStudentsOpen((open) => !open)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} />
                    Students
                  </span>

                  <ChevronDown
                    size={16}
                    className={cn(
                      "transition-transform duration-200",
                      studentsOpen && "rotate-180"
                    )}
                  />
                </button>

                {studentsOpen && (
                  <div className="space-y-1 pl-4">
                    <Link
                      href="/register/student"
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                        pathname.startsWith("/register/student")
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      )}
                    >
                      <UserPlus size={18} />
                      Register Student
                    </Link>

                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                        pathname.startsWith("/dashboard/students")
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      )}
                    >
                      <Icon size={18} />
                      Manage student records
                    </Link>
                  </div>
                )}
              </div>
            );
          }

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