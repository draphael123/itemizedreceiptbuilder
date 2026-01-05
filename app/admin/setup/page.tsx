import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SetAdminButton } from "@/components/set-admin-button"

export default async function AdminSetupPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  const isAdmin = user?.role === "admin"

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          ⚙️ Admin Setup
        </h1>

        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              👤 Your Account Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-semibold">{user?.email || session.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Role</p>
                <p className="font-semibold">
                  {isAdmin ? (
                    <span className="text-green-600">✅ Admin</span>
                  ) : (
                    <span className="text-gray-600">👤 User</span>
                  )}
                </p>
              </div>

              {!isAdmin && (
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-4">
                    You need admin access to manage pricing rules and other admin features.
                  </p>
                  <SetAdminButton userId={session.user.id} userEmail={user?.email || session.user.email || ""} />
                </div>
              )}

              {isAdmin && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                    ✅ You have admin access! You can now:
                  </p>
                  <ul className="list-disc list-inside text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>Manage pricing rules</li>
                    <li>Access admin features</li>
                    <li>Configure system settings</li>
                  </ul>
                  <div className="mt-4">
                    <a href="/admin/pricing">
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                        Go to Pricing Rules →
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

