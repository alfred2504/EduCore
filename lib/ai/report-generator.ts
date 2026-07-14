import { generateModelText, isModelUnavailable } from "@/lib/ai/model";

export async function generateReport(data: unknown) {
  try {
    return await generateModelText({
      system: "Generate a concise, professional school report from the supplied verified data. Do not add facts that are not present.",
      prompt: JSON.stringify(data),
    });
  } catch (error) {
    if (!isModelUnavailable(error)) throw error;
    return "The external AI report writer is unavailable. Please use the verified academic records to complete this report.";
  }
}
