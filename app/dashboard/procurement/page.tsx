import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type ProcurementRequestRow = Prisma.ProcurementRequestGetPayload<{}>;

export default async function ProcurementPage() {
  const requests =
    await prisma.procurementRequest.findMany();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Procurement
        </h1>

        <p className="mt-2 text-slate-500">
          Procurement management
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
        <h2 className="text-2xl font-bold">
          Requests
        </h2>

        <div className="mt-6 space-y-4">
          {requests.map((item: ProcurementRequestRow) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
            >
              <h3 className="font-semibold">
                {item.title}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                ${item.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}