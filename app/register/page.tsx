"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        role: "SCHOOL_ADMIN",
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Something went wrong");
      return;
    }

    router.push("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-[#0B1220]">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-[#111827]">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Create Account
        </h1>

        <p className="mt-2 text-slate-500">Start managing your school</p>

        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-blue-600">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}