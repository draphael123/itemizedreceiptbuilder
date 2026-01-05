"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { receiptSchema, type ReceiptFormData } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PatientInfoStep } from "./receipt-wizard/patient-info-step"
import { PlanMedsStep } from "./receipt-wizard/plan-meds-step"
import { ProviderStep } from "./receipt-wizard/provider-step"
import { ReviewStep } from "./receipt-wizard/review-step"
import { GenerateStep } from "./receipt-wizard/generate-step"
import { type CostBreakdown } from "@/lib/pricing-calculator"
import { calculateBreakdownAction } from "@/app/actions/calculate"

const STEPS = [
  { id: "patient", label: "Patient Info" },
  { id: "plan", label: "Plan & Medications" },
  { id: "provider", label: "Provider Details" },
  { id: "review", label: "Review & Adjust" },
  { id: "generate", label: "Generate & Save" },
]

export function ReceiptWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [breakdown, setBreakdown] = useState<CostBreakdown | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const form = useForm<ReceiptFormData>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      medications: [],
      patientState: "NY",
    },
  })

  const handleNext = async () => {
    const stepFields: Record<number, (keyof ReceiptFormData)[]> = {
      0: ["patientName", "patientDOB", "chargeDate", "coverageStartDate", "coverageEndDate", "patientState"],
      1: ["planPrice", "planWeeks", "medications", "chargeAmount"],
      2: ["providerName", "providerNPI", "diagnosisCode", "procedureCode"],
    }

    const fieldsToValidate = stepFields[currentStep] || []
    const isValid = await form.trigger(fieldsToValidate as any)

    if (!isValid) {
      return
    }

    // If moving to review step, calculate breakdown
    if (currentStep === 2) {
      setIsCalculating(true)
      try {
        const values = form.getValues()
        const result = await calculateBreakdownAction(
          values.planPrice,
          values.planWeeks,
          values.medications,
          values.patientState,
          values.chargeAmount
        )
        if (result.success && result.breakdown) {
          setBreakdown(result.breakdown)
        }
      } catch (error) {
        console.error("Error calculating breakdown:", error)
      } finally {
        setIsCalculating(false)
      }
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receipt Builder Wizard</CardTitle>
        <CardDescription>
          Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].label}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    index === currentStep
                      ? "bg-primary text-primary-foreground border-primary"
                      : index < currentStep
                      ? "bg-primary/10 text-primary border-primary"
                      : "bg-background text-muted-foreground border-muted"
                  }`}
                >
                  {index + 1}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      index < currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-[400px]">
          {currentStep === 0 && <PatientInfoStep form={form} />}
          {currentStep === 1 && <PlanMedsStep form={form} />}
          {currentStep === 2 && <ProviderStep form={form} />}
          {currentStep === 3 && (
            <ReviewStep
              form={form}
              breakdown={breakdown}
              setBreakdown={setBreakdown}
              isCalculating={isCalculating}
            />
          )}
          {currentStep === 4 && <GenerateStep form={form} breakdown={breakdown} />}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          {currentStep < STEPS.length - 1 && (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

