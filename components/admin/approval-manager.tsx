"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PendingUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export function ApprovalManager({
  pendingUsers,
}: {
  pendingUsers: PendingUser[];
}) {
  const router = useRouter();

  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [busyId, setBusyId] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);

  async function handleReview(
    id: string,
    action: "approve" | "reject"
  ) {
    setBusyId(id);

    const res = await fetch(
      `/api/admin/registrations/${id}/${action}`,
      {
        method: "POST",
      }
    );

    setBusyId(null);

    if (!res.ok) {
      alert("Unable to update registration");
      return;
    }

    router.refresh();
  }

  async function handleInviteAdmin(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setInviting(true);

    const res = await fetch("/api/admin/invite-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inviteForm),
    });

    setInviting(false);

    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      alert(payload?.error || "Unable to invite admin");
      return;
    }

    setInviteForm({
      name: "",
      email: "",
      password: "",
    });

    router.refresh();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Invite Admin
          </h2>

          <p className="text-sm text-slate-500">
            Create approved SCHOOL_ADMIN accounts from Alfred Makura only.
          </p>
        </div>

        <form onSubmit={handleInviteAdmin} className="grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Full name"
            value={inviteForm.name}
            onChange={(e) =>
              setInviteForm((current) => ({ ...current, name: e.target.value }))
            }
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <input
            type="email"
            placeholder="Email address"
            value={inviteForm.email}
            onChange={(e) =>
              setInviteForm((current) => ({ ...current, email: e.target.value }))
            }
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <input
            type="password"
            placeholder="Temporary password"
            value={inviteForm.password}
            onChange={(e) =>
              setInviteForm((current) => ({ ...current, password: e.target.value }))
            }
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />

          <button
            type="submit"
            disabled={inviting}
            className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 md:col-span-3"
          >
            {inviting ? "Inviting..." : "Invite Admin"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Pending Registrations
          </h2>
          <p className="text-sm text-slate-500">
            Approve teacher and student registrations. Rejected requests disappear
            from this list.
          </p>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="px-6 py-10 text-sm text-slate-500">
            No pending registrations.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-6 py-4 text-slate-900 dark:text-white">{user.name}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{user.email}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{user.role}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleReview(user.id, "approve")}
                          disabled={busyId === user.id}
                          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReview(user.id, "reject")}
                          disabled={busyId === user.id}
                          className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-300 disabled:opacity-60 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}