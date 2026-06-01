"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  DollarSign,
  Users,
  ShoppingCart,
  GraduationCap,
  ClipboardList,
  BookOpen,
  BrainCircuit,
  Shield,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "SYSTEM_ADMIN",
      "SCHOOL_ADMIN",
      "TEACHER",
    ],
  },

  {
    title: "Students",
    href: "/dashboard/students",
    icon: Users,
    roles: [
      "SYSTEM_ADMIN",
      "SCHOOL_ADMIN",
      "TEACHER",
    ],
  },

  {
    title: "Classes",
    href: "/dashboard/classes",
    icon: GraduationCap,
    roles: [
      "SYSTEM_ADMIN",
      "SCHOOL_ADMIN",
      "TEACHER",
    ],
  },

  {
    title: "Subjects",
    href: "/dashboard/subjects",
    icon: BookOpen,
    roles: [
      "SYSTEM_ADMIN",
      "SCHOOL_ADMIN",
      "TEACHER",
    ],
  },

  {
    title: "Attendance",
    href: "/dashboard/attendance",
    icon: ClipboardList,
    roles: [
      "SYSTEM_ADMIN",
      "SCHOOL_ADMIN",
      "TEACHER",
    ],
  },

  {
    title: "Grades",
    href: "/dashboard/grades",
    icon: GraduationCap,
    roles: [
      "SYSTEM_ADMIN",
      "SCHOOL_ADMIN",
      "TEACHER",
    ],
  },

  {
    title: "Teachers",
    href: "/dashboard/teachers",
    icon: GraduationCap,
    roles: [
      "SYSTEM_ADMIN",
      "SCHOOL_ADMIN",
    ],
  },

  {
    title: "Finance",
    href: "/dashboard/finance",
    icon: DollarSign,
    roles: [
      "SYSTEM_ADMIN",
      "SCHOOL_ADMIN",
    ],
  },

  {
    title: "Procurement",
    href: "/dashboard/procurement",
    icon: ShoppingCart,
    roles: [
      "SYSTEM_ADMIN",
      "SCHOOL_ADMIN",
    ],
  },

  {
    title: "Parents",
    href: "/dashboard/parents",
    icon: Users,
    roles: [
      "SYSTEM_ADMIN",
      "SCHOOL_ADMIN",
    ],
  },

  {
    title: "Results",
    href: "/dashboard/results",
    icon: ClipboardList,
    roles: [
      "SYSTEM_ADMIN",
      "SCHOOL_ADMIN",
      "TEACHER",
    ],
  },

  {
    title: "AI Insights",
    href: "/dashboard/ai",
    icon: BrainCircuit,
    roles: [
      "SYSTEM_ADMIN",
      "SCHOOL_ADMIN",
    ],
  },

  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: [
      "SYSTEM_ADMIN",
    ],
  },

  {
    title: "Audit Logs",
    href: "/dashboard/audit",
    icon: Shield,
    roles: [
      "SYSTEM_ADMIN",
    ],
  },
];

interface SidebarProps {
  role: string;
}

export function Sidebar({
  role,
}: SidebarProps) {
  const pathname = usePathname();

  const filteredMenu =
    menuItems.filter((item) =>
      item.roles.includes(role)
    );

  return (
    <aside className="hidden w-[260px] border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-[#111827] lg:flex lg:flex-col">
      {/* Logo */}
      <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-blue-600">
          EduCore
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Intelligent School OS
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredMenu.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                pathname === item.href
                  ? "bg-blue-600 text-white"
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
