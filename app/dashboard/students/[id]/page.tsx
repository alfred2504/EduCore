import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StudentDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const student =
    await prisma.student.findUnique({
      where: {
        id,
      },
    });

  if (!student) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Student Profile
          </h1>

          <p className="mt-1 text-slate-500">
            Detailed student information
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-[#111827]">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Avatar */}
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white">
            {student.firstName.charAt(0)}
          </div>

          {/* Info */}
          <div className="grid flex-1 gap-6 md:grid-cols-2">
            {/* Full Name */}
            <div>
              <p className="text-sm text-slate-500">
                Full Name
              </p>

              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                {student.firstName}{" "}
                {student.lastName}
              </h2>
            </div>

            {/* Admission Number */}
            <div>
              <p className="text-sm text-slate-500">
                Admission Number
              </p>

              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                {
                  student.admissionNumber
                }
              </h2>
            </div>

            {/* Gender */}
            <div>
              <p className="text-sm text-slate-500">
                Gender
              </p>

              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                {student.gender}
              </h2>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm text-slate-500">
                Email
              </p>

              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                {student.email || "-"}
              </h2>
            </div>

            {/* Phone */}
            <div>
              <p className="text-sm text-slate-500">
                Phone
              </p>

              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                {student.phone || "-"}
              </h2>
            </div>

            {/* DOB */}
            <div>
              <p className="text-sm text-slate-500">
                Date of Birth
              </p>

              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                {new Date(
                  student.dateOfBirth
                ).toLocaleDateString()}
              </h2>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <p className="text-sm text-slate-500">
                Address
              </p>

              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                {student.address || "-"}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          EduCore AI Insights
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {/* Insight */}
          <div className="rounded-xl bg-white p-5 dark:bg-[#111827]">
            <p className="text-sm text-slate-500">
              Performance Prediction
            </p>

            <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
              Stable Academic Trend
            </h3>
          </div>

          {/* Insight */}
          <div className="rounded-xl bg-white p-5 dark:bg-[#111827]">
            <p className="text-sm text-slate-500">
              Attendance Analysis
            </p>

            <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
              Attendance above average
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}