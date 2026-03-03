import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    // Note: experimental.after is enabled but not typed in Next.js 15
    // unstable_after is dynamically imported to avoid type errors

    // Workaround for Prisma in Next.js 15.5+ build errors
    // https://github.com/prisma/prisma/issues/27398
    serverExternalPackages: ['@prisma/client', 'prisma'],
};

export default nextConfig;