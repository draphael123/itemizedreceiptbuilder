"use server"

import { calculateBreakdown } from "@/lib/pricing-calculator"
import { CostBreakdown } from "@/lib/pricing-calculator"

export async function calculateBreakdownAction(
  planPrice: number,
  planWeeks: number,
  medications: string[],
  state: string,
  chargeAmount: number
): Promise<{ success: boolean; breakdown?: CostBreakdown; error?: string }> {
  try {
    const breakdown = await calculateBreakdown(
      planPrice,
      planWeeks,
      medications,
      state,
      chargeAmount
    )
    return { success: true, breakdown }
  } catch (error: any) {
    console.error("Error calculating breakdown:", error)
    return { success: false, error: error.message || "Failed to calculate breakdown" }
  }
}

