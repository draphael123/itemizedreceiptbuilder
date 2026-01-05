import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/toaster"
import { Nav } from "@/components/nav"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Receipt Builder",
  description: "Generate itemized receipts for patient plans",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <KeyboardShortcuts />
          <Nav />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

