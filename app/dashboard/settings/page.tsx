import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import SettingsForm from "@/components/settings/settings-form";

export default async function SettingsPage() {
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

        <p className="mt-2 text-slate-500">Only system administrators can access settings.</p>
      </div>
    );
  }

  return <SettingsForm />;
}
