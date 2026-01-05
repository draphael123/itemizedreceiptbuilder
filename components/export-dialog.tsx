"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { exportReceiptsToCSV, exportReceiptsToExcel } from "@/app/actions/export"
import { useToast } from "@/components/ui/use-toast"
import { Download, FileSpreadsheet, FileText } from "lucide-react"

interface ExportDialogProps {
  receiptIds: string[]
  allReceiptIds?: string[]
}

export function ExportDialog({ receiptIds, allReceiptIds = [] }: ExportDialogProps) {
  const [open, setOpen] = useState(false)
  const [exportAll, setExportAll] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async (format: "csv" | "excel") => {
    setIsExporting(true)
    try {
      const idsToExport = exportAll ? allReceiptIds : receiptIds
      
      if (idsToExport.length === 0) {
        toast({
          title: "No receipts selected",
          description: "Please select at least one receipt to export",
          variant: "destructive",
        })
        return
      }

      let result
      let filename
      let mimeType
      let blob

      if (format === "csv") {
        result = await exportReceiptsToCSV(idsToExport)
        if (result.success && result.data) {
          blob = new Blob([result.data], { type: "text/csv" })
          filename = `receipts-${Date.now()}.csv`
          mimeType = "text/csv"
        }
      } else {
        result = await exportReceiptsToExcel(idsToExport)
        if (result.success && result.data) {
          blob = new Blob([result.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
          filename = `receipts-${Date.now()}.xlsx`
          mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
      }

      if (!blob || !filename) {
        toast({
          title: "Error",
          description: result.error || "Failed to export receipts",
          variant: "destructive",
        })
        return
      }

      if (result.success && blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast({
          title: "Export successful",
          description: `Exported ${idsToExport.length} receipt(s) as ${format.toUpperCase()}`,
        })
        setOpen(false)
      } else {
        toast({
          title: "Export failed",
          description: result.error || "Failed to export receipts",
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
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Receipts</DialogTitle>
          <DialogDescription>
            Choose a format to export {receiptIds.length} selected receipt(s)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {allReceiptIds.length > 0 && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="exportAll"
                checked={exportAll}
                onCheckedChange={(checked) => setExportAll(checked === true)}
              />
              <label
                htmlFor="exportAll"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Export all {allReceiptIds.length} receipts
              </label>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => handleExport("csv")}
              disabled={isExporting}
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <FileText className="h-8 w-8" />
              <span>Export as CSV</span>
            </Button>
            <Button
              onClick={() => handleExport("excel")}
              disabled={isExporting}
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <FileSpreadsheet className="h-8 w-8" />
              <span>Export as Excel</span>
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

