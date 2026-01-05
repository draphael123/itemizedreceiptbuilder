"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { DarkModeToggle } from "@/components/dark-mode-toggle"

export function Nav() {
  const { data: session } = useSession()

  return (
    <nav className="border-b-2 border-purple-200 bg-gradient-to-r from-purple-100 via-pink-100 via-blue-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-5">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 via-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-110 transition-transform bg-[length:200%_auto] animate-pulse-slow">
            🧾 Receipt Builder
          </Link>
              {session && (
                <div className="flex items-center gap-4">
                  <Link href="/receipts">
                    <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300">
                      📄 Receipts
                    </Button>
                  </Link>
                  <Link href="/admin/setup">
                    <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300">
                      ⚙️ Admin
                    </Button>
                  </Link>
                  <DarkModeToggle />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full">
                    👤 {session.user?.name || session.user?.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0"
                  >
                    Sign Out
                  </Button>
                </div>
              )}
        </div>
      </div>
    </nav>
  )
}

