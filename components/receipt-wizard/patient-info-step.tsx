"use client"

import { UseFormReturn } from "react-hook-form"
import { ReceiptFormData } from "@/lib/validations"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PatientInfoStepProps {
  form: UseFormReturn<ReceiptFormData>
}

export function PatientInfoStep({ form }: PatientInfoStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="patientName">Patient Name *</Label>
        <Input
          id="patientName"
          {...form.register("patientName")}
          placeholder="John Doe"
        />
        {form.formState.errors.patientName && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.patientName.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="patientDOB">Date of Birth *</Label>
        <Input
          id="patientDOB"
          type="date"
          {...form.register("patientDOB", { valueAsDate: true })}
        />
        {form.formState.errors.patientDOB && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.patientDOB.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="chargeDate">Charge Date *</Label>
        <Input
          id="chargeDate"
          type="date"
          {...form.register("chargeDate", { valueAsDate: true })}
        />
        {form.formState.errors.chargeDate && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.chargeDate.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="coverageStartDate">Coverage Start Date *</Label>
          <Input
            id="coverageStartDate"
            type="date"
            {...form.register("coverageStartDate", { valueAsDate: true })}
          />
          {form.formState.errors.coverageStartDate && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.coverageStartDate.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="coverageEndDate">Coverage End Date *</Label>
          <Input
            id="coverageEndDate"
            type="date"
            {...form.register("coverageEndDate", { valueAsDate: true })}
          />
          {form.formState.errors.coverageEndDate && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.coverageEndDate.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="patientState">Patient State *</Label>
        <Select
          value={form.watch("patientState")}
          onValueChange={(value) => form.setValue("patientState", value as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NY">New York</SelectItem>
            <SelectItem value="NJ">New Jersey</SelectItem>
            <SelectItem value="MD">Maryland</SelectItem>
            <SelectItem value="CA">California</SelectItem>
            <SelectItem value="TX">Texas</SelectItem>
            <SelectItem value="FL">Florida</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.patientState && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.patientState.message}
          </p>
        )}
      </div>
    </div>
  )
}

