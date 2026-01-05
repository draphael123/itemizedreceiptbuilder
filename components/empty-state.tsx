"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { FileText, Plus, Search } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  icon?: React.ReactNode
}

export function EmptyState({
  title,
  description,
  actionLabel = "Get Started",
  actionHref = "/receipts/new",
  icon,
}: EmptyStateProps) {
  return (
    <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
      <CardContent className="pt-12 pb-12">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="text-6xl mb-4">
            {icon || <FileText className="h-16 w-16 text-muted-foreground" />}
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-muted-foreground max-w-md">{description}</p>
          {actionHref && (
            <Link href={actionHref}>
              <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                {actionLabel}
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

