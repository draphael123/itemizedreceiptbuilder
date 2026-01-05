"use client"

import { useEffect } from "react"

export function PrintOptimizer() {
  useEffect(() => {
    // Add print-specific styles
    const style = document.createElement("style")
    style.textContent = `
      @media print {
        body {
          background: white !important;
          color: black !important;
        }
        .no-print {
          display: none !important;
        }
        .print-break {
          page-break-after: always;
        }
        .print-avoid-break {
          page-break-inside: avoid;
        }
        nav, footer, button, .no-print {
          display: none !important;
        }
        .print-full-width {
          width: 100% !important;
        }
        .print-margin {
          margin: 1cm !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return null
}

