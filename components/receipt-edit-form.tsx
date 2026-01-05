"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Receipt } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { updateReceipt } from "@/app/actions/receipts"
import { z } from "zod"

const receiptEditSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  patientDOB: z.string(),
  chargeDate: z.string(),
  coverageStartDate: z.string(),
  coverageEndDate: z.string(),
  patientState: z.string(),
  planPrice: z.number().positive(),
  planWeeks: z.number().int().positive(),
  chargeAmount: z.number().positive(),
  providerName: z.string().optional(),
  providerNPI: z.string().optional(),
  diagnosisCode: z.string().optional(),
  procedureCode: z.string().optional(),
})

type ReceiptEditFormData = z.infer<typeof receiptEditSchema>

interface ReceiptEditFormProps {
  receipt: Receipt
}

export function ReceiptEditForm({ receipt }: ReceiptEditFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<ReceiptEditFormData>({
    resolver: zodResolver(receiptEditSchema),
    defaultValues: {
      patientName: receipt.patientName,
      patientDOB: receipt.patientDOB.toISOString().split("T")[0],
      chargeDate: receipt.chargeDate.toISOString().split("T")[0],
      coverageStartDate: receipt.coverageStartDate.toISOString().split("T")[0],
      coverageEndDate: receipt.coverageEndDate.toISOString().split("T")[0],
      patientState: receipt.patientState,
      planPrice: receipt.planPrice,
      planWeeks: receipt.planWeeks,
      chargeAmount: receipt.chargeAmount,
      providerName: receipt.providerName,
      providerNPI: receipt.providerNPI,
      diagnosisCode: receipt.diagnosisCode,
      procedureCode: receipt.procedureCode,
    },
  })

  const onSubmit = async (data: ReceiptEditFormData) => {
    setIsSaving(true)
    try {
      const result = await updateReceipt(receipt.id, {
        ...data,
        patientDOB: new Date(data.patientDOB),
        chargeDate: new Date(data.chargeDate),
        coverageStartDate: new Date(data.coverageStartDate),
        coverageEndDate: new Date(data.coverageEndDate),
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Receipt updated successfully",
        })
        router.push(`/receipts/${receipt.id}`)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update receipt",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="border-2 border-purple-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle>Edit Receipt Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientName">Patient Name *</Label>
              <Input id="patientName" {...form.register("patientName")} />
              {form.formState.errors.patientName && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.patientName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="patientDOB">Date of Birth *</Label>
              <Input id="patientDOB" type="date" {...form.register("patientDOB")} />
              {form.formState.errors.patientDOB && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.patientDOB.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="chargeDate">Charge Date *</Label>
              <Input id="chargeDate" type="date" {...form.register("chargeDate")} />
              {form.formState.errors.chargeDate && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.chargeDate.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="patientState">State *</Label>
              <Input id="patientState" {...form.register("patientState")} />
              {form.formState.errors.patientState && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.patientState.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="coverageStartDate">Coverage Start *</Label>
              <Input id="coverageStartDate" type="date" {...form.register("coverageStartDate")} />
              {form.formState.errors.coverageStartDate && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.coverageStartDate.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="coverageEndDate">Coverage End *</Label>
              <Input id="coverageEndDate" type="date" {...form.register("coverageEndDate")} />
              {form.formState.errors.coverageEndDate && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.coverageEndDate.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="planPrice">Plan Price ($) *</Label>
              <Input
                id="planPrice"
                type="number"
                step="0.01"
                {...form.register("planPrice", { valueAsNumber: true })}
              />
              {form.formState.errors.planPrice && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.planPrice.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="planWeeks">Plan Weeks *</Label>
              <Input
                id="planWeeks"
                type="number"
                {...form.register("planWeeks", { valueAsNumber: true })}
              />
              {form.formState.errors.planWeeks && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.planWeeks.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="chargeAmount">Charge Amount ($) *</Label>
              <Input
                id="chargeAmount"
                type="number"
                step="0.01"
                {...form.register("chargeAmount", { valueAsNumber: true })}
              />
              {form.formState.errors.chargeAmount && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.chargeAmount.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="providerName">Provider Name *</Label>
              <Input id="providerName" {...form.register("providerName")} />
              {form.formState.errors.providerName && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.providerName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="providerNPI">Provider NPI *</Label>
              <Input id="providerNPI" {...form.register("providerNPI")} />
              {form.formState.errors.providerNPI && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.providerNPI.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="diagnosisCode">Diagnosis Code *</Label>
              <Input id="diagnosisCode" {...form.register("diagnosisCode")} />
              {form.formState.errors.diagnosisCode && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.diagnosisCode.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="procedureCode">Procedure Code *</Label>
              <Input id="procedureCode" {...form.register("procedureCode")} />
              {form.formState.errors.procedureCode && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.procedureCode.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isSaving ? "Saving..." : "💾 Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

