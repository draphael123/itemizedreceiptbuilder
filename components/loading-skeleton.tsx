"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ReceiptSkeleton() {
  return (
    <Card className="border-2">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse">
        <div className="h-6 w-48 bg-white/20 rounded" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-5 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ReceiptListSkeleton() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((i) => (
        <ReceiptSkeleton key={i} />
      ))}
    </div>
  )
}

