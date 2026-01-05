import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { userId } = await request.json()

    // Verify the user is trying to set themselves as admin
    if (userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "You can only set yourself as admin" },
        { status: 403 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    // Set user as admin
    await prisma.user.update({
      where: { id: userId },
      data: { role: "admin" },
    })

    return NextResponse.json({
      success: true,
      message: "Admin role set successfully",
    })
  } catch (error: any) {
    console.error("Error setting admin role:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to set admin role" },
      { status: 500 }
    )
  }
}

