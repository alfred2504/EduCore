"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      alert("Invalid credentials or account awaiting approval");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-[#0B1220]">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-[#111827]">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Login
        </h1>

        <p className="mt-2 text-slate-500">Welcome back to EduCore AI</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <a href="/register" className="font-medium text-blue-600">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}