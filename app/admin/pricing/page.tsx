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

