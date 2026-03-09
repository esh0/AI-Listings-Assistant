import { DefaultSession } from "next-auth";
import { Plan } from "@prisma/client";

// Extend NextAuth session to include required user.id and custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Force required (default is optional)
      plan?: Plan;
      creditsAvailable?: number;
      boostCredits?: number;
      creditsResetAt?: string;
    } & DefaultSession["user"]; // Inherit name, email, image
  }

  interface User {
    plan?: Plan;
    creditsAvailable?: number;
    boostCredits?: number;
  }
}

// Extend JWT token to include custom fields
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    plan?: Plan;
    creditsAvailable?: number;
    boostCredits?: number;
    creditsResetAt?: string;
  }
}
