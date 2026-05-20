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
    revenue: 12000,
  },
  {
    month: "Feb",
    revenue: 15000,
  },
  {
    month: "Mar",
    revenue: 18000,
  },
];

export function FinanceForecast() {
  return (
    <div className="rounded-2xl border bg-white p-6 dark:bg-[#111827]">
      <h2 className="mb-6 text-xl font-bold">
        Revenue Forecast
      </h2>

      <div className="h-[300px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data}>
            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line dataKey="revenue" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}