"use client"

import Link from "next/link"
import { useSession, signOut, signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { DarkModeToggle } from "@/components/dark-mode-toggle"

export function Nav() {
  const { data: session } = useSession()

  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 py-5">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            🧾 Receipt Builder
          </Link>
              {session ? (
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
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <DarkModeToggle />
                  <Button
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                    variant="default"
                    size="sm"
                    className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
                  >
                    🔐 Sign In
                  </Button>
                </div>
              )}
        </div>
      </div>
    </nav>
  )
}

