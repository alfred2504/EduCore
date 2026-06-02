"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  vendors: { id: string; name: string }[];
}

export function CreateProcurementForm({ vendors }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!title || !amount) {
      toast.error("Title and amount are required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/procurement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, amount: Number(amount), vendorId: vendorId || undefined }),
      });

      if (!res.ok) throw new Error("Failed to create procurement request");

      toast.success("Procurement request created");
      router.refresh();
      setTitle("");
      setDescription("");
      setAmount("");
      setVendorId("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create procurement request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-[#111827]">
      <h3 className="text-lg font-semibold">Create Procurement Request</h3>

      <div className="mt-4 grid gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Item title" className="rounded-xl border px-3 py-2" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" className="rounded-xl border px-3 py-2" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" className="rounded-xl border px-3 py-2" />

        <select value={vendorId} onChange={(e) => setVendorId(e.target.value)} className="rounded-xl border px-3 py-2">
          <option value="">Select vendor (optional)</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <button onClick={handleCreate} disabled={loading} className="rounded-xl bg-blue-600 px-4 py-2 text-white">
          {loading ? "Saving..." : "Create Request"}
        </button>
      </div>
    </div>
  );
}
