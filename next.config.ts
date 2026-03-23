import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    // Note: experimental.after is enabled but not typed in Next.js 15
    // unstable_after is dynamically imported to avoid type errors

    // Workaround for Prisma in Next.js 15.5+ build errors
    // https://github.com/prisma/prisma/issues/27398
    serverExternalPackages: ['@prisma/client', 'prisma'],

    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    { key: "X-Frame-Options", value: "DENY" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
                    { key: "X-DNS-Prefetch-Control", value: "on" },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=31536000; includeSubDomains",
                    },
                    {
                        key: "Content-Security-Policy",
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://js.stripe.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://api.openai.com https://api.stripe.com https://*.supabase.co https://*.sentry.io https://vitals.vercel-insights.com https://o*.ingest.sentry.io https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com; frame-src https://js.stripe.com https://hooks.stripe.com; worker-src blob:;",
                    },
                ],
            },
        ];
    },
};

export default withSentryConfig(nextConfig, {
    // org and project are only needed for source map uploads.
    // If not set, Sentry still captures errors — stack traces just won't be de-minified.
    // Find these slugs in your Sentry dashboard URL:
    // sentry.io/organizations/<org>/projects/<project>/
    ...(process.env.SENTRY_ORG && process.env.SENTRY_PROJECT
        ? {
              org: process.env.SENTRY_ORG,
              project: process.env.SENTRY_PROJECT,
              widenClientFileUpload: true,
              sourcemaps: { deleteSourcemapsAfterUpload: true },
          }
        : {}),
    silent: !process.env.CI,
    disableLogger: true,
    automaticVercelMonitors: true,
});
