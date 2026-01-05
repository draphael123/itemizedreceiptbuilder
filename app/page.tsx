import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Receipt Builder</h1>
        <p className="text-muted-foreground mb-8">
          Create itemized receipts for patient plans with guided workflow
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/receipts/new">
            <Button size="lg" className="w-full h-32 text-lg">
              Create New Receipt
            </Button>
          </Link>
          <Link href="/receipts">
            <Button size="lg" variant="outline" className="w-full h-32 text-lg">
              View All Receipts
            </Button>
          </Link>
          <Link href="/admin/pricing">
            <Button size="lg" variant="outline" className="w-full h-32 text-lg">
              Manage Pricing Rules
            </Button>
          </Link>
          <Link href="/tasks">
            <Button size="lg" variant="outline" className="w-full h-32 text-lg">
              View Tasks
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

