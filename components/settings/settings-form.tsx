"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Settings = {
  siteTitle: string;
  schoolName?: string | null;
  contactEmail?: string | null;
};

export default function SettingsForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({ siteTitle: "EduCore" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        setSettings({
          siteTitle: data.siteTitle ?? "EduCore",
          schoolName: data.schoolName ?? "",
          contactEmail: data.contactEmail ?? "",
        });
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Failed to save settings");
      }

      toast.success("Settings saved.");
      router.push("/dashboard");
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>

      {loading ? (
        <p className="mt-4 text-sm text-slate-500">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <div className="text-sm text-red-600">{error}</div>}

          <div>
            <label htmlFor="siteTitle" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Site Title</label>
            <input
              id="siteTitle"
              title="Site Title"
              placeholder="EduCore"
              className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-[#0B1220]"
              value={settings.siteTitle}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="schoolName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">School Name</label>
            <input
              id="schoolName"
              title="School Name"
              placeholder="Example School"
              className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-[#0B1220]"
              value={settings.schoolName ?? ""}
              onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Contact Email</label>
            <input
              id="contactEmail"
              title="Contact Email"
              type="email"
              placeholder="admin@example.com"
              className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-[#0B1220]"
              value={settings.contactEmail ?? ""}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save settings"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
