"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    month: "Jan",
    performance: 65,
  },

  {
    month: "Feb",
    performance: 72,
  },

  {
    month: "Mar",
    performance: 78,
  },

  {
    month: "Apr",
    performance: 81,
  },

  {
    month: "May",
    performance: 85,
  },
];

export function PerformanceChart() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Academic Performance
        </h2>

        <p className="text-sm text-slate-500">
          AI academic trend analysis
        </p>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data}>
            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="performance"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}