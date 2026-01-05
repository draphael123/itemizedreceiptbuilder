"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SignIn() {
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

