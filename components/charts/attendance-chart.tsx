"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    month: "Jan",
    attendance: 92,
  },
  {
    month: "Feb",
    attendance: 89,
  },
  {
    month: "Mar",
    attendance: 95,
  },
];

export function AttendanceChart() {
  return (
    <div className="rounded-2xl border bg-white p-6 dark:bg-[#111827]">
      <h2 className="mb-6 text-xl font-bold">
        Attendance Analytics
      </h2>

      <div className="h-[300px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={data}>
            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="attendance" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}