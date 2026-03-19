import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { Plan } from "@prisma/client";
import { cache } from "react";

const { handlers, auth: uncachedAuth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt", // Use JWT for edge compatibility (middleware)
    maxAge: 7 * 24 * 60 * 60, // 7 days — balance between security and UX
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Add user data to JWT token on sign in
      if (user) {
        token.id = user.id;
        token.plan = user.plan as Plan | undefined;
        token.creditsAvailable = user.creditsAvailable;
        token.boostCredits = user.boostCredits;
        // creditsResetAt comes from Prisma as Date, convert to ISO string for JWT
        const resetAt = (user as Record<string, unknown>).creditsResetAt;
        token.creditsResetAt = resetAt instanceof Date ? resetAt.toISOString() : undefined;
      }

      // Refresh user data on session update
      if (trigger === "update") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { plan: true, creditsAvailable: true, boostCredits: true, creditsResetAt: true },
        });
        if (dbUser) {
          token.plan = dbUser.plan as Plan | undefined;
          token.creditsAvailable = dbUser.creditsAvailable;
          token.boostCredits = dbUser.boostCredits;
          token.creditsResetAt = dbUser.creditsResetAt?.toISOString();
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Add user data from JWT token to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.plan = token.plan as Plan | undefined;
        session.user.creditsAvailable = token.creditsAvailable as number | undefined;
        session.user.boostCredits = token.boostCredits as number | undefined;
        session.user.creditsResetAt = token.creditsResetAt as string | undefined;
      }
      return session;
    },
  },
});

// Wrap auth() with React.cache() for automatic per-request deduplication
// This ensures auth is only called once per server request, even if used in multiple components
export const auth = cache(uncachedAuth);
export { handlers, signIn, signOut };
