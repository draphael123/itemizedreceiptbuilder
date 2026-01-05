"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SignIn() {
  const router = useRouter()
  const { data: session } = useSession()

  // Auto-sign in if dev mode is enabled
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH === "true" && !session) {
      // In dev mode, just redirect to home (auth will be handled server-side)
      router.push("/")
    }
  }, [session, router])

  // Show dev mode message
  const isDevMode = process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH === "true"

  if (isDevMode) {
    return (
      <div className="container mx-auto py-20">
        <div className="max-w-md mx-auto">
          <Card className="border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <CardHeader>
              <CardTitle>🔧 Development Mode</CardTitle>
              <CardDescription>
                Authentication is bypassed. You&apos;re automatically signed in as a dev user.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/")}
                className="w-full"
                size="lg"
              >
                Continue to App
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-20">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Sign in with your Google account to access Receipt Builder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full"
              size="lg"
            >
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

