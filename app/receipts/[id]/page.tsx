import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReceiptDetails } from "@/components/receipt-details"
import { TaskManager } from "@/components/task-manager"

export default async function ReceiptDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/api/auth/signin")
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

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link href="/receipts">
              <Button variant="outline" size="sm" className="mb-2">
                ← Back to Receipts
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Receipt Details</h1>
          </div>
          {receipt.pdfUrl && (
            <a href={receipt.pdfUrl} target="_blank" rel="noopener noreferrer">
              <Button>Download PDF</Button>
            </a>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ReceiptDetails receipt={receipt} />
          <TaskManager receiptId={receipt.id} tasks={receipt.tasks} />
        </div>
      </div>
    </div>
  )
}

