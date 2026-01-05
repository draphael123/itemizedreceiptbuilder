import { prisma } from './prisma'

export interface CostBreakdown {
  pharmacy: LineItem[]
  lab: LineItem[]
  clinical: LineItem[]
  operational: LineItem[]
  core: LineItem[]
  adjustment?: AdjustmentItem
}

export interface LineItem {
  name: string
  description?: string
  quantity: number
  unitPrice: number
  total: number
}

export interface AdjustmentItem {
  name: string
  amount: number
  reason: string
}

export interface StateRules {
  zeroOutLabs: boolean
  zeroOutClinical: boolean
  zeroOutOperational: boolean
}

const STATE_RULES: Record<string, StateRules> = {
  NY: {
    zeroOutLabs: true,
    zeroOutClinical: false,
    zeroOutOperational: false,
  },
  NJ: {
    zeroOutLabs: false,
    zeroOutClinical: false,
    zeroOutOperational: false,
  },
  MD: {
    zeroOutLabs: false,
    zeroOutClinical: false,
    zeroOutOperational: false,
  },
}

export async function calculateBreakdown(
  planPrice: number,
  planWeeks: number,
  medications: string[],
  state: string,
  chargeAmount: number
): Promise<CostBreakdown> {
  // Fetch all pricing rules for the given plan and medications
  const rules = await prisma.pricingRule.findMany({
    where: {
      planPrice,
      planWeeks,
      medicationKey: {
        in: medications,
      },
      isActive: true,
    },
  })

  // Group by category
  const breakdown: CostBreakdown = {
    pharmacy: [],
    lab: [],
    clinical: [],
    operational: [],
    core: [],
  }

  // Process each rule
  for (const rule of rules) {
    const lineItem: LineItem = {
      name: rule.itemName,
      description: rule.itemDescription || undefined,
      quantity: rule.quantity,
      unitPrice: rule.unitPrice,
      total: rule.unitPrice * rule.quantity,
    }

    const category = rule.category.toLowerCase() as keyof Omit<CostBreakdown, 'adjustment'>
    if (breakdown[category]) {
      breakdown[category].push(lineItem)
    }
  }

  // Apply state rules
  const stateRule = STATE_RULES[state] || {
    zeroOutLabs: false,
    zeroOutClinical: false,
    zeroOutOperational: false,
  }

  if (stateRule.zeroOutLabs) {
    breakdown.lab = []
  }
  if (stateRule.zeroOutClinical) {
    breakdown.clinical = []
  }
  if (stateRule.zeroOutOperational) {
    breakdown.operational = []
  }

  // Calculate total from line items
  const totalFromItems = [
    ...breakdown.pharmacy,
    ...breakdown.lab,
    ...breakdown.clinical,
    ...breakdown.operational,
    ...breakdown.core,
  ].reduce((sum, item) => sum + item.total, 0)

  // Check if adjustment is needed
  const difference = chargeAmount - totalFromItems
  if (Math.abs(difference) > 0.01) {
    // Need adjustment
    breakdown.adjustment = {
      name: 'Service Fee Adjustment',
      amount: difference,
      reason: `Adjustment to match charge amount of $${chargeAmount.toFixed(2)}`,
    }
  }

  return breakdown
}

export function calculateTotal(breakdown: CostBreakdown): number {
  const itemsTotal = [
    ...breakdown.pharmacy,
    ...breakdown.lab,
    ...breakdown.clinical,
    ...breakdown.operational,
    ...breakdown.core,
  ].reduce((sum, item) => sum + item.total, 0)

  const adjustmentTotal = breakdown.adjustment?.amount || 0

  return itemsTotal + adjustmentTotal
}

