"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { toast } from "sonner";

import { createStudentSchema } from "@/lib/validations/student";

type FormData = z.infer<
  typeof createStudentSchema
>;

export function CreateStudentForm({
  defaultEmail = "",
  defaultFirstName = "",
  defaultLastName = "",
}: {
  defaultEmail?: string;
  defaultFirstName?: string;
  defaultLastName?: string;
} = {}) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(
      createStudentSchema
    ),
    defaultValues: {
      email: defaultEmail,
      firstName: defaultFirstName,
      lastName: defaultLastName,
    },
  });

  async function onSubmit(
    data: FormData
  ) {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/students",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to create student"
        );
      }

      toast.success(
        "Student created successfully"
      );

      reset();

      router.refresh();

    } catch {
      toast.error(
        "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 md:grid-cols-2"
    >
      {/* Admission Number */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Admission Number
        </label>

        <input
          {...register(
            "admissionNumber"
          )}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900"
        />

        {errors.admissionNumber && (
          <p className="mt-1 text-sm text-red-500">
            {
              errors.admissionNumber
                .message
            }
          </p>
        )}
      </div>

      {/* First Name */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          First Name
        </label>

        <input
          {...register("firstName")}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      {/* Last Name */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Last Name
        </label>

        <input
          {...register("lastName")}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Email
        </label>

        <input
          type="email"
          {...register("email")}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Phone
        </label>

        <input
          {...register("phone")}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Gender
        </label>

        <select
          {...register("gender")}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="">
            Select gender
          </option>

          <option value="MALE">
            Male
          </option>

          <option value="FEMALE">
            Female
          </option>
        </select>
      </div>

      {/* DOB */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Date of Birth
        </label>

        <input
          type="date"
          {...register(
            "dateOfBirth"
          )}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      {/* Address */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Address
        </label>

        <input
          {...register("address")}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      {/* Submit */}
      <div className="md:col-span-2">
        <button
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          {loading
            ? "Creating..."
            : "Create Student"}
        </button>
      </div>
    </form>
  );
}
