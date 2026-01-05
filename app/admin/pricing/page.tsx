import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
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
        <h1 className="text-3xl font-bold mb-6">Manage Pricing Rules</h1>
        <PricingRulesManager initialRules={rules} />
      </div>
    </div>
  )
}

