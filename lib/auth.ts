import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import GoogleProvider from "next-auth/providers/google"

// Validate required environment variables
const requiredEnvVars = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  AUTH_SECRET: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
}

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0 && process.env.NODE_ENV !== 'test') {
  console.error('❌ Missing required environment variables for NextAuth:')
  missingVars.forEach(varName => console.error(`   - ${varName}`))
  console.error('\n📝 Please add these to your .env file:')
  if (!requiredEnvVars.GOOGLE_CLIENT_ID || !requiredEnvVars.GOOGLE_CLIENT_SECRET) {
    console.error('   - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (get from Google Cloud Console)')
  }
  if (!requiredEnvVars.AUTH_SECRET) {
    console.error('   - AUTH_SECRET or NEXTAUTH_SECRET (generate with: openssl rand -base64 32)')
  }
}

// Check for required environment variables
const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

if (!authSecret) {
  throw new Error(
    'AUTH_SECRET or NEXTAUTH_SECRET environment variable is required. ' +
    'Generate one with: openssl rand -base64 32'
  )
}

if (!googleClientId || !googleClientSecret) {
  throw new Error(
    'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are required. ' +
    'Get them from Google Cloud Console: https://console.cloud.google.com/'
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  secret: authSecret,
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  callbacks: {
    async session({ session, token, user }: any) {
      if (session.user) {
        // Try to get user ID from token first, then from user object
        session.user.id = token?.sub || user?.id || token?.userId
      }
      return session
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        token.sub = user.id
        token.userId = user.id
      }
      return token
    },
  },
  pages: {
    signIn: "/signin",
    error: "/api/auth/error",
  },
  trustHost: true,
})

