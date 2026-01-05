"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt } from "@prisma/client"

interface ReceiptsReportProps {
  receipts: Receipt[]
  receiptsByState: Record<string, number>
  receiptsByPlan: Record<string, number>
}

export function ReceiptsReport({ receipts, receiptsByState, receiptsByPlan }: ReceiptsReportProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle>📍 Receipts by State</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {Object.entries(receiptsByState)
              .sort(([, a], [, b]) => b - a)
              .map(([state, count]) => {
                const percentage = receipts.length > 0 ? (count / receipts.length) * 100 : 0
                return (
                  <div key={state} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{state}</span>
                      <span>{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
          <CardTitle>💰 Receipts by Plan Price</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {Object.entries(receiptsByPlan)
              .sort(([, a], [, b]) => b - a)
              .map(([plan, count]) => {
                const percentage = receipts.length > 0 ? (count / receipts.length) * 100 : 0
                return (
                  <div key={plan} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{plan}</span>
                      <span>{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

