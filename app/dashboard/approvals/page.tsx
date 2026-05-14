import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApprovalManager } from "@/components/admin/approval-manager";

export default async function ApprovalsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "SYSTEM_ADMIN") {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Access denied
        </h1>
        <p className="mt-2 text-slate-500">
          Only Alfred Makura can manage approvals and admin invites.
        </p>
      </div>
    );
  }

  const pendingUsers = await prisma.user.findMany({
    where: {
      status: "PENDING",
      role: {
        in: ["TEACHER", "STUDENT"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <ApprovalManager
      pendingUsers={pendingUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      }))}
    />
  );
}