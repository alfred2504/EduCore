import Link from "next/link";

import { prisma } from "@/lib/prisma";

import { CreateClassForm } from "@/components/classes/create-class-form";

export default async function ClassRegistrationPage() {
  const academicYears = await prisma.academicYear.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-12 dark:bg-[#0B1220]">
      <div className="mx-auto w-full max-w-4xl space-y-6 rounded-3xl bg-white p-6 shadow-xl dark:bg-[#111827] md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Class Registration
            </h1>

            <p className="mt-2 text-slate-500">
              Create a new class record.
            </p>
          </div>

          <Link
            href="/dashboard/classes"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Back to Classes
          </Link>
        </div>

        <CreateClassForm academicYears={academicYears} />
      </div>
    </div>
  );
}