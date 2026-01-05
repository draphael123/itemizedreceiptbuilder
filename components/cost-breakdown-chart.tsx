"use client"

import { CostBreakdown } from "@/lib/pricing-calculator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CostBreakdownChartProps {
  breakdown: CostBreakdown
}

export function CostBreakdownChart({ breakdown }: CostBreakdownChartProps) {
  const categories = [
    { key: "pharmacy", label: "Pharmacy", color: "bg-blue-500" },
    { key: "lab", label: "Lab", color: "bg-green-500" },
    { key: "clinical", label: "Clinical", color: "bg-purple-500" },
    { key: "operational", label: "Operational", color: "bg-orange-500" },
    { key: "core", label: "Core Membership", color: "bg-pink-500" },
  ]

  const totals = {
    pharmacy: breakdown.pharmacy.reduce((sum, item) => sum + item.total, 0),
    lab: breakdown.lab.reduce((sum, item) => sum + item.total, 0),
    clinical: breakdown.clinical.reduce((sum, item) => sum + item.total, 0),
    operational: breakdown.operational.reduce((sum, item) => sum + item.total, 0),
    core: breakdown.core.reduce((sum, item) => sum + item.total, 0),
  }

  const grandTotal = Object.values(totals).reduce((sum, val) => sum + val, 0)

  const maxValue = Math.max(...Object.values(totals))

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle>📊 Cost Breakdown Visualization</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {categories.map((category) => {
            const value = totals[category.key as keyof typeof totals]
            const percentage = grandTotal > 0 ? (value / grandTotal) * 100 : 0
            const barWidth = maxValue > 0 ? (value / maxValue) * 100 : 0

            return (
              <div key={category.key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{category.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">${value.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full ${category.color} transition-all duration-500 rounded-full flex items-center justify-end pr-2`}
                    style={{ width: `${barWidth}%` }}
                  >
                    {barWidth > 15 && (
                      <span className="text-xs text-white font-semibold">
                        {percentage.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Grand Total</span>
              <span className="font-bold text-lg text-purple-600">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

