import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { PricingRulesManager } from "@/components/pricing-rules-manager"

export default async function AdminPricingPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  // Check admin access
  try {
    await requireAdmin()
  } catch (error) {
    console.error("Admin access denied:", error)
    // Show a helpful message instead of just redirecting
    return (
      <div className="container mx-auto py-10">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-red-200">
            <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle>🔒 Admin Access Required</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">
                You need admin access to manage pricing rules. To become an admin:
              </p>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>Connect to your database (Neon/Supabase dashboard)</li>
                <li>Run this SQL query:
                  <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 text-sm">
                    UPDATE User SET role = 'admin' WHERE email = '{session.user.email}';
                  </pre>
                </li>
                <li>Sign out and sign back in</li>
              </ol>
              <p className="text-sm text-muted-foreground">
                Or use the command: <code>npm run make-admin {session.user.email}</code>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const rules = await prisma.pricingRule.findMany({
    orderBy: [
      { planPrice: "asc" },
      { planWeeks: "asc" },
      { medicationKey: "asc" },
      { category: "asc" },
    ],
  })

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
          ⚙️ Manage Pricing Rules
        </h1>
        <PricingRulesManager initialRules={rules} />
      </div>
    </div>
  )
}

