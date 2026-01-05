"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ReceiptWizard } from "@/components/receipt-wizard"

export default function NewReceiptPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Receipt</h1>
        <ReceiptWizard />
      </div>
    </div>
  )
}

