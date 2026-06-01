"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setErrorMessage("");
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    const res = await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setErrorMessage("Invalid credentials or account awaiting approval.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 px-4 py-10 dark:bg-[#0B1220]">
      <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-8 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden bg-gradient-to-br from-cyan-600 to-blue-700 p-10 text-white lg:block">
          <p className="inline-flex rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80">
            EduCore Secure Access
          </p>

          <h1 className="mt-6 text-4xl font-bold leading-tight">
            Welcome back.
            <br />
            Lead with clarity.
          </h1>

          <p className="mt-4 max-w-md text-sm text-white/90">
            Sign in to manage exams, attendance, report cards, and parent updates from one unified school command center.
          </p>

          <div className="mt-10 grid gap-3 text-sm">
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">Real-time academic analytics</div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">Approval-based account security</div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">Enterprise-grade exam workflows</div>
          </div>
        </section>

        <section className="p-6 sm:p-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Login
          </h2>

          <p className="mt-2 text-slate-500">
            Access your EduCore workspace.
          </p>

          {errorMessage ? (
            <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
              {errorMessage}
            </p>
          ) : null}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@school.edu"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
              Register
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}