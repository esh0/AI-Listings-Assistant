# Authentication & Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add authentication (NextAuth v5), user dashboard with stats/templates, and soft-wall PLG flow to Marketplace Assistant.

**Architecture:** NextAuth v5 with Prisma adapter + Supabase PostgreSQL for user/session data. IndexedDB (idb-keyval) for soft-wall persistence. Dashboard with sidebar layout, stats aggregations, templates CRUD, and CSV export. Images stored in Supabase Storage.

**Tech Stack:** NextAuth v5, Prisma, Supabase PostgreSQL, Supabase Storage, idb-keyval, Resend (email)

**Design Document:** See `docs/plans/2026-03-01-auth-dashboard-design.md` for full architecture details.

---

## Phase 1: Foundation (Database & Auth Setup)

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install authentication dependencies**

```bash
npm install next-auth@beta @auth/prisma-adapter
```

**Step 2: Install database dependencies**

```bash
npm install prisma @prisma/client @supabase/supabase-js
```

**Step 3: Install utility libraries**

```bash
npm install idb-keyval resend
```

**Step 4: Install dev dependencies**

```bash
npm install -D prisma
```

**Step 5: Verify installation**

Run: `npm list next-auth prisma @prisma/client`
Expected: All packages listed with correct versions

**Step 6: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add NextAuth v5, Prisma, Supabase, and utilities"
```

---

### Task 2: Setup Prisma

**Files:**
- Create: `prisma/schema.prisma`
- Create: `.env.local` (update with Supabase credentials)

**Step 1: Initialize Prisma**

```bash
npx prisma init
```

Expected: Creates `prisma/` directory with `schema.prisma`

**Step 2: Replace schema with complete model**

Replace contents of `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ===== NextAuth Required Models =====
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ===== Application Models =====
model User {
  id            String      @id @default(cuid())
  email         String      @unique
  name          String?
  image         String?
  emailVerified DateTime?
  createdAt     DateTime    @default(now())
  plan          Plan        @default(FREE)
  creditsUsed   Int         @default(0)
  creditsReset  DateTime    @default(now())

  ads           Ad[]
  templates     Template[]
  accounts      Account[]
  sessions      Session[]
}

model Ad {
  id            String      @id @default(cuid())
  userId        String
  platform      Platform
  title         String
  description   String      @db.Text
  status        AdStatus    @default(DRAFT)
  soldPrice     Float?
  priceMin      Float?
  priceMax      Float?
  images        Json
  parameters    Json
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt(sort: Desc)])
  @@index([userId, status])
}

model Template {
  id            String            @id @default(cuid())
  userId        String
  name          String
  platform      Platform
  tone          ToneStyle
  condition     ProductCondition
  delivery      Json
  isDefault     Boolean           @default(false)
  createdAt     DateTime          @default(now())

  user          User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, name])
  @@index([userId, isDefault])
}

enum Plan {
  FREE
  PREMIUM
}

enum AdStatus {
  DRAFT
  PUBLISHED
  SOLD
  ARCHIVED
}

enum Platform {
  OLX
  ALLEGRO_LOKALNIE
  FACEBOOK_MARKETPLACE
  VINTED
}

enum ToneStyle {
  PROFESSIONAL
  FRIENDLY
  CASUAL
}

enum ProductCondition {
  NOWY
  IDEALNY
  UZYWANY_DOBRY
  SLADY_UZYCIA
}
```

**Step 3: Add Supabase connection strings to .env.local**

Add to `.env.local`:

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[Run: openssl rand -base64 32]"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_ANON_KEY]"
```

**Important:** Replace placeholders with actual Supabase credentials.

**Step 4: Generate Prisma client**

```bash
npx prisma generate
```

Expected: Prisma Client generated in `node_modules/@prisma/client`

**Step 5: Push schema to database**

```bash
npx prisma db push
```

Expected: All tables created successfully in Supabase

**Step 6: Verify with Prisma Studio**

```bash
npx prisma studio
```

Expected: Opens browser with database GUI showing all tables

**Step 7: Commit**

```bash
git add prisma/schema.prisma .env.example
git commit -m "feat: add Prisma schema with NextAuth and app models"
```

---

### Task 3: Create Prisma Client Instance

**Files:**
- Create: `lib/prisma.ts`

**Step 1: Create Prisma singleton**

Create `lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**Why singleton:** Prevents multiple Prisma Client instances in development (Next.js hot reload).

**Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add lib/prisma.ts
git commit -m "feat: add Prisma client singleton"
```

---

### Task 4: Setup Supabase Client

**Files:**
- Create: `lib/supabase.ts`

**Step 1: Create Supabase client**

Create `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

**Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add lib/supabase.ts
git commit -m "feat: add Supabase client for storage"
```

---

### Task 5: Configure NextAuth v5

**Files:**
- Create: `auth.ts` (root directory)
- Create: `app/api/auth/[...nextauth]/route.ts`
- Modify: `lib/types.ts` (add Plan type to session)

**Step 1: Create auth configuration**

Create `auth.ts` in project root:

```typescript
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        const userData = await prisma.user.findUnique({
          where: { id: user.id },
          select: { plan: true, creditsUsed: true, creditsReset: true }
        });

        session.user.plan = userData?.plan;
        session.user.creditsUsed = userData?.creditsUsed;
      }
      return session;
    },
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});
```

**Step 2: Create API route handler**

Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

**Step 3: Add session type to lib/types.ts**

Add to `lib/types.ts`:

```typescript
// Auth types
export type Plan = 'FREE' | 'PREMIUM';
export type AdStatus = 'DRAFT' | 'PUBLISHED' | 'SOLD' | 'ARCHIVED';

// Extend NextAuth session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      plan?: Plan;
      creditsUsed?: number;
    };
  }
}
```

**Step 4: Add environment variables**

Add to `.env.local`:

```bash
# Google OAuth (get from https://console.cloud.google.com)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Resend (get from https://resend.com)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"
```

**Step 5: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 6: Commit**

```bash
git add auth.ts app/api/auth/[...nextauth]/route.ts lib/types.ts
git commit -m "feat: configure NextAuth v5 with Google and Resend providers"
```

---

### Task 6: Create Middleware for Route Protection

**Files:**
- Create: `middleware.ts` (root directory)

**Step 1: Create middleware**

Create `middleware.ts`:

```typescript
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Protected routes
  if (pathname.startsWith('/dashboard') ||
      pathname.startsWith('/api/ads') ||
      pathname.startsWith('/api/templates')) {

    if (!req.auth) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/ads/:path*',
    '/api/templates/:path*',
  ],
};
```

**Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat: add middleware for route protection"
```

---

## Phase 2: Credits System & Utilities

### Task 7: Create Credits Management Logic

**Files:**
- Create: `lib/credits.ts`

**Step 1: Write credits helper functions**

Create `lib/credits.ts`:

```typescript
import { prisma } from '@/lib/prisma';

export async function checkAndResetCredits(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      plan: true,
      creditsUsed: true,
      creditsReset: true,
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const now = new Date();
  const resetDate = new Date(user.creditsReset);

  // Check if month passed (compare year + month)
  const monthPassed =
    now.getFullYear() > resetDate.getFullYear() ||
    (now.getFullYear() === resetDate.getFullYear() &&
     now.getMonth() > resetDate.getMonth());

  if (monthPassed && user.plan === 'FREE') {
    // Reset credits
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        creditsUsed: 0,
        creditsReset: now
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        plan: true,
        creditsUsed: true,
        creditsReset: true,
      }
    });

    return updatedUser;
  }

  return user;
}

export function getRemainingCredits(user: { plan: string; creditsUsed: number }) {
  if (user.plan === 'PREMIUM') return Infinity;
  return Math.max(0, 5 - user.creditsUsed);
}
```

**Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add lib/credits.ts
git commit -m "feat: add credits management with lazy reset"
```

---

### Task 8: Create IndexedDB Storage Helper

**Files:**
- Create: `lib/storage-helper.ts`

**Step 1: Write storage helpers**

Create `lib/storage-helper.ts`:

```typescript
import { set, get, del } from 'idb-keyval';

export interface PendingAdData {
  title: string;
  description: string;
  images: any[];
  parameters: any;
  priceMin?: number;
  priceMax?: number;
  platform: string;
  timestamp: number;
}

export async function savePendingAd(adData: PendingAdData): Promise<void> {
  await set('pendingAd', adData);
}

export async function getPendingAd(): Promise<PendingAdData | undefined> {
  return await get('pendingAd');
}

export async function clearPendingAd(): Promise<void> {
  await del('pendingAd');
}
```

**Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add lib/storage-helper.ts
git commit -m "feat: add IndexedDB helper for soft-wall flow"
```

---

### Task 9: Create Image Upload Helper

**Files:**
- Create: `lib/storage.ts`

**Step 1: Write image upload function**

Create `lib/storage.ts`:

```typescript
import { supabase } from './supabase';

export async function uploadImagesToStorage(
  adId: string,
  userId: string,
  images: { url: string; file: { name: string } }[]
) {
  const uploadedImages = [];

  for (const image of images) {
    try {
      // Convert base64 to Blob
      const base64Data = image.url.split(',')[1];
      const mimeType = image.url.split(';')[0].split(':')[1];
      const blob = base64ToBlob(base64Data, mimeType);

      // Generate unique filename
      const extension = image.file.name.split('.').pop();
      const fileName = `${userId}/${adId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('ad-images')
        .upload(fileName, blob, {
          contentType: mimeType,
          cacheControl: '31536000', // 1 year
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('ad-images')
        .getPublicUrl(fileName);

      uploadedImages.push({
        url: urlData.publicUrl,
        quality: (image as any).quality,
        suggestions: (image as any).suggestions,
      });
    } catch (error) {
      console.error('Image upload failed:', error);
      uploadedImages.push(image); // Fallback: keep base64
    }
  }

  return uploadedImages;
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}
```

**Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add lib/storage.ts
git commit -m "feat: add Supabase Storage image upload helper"
```

---

## Phase 3: API Endpoints

### Task 10: Extend Generate Ad Endpoint

**Files:**
- Modify: `app/api/generate-ad/route.ts`

**Step 1: Import new dependencies**

Add imports at top of file:

```typescript
import { auth } from "@/auth";
import { checkAndResetCredits } from "@/lib/credits";
import { prisma } from "@/lib/prisma";
import { uploadImagesToStorage } from "@/lib/storage";
```

**Step 2: Wrap existing handler with auth check**

Replace the POST function with:

```typescript
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    // Validate with existing Zod schema
    const validatedData = adRequestSchema.parse(body);

    // AUTHENTICATED USER
    if (session?.user) {
      const user = await checkAndResetCredits(session.user.id);

      // Check credits
      if (user.plan === 'FREE' && user.creditsUsed >= 5) {
        return NextResponse.json(
          {
            error: 'Wykorzystałeś limit darmowych ogłoszeń. Przejdź na Premium!',
            code: 'CREDITS_EXCEEDED'
          },
          { status: 403 }
        );
      }

      // Generate ad (existing logic)
      const result = await generateAd(validatedData);

      // Save to database
      const ad = await prisma.ad.create({
        data: {
          userId: user.id,
          platform: validatedData.platform,
          title: result.title,
          description: result.description,
          priceMin: result.priceMin,
          priceMax: result.priceMax,
          images: result.imageAnalysis,
          parameters: {
            condition: validatedData.condition,
            tone: validatedData.tone,
            delivery: validatedData.delivery,
            productName: validatedData.productName,
            notes: validatedData.notes,
            priceType: validatedData.priceType,
          },
          status: 'DRAFT',
        },
      });

      // Increment credits
      await prisma.user.update({
        where: { id: user.id },
        data: { creditsUsed: { increment: 1 } }
      });

      // Background image upload (non-blocking)
      uploadImagesToStorage(ad.id, user.id, validatedData.images).catch(console.error);

      return NextResponse.json({
        ...result,
        adId: ad.id,
        creditsRemaining: user.plan === 'PREMIUM' ? null : 5 - user.creditsUsed - 1,
      });
    }

    // GUEST USER (soft-wall)
    else {
      const result = await generateAd(validatedData);

      return NextResponse.json({
        ...result,
        requiresAuth: true,
      });
    }

  } catch (error) {
    console.error("Generate ad error:", error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Nieprawidłowe dane formularza' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Błąd generowania ogłoszenia' },
      { status: 500 }
    );
  }
}
```

**Step 3: Test endpoint manually**

Run dev server: `npm run dev`

Test with curl (authenticated user - will need actual session):
```bash
curl -X POST http://localhost:3000/api/generate-ad \
  -H "Content-Type: application/json" \
  -d '{"platform":"olx","condition":"nowy","tone":"friendly",...}'
```

Expected: Returns `requiresAuth: true` for guest

**Step 4: Commit**

```bash
git add app/api/generate-ad/route.ts
git commit -m "feat: extend generate-ad endpoint with auth and DB save"
```

---

### Task 11: Create Ads CRUD Endpoints

**Files:**
- Create: `app/api/ads/route.ts`
- Create: `app/api/ads/[id]/route.ts`

**Step 1: Create GET and POST handlers**

Create `app/api/ads/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkAndResetCredits } from "@/lib/credits";

// GET /api/ads - List user's ads
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  const where = {
    userId: session.user.id,
    ...(status && status !== 'ALL' ? { status: status as any } : {}),
  };

  const [ads, total] = await Promise.all([
    prisma.ad.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        platform: true,
        title: true,
        status: true,
        soldPrice: true,
        images: true,
        createdAt: true,
      },
    }),
    prisma.ad.count({ where }),
  ]);

  return NextResponse.json({ ads, total });
}

// POST /api/ads - Save pending ad (after soft-wall login)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const user = await checkAndResetCredits(session.user.id);
  if (user.plan === 'FREE' && user.creditsUsed >= 5) {
    return NextResponse.json(
      { error: 'Brak kredytów' },
      { status: 403 }
    );
  }

  const ad = await prisma.ad.create({
    data: {
      userId: user.id,
      platform: body.platform,
      title: body.title,
      description: body.description,
      priceMin: body.priceMin,
      priceMax: body.priceMax,
      images: body.images,
      parameters: body.parameters,
      status: 'DRAFT',
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { creditsUsed: { increment: 1 } }
  });

  return NextResponse.json({ ad });
}
```

**Step 2: Create PATCH and DELETE handlers**

Create `app/api/ads/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

// GET /api/ads/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ad = await prisma.ad.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!ad) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ ad });
}

// PATCH /api/ads/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const ad = await prisma.ad.updateMany({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.soldPrice && { soldPrice: body.soldPrice }),
    },
  });

  if (ad.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/ads/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ad = await prisma.ad.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    select: { images: true }
  });

  if (!ad) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.ad.delete({
    where: { id: params.id }
  });

  // Cleanup Supabase Storage (async)
  const images = ad.images as { url: string }[];
  images.forEach(async (img) => {
    if (img.url.includes('supabase')) {
      const path = img.url.split('/ad-images/')[1];
      await supabase.storage.from('ad-images').remove([path]);
    }
  });

  return NextResponse.json({ success: true });
}
```

**Step 3: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add app/api/ads/route.ts app/api/ads/[id]/route.ts
git commit -m "feat: add ads CRUD API endpoints"
```

---

### Task 12: Create CSV Export Endpoint

**Files:**
- Create: `app/api/ads/export/route.ts`

**Step 1: Create export handler**

Create `app/api/ads/export/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { adIds } = await req.json();

  const ads = await prisma.ad.findMany({
    where: {
      id: { in: adIds },
      userId: session.user.id,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Generate CSV
  const csvHeader = 'Data,Platforma,Tytuł,Status,Cena min,Cena max,Cena sprzedaży,Link do zdjęcia\n';
  const csvRows = ads.map(ad => {
    const firstImage = (ad.images as any[])[0]?.url || '';
    return [
      ad.createdAt.toISOString().split('T')[0],
      ad.platform,
      `"${ad.title.replace(/"/g, '""')}"`,
      ad.status,
      ad.priceMin || '',
      ad.priceMax || '',
      ad.soldPrice || '',
      firstImage,
    ].join(',');
  }).join('\n');

  const csv = csvHeader + csvRows;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="ogloszenia-${Date.now()}.csv"`,
    },
  });
}
```

**Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add app/api/ads/export/route.ts
git commit -m "feat: add CSV export endpoint"
```

---

### Task 13: Create Templates CRUD Endpoints

**Files:**
- Create: `app/api/templates/route.ts`
- Create: `app/api/templates/[id]/route.ts`

**Step 1: Create GET and POST handlers**

Create `app/api/templates/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/templates
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const templates = await prisma.template.findMany({
    where: { userId: session.user.id },
    orderBy: [
      { isDefault: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  return NextResponse.json({ templates });
}

// POST /api/templates
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  // If isDefault=true, set others to false
  if (body.isDefault) {
    await prisma.template.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  const template = await prisma.template.create({
    data: {
      userId: session.user.id,
      name: body.name,
      platform: body.platform,
      tone: body.tone,
      condition: body.condition,
      delivery: body.delivery,
      isDefault: body.isDefault || false,
    },
  });

  return NextResponse.json({ template });
}
```

**Step 2: Create PATCH and DELETE handlers**

Create `app/api/templates/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/templates/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  // If setting isDefault=true, disable others
  if (body.isDefault) {
    await prisma.template.updateMany({
      where: {
        userId: session.user.id,
        id: { not: params.id }
      },
      data: { isDefault: false },
    });
  }

  const template = await prisma.template.updateMany({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    data: body,
  });

  if (template.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/templates/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const template = await prisma.template.deleteMany({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (template.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
```

**Step 3: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add app/api/templates/route.ts app/api/templates/[id]/route.ts
git commit -m "feat: add templates CRUD API endpoints"
```

---

## Phase 4: Dashboard UI Components

### Task 14: Create Sidebar Component

**Files:**
- Create: `components/dashboard/Sidebar.tsx`

**Step 1: Create sidebar component**

Create `components/dashboard/Sidebar.tsx`:

```typescript
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Package, FileText, Settings, CreditCard, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

interface SidebarProps {
  user: {
    name?: string | null;
    image?: string | null;
    plan: string;
  };
  remaining: number;
}

export function Sidebar({ user, remaining }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: '/dashboard', icon: Package, label: 'Moje ogłoszenia' },
    { href: '/dashboard/templates', icon: FileText, label: 'Szablony' },
    { href: '/dashboard/settings', icon: Settings, label: 'Ustawienia' },
    { href: '/dashboard/subscription', icon: CreditCard, label: 'Subskrypcja' },
  ];

  return (
    <aside className="w-60 bg-gray-50 dark:bg-gray-900 border-r h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <ShoppingBag className="h-8 w-8 text-orange-500" />
          <span className="font-bold text-lg">Marketplace AI</span>
        </Link>
      </div>

      {/* CTA Button */}
      <div className="px-4 mb-6">
        <Button
          size="lg"
          className="w-full bg-orange-500 hover:bg-orange-600"
          onClick={() => router.push('/')}
        >
          <Plus className="mr-2 h-5 w-5" />
          Nowe ogłoszenie
        </Button>
      </div>

      {/* Navigation */}
      <nav className="px-4 space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg transition
                ${isActive
                  ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
              {item.label === 'Subskrypcja' && user.plan === 'FREE' && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Free
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          {user.image && (
            <Image
              src={user.image}
              alt={user.name || 'User'}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user.name}</p>
            <p className="text-xs text-gray-500">
              {remaining === Infinity ? '∞' : `${remaining}/5`} kredytów
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut({ callbackUrl: '/' })}
            title="Wyloguj"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
```

**Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add components/dashboard/Sidebar.tsx
git commit -m "feat: add dashboard sidebar component"
```

---

### Task 15: Create Stats Cards Component

**Files:**
- Create: `components/dashboard/StatsCards.tsx`

**Step 1: Create stats component**

Create `components/dashboard/StatsCards.tsx`:

```typescript
'use client';

import { PackageOpen, CheckCircle, TrendingUp } from 'lucide-react';

interface Stats {
  published: number;
  sold: number;
  totalEarnings: number;
}

interface StatsCardsProps {
  stats: Stats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatCard
        icon={PackageOpen}
        label="Wystawione"
        value={stats.published}
        iconColor="text-blue-500"
      />
      <StatCard
        icon={CheckCircle}
        label="Sprzedane"
        value={stats.sold}
        iconColor="text-green-500"
      />
      <StatCard
        icon={TrendingUp}
        label="Twój zysk"
        value={`${stats.totalEarnings.toFixed(0)} zł`}
        iconColor="text-orange-500"
        subtitle="Dzięki AI"
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  iconColor: string;
  subtitle?: string;
}

function StatCard({ icon: Icon, label, value, iconColor, subtitle }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-900`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add components/dashboard/StatsCards.tsx
git commit -m "feat: add dashboard stats cards component"
```

---

### Task 16: Create Ad Card Component

**Files:**
- Create: `components/dashboard/AdCard.tsx`

**Step 1: Create ad card component**

Create `components/dashboard/AdCard.tsx`:

```typescript
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PLATFORM_NAMES } from '@/lib/types';

interface AdCardProps {
  ad: {
    id: string;
    title: string;
    platform: string;
    status: string;
    images: { url: string }[];
    createdAt: Date;
    soldPrice?: number | null;
  };
  onStatusChange: (id: string, status: string, soldPrice?: number) => void;
  onDelete: (id: string) => void;
}

export function AdCard({ ad, onStatusChange, onDelete }: AdCardProps) {
  const router = useRouter();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      DRAFT: { label: 'Szkic', variant: 'secondary' as const },
      PUBLISHED: { label: 'Wystawione', variant: 'default' as const },
      SOLD: { label: 'Sprzedane', variant: 'default' as const },
      ARCHIVED: { label: 'Archiwum', variant: 'secondary' as const },
    };

    const config = variants[status as keyof typeof variants] || variants.DRAFT;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
      {/* Image Header */}
      <div className="relative aspect-video bg-gray-100">
        <Image
          src={ad.images[0]?.url || '/placeholder.png'}
          alt={ad.title}
          fill
          className="object-cover"
        />
        <Badge className="absolute top-2 left-2 bg-white/90 text-gray-900">
          {PLATFORM_NAMES[ad.platform] || ad.platform}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-base line-clamp-2 mb-2">
          {ad.title}
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>{formatDate(ad.createdAt)}</span>
          {getStatusBadge(ad.status)}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => router.push(`/dashboard/ad/${ad.id}`)}
          >
            <Eye className="w-4 h-4 mr-1" />
            Podgląd
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onStatusChange(ad.id, 'PUBLISHED')}>
                Oznacz jako wystawione
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const price = prompt('Za ile sprzedałeś? (zł)');
                  if (price) {
                    onStatusChange(ad.id, 'SOLD', parseFloat(price));
                  }
                }}
              >
                Oznacz jako sprzedane
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(ad.id)}
                className="text-red-600"
              >
                Usuń
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add components/dashboard/AdCard.tsx
git commit -m "feat: add dashboard ad card component"
```

---

## Phase 5: Dashboard Pages

### Task 17: Create Main Dashboard Page

**Files:**
- Create: `app/dashboard/page.tsx`
- Create: `app/dashboard/layout.tsx`

**Step 1: Create dashboard layout**

Create `app/dashboard/layout.tsx`:

```typescript
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { checkAndResetCredits, getRemainingCredits } from "@/lib/credits";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Proactive credits reset
  const user = await checkAndResetCredits(session.user.id);
  const remaining = getRemainingCredits(user);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        user={{
          name: user.name,
          image: user.image,
          plan: user.plan,
        }}
        remaining={remaining}
      />
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
```

**Step 2: Create dashboard page**

Create `app/dashboard/page.tsx`:

```typescript
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // Fetch stats
  const [publishedCount, soldCount, earnings, ads] = await Promise.all([
    prisma.ad.count({
      where: { userId: session.user.id, status: 'PUBLISHED' }
    }),
    prisma.ad.count({
      where: { userId: session.user.id, status: 'SOLD' }
    }),
    prisma.ad.aggregate({
      where: { userId: session.user.id, status: 'SOLD' },
      _sum: { soldPrice: true }
    }),
    prisma.ad.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        title: true,
        platform: true,
        status: true,
        images: true,
        createdAt: true,
        soldPrice: true,
      },
    }),
  ]);

  const stats = {
    published: publishedCount,
    sold: soldCount,
    totalEarnings: earnings._sum.soldPrice || 0,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Witaj, {session.user.name}!</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Zarządzaj swoimi ogłoszeniami i śledź sprzedaż
        </p>
      </div>

      <StatsCards stats={stats} />

      <DashboardClient initialAds={ads} />
    </div>
  );
}
```

**Step 3: Create client component for interactive features**

Create `app/dashboard/DashboardClient.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { AdCard } from '@/components/dashboard/AdCard';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  platform: string;
  status: string;
  images: { url: string }[];
  createdAt: Date;
  soldPrice?: number | null;
}

interface DashboardClientProps {
  initialAds: Ad[];
}

export function DashboardClient({ initialAds }: DashboardClientProps) {
  const [ads, setAds] = useState(initialAds);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleStatusChange = async (id: string, status: string, soldPrice?: number) => {
    const response = await fetch(`/api/ads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, soldPrice }),
    });

    if (response.ok) {
      setAds(ads.map(ad => ad.id === id ? { ...ad, status, soldPrice } : ad));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno usunąć to ogłoszenie?')) return;

    const response = await fetch(`/api/ads/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setAds(ads.filter(ad => ad.id !== id));
    }
  };

  const handleExport = async () => {
    const response = await fetch('/api/ads/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adIds: selectedIds }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ogloszenia-${Date.now()}.csv`;
      a.click();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Twoje ogłoszenia ({ads.length})</h2>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={selectedIds.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Eksport CSV ({selectedIds.length})
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ads.map((ad) => (
          <AdCard
            key={ad.id}
            ad={ad}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {ads.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            Nie masz jeszcze żadnych ogłoszeń
          </p>
        </div>
      )}
    </div>
  );
}
```

**Step 4: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 5: Test dashboard**

Run: `npm run dev`
Navigate to: http://localhost:3000/dashboard
Expected: Redirects to signin (not logged in)

**Step 6: Commit**

```bash
git add app/dashboard/layout.tsx app/dashboard/page.tsx app/dashboard/DashboardClient.tsx
git commit -m "feat: add main dashboard page with stats and ads grid"
```

---

### Task 18: Create Templates Page

**Files:**
- Create: `app/dashboard/templates/page.tsx`
- Create: `components/dashboard/TemplateForm.tsx`

**Step 1: Create template form modal**

Create `components/dashboard/TemplateForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PlatformSelector } from '@/components/PlatformSelector';
import { ToneSelector } from '@/components/ToneSelector';
import { ConditionSegmentedControl } from '@/components/ConditionSegmentedControl';
import type { Platform, ToneStyle, ProductCondition, DeliveryOption } from '@/lib/types';

interface TemplateFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: any;
  mode: 'create' | 'edit';
  templateId?: string;
}

export function TemplateForm({ open, onClose, initialData, mode, templateId }: TemplateFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [platform, setPlatform] = useState<Platform>(initialData?.platform || 'olx');
  const [tone, setTone] = useState<ToneStyle>(initialData?.tone || 'friendly');
  const [condition, setCondition] = useState<ProductCondition>(
    initialData?.condition || 'używany, w dobrym stanie'
  );
  const [delivery, setDelivery] = useState<DeliveryOption[]>(
    initialData?.delivery || ['odbiór osobisty', 'wysyłka']
  );
  const [isDefault, setIsDefault] = useState(initialData?.isDefault || false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = mode === 'create' ? '/api/templates' : `/api/templates/${templateId}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          platform,
          tone,
          condition,
          delivery,
          isDefault,
        }),
      });

      if (!response.ok) throw new Error('Failed to save template');

      window.location.reload();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Błąd zapisu szablonu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nowy szablon' : 'Edytuj szablon'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="template-name">Nazwa szablonu</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="np. Moje ubrania na Vinted"
              required
              maxLength={50}
            />
          </div>

          <div>
            <Label>Platforma</Label>
            <PlatformSelector selected={platform} onChange={setPlatform} />
          </div>

          <div>
            <Label>Styl ogłoszenia</Label>
            <ToneSelector
              selected={tone}
              onChange={setTone}
              platform={platform}
            />
          </div>

          <div>
            <Label>Domyślny stan produktu</Label>
            <ConditionSegmentedControl
              selected={condition}
              onChange={setCondition}
            />
          </div>

          <div>
            <Label>Domyślne opcje dostawy</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={delivery.includes('odbiór osobisty')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setDelivery([...delivery, 'odbiór osobisty']);
                    } else {
                      setDelivery(delivery.filter(d => d !== 'odbiór osobisty'));
                    }
                  }}
                />
                <span>Odbiór osobisty</span>
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={delivery.includes('wysyłka')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setDelivery([...delivery, 'wysyłka']);
                    } else {
                      setDelivery(delivery.filter(d => d !== 'wysyłka'));
                    }
                  }}
                />
                <span>Wysyłka</span>
              </label>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={isDefault}
                onCheckedChange={(checked) => setIsDefault(checked as boolean)}
              />
              <span className="text-sm">
                Ustaw jako domyślny szablon (wypełni formularz automatycznie)
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Anuluj
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Zapisywanie…' : mode === 'create' ? 'Utwórz szablon' : 'Zapisz zmiany'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

**Step 2: Create templates page**

Create `app/dashboard/templates/page.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TemplateForm } from '@/components/dashboard/TemplateForm';
import { Plus, Edit, Trash, Star } from 'lucide-react';
import { PLATFORM_NAMES, TONE_STYLE_NAMES } from '@/lib/types';

interface Template {
  id: string;
  name: string;
  platform: string;
  tone: string;
  condition: string;
  delivery: string[];
  isDefault: boolean;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const res = await fetch('/api/templates');
    const data = await res.json();
    setTemplates(data.templates);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno usunąć ten szablon?')) return;

    await fetch(`/api/templates/${id}`, { method: 'DELETE' });
    fetchTemplates();
  };

  if (loading) return <div>Ładowanie…</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Szablony</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Zapisz często używane ustawienia, aby przyspieszyć tworzenie ogłoszeń
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 w-4 h-4" />
          Nowy szablon
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Nie masz jeszcze żadnych szablonów
          </p>
          <Button onClick={() => setShowForm(true)}>
            Utwórz pierwszy szablon
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-lg border p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  {template.isDefault && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Domyślny
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingTemplate(template);
                      setShowForm(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(template.id)}
                  >
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Platforma:</span>
                  <span className="font-medium">{PLATFORM_NAMES[template.platform]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Styl:</span>
                  <span className="font-medium">{TONE_STYLE_NAMES[template.tone]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Stan:</span>
                  <span className="font-medium">{template.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dostawa:</span>
                  <span className="font-medium">{template.delivery.join(', ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <TemplateForm
          open={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingTemplate(null);
          }}
          mode={editingTemplate ? 'edit' : 'create'}
          initialData={editingTemplate || undefined}
          templateId={editingTemplate?.id}
        />
      )}
    </div>
  );
}
```

**Step 3: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add app/dashboard/templates/page.tsx components/dashboard/TemplateForm.tsx
git commit -m "feat: add templates management page"
```

---

## Phase 6: Soft-Wall Integration

### Task 19: Add Soft-Wall Modal to Result Page

**Files:**
- Modify: `app/page.tsx` (add soft-wall save logic)
- Create: `components/AuthModal.tsx`

**Step 1: Create auth modal component**

Create `components/AuthModal.tsx`:

```typescript
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            🎉 Zapisz to ogłoszenie i odbierz 4 darmowe generacje!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-center text-gray-600 dark:text-gray-400">
            Zaloguj się w 5 sekund, aby nie stracić tego opisu
          </p>

          <div className="space-y-3">
            <Button
              className="w-full"
              size="lg"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Zaloguj przez Google
            </Button>

            <Button
              variant="outline"
              className="w-full"
              size="lg"
              onClick={() => signIn('resend', { callbackUrl: '/dashboard' })}
            >
              📧 Zaloguj przez email
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Nie wysyłamy spamu. Możesz się wypisać w każdej chwili.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Step 2: Modify main page to save to IndexedDB**

Modify `app/page.tsx` - add after successful generation (logged out user):

```typescript
import { savePendingAd } from '@/lib/storage-helper';

// In the generate ad handler, after receiving response with requiresAuth: true
if (response.requiresAuth) {
  // Save to IndexedDB
  await savePendingAd({
    title: response.title,
    description: response.description,
    images: response.imageAnalysis,
    parameters: {
      platform,
      condition,
      tone: selectedTone,
      delivery,
      productName,
      notes,
      priceType,
    },
    priceMin: response.priceMin,
    priceMax: response.priceMax,
    platform,
    timestamp: Date.now(),
  });

  // Show auth modal
  setShowAuthModal(true);
}
```

**Step 3: Add auth modal state and component**

Add to `app/page.tsx`:

```typescript
const [showAuthModal, setShowAuthModal] = useState(false);

// In JSX:
<AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
```

**Step 4: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 5: Commit**

```bash
git add app/page.tsx components/AuthModal.tsx
git commit -m "feat: add soft-wall auth modal with IndexedDB save"
```

---

### Task 20: Add Dashboard Pending Ad Handler

**Files:**
- Modify: `app/dashboard/page.tsx`

**Step 1: Add pending ad handler to dashboard**

Add to `app/dashboard/page.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getPendingAd, clearPendingAd } from '@/lib/storage-helper';
import { toast } from 'sonner'; // or your toast library

export function PendingAdHandler() {
  const { data: session } = useSession();

  useEffect(() => {
    async function handlePendingAd() {
      if (!session?.user) return;

      const pending = await getPendingAd();
      if (!pending) return;

      try {
        // Save to database
        const response = await fetch('/api/ads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pending),
        });

        if (response.ok) {
          await clearPendingAd();
          toast.success('Twoje ogłoszenie zostało zapisane!');
        }
      } catch (error) {
        console.error('Failed to save pending ad:', error);
      }
    }

    handlePendingAd();
  }, [session]);

  return null;
}
```

**Step 2: Add component to dashboard layout**

Modify `app/dashboard/layout.tsx`:

```typescript
import { PendingAdHandler } from './PendingAdHandler';

// In JSX:
<main className="flex-1 p-6 overflow-auto">
  <PendingAdHandler />
  {children}
</main>
```

**Step 3: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Test soft-wall flow**

1. Generate ad as guest
2. Click "Zaloguj przez Google"
3. Complete OAuth
4. Verify redirect to dashboard
5. Verify ad appears in list

**Step 5: Commit**

```bash
git add app/dashboard/page.tsx app/dashboard/PendingAdHandler.tsx app/dashboard/layout.tsx
git commit -m "feat: add pending ad handler for soft-wall flow"
```

---

## Phase 7: Final Polish

### Task 21: Add Auth Pages

**Files:**
- Create: `app/auth/signin/page.tsx`
- Create: `app/auth/error/page.tsx`

**Step 1: Create signin page**

Create `app/auth/signin/page.tsx`:

```typescript
'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <ShoppingBag className="h-12 w-12 text-orange-500" />
            <span className="text-2xl font-bold">Marketplace AI</span>
          </Link>
          <h2 className="text-3xl font-bold">Zaloguj się</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Utwórz profesjonalne ogłoszenia w sekundę
          </p>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full"
            size="lg"
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              {/* Google icon SVG */}
            </svg>
            Zaloguj przez Google
          </Button>

          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => signIn('resend', { callbackUrl: '/dashboard' })}
          >
            📧 Zaloguj przez email
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Logując się akceptujesz naszą{' '}
          <Link href="/privacy" className="text-orange-500 hover:underline">
            politykę prywatności
          </Link>
        </p>
      </div>
    </div>
  );
}
```

**Step 2: Create error page**

Create `app/auth/error/page.tsx`:

```typescript
'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages = {
    Configuration: 'Wystąpił problem z konfiguracją. Skontaktuj się z supportem.',
    AccessDenied: 'Odmowa dostępu. Spróbuj ponownie.',
    Verification: 'Link weryfikacyjny wygasł. Poproś o nowy.',
    Default: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.',
  };

  const message = errorMessages[error as keyof typeof errorMessages] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full text-center p-8">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Błąd logowania</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/auth/signin">Spróbuj ponownie</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Wróć na stronę główną</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add app/auth/signin/page.tsx app/auth/error/page.tsx
git commit -m "feat: add auth signin and error pages"
```

---

### Task 22: Update Environment Variables Documentation

**Files:**
- Modify: `.env.example`
- Modify: `README.md`

**Step 1: Update .env.example**

Replace `.env.example`:

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[Run: openssl rand -base64 32]"

# Google OAuth (https://console.cloud.google.com)
GOOGLE_CLIENT_ID="[YOUR_CLIENT_ID].apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="[YOUR_CLIENT_SECRET]"

# Resend (https://resend.com) - Optional for email login
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"

# OpenAI
OPENAI_API_KEY="sk-proj-[YOUR_KEY]"

# Supabase (for Storage)
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_ANON_KEY]"
```

**Step 2: Update README.md setup section**

Add to README.md:

```markdown
## Setup

### 1. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Setup environment variables

Copy \`.env.example\` to \`.env.local\` and fill in:

- **Database**: Create Supabase project and copy connection strings
- **NextAuth Secret**: Run \`openssl rand -base64 32\`
- **Google OAuth**: Setup at https://console.cloud.google.com
- **Resend** (optional): Get API key from https://resend.com
- **OpenAI**: Get API key from https://platform.openai.com
- **Supabase**: Copy URL and anon key from project settings

### 3. Setup database

\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

### 4. Run development server

\`\`\`bash
npm run dev
\`\`\`

Open http://localhost:3000
```

**Step 3: Commit**

```bash
git add .env.example README.md
git commit -m "docs: update environment variables and setup instructions"
```

---

### Task 23: Final Testing Checklist

**No files modified - testing only**

**Step 1: Test auth flow**

- [ ] Visit /auth/signin → Google login works
- [ ] Visit /auth/signin → Email login works (if configured)
- [ ] Successful login redirects to /dashboard
- [ ] Logout works (from sidebar)

**Step 2: Test soft-wall flow**

- [ ] Generate ad as guest → shows auth modal
- [ ] Click "Zaloguj przez Google" → OAuth flow
- [ ] After login, ad appears in dashboard
- [ ] IndexedDB cleared after save

**Step 3: Test dashboard**

- [ ] Stats show correct numbers
- [ ] Ads grid displays correctly
- [ ] Ad cards show platform badges
- [ ] Status change works (Published/Sold/Archived)
- [ ] Delete confirmation works
- [ ] CSV export downloads file

**Step 4: Test templates**

- [ ] Create template → saves successfully
- [ ] Edit template → updates correctly
- [ ] Delete template → removes from list
- [ ] Set default → only one can be default
- [ ] Default template auto-fills form on /

**Step 5: Test credits**

- [ ] Dashboard shows correct remaining credits
- [ ] Generate 5 ads → credits depleted
- [ ] 6th generation shows error modal
- [ ] Manually change `creditsReset` date → credits reset

**Step 6: Test responsive design**

- [ ] Dashboard sidebar collapses on mobile
- [ ] Stats cards stack vertically
- [ ] Ad cards responsive grid
- [ ] Templates page responsive
- [ ] Forms work on mobile

**Step 7: Verify no errors**

Run: `npm run build`
Expected: Build succeeds with no errors

Run: `npx tsc --noEmit`
Expected: No TypeScript errors

**Step 8: Document any issues found**

Create `docs/known-issues.md` if needed

---

## Deployment Checklist

### Task 24: Prepare for Production

**Files:**
- Verify all environment variables
- Test production build

**Step 1: Verify environment variables**

Check all required vars are in Vercel:
- DATABASE_URL (Supabase)
- DIRECT_URL (Supabase)
- NEXTAUTH_URL (production domain)
- NEXTAUTH_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- RESEND_API_KEY (optional)
- OPENAI_API_KEY
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

**Step 2: Test production build locally**

```bash
npm run build
npm start
```

Test all features in production mode locally

**Step 3: Run database migration on production**

```bash
DATABASE_URL="[PRODUCTION_URL]" npx prisma migrate deploy
```

**Step 4: Deploy to Vercel**

```bash
git push origin main
```

Verify deployment succeeds in Vercel dashboard

**Step 5: Test production deployment**

- [ ] Visit production URL
- [ ] Test OAuth login
- [ ] Test soft-wall flow
- [ ] Test dashboard features
- [ ] Test templates
- [ ] Monitor Vercel logs for errors

**Step 6: Setup Supabase Storage bucket**

1. Go to Supabase Dashboard → Storage
2. Create bucket: `ad-images`
3. Set to public
4. Add RLS policies (see design doc)

**Step 7: Monitor first users**

- Check Prisma Studio for database entries
- Monitor Supabase Storage usage
- Check OpenAI API usage
- Verify no errors in Vercel logs

**Step 8: Final commit**

```bash
git add .
git commit -m "chore: production deployment complete"
git push origin main
```

---

## Success Metrics

After implementation, track:

- **Conversion Rate**: % of guests who sign up after seeing auth modal
- **Activation**: % of new users who generate 2+ ads in first session
- **Retention D7**: % of users who return within 7 days
- **Credits Usage**: Average credits used per FREE user
- **Template Adoption**: % of users who create templates
- **CSV Export**: % of users who export ads

**Target Metrics:**
- Conversion: 30-40%
- Activation: 60%+
- Retention D7: 30%+
- Credits: 3-4 avg per user/month
- Templates: 20%+ adoption

---

## Plan Complete

This implementation plan covers all tasks from database setup to production deployment. Each task is broken down into bite-sized steps (2-5 minutes each) with clear commands, expected output, and frequent commits.

**Total estimated time:** 5-7 days for experienced developer

**Key technologies mastered:**
- NextAuth v5 with Prisma adapter
- Supabase PostgreSQL + Storage
- IndexedDB for soft-wall persistence
- Dashboard with stats aggregations
- Templates CRUD with default handling
- CSV export generation

**Next steps:** Choose execution approach (subagent-driven or parallel session).
