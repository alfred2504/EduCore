"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

interface Props {
  academicYears: {
    id: string;
    name: string;
  }[];
}

export function CreateClassForm({
  academicYears,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      level: "",
      capacity: 40,
      academicYearId: "",
      academicYearName: "",
    });

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "/api/classes",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            formData
          ),
        }
      );

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(
          payload?.error || "Failed to create class"
        );
      }

      toast.success(
        "Class created successfully"
      );

      setFormData({
        name: "",
        level: "",
        capacity: 40,
        academicYearId: "",
        academicYearName: "",
      });

      router.refresh();

    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create class"
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 md:grid-cols-2"
    >
      {/* Class Name */}
      <input
        placeholder="Class Name"
        value={formData.name}
        onChange={(e) =>
          setFormData({
            ...formData,
            name: e.target.value,
          })
        }
        className="rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
      />

      {/* Level */}
      <input
        placeholder="Level"
        value={formData.level}
        onChange={(e) =>
          setFormData({
            ...formData,
            level: e.target.value,
          })
        }
        className="rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
      />

      {/* Capacity */}
      <input
        type="number"
        placeholder="Capacity"
        value={formData.capacity}
        onChange={(e) =>
          setFormData({
            ...formData,
            capacity: Number(
              e.target.value
            ),
          })
        }
        className="rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
      />

      {/* Academic Year */}
      <select
        value={formData.academicYearId}
        onChange={(e) =>
          setFormData({
            ...formData,
            academicYearId:
              e.target.value,
          })
        }
        className="rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
      >
        <option value="">
          Select Academic Year
        </option>

        {academicYears.map((year) => (
          <option
            key={year.id}
            value={year.id}
          >
            {year.name}
          </option>
        ))}
      </select>

      {academicYears.length === 0 ? (
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">Academic Year</label>
          <input
            required
            placeholder="e.g. 2026"
            value={formData.academicYearName}
            onChange={(e) => setFormData({ ...formData, academicYearName: e.target.value })}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
          />
          <p className="mt-2 text-sm text-slate-500">No academic years exist yet. This will create the first one.</p>
        </div>
      ) : null}

      <div className="md:col-span-2">
        <button
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white"
        >
          {loading
            ? "Creating..."
            : "Create Class"}
        </button>
      </div>
    </form>
  );
}
