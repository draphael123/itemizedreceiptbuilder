"use client"

import { UseFormReturn } from "react-hook-form"
import { ReceiptFormData } from "@/lib/validations"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface PlanMedsStepProps {
  form: UseFormReturn<ReceiptFormData>
}

const AVAILABLE_MEDICATIONS = [
  { key: "medication-a", label: "Medication A" },
  { key: "medication-b", label: "Medication B" },
  { key: "medication-c", label: "Medication C" },
]

export function PlanMedsStep({ form }: PlanMedsStepProps) {
  const medications = form.watch("medications") || []

  const toggleMedication = (medKey: string) => {
    const current = medications
    if (current.includes(medKey)) {
      form.setValue(
        "medications",
        current.filter((m) => m !== medKey)
      )
    } else {
      form.setValue("medications", [...current, medKey])
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="planPrice">Plan Price ($) *</Label>
        <Input
          id="planPrice"
          type="number"
          step="0.01"
          {...form.register("planPrice", { valueAsNumber: true })}
          placeholder="199.00"
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
          placeholder="4"
        />
        {form.formState.errors.planWeeks && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.planWeeks.message}
          </p>
        )}
      </div>

      <div>
        <Label>Medications *</Label>
        <div className="space-y-2 mt-2">
          {AVAILABLE_MEDICATIONS.map((med) => (
            <div key={med.key} className="flex items-center space-x-2">
              <Checkbox
                id={med.key}
                checked={medications.includes(med.key)}
                onCheckedChange={() => toggleMedication(med.key)}
              />
              <Label
                htmlFor={med.key}
                className="text-sm font-normal cursor-pointer"
              >
                {med.label}
              </Label>
            </div>
          ))}
        </div>
        {form.formState.errors.medications && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.medications.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="chargeAmount">Total Charge Amount ($) *</Label>
        <Input
          id="chargeAmount"
          type="number"
          step="0.01"
          {...form.register("chargeAmount", { valueAsNumber: true })}
          placeholder="199.00"
        />
        {form.formState.errors.chargeAmount && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.chargeAmount.message}
          </p>
        )}
      </div>
    </div>
  )
}

