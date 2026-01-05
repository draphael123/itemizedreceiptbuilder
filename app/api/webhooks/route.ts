import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Webhook endpoint for external integrations
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret (in production, use proper authentication)
    const authHeader = request.headers.get("authorization")
    const webhookSecret = process.env.WEBHOOK_SECRET

    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { event, data } = body

    // Handle different webhook events
    switch (event) {
      case "receipt.created":
        // Notify external systems when a receipt is created
        console.log("Receipt created webhook:", data)
        break

      case "receipt.updated":
        // Notify external systems when a receipt is updated
        console.log("Receipt updated webhook:", data)
        break

      case "task.completed":
        // Notify external systems when a task is completed
        console.log("Task completed webhook:", data)
        break

      default:
        return NextResponse.json({ error: "Unknown event type" }, { status: 400 })
    }

    return NextResponse.json({ success: true, received: true })
  } catch (error: any) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

