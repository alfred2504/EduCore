import { prisma } from "@/lib/prisma";
import { CreateTermForm } from "@/components/terms/create-term-form";

interface TermItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export default async function TermsPage() {
  const terms = await prisma.term.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Academic Terms</h1>
        <p className="mt-1 text-slate-500">Create and manage academic terms</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <CreateTermForm />

        {/* Terms List */}
        <div className="rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
          <div className="border-b px-6 py-4 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Active Terms ({terms.length})
            </h2>
          </div>

          <div className="overflow-hidden">
            {terms.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500">
                No terms created yet. Create one to get started.
              </div>
            ) : (
              <table className="w-full">
                <tbody>
                  {terms.map((term: TermItem) => (
                    <tr
                      key={term.id}
                      className="border-b transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {term.name}
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                          {new Date(term.startDate).toLocaleDateString()} -{" "}
                          {new Date(term.endDate).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
