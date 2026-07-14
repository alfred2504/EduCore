"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PendingUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

type AdminAccount = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
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
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "SCHOOL_ADMIN",
  });
  const [adminBusyId, setAdminBusyId] = useState<string | null>(null);

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
      const payload = await res.json().catch(() => null);
      alert(payload?.error || "Unable to update registration");
      return;
    }

    router.refresh();
  }

  useEffect(() => {
    async function loadAdmins() {
      try {
        const res = await fetch("/api/admin/accounts");
        if (!res.ok) return;
        const data = await res.json();
        setAdmins(data);
      } finally {
        setLoadingAdmins(false);
      }
    }

    loadAdmins();
  }, []);

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

    setAdminForm((current) => ({ ...current, name: "", email: "", password: "" }));
    router.refresh();
  }

  async function createAdmin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setInviting(true);

    const res = await fetch("/api/admin/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adminForm),
    });

    setInviting(false);

    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      alert(payload?.error || "Unable to create admin account");
      return;
    }

    setAdminForm({ name: "", email: "", password: "", role: "SCHOOL_ADMIN" });
    const next = await res.json();
    setAdmins((current) => [
      {
        id: next.id,
        name: next.name,
        email: next.email,
        role: next.role,
        status: next.status,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    router.refresh();
  }

  async function toggleAdminRole(adminId: string, role: string) {
    setAdminBusyId(adminId);

    const res = await fetch(`/api/admin/accounts/${adminId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    setAdminBusyId(null);

    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      alert(payload?.error || "Unable to update admin role");
      return;
    }

    setAdmins((current) => current.map((item) => (item.id === adminId ? { ...item, role } : item)));
    router.refresh();
  }

  async function deleteAdmin(adminId: string) {
    if (!window.confirm("Remove this administrator account?")) return;

    setAdminBusyId(adminId);
    const res = await fetch(`/api/admin/accounts/${adminId}`, { method: "DELETE" });
    setAdminBusyId(null);

    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      alert(payload?.error || "Unable to delete admin account");
      return;
    }

    setAdmins((current) => current.filter((item) => item.id !== adminId));
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Manage Administrators
          </h2>

          <p className="text-sm text-slate-500">
            Create approved admin accounts, promote or demote them, and remove them when needed.
          </p>
        </div>

        <form onSubmit={createAdmin} className="grid gap-4 md:grid-cols-4">
          <input
            type="text"
            placeholder="Full name"
            value={adminForm.name}
            onChange={(e) => setAdminForm((current) => ({ ...current, name: e.target.value }))}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <input
            type="email"
            placeholder="Email address"
            value={adminForm.email}
            onChange={(e) => setAdminForm((current) => ({ ...current, email: e.target.value }))}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <input
            type="password"
            placeholder="Temporary password"
            value={adminForm.password}
            onChange={(e) => setAdminForm((current) => ({ ...current, password: e.target.value }))}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <select
            value={adminForm.role}
            onChange={(e) => setAdminForm((current) => ({ ...current, role: e.target.value }))}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="SCHOOL_ADMIN">School Admin</option>
            <option value="SYSTEM_ADMIN">System Admin</option>
          </select>

          <button
            type="submit"
            disabled={inviting}
            className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 md:col-span-4"
          >
            {inviting ? "Creating..." : "Add Admin"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Accounts</h2>
          <p className="text-sm text-slate-500">Promote, demote, or remove administrator accounts.</p>
        </div>

        {loadingAdmins ? (
          <div className="px-6 py-10 text-sm text-slate-500">Loading admin accounts...</div>
        ) : admins.length === 0 ? (
          <div className="px-6 py-10 text-sm text-slate-500">No administrator accounts found.</div>
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
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-6 py-4 text-slate-900 dark:text-white">{admin.name}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{admin.email}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{admin.role}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => toggleAdminRole(admin.id, admin.role === "SYSTEM_ADMIN" ? "SCHOOL_ADMIN" : "SYSTEM_ADMIN")}
                          disabled={adminBusyId === admin.id}
                          className="rounded-xl bg-amber-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-60"
                        >
                          {admin.role === "SYSTEM_ADMIN" ? "Demote" : "Promote"}
                        </button>
                        <button
                          onClick={() => deleteAdmin(admin.id)}
                          disabled={adminBusyId === admin.id}
                          className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-60"
                        >
                          Delete
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
