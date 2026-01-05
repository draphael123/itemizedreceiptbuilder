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
import { useSession } from "next-auth/react"

interface GenerateStepProps {
  form: UseFormReturn<ReceiptFormData>
  breakdown: CostBreakdown | null
}

export function GenerateStep({ form, breakdown }: GenerateStepProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { data: session, status } = useSession()

  const handleGenerate = async () => {
    if (!breakdown) {
      toast({
        title: "Error",
        description: "Breakdown is required",
        variant: "destructive",
      })
      return
    }

    if (status === "loading") {
      toast({
        title: "Please wait",
        description: "Checking authentication...",
      })
      return
    }

    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create receipts. Redirecting to sign in...",
        variant: "destructive",
      })
      setTimeout(() => {
        router.push("/api/auth/signin")
      }, 2000)
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
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Ready to Generate!
            </p>
            <p className="text-muted-foreground">
              Review all information and click Generate to create the receipt PDF and save it to the database.
            </p>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            size="lg"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/50 text-lg py-6"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span> Generating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                ✨ Generate Receipt & Save
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

