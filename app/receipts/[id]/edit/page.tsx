import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { ReceiptEditForm } from "@/components/receipt-edit-form"

export default async function EditReceiptPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  const receipt = await prisma.receipt.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!receipt) {
    notFound()
  }

  if (receipt.createdById !== session.user.id) {
    redirect("/receipts")
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          ✏️ Edit Receipt
        </h1>
        <ReceiptEditForm receipt={receipt} />
      </div>
    </div>
  )
}

