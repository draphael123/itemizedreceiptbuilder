import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { PricingRulesManager } from "@/components/pricing-rules-manager"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminPricingPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/signin")
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
                You need admin access to manage pricing rules.
              </p>
              <div className="mb-4">
                <Link href="/admin/setup">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    ✨ Make Me Admin
                  </Button>
                </Link>
              </div>
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

