"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function createPricingRule(data: {
  planPrice: number
  planWeeks: number
  medicationKey: string
  category: string
  itemName: string
  itemDescription: string | null
  unitPrice: number
  quantity: number
  isActive: boolean
}) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    const rule = await prisma.pricingRule.create({
      data,
    })

    return { success: true, rule }
  } catch (error: any) {
    console.error("Error creating pricing rule:", error)
    return { success: false, error: error.message || "Failed to create pricing rule" }
  }
}

export async function updatePricingRule(
  id: string,
  data: {
    itemName: string
    itemDescription: string | null
    unitPrice: number
    quantity: number
    isActive: boolean
  }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    await prisma.pricingRule.update({
      where: { id },
      data,
    })

    return { success: true }
  } catch (error: any) {
    console.error("Error updating pricing rule:", error)
    return { success: false, error: error.message || "Failed to update pricing rule" }
  }
}

export async function deletePricingRule(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    await prisma.pricingRule.delete({
      where: { id },
    })

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting pricing rule:", error)
    return { success: false, error: error.message || "Failed to delete pricing rule" }
  }
}

