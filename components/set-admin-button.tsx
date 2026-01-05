"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface SetAdminButtonProps {
  userId: string
  userEmail: string
}

export function SetAdminButton({ userId, userEmail }: SetAdminButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSetAdmin = async () => {
    if (!confirm(`Are you sure you want to make ${userEmail} an admin?`)) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/set-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success!",
          description: "You are now an admin. Please refresh the page.",
        })
        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to set admin role",
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
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSetAdmin}
      disabled={isLoading}
      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
    >
      {isLoading ? "Setting Admin..." : "✨ Make Me Admin"}
    </Button>
  )
}

