import { prisma } from "@/lib/prisma";
import { CreateProcurementForm } from "@/components/procurement/create-procurement-form";

interface VendorItem {
  name: string;
}

interface ProcurementRequestWithVendor {
  id: string;
  title: string;
  description: string | null;
  status: string;
  amount: number;
  vendor: VendorItem | null;
}

export default async function ProcurementPage() {
  const procurementRequests =
    await prisma.procurementRequest.findMany({
      include: {
        vendor: true,
      },
    });

  const vendors = await prisma.vendor.findMany({ select: { id: true, name: true } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Procurement</h1>
        <p className="mt-1 text-slate-500">Procurement management</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CreateProcurementForm vendors={vendors} />

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-[#111827]">
          <table className="w-full">
            <thead className="border-b bg-slate-50 dark:bg-[#1f2937]">
              <tr>
                <th className="px-6 py-4 text-left">Item</th>
                <th className="px-6 py-4 text-left">Supplier</th>
                <th className="px-6 py-4 text-left">Quantity</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Cost</th>
              </tr>
            </thead>

            <tbody>
              {procurementRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No procurement requests found
                  </td>
                </tr>
              ) : (
                procurementRequests.map((request: ProcurementRequestWithVendor) => (
                  <tr key={request.id} className="border-b">
                    <td className="px-6 py-4">{request.title}</td>
                    <td className="px-6 py-4">{request.vendor?.name ?? "Unassigned"}</td>
                    <td className="px-6 py-4">{request.description ?? "-"}</td>
                    <td className="px-6 py-4">{request.status}</td>
                    <td className="px-6 py-4">${request.amount.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}