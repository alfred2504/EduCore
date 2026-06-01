"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BrainCircuit,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Package,
  Settings,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

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
    title: "Analytics",
    href: "/dashboard/analytics/academics",
    icon: BarChart3,
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER"],
  },
  {
    title: "AI",
    href: "/dashboard/ai",
    icon: BrainCircuit,
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN"],
  },
  {
    title: "Parent",
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
    title: "Approvals",
    href: "/dashboard/approvals",
    icon: Settings,
    roles: ["SYSTEM_ADMIN"],
  },
];

interface MobileDashboardNavProps {
  role: string;
}

export function MobileDashboardNav({ role }: MobileDashboardNavProps) {
  const pathname = usePathname();
  const filteredMenu = menuItems.filter((item) => item.roles.includes(role));
  const isActiveLink = (href: string) =>
    href === "/dashboard"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-[#111827] lg:hidden">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filteredMenu.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-fit items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
                isActiveLink(item.href)
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200"
              )}
            >
              <Icon size={16} />
              {item.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
