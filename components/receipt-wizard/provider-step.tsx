"use client"

import { UseFormReturn } from "react-hook-form"
import { ReceiptFormData } from "@/lib/validations"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface ProviderStepProps {
  form: UseFormReturn<ReceiptFormData>
}

export function ProviderStep({ form }: ProviderStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="providerName">Provider Name *</Label>
        <Input
          id="providerName"
          {...form.register("providerName")}
          placeholder="Dr. Jane Smith"
        />
        {form.formState.errors.providerName && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.providerName.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="providerNPI">Provider NPI *</Label>
        <Input
          id="providerNPI"
          {...form.register("providerNPI")}
          placeholder="1234567890"
        />
        {form.formState.errors.providerNPI && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.providerNPI.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="diagnosisCode">Diagnosis Code (ICD-10) *</Label>
        <Input
          id="diagnosisCode"
          {...form.register("diagnosisCode")}
          placeholder="E11.9"
        />
        {form.formState.errors.diagnosisCode && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.diagnosisCode.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="procedureCode">Procedure Code (CPT) *</Label>
        <Input
          id="procedureCode"
          {...form.register("procedureCode")}
          placeholder="99213"
        />
        {form.formState.errors.procedureCode && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.procedureCode.message}
          </p>
        )}
      </div>
    </div>
  )
}

