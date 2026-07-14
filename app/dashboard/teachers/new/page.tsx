"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewTeacherPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    qualification: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          password: `${form.firstName.toLowerCase()}${form.lastName.toLowerCase()}123`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create teacher account");
      }

      setCredentials({
        email: data.user.email,
        password: data.password,
      });
      setMessage("Teacher account created successfully.");
      setForm({ firstName: "", lastName: "", email: "", phone: "", qualification: "" });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create teacher account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold">Add Teacher</h1>
      <p className="mt-2 text-sm text-slate-500">
        This creates a teacher profile and a login account with temporary credentials.
      </p>

      {message ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {credentials ? (
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <p className="font-semibold">Login credentials</p>
          <p>Email: {credentials.email}</p>
          <p>Password: {credentials.password}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input name="firstName" required value={form.firstName} onChange={handleChange} className="mt-2 w-full rounded-xl border p-3" placeholder="John" />
        </div>

        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input name="lastName" required value={form.lastName} onChange={handleChange} className="mt-2 w-full rounded-xl border p-3" placeholder="Doe" />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input name="email" type="email" required value={form.email} onChange={handleChange} className="mt-2 w-full rounded-xl border p-3" placeholder="john@example.com" />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="mt-2 w-full rounded-xl border p-3" placeholder="07000000000" />
        </div>

        <div>
          <label className="block text-sm font-medium">Qualification</label>
          <input name="qualification" value={form.qualification} onChange={handleChange} className="mt-2 w-full rounded-xl border p-3" placeholder="M.Ed Mathematics" />
        </div>

        <button type="submit" disabled={loading} className="rounded-xl bg-blue-600 px-6 py-3 text-white disabled:opacity-70">
          {loading ? "Creating..." : "Create Teacher"}
        </button>
      </form>
    </div>
  );
}