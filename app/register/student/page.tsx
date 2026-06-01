import Link from "next/link";

import { CreateStudentForm } from "@/components/students/create-student-form";

type StudentRegistrationPageProps = {
  searchParams?: {
    email?: string;
    name?: string;
  };
};

export default function StudentRegistrationPage({
  searchParams,
}: StudentRegistrationPageProps) {
  const email = searchParams?.email || "";
  const name = searchParams?.name || "";

  // Parse full name into first and last name
  const nameParts = name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 px-4 py-12 dark:bg-[#0B1220]">
      <div className="pointer-events-none absolute -left-16 top-6 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-6 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="mx-auto w-full max-w-4xl space-y-6 rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
              Final Step
            </p>

            <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
              Complete Student Profile
            </h1>

            <p className="mt-2 text-slate-500">
              Add academic details to activate student onboarding.
            </p>
          </div>

          <Link
            href="/dashboard/students"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Back to Students
          </Link>
        </div>

        <CreateStudentForm
          defaultEmail={email}
          defaultFirstName={firstName}
          defaultLastName={lastName}
        />
      </div>
    </div>
  );
}
