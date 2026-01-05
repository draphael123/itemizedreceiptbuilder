import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { ReceiptWizard } from "@/components/receipt-wizard"

export default async function NewReceiptPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Receipt</h1>
        <ReceiptWizard />
      </div>
    </div>
  )
}

