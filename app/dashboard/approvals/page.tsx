import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApprovalManager } from "@/components/admin/approval-manager";

interface PendingUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
}

export default async function ApprovalsPage() {
  const session =
    await getServerSession(
      authOptions
    );

  if (!session?.user) {
    redirect("/login");
  }

  if (
    session.user.role !==
    "SYSTEM_ADMIN"
  ) {
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

  let pendingUsers: PendingUser[] = [];

  try {
    pendingUsers = await prisma.user.findMany({
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
  } catch (error) {
    console.error("Approvals page error", error);

    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Unable to load approvals
        </h1>

        <p className="mt-2 text-slate-500">
          There was a problem connecting to the database. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <ApprovalManager
      pendingUsers={pendingUsers.map(
        (
          user: PendingUser
        ) => ({
          id: user.id,

          name:
            user.name ??
            "Unknown User",

          email:
            user.email,

          role:
            user.role,

          createdAt:
            user.createdAt.toISOString(),
        })
      )}
    />
  );
}