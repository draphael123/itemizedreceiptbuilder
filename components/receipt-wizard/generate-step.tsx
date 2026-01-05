"use client"

import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { ReceiptFormData } from "@/lib/validations"
import { CostBreakdown } from "@/lib/pricing-calculator"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { createReceipt } from "@/app/actions/receipts"
import { useRouter } from "next/navigation"

interface GenerateStepProps {
  form: UseFormReturn<ReceiptFormData>
  breakdown: CostBreakdown | null
}

export function GenerateStep({ form, breakdown }: GenerateStepProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleGenerate = async () => {
    if (!breakdown) {
      toast({
        title: "Error",
        description: "Breakdown is required",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const formData = form.getValues()
      const result = await createReceipt({
        ...formData,
        breakdown,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Receipt generated and saved successfully",
        })
        router.push(`/receipts/${result.receiptId}`)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create receipt",
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
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground mb-4">
            Review all information and click Generate to create the receipt PDF and save it to the database.
          </p>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            size="lg"
            className="w-full"
          >
            {isGenerating ? "Generating..." : "Generate Receipt & Save"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

