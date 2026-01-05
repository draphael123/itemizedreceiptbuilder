"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export function KeyboardShortcuts() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K: Quick search/navigation
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        } else {
          toast({
            title: "Quick Navigation",
            description: "Press Ctrl+K to search receipts",
          })
        }
      }

      // Ctrl+N or Cmd+N: New receipt
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault()
        router.push("/receipts/new")
      }

      // Escape: Close modals/dialogs
      if (e.key === "Escape") {
        const dialogs = document.querySelectorAll('[role="dialog"]')
        dialogs.forEach((dialog) => {
          const closeButton = dialog.querySelector('button[aria-label*="close"], button[aria-label*="Close"]')
          if (closeButton) {
            ;(closeButton as HTMLButtonElement).click()
          }
        })
      }

      // Ctrl+S or Cmd+S: Save (when in a form)
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        const form = document.querySelector("form")
        if (form && !form.querySelector(":disabled")) {
          e.preventDefault()
          const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement
          if (submitButton) {
            submitButton.click()
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router, toast])

  return null
}

