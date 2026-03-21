import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import ResendProvider from "next-auth/providers/resend";
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
    FacebookProvider({
      clientId: process.env.AUTH_FACEBOOK_ID!,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
    }),
    ResendProvider({
      async sendVerificationRequest({ identifier: email, url }) {
        const { sendEmail } = await import("@/lib/email");
        const { magicLinkEmailHtml } = await import("@/emails/magic-link");
        await sendEmail(
          email,
          "Twój link do logowania — Marketplace AI",
          magicLinkEmailHtml(url),
        );
      },
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
    async signIn({ user }) {
      // Send welcome email to new users (created within last 60 seconds)
      if (user.email && user.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { createdAt: true, name: true },
          });
          if (dbUser) {
            const ageMs = Date.now() - new Date(dbUser.createdAt).getTime();
            if (ageMs < 60_000) {
              const { sendEmail } = await import("@/lib/email");
              const { welcomeEmailHtml } = await import("@/emails/welcome");
              const name = dbUser.name ?? user.email.split("@")[0];
              await sendEmail(
                user.email,
                "Witaj w Marketplace AI! 🎉",
                welcomeEmailHtml(name)
              );
            }
          }
        } catch (err) {
          console.error("[auth] Failed to send welcome email:", err);
        }
      }
      return true;
    },
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
