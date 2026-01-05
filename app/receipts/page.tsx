"use client"

import { useState, useMemo } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReceiptsSearchFilter } from "@/components/receipts-search-filter"
import { useReceipts } from "@/hooks/use-receipts"
import { ReceiptListSkeleton } from "@/components/loading-skeleton"
import { EmptyState } from "@/components/empty-state"
import { BulkOperations } from "@/components/bulk-operations"

export default function ReceiptsPage() {
  const { data: session, status } = useSession()
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<any>({})

  const { receipts, isLoading } = useReceipts(session?.user?.id)

  const filteredReceipts = useMemo(() => {
    if (!receipts) return []

    let filtered = [...receipts]

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (receipt) =>
          receipt.patientName.toLowerCase().includes(searchLower) ||
          receipt.chargeAmount.toString().includes(searchLower) ||
          receipt.chargeDate.toLocaleDateString().includes(searchLower)
      )
    }

    // State filter
    if (filters.state) {
      filtered = filtered.filter((receipt) => receipt.patientState === filters.state)
    }

    // Amount filters
    if (filters.minAmount !== undefined) {
      filtered = filtered.filter((receipt) => receipt.chargeAmount >= filters.minAmount)
    }
    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter((receipt) => receipt.chargeAmount <= filters.maxAmount)
    }

    // Date filters
    if (filters.startDate) {
      const startDate = new Date(filters.startDate)
      filtered = filtered.filter((receipt) => receipt.chargeDate >= startDate)
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate)
      endDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter((receipt) => receipt.chargeDate <= endDate)
    }

    // Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "oldest":
          filtered.sort((a, b) => a.chargeDate.getTime() - b.chargeDate.getTime())
          break
        case "amountHigh":
          filtered.sort((a, b) => b.chargeAmount - a.chargeAmount)
          break
        case "amountLow":
          filtered.sort((a, b) => a.chargeAmount - b.chargeAmount)
          break
        case "name":
          filtered.sort((a, b) => a.patientName.localeCompare(b.patientName))
          break
        default: // newest
          filtered.sort((a, b) => b.chargeDate.getTime() - a.chargeDate.getTime())
      }
    }

    return filtered
  }, [receipts, search, filters])

  if (status === "loading") {
    return <div className="container mx-auto py-10">Loading...</div>
  }

  if (!session?.user?.id) {
    redirect("/signin")
    return null // This will never execute, but satisfies TypeScript
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            📄 Receipts
          </h1>
          <Link href="/receipts/new">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
              ✨ Create New Receipt
            </Button>
          </Link>
        </div>

        <ReceiptsSearchFilter onSearchChange={setSearch} onFilterChange={setFilters} />

        {isLoading ? (
          <ReceiptListSkeleton />
        ) : filteredReceipts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {search || Object.keys(filters).length > 0
                    ? "No receipts match your search"
                    : "No receipts found"}
                </p>
                <p className="text-muted-foreground mb-4">
                  {search || Object.keys(filters).length > 0
                    ? "Try adjusting your search or filters"
                    : "Create your first receipt to get started"}
                </p>
                {!search && Object.keys(filters).length === 0 && (
                  <Link href="/receipts/new">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      Create Your First Receipt
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Showing {filteredReceipts.length} of {receipts?.length || 0} receipts
              </div>
              <BulkOperations receiptIds={filteredReceipts.map(r => r.id)} allReceiptIds={receipts?.map(r => r.id) || []} />
            </div>
            <div className="grid gap-4">
              {filteredReceipts.map((receipt, index) => (
                <Card
                  key={receipt.id}
                  className="border-2 hover:border-purple-300 transition-all hover:shadow-lg bg-gradient-to-br from-white to-purple-50/30"
                  style={{
                    borderLeftColor: `hsl(${(index * 60) % 360}, 70%, 60%)`,
                    borderLeftWidth: "4px",
                  }}
                >
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      👤 {receipt.patientName}
                    </CardTitle>
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
                      <Link href={`/receipts/${receipt.id}/edit`}>
                        <Button variant="outline" size="sm">
                          ✏️ Edit
                        </Button>
                      </Link>
                      {receipt.pdfUrl && (
                        <a href={receipt.pdfUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            📥 Download PDF
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
