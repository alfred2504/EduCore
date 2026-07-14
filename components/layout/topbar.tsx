"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BarChart3,
  BrainCircuit,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  Users,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/theme-toggle";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"],
  },
  {
    title: "Students",
    href: "/dashboard/students",
    icon: Users,
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER"],
  },
  {
    title: "Classes",
    href: "/dashboard/classes",
    icon: GraduationCap,
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER"],
  },
  {
    title: "Exams",
    href: "/dashboard/exams",
    icon: ClipboardList,
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER"],
  },
  {
    title: "Results",
    href: "/dashboard/results",
    icon: ClipboardList,
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER"],
  },
  {
    title: "Academic Analytics",
    href: "/dashboard/analytics/academics",
    icon: BarChart3,
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER"],
  },
  {
    title: "Parent Portal",
    href: "/dashboard/parent",
    icon: Users,
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"],
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
];

interface TopbarProps {
  name: string;
  role: string;
}

export function Topbar({ name, role }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredMenu = menuItems.filter((item) => item.roles.includes(role));

  return (
    <>
      <header className="sticky top-0 z-40 flex min-h-[72px] items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-[#111827] sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              EduCore
            </h2>

            <p className="hidden text-sm text-slate-500 sm:block">
              One system. Total control.
            </p>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <div className="hidden text-right sm:block">
            <p className="max-w-[120px] truncate text-sm font-semibold text-slate-900 dark:text-white sm:max-w-[180px]">
              {name}
            </p>

            <p className="text-xs text-slate-500">{role}</p>
          </div>

          <ModeToggle />

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white sm:h-10 sm:w-10">
            {name.charAt(0)}
          </div>

          <button
            onClick={async () => {
              await signOut({ redirect: false });
              router.push("/login");
            }}
            className="rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600 sm:px-4"
          >
            Logout
          </button>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        hidden={!menuOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-slate-950/50 transition-opacity duration-200",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMenuOpen(false)}
        />

        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-[290px] overflow-y-auto border-r border-slate-200 bg-white shadow-2xl transition-transform duration-200 dark:border-slate-800 dark:bg-[#111827]",
            menuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div>
              <h2 className="text-2xl font-bold text-blue-600">EduCore</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Mobile menu</p>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close navigation menu"
              >
                <X size={20} className="text-slate-600 dark:text-slate-300" />
              </button>
            </div>
          </div>

          <nav className="space-y-1 px-3 py-4">
            {filteredMenu.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon size={18} />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </aside>
      </div>
    </>
  );
}
