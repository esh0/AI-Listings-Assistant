import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { Plan } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
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
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Add user data to JWT token on sign in
      if (user) {
        token.id = user.id;
        token.plan = user.plan as Plan | undefined;
        token.creditsAvailable = user.creditsAvailable;
      }

      // Refresh user data on session update
      if (trigger === "update") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { plan: true, creditsAvailable: true },
        });
        if (dbUser) {
          token.plan = dbUser.plan as Plan | undefined;
          token.creditsAvailable = dbUser.creditsAvailable;
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
      }
      return session;
    },
  },
});
