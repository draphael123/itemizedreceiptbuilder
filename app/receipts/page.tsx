import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ReceiptsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  const receipts = await prisma.receipt.findMany({
    where: {
      createdById: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  })

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Receipts</h1>
          <Link href="/receipts/new">
            <Button>Create New Receipt</Button>
          </Link>
        </div>

        {receipts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No receipts found. Create your first receipt to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {receipts.map((receipt) => (
              <Card key={receipt.id}>
                <CardHeader>
                  <CardTitle>{receipt.patientName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Charge Date</p>
                      <p>{receipt.chargeDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">State</p>
                      <p>{receipt.patientState}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-semibold">${receipt.chargeAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Plan</p>
                      <p>
                        ${receipt.planPrice} / {receipt.planWeeks} weeks
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link href={`/receipts/${receipt.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    {receipt.pdfUrl && (
                      <a href={receipt.pdfUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Download PDF
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

