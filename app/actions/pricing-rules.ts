"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/permissions"

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
      return { success: false, error: "Unauthorized - Please sign in" }
    }

    // Check admin access
    try {
      await requireAdmin()
    } catch (adminError) {
      return { success: false, error: "Admin access required. Please contact an administrator to make you an admin." }
    }

    // Validate data
    if (!data.planPrice || !data.planWeeks || !data.medicationKey || !data.category || !data.itemName || !data.unitPrice) {
      return { success: false, error: "Missing required fields" }
    }

    if (isNaN(data.planPrice) || data.planPrice <= 0) {
      return { success: false, error: "Plan price must be a positive number" }
    }

    if (isNaN(data.planWeeks) || data.planWeeks <= 0) {
      return { success: false, error: "Plan weeks must be a positive integer" }
    }

    if (isNaN(data.unitPrice) || data.unitPrice <= 0) {
      return { success: false, error: "Unit price must be a positive number" }
    }

    const rule = await prisma.pricingRule.create({
      data: {
        planPrice: data.planPrice,
        planWeeks: data.planWeeks,
        medicationKey: data.medicationKey,
        category: data.category,
        itemName: data.itemName,
        itemDescription: data.itemDescription || null,
        unitPrice: data.unitPrice,
        quantity: data.quantity || 1,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    })

    return { success: true, rule }
  } catch (error: any) {
    console.error("Error creating pricing rule:", error)
    // Provide more detailed error messages
    if (error.code === 'P2002') {
      return { success: false, error: "A pricing rule with these exact parameters already exists" }
    }
    if (error.message?.includes('DATABASE_URL')) {
      return { success: false, error: "Database connection error. Please check DATABASE_URL environment variable." }
    }
    return { success: false, error: error.message || "Failed to create pricing rule. Please check the console for details." }
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
      return { success: false, error: "Unauthorized - Please sign in" }
    }

    // Check admin access
    try {
      await requireAdmin()
    } catch (adminError) {
      return { success: false, error: "Admin access required" }
    }

    await prisma.pricingRule.update({
      where: { id },
      data,
    })

    return { success: true }
  } catch (error: any) {
    console.error("Error updating pricing rule:", error)
    if (error.message?.includes('DATABASE_URL')) {
      return { success: false, error: "Database connection error. Please check DATABASE_URL environment variable." }
    }
    return { success: false, error: error.message || "Failed to update pricing rule" }
  }
}

export async function deletePricingRule(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized - Please sign in" }
    }

    // Check admin access
    try {
      await requireAdmin()
    } catch (adminError) {
      return { success: false, error: "Admin access required" }
    }

    await prisma.pricingRule.delete({
      where: { id },
    })

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting pricing rule:", error)
    if (error.message?.includes('DATABASE_URL')) {
      return { success: false, error: "Database connection error. Please check DATABASE_URL environment variable." }
    }
    return { success: false, error: error.message || "Failed to delete pricing rule" }
  }
}

