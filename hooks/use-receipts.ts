"use client"

import { useState, useEffect } from "react"

interface Receipt {
  id: string
  patientName: string
  chargeDate: Date
  patientState: string
  chargeAmount: number
  planPrice: number
  planWeeks: number
  pdfUrl: string | null
}

export function useReceipts(userId: string | undefined) {
  const [receipts, setReceipts] = useState<Receipt[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchReceipts() {
      try {
        const response = await fetch(`/api/receipts?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setReceipts(
            data.map((r: any) => ({
              ...r,
              chargeDate: new Date(r.chargeDate),
            }))
          )
        }
      } catch (error) {
        console.error("Error fetching receipts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchReceipts()
    }
  }, [userId])

  return { receipts, isLoading }
}

