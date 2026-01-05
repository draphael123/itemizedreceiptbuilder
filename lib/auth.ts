import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import GoogleProvider from "next-auth/providers/google"
import { getDevSession } from "@/lib/auth-dev"

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

// Check if dev auth is enabled (bypasses Google OAuth)
const isDevAuthEnabled = process.env.ENABLE_DEV_AUTH === "true"

// Check for required environment variables (only if not using dev auth)
const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

if (!isDevAuthEnabled) {
  if (!authSecret) {
    throw new Error(
      'AUTH_SECRET or NEXTAUTH_SECRET environment variable is required. ' +
      'Generate one with: openssl rand -base64 32\n' +
      'Or enable dev mode by setting ENABLE_DEV_AUTH=true in your .env file'
    )
  }

  if (!googleClientId || !googleClientSecret) {
    throw new Error(
      'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are required. ' +
      'Get them from Google Cloud Console: https://console.cloud.google.com/\n' +
      'Or enable dev mode by setting ENABLE_DEV_AUTH=true in your .env file'
    )
  }
}

// Create NextAuth config conditionally
const nextAuthConfig: any = {
  adapter: PrismaAdapter(prisma) as any,
  secret: authSecret || "dev-secret-key",
  providers: [],
}

// Only add Google provider if not in dev mode
if (!isDevAuthEnabled) {
  nextAuthConfig.providers.push(
    GoogleProvider({
      clientId: googleClientId!,
      clientSecret: googleClientSecret!,
    })
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...nextAuthConfig,
  callbacks: {
    async session({ session, token, user }: any) {
      // In dev mode, use dev session
      if (isDevAuthEnabled) {
        const devSession = await getDevSession()
        if (devSession) {
          return {
            ...session,
            user: devSession.user,
            expires: devSession.expires,
          }
        }
      }
      
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

