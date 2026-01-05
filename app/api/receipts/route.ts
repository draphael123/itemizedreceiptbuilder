import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const receipts = await prisma.receipt.findMany({
      where: {
        createdById: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    })

    return NextResponse.json(receipts)
  } catch (error: any) {
    console.error("Error fetching receipts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

