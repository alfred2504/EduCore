import { AIChat } from "@/components/ai/ai-chat";
import { generateAIInsights } from "@/lib/ai/insights";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

type InsightsPageData = {
  insights?: string | null;
  error?: string;
};

async function getInsights(): Promise<InsightsPageData> {
  try {
    return await generateAIInsights();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    return { error: message };
  }
}

export default async function AIPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (!["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER"].includes(session.user.role)) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">AI tools are available to teachers and administrators.</div>;
  }
  const data = await getInsights();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          AI Insights
        </h1>

        <p className="mt-1 text-slate-500">
          AI-powered educational intelligence
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-8 dark:bg-[#111827]">
        {data?.error ? (
          <div className="text-red-600">Error: {data.error}</div>
        ) : (
          <pre className="whitespace-pre-wrap text-sm">{data.insights}</pre>
        )}
      </div>

      <AIChat />
    </div>
  );
}
