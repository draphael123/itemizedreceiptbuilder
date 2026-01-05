import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import GoogleProvider from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
    signIn: "/api/auth/signin",
  },
  trustHost: true,
})

