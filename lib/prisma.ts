import { PrismaClient } from '@prisma/client'
import { demoPrisma } from './demo-storage'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if demo mode is enabled (no DATABASE_URL)
const isDemoMode = !process.env.DATABASE_URL || process.env.DATABASE_URL === 'demo'

let prismaInstance: PrismaClient | typeof demoPrisma

if (isDemoMode) {
  // Use in-memory demo storage
  console.warn('⚠️  Running in DEMO MODE - Data will be lost on restart!')
  console.warn('⚠️  Set DATABASE_URL to use a real database for production.')
  prismaInstance = demoPrisma as any
} else {
  // Use real Prisma with database
  prismaInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance as PrismaClient
  }
}

export const prisma = prismaInstance as PrismaClient

