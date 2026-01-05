import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const session = await auth()

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Receipt Builder
          </h1>
          <p className="text-lg text-muted-foreground">
            Create itemized receipts for patient plans with guided workflow
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/receipts/new">
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-[2px] transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50">
              <div className="relative h-32 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                <Button size="lg" className="w-full h-full text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                  ✨ Create New Receipt
                </Button>
              </div>
            </div>
          </Link>
          <Link href="/receipts">
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-[2px] transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50">
              <div className="relative h-32 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                <Button size="lg" variant="outline" className="w-full h-full text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0">
                  📋 View All Receipts
                </Button>
              </div>
            </div>
          </Link>
          <Link href="/admin/pricing">
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-[2px] transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/50">
              <div className="relative h-32 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                <Button size="lg" variant="outline" className="w-full h-full text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0">
                  ⚙️ Manage Pricing Rules
                </Button>
              </div>
            </div>
          </Link>
          <Link href="/tasks">
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-red-500 p-[2px] transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-500/50">
              <div className="relative h-32 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                <Button size="lg" variant="outline" className="w-full h-full text-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0">
                  ✅ View Tasks
                </Button>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

