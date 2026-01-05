import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReceiptDetails } from "@/components/receipt-details"
import { TaskManager } from "@/components/task-manager"
import { PrintOptimizer } from "@/components/print-optimizer"

export default async function ReceiptDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/signin")
  }

  const receipt = await prisma.receipt.findUnique({
    where: {
      id: params.id,
    },
    include: {
      tasks: true,
    },
  })

  if (!receipt) {
    notFound()
  }

  if (receipt.createdById !== session.user.id) {
    redirect("/receipts")
  }

  // Return receipt detail page with print optimizer
  return (
    <div>
      <PrintOptimizer />
      <div className="container mx-auto py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Link href="/receipts">
                <Button variant="outline" size="sm" className="mb-2">
                  ← Back to Receipts
                </Button>
              </Link>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                📄 Receipt Details
              </h1>
            </div>
            <div className="flex gap-2">
              <Link href={`/receipts/${receipt.id}/edit`}>
                <Button variant="outline">✏️ Edit Receipt</Button>
              </Link>
              {receipt.pdfUrl && (
                <a href={receipt.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                    📥 Download PDF
                  </Button>
                </a>
              )}
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="hidden print:block"
              >
                🖨️ Print
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ReceiptDetails receipt={receipt} />
            <TaskManager receiptId={receipt.id} tasks={receipt.tasks} />
          </div>
        </div>
      </div>
    </div>
  )
}

