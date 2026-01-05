"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import * as XLSX from "xlsx"

export async function exportReceiptsToCSV(receiptIds: string[]) {
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

    const data = receipts.map((receipt) => ({
      "Patient Name": receipt.patientName,
      "Date of Birth": receipt.patientDOB.toISOString().split("T")[0],
      "Charge Date": receipt.chargeDate.toISOString().split("T")[0],
      "Coverage Start": receipt.coverageStartDate.toISOString().split("T")[0],
      "Coverage End": receipt.coverageEndDate.toISOString().split("T")[0],
      "State": receipt.patientState,
      "Plan Price": receipt.planPrice,
      "Plan Weeks": receipt.planWeeks,
      "Charge Amount": receipt.chargeAmount,
      "Provider Name": receipt.providerName,
      "Provider NPI": receipt.providerNPI,
      "Diagnosis Code": receipt.diagnosisCode,
      "Procedure Code": receipt.procedureCode,
      "Medications": (() => {
        const meds = typeof receipt.medications === 'string' 
          ? JSON.parse(receipt.medications)
          : receipt.medications;
        return Array.isArray(meds) ? meds.join(", ") : String(meds);
      })(),
      "PDF URL": receipt.pdfUrl || "",
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Receipts")
    const csv = XLSX.utils.sheet_to_csv(worksheet)

    return { success: true, data: csv }
  } catch (error: any) {
    console.error("Error exporting receipts:", error)
    return { success: false, error: error.message || "Failed to export receipts" }
  }
}

export async function exportReceiptsToExcel(receiptIds: string[]) {
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

    const data = receipts.map((receipt) => ({
      "Patient Name": receipt.patientName,
      "Date of Birth": receipt.patientDOB.toISOString().split("T")[0],
      "Charge Date": receipt.chargeDate.toISOString().split("T")[0],
      "Coverage Start": receipt.coverageStartDate.toISOString().split("T")[0],
      "Coverage End": receipt.coverageEndDate.toISOString().split("T")[0],
      "State": receipt.patientState,
      "Plan Price": receipt.planPrice,
      "Plan Weeks": receipt.planWeeks,
      "Charge Amount": receipt.chargeAmount,
      "Provider Name": receipt.providerName,
      "Provider NPI": receipt.providerNPI,
      "Diagnosis Code": receipt.diagnosisCode,
      "Procedure Code": receipt.procedureCode,
      "Medications": (() => {
        const meds = typeof receipt.medications === 'string' 
          ? JSON.parse(receipt.medications)
          : receipt.medications;
        return Array.isArray(meds) ? meds.join(", ") : String(meds);
      })(),
      "PDF URL": receipt.pdfUrl || "",
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Receipts")
    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

    return { success: true, data: excelBuffer }
  } catch (error: any) {
    console.error("Error exporting receipts:", error)
    return { success: false, error: error.message || "Failed to export receipts" }
  }
}

