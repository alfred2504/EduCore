import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type InvoiceRow = Prisma.InvoiceGetPayload<{}>;

export default async function FinancePage() {
  const invoices =
    await prisma.invoice.findMany();

  const totalRevenue =
    invoices.reduce(
      (acc: number, item: InvoiceRow) =>
        acc + item.amount,
      0
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Finance
        </h1>

        <p className="mt-2 text-slate-500">
          School financial management
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">
            Total Invoices
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {invoices.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
          <p className="text-sm text-slate-500">
            Revenue
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            ${totalRevenue}
          </h2>
        </div>
      </div>
    </div>
  );
}