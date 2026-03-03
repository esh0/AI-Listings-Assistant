# Production Deployment Guide

This guide walks through deploying the Marketplace Assistant application to production using Supabase (database + storage) and Vercel (hosting).

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Google OAuth Setup](#google-oauth-setup)
4. [Environment Variables](#environment-variables)
5. [Database Migration](#database-migration)
6. [Vercel Deployment](#vercel-deployment)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- [ ] Supabase account: https://supabase.com
- [ ] Vercel account: https://vercel.com
- [ ] Google Cloud Console access: https://console.cloud.google.com
- [ ] OpenAI API key with GPT-4o access: https://platform.openai.com/api-keys
- [ ] Domain name (optional, but recommended for production)

---

## Supabase Setup

### 1. Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - **Project name**: marketplace-assistant (or your choice)
   - **Database password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., eu-central-1 for Europe)
4. Click "Create new project"
5. Wait ~2 minutes for project to initialize

### 2. Get Database Connection String

1. In Supabase dashboard, go to **Project Settings** (gear icon)
2. Navigate to **Database** section
3. Scroll to **Connection string**
4. Select **URI** tab
5. Copy the connection string:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with your database password from step 1
7. Save this as `DATABASE_URL` for later

### 3. Get API Keys

1. In Supabase dashboard, go to **Project Settings** > **API**
2. Copy these values:
   - **Project URL**: `https://[PROJECT-REF].supabase.co` → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click "Create bucket"
3. Fill in:
   - **Name**: `ad-images`
   - **Public bucket**: ✅ Enable (so images are publicly accessible)
4. Click "Create bucket"
5. Bucket is now ready for image uploads

### 5. Configure Storage Policies (Important!)

By default, the bucket is public for reads but not for writes. We need to allow authenticated users to upload:

1. Go to **Storage** > **Policies** > `ad-images` bucket
2. Click "New Policy"
3. Create policy for **INSERT**:
   - **Policy name**: Allow authenticated uploads
   - **Policy definition**: `authenticated`
   - **Target roles**: `authenticated`
   - Click "Save"
4. Create policy for **DELETE**:
   - **Policy name**: Allow authenticated deletes
   - **Policy definition**: `authenticated`
   - **Target roles**: `authenticated`
   - Click "Save"

Alternatively, use SQL in SQL Editor:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'ad-images');

-- Allow authenticated users to delete their images
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'ad-images');

-- Public read access (already enabled if bucket is public)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'ad-images');
```

---

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click project dropdown (top left) → "New Project"
3. **Project name**: Marketplace Assistant
4. Click "Create"

### 2. Enable Google+ API

1. In Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click "Enable"

### 3. Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **External** (unless you have Google Workspace)
3. Click "Create"
4. Fill in:
   - **App name**: Marketplace Assistant
   - **User support email**: Your email
   - **Developer contact email**: Your email
5. Click "Save and Continue"
6. **Scopes**: Click "Add or Remove Scopes"
   - Select: `userinfo.email`, `userinfo.profile`, `openid`
   - Click "Update"
7. Click "Save and Continue"
8. **Test users** (for External apps): Add your email for testing
9. Click "Save and Continue"

### 4. Create OAuth Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click "Create Credentials" > "OAuth client ID"
3. Select **Application type**: Web application
4. **Name**: Marketplace Assistant Web Client
5. **Authorized JavaScript origins**:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`
6. **Authorized redirect URIs**:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
7. Click "Create"
8. Copy:
   - **Client ID** → `GOOGLE_CLIENT_ID`
   - **Client Secret** → `GOOGLE_CLIENT_SECRET`

---

## Environment Variables

### Development (.env.local)

Create `.env.local` in project root:

```env
# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL=postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres

# NextAuth
NEXTAUTH_SECRET=your-generated-secret  # Generate: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Production (Vercel)

You'll add these in Vercel dashboard (next section).

---

## Database Migration

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Push Schema to Database

```bash
npx prisma db push
```

This creates all tables (User, Account, Session, Ad, Template) and enums in your Supabase database.

### 4. Verify in Supabase

1. Go to Supabase dashboard > **Table Editor**
2. You should see:
   - User
   - Account
   - Session
   - VerificationToken
   - Ad
   - Template
3. Click on each table to verify structure

---

## Vercel Deployment

### 1. Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

Or deploy via Vercel dashboard (recommended for first time).

### 2. Deploy via GitHub (Recommended)

1. Push your code to GitHub
2. Go to https://vercel.com/dashboard
3. Click "Add New" > "Project"
4. Import your GitHub repository
5. **Framework Preset**: Next.js (auto-detected)
6. **Root Directory**: `./` (default)
7. **Build Command**: `npm run build` (default)
8. **Output Directory**: `.next` (default)

### 3. Configure Environment Variables

In Vercel project settings > **Environment Variables**, add:

```
OPENAI_API_KEY=sk-your-openai-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL=postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

**Important**: Set environment variables for **Production**, **Preview**, and **Development** (check all three).

### 4. Update Google OAuth Redirect URIs

After first deployment, you'll get a Vercel URL (e.g., `https://marketplace-assistant.vercel.app`).

1. Go back to Google Cloud Console > **Credentials**
2. Edit your OAuth client
3. Add to **Authorized redirect URIs**:
   ```
   https://your-vercel-domain.vercel.app/api/auth/callback/google
   ```
4. Update `NEXTAUTH_URL` in Vercel environment variables:
   ```
   NEXTAUTH_URL=https://your-vercel-domain.vercel.app
   ```
5. Redeploy in Vercel (or it will auto-deploy on next push)

### 5. Deploy

Click "Deploy" in Vercel. Build takes ~2-3 minutes.

---

## Post-Deployment Verification

### 1. Health Check

- [ ] Visit your production URL
- [ ] Home page loads correctly
- [ ] Theme toggle works
- [ ] Form is interactive

### 2. Authentication Flow

- [ ] Click "Sign in" (or trigger soft-wall)
- [ ] Redirects to `/auth/signin`
- [ ] Click "Kontynuuj z Google"
- [ ] Google OAuth consent screen appears
- [ ] After consent, redirects back to app
- [ ] User appears in sidebar (check name, email, avatar)
- [ ] Check Supabase > Table Editor > User - new row created

### 3. Generate Ad

- [ ] Upload images
- [ ] Fill form
- [ ] Click "Generuj ogłoszenie"
- [ ] Loading screen appears
- [ ] Result displays
- [ ] Check Supabase > Table Editor > Ad - new row created
- [ ] Wait 10 seconds, refresh Ad table
- [ ] `images` field updated with Supabase Storage URLs

### 4. Storage Verification

- [ ] Go to Supabase > Storage > `ad-images`
- [ ] Browse to `{userId}/{adId}/`
- [ ] Images appear (image-0.jpg, image-1.jpg, etc.)
- [ ] Click image - opens in new tab (public access works)

### 5. Dashboard

- [ ] Navigate to `/dashboard`
- [ ] Stats cards show correct counts
- [ ] Recent ads list displays
- [ ] Click "Ogłoszenia" - navigates to ads page
- [ ] Click "Szablony" - navigates to templates page

---

## Troubleshooting

### Issue: "Invalid API key" (OpenAI)

**Cause**: OpenAI API key not set or incorrect.

**Solution**:
1. Verify `OPENAI_API_KEY` in Vercel environment variables
2. Check key is valid at https://platform.openai.com/api-keys
3. Ensure key has GPT-4o model access
4. Redeploy after fixing

### Issue: "Database connection error"

**Cause**: Invalid `DATABASE_URL` or Supabase not allowing connections.

**Solution**:
1. Verify `DATABASE_URL` format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
2. Check password is correct (no special characters causing issues)
3. Go to Supabase > Project Settings > Database > Connection Pooling
4. Use **Transaction mode** pooling for Prisma: `?pgbouncer=true&connection_limit=1`
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true
   ```
5. Run `npx prisma db push` again

### Issue: "Unauthorized" when accessing dashboard

**Cause**: NextAuth session not working.

**Solution**:
1. Verify `NEXTAUTH_SECRET` is set in Vercel
2. Verify `NEXTAUTH_URL` matches your production domain
3. Check Google OAuth redirect URI includes your production domain
4. Clear cookies and try signing in again

### Issue: Google OAuth "redirect_uri_mismatch"

**Cause**: Redirect URI not whitelisted in Google Cloud Console.

**Solution**:
1. Go to Google Cloud Console > Credentials
2. Edit OAuth client
3. Add exact redirect URI: `https://your-domain.com/api/auth/callback/google`
4. Wait 1-2 minutes for changes to propagate
5. Try signing in again

### Issue: Images not uploading to Supabase Storage

**Cause**: Storage policies not configured or `unstable_after` not working.

**Solution**:
1. Check Supabase > Storage > Policies for `ad-images` bucket
2. Ensure authenticated users have INSERT/DELETE permissions
3. Check Vercel logs for errors:
   - Go to Vercel > Project > Logs
   - Look for "Background image upload failed" errors
4. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
5. Test manually via Supabase Storage UI - try uploading a file

### Issue: "No credits remaining" for new users

**Cause**: User not initialized with FREE plan.

**Solution**:
1. Check Supabase > User table
2. Verify `plan` = "FREE", `creditsUsed` = 0
3. If not, update manually:
   ```sql
   UPDATE "User" SET plan = 'FREE', "creditsUsed" = 0, "creditsReset" = NOW() WHERE email = 'user@example.com';
   ```

### Issue: Dark mode not persisting

**Cause**: Theme stored in localStorage, cookies not configured.

**Solution**: This is expected behavior. Theme is client-side only. For persistence across sessions, consider using cookies in `ThemeProvider`.

### Issue: Build fails with TypeScript errors

**Cause**: Type mismatches or missing dependencies.

**Solution**:
1. Run locally: `npx tsc --noEmit`
2. Fix all TypeScript errors
3. Run `npm run build` locally to verify
4. Commit and push fixes
5. Vercel will auto-deploy

---

## Performance Optimization

### 1. Enable Vercel Analytics

1. Go to Vercel > Project > Analytics
2. Click "Enable"
3. Monitor Core Web Vitals, page load times

### 2. Configure Caching

Add to `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['your-project-ref.supabase.co'], // Allow Supabase images
    },
    // Cache static assets
    async headers() {
        return [
            {
                source: '/:all*(svg|jpg|png|webp)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};
```

### 3. Monitor API Response Times

- Check Vercel logs for slow API routes
- Optimize Prisma queries with indexes (already configured)
- Consider edge functions for `/api/auth/*` routes

---

## Backup & Recovery

### Database Backups

Supabase automatically backs up your database daily. To restore:

1. Go to Supabase > Database > Backups
2. Select backup date
3. Click "Restore"

### Manual Backup

```bash
# Export database
npx prisma db pull
npx prisma generate

# Backup to SQL
pg_dump -h db.your-project-ref.supabase.co -U postgres -d postgres > backup.sql
```

### Storage Backups

Supabase Storage doesn't have automatic backups. Consider periodic manual downloads or use Supabase CLI:

```bash
supabase storage download --project-ref your-project-ref ad-images
```

---

## Monitoring & Alerts

### 1. Vercel Monitoring

- **Build notifications**: Enable in Vercel > Project > Settings > Notifications
- **Error tracking**: Check Vercel > Logs for runtime errors

### 2. Supabase Monitoring

- **Database usage**: Supabase > Project Settings > Usage
- **Storage usage**: Supabase > Storage > Usage
- **API requests**: Supabase > Project Settings > API > Usage

### 3. Set Up Alerts

- **Supabase**: Configure email alerts for database size limits
- **Vercel**: Enable deployment notifications (success/failure)

---

## Scaling Considerations

### Database Connection Pooling

If you exceed Supabase's connection limit (Prisma uses 10 connections by default):

1. Use Supabase connection pooling:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
   ```

### Storage Limits

- **Free tier**: 1GB storage
- **Pro tier**: 100GB storage
- Monitor usage in Supabase dashboard

### Rate Limiting

Consider adding rate limiting for unauthenticated users:

```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 requests per hour
});
```

---

## Security Checklist

- [ ] `.env.local` in `.gitignore`
- [ ] All API routes validate user ownership
- [ ] Google OAuth restricted to your domain
- [ ] Supabase RLS policies enabled
- [ ] NEXTAUTH_SECRET is strong (32+ characters)
- [ ] Database password is strong
- [ ] Regular dependency updates: `npm audit`

---

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **NextAuth Docs**: https://next-auth.js.org
- **Prisma Docs**: https://www.prisma.io/docs
- **Vercel Docs**: https://vercel.com/docs

---

## Post-Launch Checklist

- [ ] Test authentication flow
- [ ] Test ad generation (logged in + logged out)
- [ ] Verify image uploads to Supabase Storage
- [ ] Test credits system (FREE plan limits)
- [ ] Test CSV export
- [ ] Test templates CRUD
- [ ] Monitor Vercel logs for errors
- [ ] Check Supabase usage metrics
- [ ] Set up error monitoring (Sentry optional)
- [ ] Configure custom domain (optional)
- [ ] Enable Vercel Analytics

---

**Congratulations!** Your Marketplace Assistant is now live in production. 🎉
