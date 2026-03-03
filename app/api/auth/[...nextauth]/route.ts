import { handlers } from "@/auth";

// Export NextAuth handlers for all HTTP methods
// This catch-all route handles all NextAuth endpoints:
// - /api/auth/signin
// - /api/auth/signout
// - /api/auth/callback/:provider
// - /api/auth/session
// - /api/auth/providers
// - /api/auth/csrf
export const { GET, POST } = handlers;
