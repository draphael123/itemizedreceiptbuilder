import { Receipt } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CostBreakdown } from "@/lib/pricing-calculator"

interface ReceiptDetailsProps {
  receipt: Receipt
}

export function ReceiptDetails({ receipt }: ReceiptDetailsProps) {
  const breakdown = typeof receipt.breakdown === 'string' 
    ? JSON.parse(receipt.breakdown) as CostBreakdown
    : receipt.breakdown as unknown as CostBreakdown

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receipt Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Patient Information</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Name:</span> {receipt.patientName}
            </p>
            <p>
              <span className="text-muted-foreground">DOB:</span>{" "}
              {receipt.patientDOB.toLocaleDateString()}
            </p>
            <p>
              <span className="text-muted-foreground">State:</span> {receipt.patientState}
            </p>
            <p>
              <span className="text-muted-foreground">Coverage:</span>{" "}
              {receipt.coverageStartDate.toLocaleDateString()} -{" "}
              {receipt.coverageEndDate.toLocaleDateString()}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Provider Information</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Name:</span> {receipt.providerName}
            </p>
            <p>
              <span className="text-muted-foreground">NPI:</span> {receipt.providerNPI}
            </p>
            <p>
              <span className="text-muted-foreground">Diagnosis Code:</span>{" "}
              {receipt.diagnosisCode}
            </p>
            <p>
              <span className="text-muted-foreground">Procedure Code:</span>{" "}
              {receipt.procedureCode}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Plan Information</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Price:</span> ${receipt.planPrice}
            </p>
            <p>
              <span className="text-muted-foreground">Weeks:</span> {receipt.planWeeks}
            </p>
            <p>
              <span className="text-muted-foreground">Medications:</span>{" "}
              {typeof receipt.medications === 'string' 
                ? JSON.parse(receipt.medications).join(", ")
                : (Array.isArray(receipt.medications) ? receipt.medications.join(", ") : String(receipt.medications))}
            </p>
          </div>
        </div>

        {breakdown && (
          <div>
            <h3 className="font-semibold mb-2">Cost Breakdown</h3>
            <div className="space-y-2 text-sm">
              {breakdown.pharmacy.length > 0 && (
                <div>
                  <p className="font-medium">Pharmacy: ${breakdown.pharmacy.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</p>
                </div>
              )}
              {breakdown.lab.length > 0 && (
                <div>
                  <p className="font-medium">Lab: ${breakdown.lab.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</p>
                </div>
              )}
              {breakdown.clinical.length > 0 && (
                <div>
                  <p className="font-medium">Clinical: ${breakdown.clinical.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</p>
                </div>
              )}
              {breakdown.operational.length > 0 && (
                <div>
                  <p className="font-medium">Operational: ${breakdown.operational.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</p>
                </div>
              )}
              {breakdown.core.length > 0 && (
                <div>
                  <p className="font-medium">Core: ${breakdown.core.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</p>
                </div>
              )}
              {breakdown.adjustment && (
                <div>
                  <p className="font-medium">
                    Adjustment: ${breakdown.adjustment.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {breakdown.adjustment.reason}
                  </p>
                </div>
              )}
              <div className="pt-2 border-t">
                <p className="font-bold">
                  Total: ${receipt.chargeAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

