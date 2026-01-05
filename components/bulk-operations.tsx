"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { bulkExportPDFs } from "@/app/actions/bulk"
import { Download, FileArchive, Loader2 } from "lucide-react"

interface BulkOperationsProps {
  receiptIds: string[]
  allReceiptIds?: string[]
}

export function BulkOperations({ receiptIds, allReceiptIds = [] }: BulkOperationsProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(receiptIds)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleSelectAll = () => {
    if (selectedIds.length === (allReceiptIds.length || receiptIds.length)) {
      setSelectedIds([])
    } else {
      setSelectedIds(allReceiptIds.length > 0 ? allReceiptIds : receiptIds)
    }
  }

  const handleExportZIP = async () => {
    if (selectedIds.length === 0) {
      toast({
        title: "No receipts selected",
        description: "Please select at least one receipt to export",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const result = await bulkExportPDFs(selectedIds)
      if (result.success && result.pdfUrls) {
        // Download each PDF
        for (const pdf of result.pdfUrls) {
          const link = document.createElement("a")
          link.href = pdf.url
          link.download = `${pdf.name}-receipt.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }

        toast({
          title: "Export started",
          description: `Downloading ${result.pdfUrls.length} PDF(s)...`,
        })
      } else {
        toast({
          title: "Export failed",
          description: result.error || "Failed to export PDFs",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Export failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <FileArchive className="h-5 w-5" />
          Bulk Operations
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="selectAll"
              checked={selectedIds.length === (allReceiptIds.length || receiptIds.length)}
              onCheckedChange={handleSelectAll}
            />
            <label
              htmlFor="selectAll"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Select All ({allReceiptIds.length || receiptIds.length} receipts)
            </label>
          </div>
          <div className="text-sm text-muted-foreground">
            {selectedIds.length} receipt(s) selected
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExportZIP}
              disabled={isProcessing || selectedIds.length === 0}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Selected PDFs
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

