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
import { AdvancedValidation } from "@/components/advanced-validation"
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
  const [calculationError, setCalculationError] = useState<string | null>(null)

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
      setCalculationError(null)
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
          setCalculationError(null)
        } else {
          setCalculationError(result.error || "Failed to calculate breakdown. Please check that pricing rules exist for this plan.")
          setBreakdown(null)
        }
      } catch (error: any) {
        console.error("Error calculating breakdown:", error)
        setCalculationError(error.message || "An unexpected error occurred while calculating the breakdown")
        setBreakdown(null)
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
    <Card className="border-4 border-transparent bg-clip-padding shadow-2xl bg-gradient-to-br from-white to-purple-50/30 rounded-2xl" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #a855f7, #ec4899, #3b82f6)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
      <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-t-xl p-6 shadow-lg">
        <CardTitle className="text-3xl font-bold flex items-center gap-2">
          <span className="animate-bounce">✨</span> Receipt Builder Wizard
        </CardTitle>
        <CardDescription className="text-purple-100 text-lg mt-2">
          Step {currentStep + 1} of {STEPS.length}: <span className="font-semibold">{STEPS[currentStep].label}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold transition-all ${
                    index === currentStep
                      ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white border-purple-500 shadow-lg shadow-purple-500/50 scale-110"
                      : index < currentStep
                      ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white border-green-400 shadow-md"
                      : "bg-gray-100 text-gray-400 border-gray-300"
                  }`}
                >
                  {index < currentStep ? "✓" : index + 1}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-2 mx-2 rounded-full transition-all ${
                      index < currentStep 
                        ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                        : index === currentStep - 1
                        ? "bg-gradient-to-r from-green-500 to-purple-500"
                        : "bg-gray-200"
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
              calculationError={calculationError}
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
            className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white border-0 disabled:opacity-50"
          >
            ← Back
          </Button>
          {currentStep < STEPS.length - 1 && (
            <Button 
              type="button" 
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/50"
            >
              Next →
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

