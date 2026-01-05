"use client"

import { useEffect, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { ReceiptFormData } from "@/lib/validations"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react"

interface AdvancedValidationProps {
  form: UseFormReturn<ReceiptFormData>
  existingReceipts?: any[]
}

export function AdvancedValidation({ form, existingReceipts = [] }: AdvancedValidationProps) {
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      const errors: string[] = []
      const warnings: string[] = []

      // NPI validation (10 digits)
      if (name === "providerNPI" && value.providerNPI) {
        const npi = value.providerNPI.replace(/\D/g, "")
        if (npi.length !== 10) {
          errors.push("Provider NPI must be exactly 10 digits")
        }
      }

      // Diagnosis code validation (ICD-10 format)
      if (name === "diagnosisCode" && value.diagnosisCode) {
        const dxCode = value.diagnosisCode.trim()
        if (!/^[A-Z]\d{2}(\.\d{1,4})?$/.test(dxCode)) {
          warnings.push("Diagnosis code should be in ICD-10 format (e.g., E11.9)")
        }
      }

      // Procedure code validation (CPT format)
      if (name === "procedureCode" && value.procedureCode) {
        const cptCode = value.procedureCode.trim()
        if (!/^\d{5}$/.test(cptCode)) {
          warnings.push("Procedure code should be a 5-digit CPT code")
        }
      }

      // Date validation
      if (name === "coverageStartDate" && name === "coverageEndDate") {
        const start = value.coverageStartDate ? new Date(value.coverageStartDate) : null
        const end = value.coverageEndDate ? new Date(value.coverageEndDate) : null
        if (start && end && start > end) {
          errors.push("Coverage start date must be before end date")
        }
      }

      // Duplicate detection
      if (name === "patientName" && value.patientName && existingReceipts.length > 0) {
        const duplicates = existingReceipts.filter(
          (r) =>
            r.patientName.toLowerCase() === value.patientName.toLowerCase() &&
            r.chargeDate &&
            new Date(r.chargeDate).toDateString() ===
              (value.chargeDate ? new Date(value.chargeDate).toDateString() : "")
        )
        if (duplicates.length > 0) {
          warnings.push(
            `Found ${duplicates.length} receipt(s) with the same patient name and charge date`
          )
        }
      }

      // Amount validation
      if (name === "chargeAmount" && value.chargeAmount) {
        if (value.chargeAmount < 0) {
          errors.push("Charge amount cannot be negative")
        }
        if (value.chargeAmount > 100000) {
          warnings.push("Charge amount seems unusually high")
        }
      }

      setValidationErrors(errors)
      setWarnings(warnings)
    })

    return () => subscription.unsubscribe()
  }, [form, existingReceipts])

  if (validationErrors.length === 0 && warnings.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      {validationErrors.map((error, idx) => (
        <Alert key={idx} variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Validation Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ))}
      {warnings.map((warning, idx) => (
        <Alert key={idx} className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-200">Warning</AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            {warning}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}

