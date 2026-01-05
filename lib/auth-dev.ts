/**
 * Development-only authentication bypass
 * Use this when you don't want to set up Google OAuth
 * 
 * To enable: Set ENABLE_DEV_AUTH=true in your .env file
 */

import { prisma } from "@/lib/prisma"

// Mock user for development
const DEV_USER = {
  id: "dev-user-123",
  email: "dev@example.com",
  name: "Dev User",
  role: "admin" as const,
}

export async function getDevSession() {
  // Check if dev auth is enabled
  if (process.env.ENABLE_DEV_AUTH !== "true") {
    return null
  }

  // Ensure dev user exists in database
  try {
    const user = await prisma.user.upsert({
      where: { email: DEV_USER.email },
      update: {},
      create: {
        id: DEV_USER.id,
        email: DEV_USER.email,
        name: DEV_USER.name,
        role: DEV_USER.role,
        emailVerified: new Date(),
      },
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    }
  } catch (error) {
    console.error("Error creating dev user:", error)
    return null
  }
}

