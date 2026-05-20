import { AIChat } from "@/components/ai/ai-chat";
import { headers } from "next/headers";

async function getInsights() {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "http";
    const baseUrl = host ? `${proto}://${host}` : process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/ai/insights`, { cache: "no-store" });

    const json = await res.json().catch(() => ({ error: "invalid JSON response" }));

    if (!res.ok) {
      return { error: json?.error ?? `status ${res.status}` };
    }

    return json;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    return { error: message };
  }
}

export default async function AIPage() {
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