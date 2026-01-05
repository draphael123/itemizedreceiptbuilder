import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams.error

  let errorMessage = "An authentication error occurred."
  let errorDetails: string | React.ReactNode = "Please try again or contact support if the problem persists."

  if (error === "Configuration") {
    errorMessage = "Server Configuration Error"
    errorDetails = (
      <div className="space-y-4">
        <p className="text-sm">
          The authentication server is not properly configured. This usually means missing environment variables.
        </p>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Required Environment Variables:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
            <li><code className="bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded">AUTH_SECRET</code> or <code className="bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded">NEXTAUTH_SECRET</code></li>
            <li><code className="bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded">GOOGLE_CLIENT_ID</code></li>
            <li><code className="bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded">GOOGLE_CLIENT_SECRET</code></li>
          </ul>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            How to Fix:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
            <li>Create a <code className="bg-blue-100 dark:bg-blue-900/40 px-1 rounded">.env</code> file in the project root</li>
            <li>Add the required environment variables (see README.md for details)</li>
            <li>Restart the development server</li>
          </ol>
        </div>
      </div>
    )
  } else if (error === "AccessDenied") {
    errorMessage = "Access Denied"
    errorDetails = "You don't have permission to access this application."
  } else if (error === "Verification") {
    errorMessage = "Verification Error"
    errorDetails = "The verification token has expired or is invalid."
  }

  return (
    <div className="container mx-auto py-20">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-red-200 dark:border-red-800">
          <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl">❌ {errorMessage}</CardTitle>
            <CardDescription className="text-white/90">
              Authentication Error
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {typeof errorDetails === "string" ? (
                <p className="text-gray-700 dark:text-gray-300">{errorDetails}</p>
              ) : (
                errorDetails
              )}
              
              <div className="flex gap-4 pt-4">
                <Link href="/">
                  <Button variant="outline">Go Home</Button>
                </Link>
                <Link href="/signin">
                  <Button>Try Again</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
