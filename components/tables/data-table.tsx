"use client";

interface Column<T> {
  key: keyof T;
  label: string;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
}: Props<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white dark:bg-[#111827]">
      <table className="w-full">
        <thead className="border-b bg-slate-50 dark:bg-[#1f2937]">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-6 py-4 text-left"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-b"
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="px-6 py-4"
                >
                  {String(row[column.key])}
                </td>
              ))}
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-slate-500"
              >
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}