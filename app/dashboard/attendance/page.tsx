import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AttendanceEntryForm } from "@/components/attendance/attendance-entry-form";

export default async function AttendancePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (!["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER"].includes(session.user.role)) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Access denied</h1>
        <p className="mt-2 text-slate-500">Only teachers and administrators can enter attendance.</p>
      </div>
    );
  }

  const students = await prisma.student.findMany({
    where: {
      classId: {
        not: null,
      },
    },
    include: {
      class: true,
    },
    orderBy: {
      firstName: "asc",
    },
  });

  const attendance = await prisma.attendance.findMany({
    include: {
      student: true,
      class: true,
    },
    orderBy: {
      date: "desc",
    },
    take: 50,
  });

  const totalRecords = attendance.length;
  const presentCount = attendance.filter((item) => item.status === "PRESENT").length;
  const absentCount = attendance.filter((item) => item.status === "ABSENT").length;
  const lateCount = attendance.filter((item) => item.status === "LATE").length;
  const uniqueStudents = new Set(attendance.map((item) => item.studentId)).size;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Attendance</h1>
          <p className="mt-1 text-slate-500">Record student attendance and review recent entries.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-[#111827] dark:text-slate-300">
          Teacher and admin attendance entry is enabled here.
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Total records</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{totalRecords}</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Students present</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{presentCount}</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Students absent</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{absentCount}</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">Students late</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{lateCount}</h2>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <AttendanceEntryForm students={students} />

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
            <p className="text-sm text-slate-500">Unique students recorded</p>
            <h2 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{uniqueStudents}</h2>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
            <table className="w-full">
              <thead className="border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500">Class</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-6 py-4 text-slate-900 dark:text-white">
                      {item.student.firstName} {item.student.lastName}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{item.class.name}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{new Date(item.date).toLocaleDateString()}</td>
                  </tr>
                ))}

                {attendance.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
