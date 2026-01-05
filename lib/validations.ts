import { z } from "zod"

export const receiptSchema = z.object({
  // Step 1: Patient Info
  patientName: z.string().min(1, "Patient name is required"),
  patientDOB: z.date(),
  chargeDate: z.date(),
  coverageStartDate: z.date(),
  coverageEndDate: z.date(),
  patientState: z.enum(["NY", "NJ", "MD", "CA", "TX", "FL"]),

  // Step 2: Plan + Meds
  planPrice: z.number().positive("Plan price must be positive"),
  planWeeks: z.number().int().positive("Plan weeks must be a positive integer"),
  medications: z.array(z.string()).min(1, "At least one medication is required"),
  chargeAmount: z.number().positive("Charge amount must be positive"),

  // Step 3: Provider Details
  providerName: z.string().min(1, "Provider name is required"),
  providerNPI: z.string().min(1, "Provider NPI is required"),
  diagnosisCode: z.string().min(1, "Diagnosis code is required"),
  procedureCode: z.string().min(1, "Procedure code is required"),

  // Step 4: Adjustment (optional)
  adjustmentAmount: z.number().optional(),
  adjustmentReason: z.string().optional(),
}).refine((data) => data.coverageEndDate > data.coverageStartDate, {
  message: "Coverage end date must be after start date",
  path: ["coverageEndDate"],
})

export type ReceiptFormData = z.infer<typeof receiptSchema>

