import { prisma } from "@/lib/prisma";

interface AuditLogItem {
  id: string;
  action: string;
  createdAt: Date;
}

export default async function AuditPage() {
  const logs =
    await prisma.auditLog.findMany({
      orderBy: {
        createdAt: "desc",
      },

      take: 20,
    });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Audit Logs
        </h1>

        <p className="mt-1 text-slate-500">
          System activity history
        </p>
      </div>

      <div className="rounded-2xl border bg-white dark:bg-[#111827]">
        {logs.map(
          (log: AuditLogItem) => (
            <div
              key={log.id}
              className="border-b p-6"
            >
              <p className="font-medium">
                {log.action}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {new Date(
                  log.createdAt
                ).toLocaleString()}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}