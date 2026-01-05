"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ReceiptFormData } from "@/lib/validations"
import { CostBreakdown } from "@/lib/pricing-calculator"
import { generateReceiptPDF } from "@/lib/pdf-generator"
import { put } from "@vercel/blob"

export async function bulkGenerateReceipts(receiptsData: (ReceiptFormData & { breakdown: CostBreakdown })[]) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    const results = []
    const errors = []

    for (const data of receiptsData) {
      try {
        // Generate PDF
        const pdfBuffer = await generateReceiptPDF(data, data.breakdown)

        // Upload to Vercel Blob
        let pdfUrl: string
        if (process.env.BLOB_READ_WRITE_TOKEN) {
          const blob = await put(`receipts/${Date.now()}-${data.patientName}.pdf`, pdfBuffer as Buffer, {
            access: "public",
            contentType: "application/pdf",
          })
          pdfUrl = blob.url
        } else {
          // Fallback: local storage
          const fs = await import("fs/promises")
          const path = await import("path")
          const fileName = `receipt-${Date.now()}.pdf`
          const filePath = path.join(process.cwd(), "public", "receipts", fileName)
          await fs.mkdir(path.dirname(filePath), { recursive: true })
          await fs.writeFile(filePath, pdfBuffer)
          pdfUrl = `/receipts/${fileName}`
        }

        // Save to database
        const receipt = await prisma.receipt.create({
          data: {
            patientName: data.patientName,
            patientDOB: data.patientDOB,
            chargeDate: data.chargeDate,
            coverageStartDate: data.coverageStartDate,
            coverageEndDate: data.coverageEndDate,
            patientState: data.patientState,
            planPrice: data.planPrice,
            planWeeks: data.planWeeks,
            medications: JSON.stringify(data.medications),
            chargeAmount: data.chargeAmount,
            breakdown: JSON.stringify(data.breakdown),
            adjustmentAmount: data.adjustmentAmount || null,
            adjustmentReason: data.adjustmentReason || null,
            providerName: data.providerName,
            providerNPI: data.providerNPI,
            diagnosisCode: data.diagnosisCode,
            procedureCode: data.procedureCode,
            pdfUrl,
            createdById: session.user.id,
          },
        })

        results.push({ receipt, pdfBuffer, patientName: data.patientName })
      } catch (error: any) {
        errors.push({ patientName: data.patientName, error: error.message })
      }
    }

    return { success: true, results, errors }
  } catch (error: any) {
    console.error("Error in bulk generation:", error)
    return { success: false, error: error.message || "Failed to generate receipts" }
  }
}

export async function bulkExportPDFs(receiptIds: string[]) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    const receipts = await prisma.receipt.findMany({
      where: {
        id: { in: receiptIds },
        createdById: session.user.id,
      },
    })

    if (receipts.length === 0) {
      return { success: false, error: "No receipts found" }
    }

    // For now, return URLs - in production, you'd fetch PDFs and create ZIP
    const pdfUrls = receipts
      .filter((r) => r.pdfUrl)
      .map((r) => ({ id: r.id, name: r.patientName, url: r.pdfUrl! }))

    return { success: true, pdfUrls }
  } catch (error: any) {
    console.error("Error exporting PDFs:", error)
    return { success: false, error: error.message || "Failed to export PDFs" }
  }
}

