import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReceiptsReport } from "@/components/receipts-report"

export default async function ReportsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  const receipts = await prisma.receipt.findMany({
    where: {
      createdById: session.user.id,
    },
    orderBy: {
      chargeDate: "desc",
    },
  })

  // Calculate summary statistics
  const totalReceipts = receipts.length
  const totalRevenue = receipts.reduce((sum, r) => sum + r.chargeAmount, 0)
  const avgReceiptAmount = totalReceipts > 0 ? totalRevenue / totalReceipts : 0

  // Group by state
  const receiptsByState = receipts.reduce((acc, r) => {
    acc[r.patientState] = (acc[r.patientState] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Group by plan price
  const receiptsByPlan = receipts.reduce((acc, r) => {
    const key = `$${r.planPrice}`
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          📊 Reports & Analytics
        </h1>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
              <CardTitle>Total Receipts</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">{totalReceipts}</div>
              <p className="text-sm text-muted-foreground mt-2">All time receipts</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-sm text-muted-foreground mt-2">Sum of all charges</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle>Average Receipt</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold">${avgReceiptAmount.toFixed(2)}</div>
              <p className="text-sm text-muted-foreground mt-2">Per receipt average</p>
            </CardContent>
          </Card>
        </div>

        <ReceiptsReport
          receipts={receipts}
          receiptsByState={receiptsByState}
          receiptsByPlan={receiptsByPlan}
        />
      </div>
    </div>
  )
}

