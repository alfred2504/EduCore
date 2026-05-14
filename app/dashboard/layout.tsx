import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { Sidebar } from "./sidebar";
import { Topbar } from "@/components/layout/topbar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const name = session.user.name ?? "User";
  const role = session.user.role;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B1220]">
      <Sidebar role={role} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar name={name} role={role} />

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}