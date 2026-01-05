"use client"

import { UseFormReturn } from "react-hook-form"
import { ReceiptFormData } from "@/lib/validations"
import { CostBreakdown, calculateTotal } from "@/lib/pricing-calculator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ReviewStepProps {
  form: UseFormReturn<ReceiptFormData>
  breakdown: CostBreakdown | null
  setBreakdown: (breakdown: CostBreakdown) => void
  isCalculating: boolean
}

export function ReviewStep({
  form,
  breakdown,
  setBreakdown,
  isCalculating,
}: ReviewStepProps) {
  const chargeAmount = form.watch("chargeAmount")
  const calculatedTotal = breakdown ? calculateTotal(breakdown) : 0
  const difference = chargeAmount - calculatedTotal
  const needsAdjustment = Math.abs(difference) > 0.01

  const handleAdjustmentChange = (amount: number, reason: string) => {
    if (!breakdown) return

    const newBreakdown = {
      ...breakdown,
      adjustment: {
        name: "Service Fee Adjustment",
        amount,
        reason,
      },
    }

    setBreakdown(newBreakdown)
    form.setValue("adjustmentAmount", amount)
    form.setValue("adjustmentReason", reason)
  }

  if (isCalculating) {
    return <div className="text-center py-10">Calculating breakdown...</div>
  }

  if (!breakdown) {
    return <div className="text-center py-10">No breakdown available</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pharmacy Costs</CardTitle>
          </CardHeader>
          <CardContent>
            {breakdown.pharmacy.length === 0 ? (
              <p className="text-muted-foreground">No items</p>
            ) : (
              <div className="space-y-2">
                {breakdown.pharmacy.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>${item.total.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Subtotal</span>
                  <span>
                    $
                    {breakdown.pharmacy
                      .reduce((sum, item) => sum + item.total, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lab Costs</CardTitle>
          </CardHeader>
          <CardContent>
            {breakdown.lab.length === 0 ? (
              <p className="text-muted-foreground">No items (zeroed out by state rules)</p>
            ) : (
              <div className="space-y-2">
                {breakdown.lab.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>${item.total.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Subtotal</span>
                  <span>
                    $
                    {breakdown.lab
                      .reduce((sum, item) => sum + item.total, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clinical Provider Services</CardTitle>
          </CardHeader>
          <CardContent>
            {breakdown.clinical.length === 0 ? (
              <p className="text-muted-foreground">No items</p>
            ) : (
              <div className="space-y-2">
                {breakdown.clinical.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>${item.total.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Subtotal</span>
                  <span>
                    $
                    {breakdown.clinical
                      .reduce((sum, item) => sum + item.total, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Operational Costs</CardTitle>
          </CardHeader>
          <CardContent>
            {breakdown.operational.length === 0 ? (
              <p className="text-muted-foreground">No items</p>
            ) : (
              <div className="space-y-2">
                {breakdown.operational.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>${item.total.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Subtotal</span>
                  <span>
                    $
                    {breakdown.operational
                      .reduce((sum, item) => sum + item.total, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Core Membership Fee</CardTitle>
        </CardHeader>
        <CardContent>
          {breakdown.core.length === 0 ? (
            <p className="text-muted-foreground">No items</p>
          ) : (
            <div className="space-y-2">
              {breakdown.core.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span>${item.total.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Subtotal</span>
                <span>
                  $
                  {breakdown.core
                    .reduce((sum, item) => sum + item.total, 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {breakdown.adjustment && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Adjustment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm mb-2">
              <span>{breakdown.adjustment.name}</span>
              <span>${breakdown.adjustment.amount.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {breakdown.adjustment.reason}
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Calculated Total:</span>
            <span className="text-lg font-semibold">
              ${calculatedTotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-lg font-semibold">Charge Amount:</span>
            <span className="text-lg font-semibold">
              ${chargeAmount?.toFixed(2) || "0.00"}
            </span>
          </div>
          {needsAdjustment && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive rounded-md">
              <p className="text-sm text-destructive font-semibold mb-2">
                Adjustment Required: ${Math.abs(difference).toFixed(2)} difference
              </p>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="adjustmentAmount">Adjustment Amount ($)</Label>
                  <Input
                    id="adjustmentAmount"
                    type="number"
                    step="0.01"
                    value={form.watch("adjustmentAmount") || difference.toFixed(2)}
                    onChange={(e) => {
                      const amount = parseFloat(e.target.value) || 0
                      const reason = form.watch("adjustmentReason") || ""
                      handleAdjustmentChange(amount, reason)
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="adjustmentReason">Adjustment Reason *</Label>
                  <Textarea
                    id="adjustmentReason"
                    value={form.watch("adjustmentReason") || ""}
                    onChange={(e) => {
                      const amount = form.watch("adjustmentAmount") || difference
                      handleAdjustmentChange(amount, e.target.value)
                    }}
                    placeholder="Explain why this adjustment is needed..."
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

