import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B1220]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar name="Alfred Makura" role="School Admin" />

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}