import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { EditTeacherForm } from "../../edit-teacher-form";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTeacherPage({
  params,
}: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const teacher = await prisma.teacher.findUnique({
    where: {
      id,
    },
  });

  if (!teacher) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Edit Teacher
          </h1>
          <p className="mt-1 text-slate-500">
            Update details for {teacher.firstName} {teacher.lastName}
          </p>
        </div>

        <Link
          href={`/dashboard/teachers/${teacher.id}`}
          className="text-blue-600 hover:underline"
        >
          Back to profile
        </Link>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
        <EditTeacherForm
          teacher={{
            id: teacher.id,
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            email: teacher.email,
            phone: teacher.phone,
            qualification: teacher.qualification,
          }}
        />
      </div>
    </div>
  );
}
