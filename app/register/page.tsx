"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      setErrorMessage(
        payload?.error ?? "Something went wrong while creating the account"
      );
      return;
    }

    const payload = await res.json().catch(() => null);
    const accountStatus = payload?.status ?? "PENDING";

    if (formData.role === "TEACHER") {
      setSuccessMessage(
        `Teacher registered successfully. Account status: ${accountStatus}.`
      );

      setTimeout(() => {
        router.push("/login");
      }, 1600);

      return;
    }

    setSuccessMessage(
      `Registration successful. Account status: ${accountStatus}.`
    );

    // Redirect students to fill in their info; teachers go straight to login
    if (formData.role === "STUDENT") {
      router.push(`/register/student?email=${encodeURIComponent(formData.email)}&name=${encodeURIComponent(formData.name)}`);
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 px-4 py-10 dark:bg-[#0B1220]">
      <div className="pointer-events-none absolute left-[-4rem] top-4 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[-5rem] h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />

      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden bg-gradient-to-br from-emerald-600 to-cyan-700 p-10 text-white lg:block">
          <p className="inline-flex rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80">
            EduCore Onboarding
          </p>

          <h1 className="mt-6 text-4xl font-bold leading-tight">
            Create your
            <br />
            academic account
          </h1>

          <p className="mt-4 max-w-md text-sm text-white/90">
            Register as a student or teacher. New accounts are reviewed by administrators before full system access.
          </p>

          <div className="mt-10 space-y-3 text-sm">
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">Approval workflow for secure onboarding</div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">Student profile continuation after signup</div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">Role-based access and permissions</div>
          </div>
        </section>

        <section className="p-6 sm:p-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Create Account
          </h2>

          <p className="mt-2 text-slate-500">
            Start your EduCore journey.
          </p>

          {errorMessage ? (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
              {errorMessage}
            </p>
          ) : null}

          {successMessage ? (
            <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
              {successMessage}
            </p>
          ) : null}

          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Jane Doe"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@school.edu"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a secure password"
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Register As
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
              Login
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}