"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ReceiptFormData } from "@/lib/validations"
import { CostBreakdown } from "@/lib/pricing-calculator"
import { generateReceiptPDF } from "@/lib/pdf-generator"
import { put } from "@vercel/blob"

export async function createReceipt(data: ReceiptFormData & { breakdown: CostBreakdown }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    // Generate PDF
    const pdfBuffer = await generateReceiptPDF(data, data.breakdown)

    // Upload to Vercel Blob (or use local storage in dev)
    let pdfUrl: string
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`receipts/${Date.now()}-${data.patientName}.pdf`, pdfBuffer.buffer, {
        access: "public",
        contentType: "application/pdf",
      })
      pdfUrl = blob.url
    } else {
      // Fallback: store in public folder (dev only)
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
        medications: data.medications,
        chargeAmount: data.chargeAmount,
        breakdown: data.breakdown as any,
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

    return { success: true, receiptId: receipt.id }
  } catch (error: any) {
    console.error("Error creating receipt:", error)
    return { success: false, error: error.message || "Failed to create receipt" }
  }
}

