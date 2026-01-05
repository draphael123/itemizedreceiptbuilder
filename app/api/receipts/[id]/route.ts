import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const receipt = await prisma.receipt.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
        tasks: true,
      },
    })

    if (!receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 })
    }

    if (receipt.createdById !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(receipt)
  } catch (error: any) {
    console.error("Error fetching receipt:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const receipt = await prisma.receipt.findUnique({
      where: { id: params.id },
    })

    if (!receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 })
    }

    if (receipt.createdById !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.receipt.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting receipt:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

