# Authentication & Dashboard Design Document

**Date:** 2026-03-01
**Author:** Claude Code
**Status:** Approved (Revised)
**Version:** 1.1

**Revision Notes (v1.1):**
- Fixed: IndexedDB instead of localStorage for soft-wall (5MB+ images)
- Fixed: NextAuth v5 API syntax (auth() instead of getServerSession)
- Added: idb-keyval library for simple IndexedDB wrapper

## Executive Summary

This document outlines the complete design for adding authentication, user dashboard, and templates management to the Marketplace Assistant application. The implementation follows a Product-Led Growth strategy with a "soft wall" approach to maximize conversion while maintaining excellent UX.

**Key Features:**
- Social login (Google, Apple) + Magic Link email authentication
- User dashboard with ad history, statistics, and status tracking
- Template system for quick ad generation
- CSV export functionality
- Credit system (5 free ads/month, unlimited for Premium)
- Supabase PostgreSQL + Prisma ORM
- NextAuth v5 for authentication

**Target Timeline:** 5-7 days implementation

---

## Critical Technical Fixes (v1.1)

### 1. IndexedDB for Soft-Wall (Not localStorage)

**Problem Identified:**
- localStorage has strict 5MB limit per domain
- 8 images in Base64 format = 30-50 MB of data
- Attempting to save exceeds quota → `QuotaExceededError` → user loses ad

**Solution:**
- Use IndexedDB via `idb-keyval` library (600 bytes gzipped)
- No practical size limit (50MB+ easily supported)
- Async API (better performance than localStorage)
- Same simple API: `set()`, `get()`, `del()`

**Impact:** Prevents critical bug that would cause 100% failure rate on soft-wall flow.

### 2. NextAuth v5 API Syntax (Not v4)

**Problem Identified:**
- Original design used NextAuth v4 API (`getServerSession(authOptions)`)
- NextAuth v5 has breaking changes to API

**Solution:**
- Create `auth.ts` in root with single config export
- Use `auth()` function everywhere (no authOptions argument)
- Export `handlers` for API route instead of manual NextAuth() call

**Impact:** Prevents TypeScript errors and runtime failures. v5 is simplified and more maintainable.

**Migration Required:**
```typescript
// ❌ OLD (v4):
const session = await getServerSession(authOptions);

// ✅ NEW (v5):
import { auth } from "@/auth";
const session = await auth();
```

---

## 1. Architecture & Tech Stack

### 1.1 Technology Decisions

**Authentication:** NextAuth v5 (Auth.js)
- Industry-standard, battle-tested
- Built-in support for Google, Apple, Email providers
- Database session strategy for security
- Prisma adapter for seamless integration

**Database:** Supabase PostgreSQL
- 500 MB database + unlimited compute (free tier)
- Superior to Vercel Postgres (60h compute limit)
- Easy Prisma integration via connection string
- Bonus: Supabase Storage for images (1 GB free)

**ORM:** Prisma
- Type-safe database access
- Automatic migrations
- Excellent TypeScript integration
- Built-in connection pooling

**Image Storage:** Supabase Storage
- 1 GB free tier (~2000-5000 images)
- Public URL access
- CDN-backed for performance
- Row Level Security (RLS) for access control

**Deployment:** Vercel
- Zero-config Next.js optimization
- Free tier: 100 GB bandwidth/month
- Serverless Functions included
- Built-in analytics

**Browser Storage:** IndexedDB (via idb-keyval)
- No size limit (vs 5MB localStorage limit)
- Async API (better performance)
- Only 600 bytes gzipped
- Critical for soft-wall flow with 8 images (50MB+ Base64)

### 1.2 User Journey - "Soft Wall" Flow

**New User (Golden Path):**

1. User lands on `/` (existing form page)
2. Uploads images, fills form, clicks "Generuj ogłoszenie"
3. Sees beautiful result on `/result` page
4. After clicking "Kopiuj" or 3 seconds → **Modal appears:**
   ```
   🎉 Zapisz to ogłoszenie i odbierz 4 darmowe generacje!

   [Zaloguj przez Google] [Zaloguj przez Apple]

   Zajmuje to 5 sekund →
   ```
5. User clicks Google OAuth → NextAuth handles login
6. **Redirect to `/dashboard`** - their ad is already saved (from IndexedDB)

**Returning User:**

1. Navbar shows: `[Logo] ... [Kredyty: 3/5] [Avatar + Menu]`
2. Clicks "Nowe ogłoszenie" → redirects to `/`
3. Form pre-filled with default template (if exists)
4. Generates → auto-saves to database → redirect to `/dashboard`

**Technical Implementation - Soft Wall:**

**Critical Fix: IndexedDB instead of localStorage**

Problem: localStorage has 5MB limit - 8 Base64 images easily exceed this.
Solution: Use IndexedDB via `idb-keyval` library (tiny wrapper, async API).

```bash
npm install idb-keyval
```

```typescript
// lib/storage-helper.ts
import { set, get, del } from 'idb-keyval';

export async function savePendingAd(adData: any) {
  await set('pendingAd', adData);
}

export async function getPendingAd() {
  return await get('pendingAd');
}

export async function clearPendingAd() {
  await del('pendingAd');
}
```

```typescript
// Before showing modal, save to IndexedDB
import { savePendingAd } from '@/lib/storage-helper';

await savePendingAd({
  title, description, images, parameters, priceMin, priceMax,
  platform, timestamp: Date.now()
});

// After OAuth redirect to /dashboard
import { getPendingAd, clearPendingAd } from '@/lib/storage-helper';

useEffect(() => {
  async function handlePendingAd() {
    const pending = await getPendingAd();
    if (pending && session?.user) {
      // Upload images to Supabase Storage
      // POST /api/ads (save to DB)
      await clearPendingAd();
      toast.success('Twoje ogłoszenie zostało zapisane!');
    }
  }
  handlePendingAd();
}, [session]);
```

**Why this works:**
- User experiences value BEFORE registration (PLG principle)
- OAuth redirect clears React state, but IndexedDB persists
- IndexedDB has no practical size limit (50MB+ easily supported)
- Images temporarily in Base64, uploaded to storage after login
- High conversion rate (industry standard: 30-50% for soft walls)
- `idb-keyval` is only 600 bytes gzipped (negligible bundle impact)

### 1.3 Routing Structure

```
/                          → Landing page (existing form + generator)
/auth/signin               → NextAuth login page (custom styled)
/auth/error                → NextAuth error handling
/dashboard                 → Main hub (protected route)
/dashboard/ad/[id]         → Ad detail page (reuse AdResult components)
/dashboard/templates       → Templates management
/dashboard/settings        → User settings (future)
/dashboard/subscription    → Premium upgrade page (future)

/api/auth/[...nextauth]    → NextAuth endpoints
/api/generate-ad           → Existing endpoint (extended for DB save)
/api/ads                   → GET (list), POST (save pending ad)
/api/ads/[id]              → GET, PATCH (status), DELETE
/api/ads/export            → POST (CSV export selected ads)
/api/templates             → GET (list), POST (create)
/api/templates/[id]        → PATCH, DELETE
```

**Middleware Protection:**

```typescript
// middleware.ts
export const config = {
  matcher: ['/dashboard/:path*', '/api/ads/:path*', '/api/templates/:path*']
}
// Redirects to /auth/signin if not authenticated
```

### 1.4 Database Schema

**Complete Prisma Schema:**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
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
  image         String?     // avatar from Google/Apple
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
  images        Json        // [{url: "https://...", quality: "dobra", suggestions: "..."}]
  parameters    Json        // {condition, tone, delivery, productName, notes, priceType}
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt(sort: Desc)])
  @@index([userId, status])
}

model Template {
  id            String            @id @default(cuid())
  userId        String
  name          String            // "Moje ubrania na Vinted"
  platform      Platform
  tone          ToneStyle
  condition     ProductCondition
  delivery      Json              // DeliveryOption[]
  isDefault     Boolean           @default(false)
  createdAt     DateTime          @default(now())

  user          User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, name])
  @@index([userId, isDefault])
}

enum Plan {
  FREE      // 5 ads/month
  PREMIUM   // unlimited (39 zł/miesiąc)
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

**Schema Design Rationale:**

1. **Account/Session/VerificationToken:** Required by NextAuth adapter
2. **User.creditsUsed + creditsReset:** Lazy reset pattern (no CRON jobs needed)
3. **Ad.images as Json:** Array of `{url, quality, suggestions}` objects
4. **Ad.parameters as Json:** Flexible storage for form inputs
5. **Template.isDefault:** Only one template can be default (auto-fills form)
6. **Indexes:** Optimized for common queries (user's ads sorted by date, filtered by status)

### 1.5 Credits System - Proactive Reset

**Problem:** User doesn't know credits refreshed until they try to generate.

**Solution:** Reset credits on dashboard page load (not just on generate attempt).

**Implementation:**

```typescript
// lib/credits.ts
export async function checkAndResetCredits(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      creditsUsed: true,
      creditsReset: true,
      plan: true,
    }
  });

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
      }
    });

    return updatedUser;
  }

  return user;
}

export function getRemainingCredits(user: { plan: string, creditsUsed: number }) {
  if (user.plan === 'PREMIUM') return Infinity;
  return Math.max(0, 5 - user.creditsUsed);
}
```

**Trigger Points:**

1. **Dashboard page load** (primary) - User sees updated credits immediately
2. **API /generate-ad** (backup) - In case user goes directly to form
3. **Navbar component** (display only) - Shows current state on every page

**Benefits:**
- ✅ User sees "🎉 Masz 5 nowych kredytów!" toast when returning after month
- ✅ No CRON jobs needed (lazy evaluation, but smart triggers)
- ✅ Zero infrastructure costs
- ✅ Works in serverless environment

---

## 2. Dashboard UI/UX Design

### 2.1 Layout Structure

**Desktop (≥1024px):**

```
┌─────────────────────────────────────────────────────────┐
│ [Sidebar 240px]    │ [Main Content - flexible]          │
│                    │                                     │
│ Logo + Brand       │ Header: "Witaj, Jan!"              │
│                    │ [3 Stats Cards: Published|Sold|Earnings] │
│ [+ Nowe ogłoszenie]│                                     │
│   (Orange CTA)     │ Twoje ogłoszenia (12)              │
│                    │ [Filters: Status▼] [Export CSV]    │
│ 📦 Moje ogłoszenia │                                     │
│ 📋 Szablony        │ [3-column Grid: Ad Cards]          │
│ ⚙️ Ustawienia      │ ┌──────┐ ┌──────┐ ┌──────┐        │
│ 💳 Subskrypcja     │ │ Ad 1 │ │ Ad 2 │ │ Ad 3 │        │
│                    │ │Img   │ │ Img  │ │ Img  │        │
│ ─────────────      │ │OLX   │ │Vinted│ │Allegro        │
│ [Avatar] Jan       │ └──────┘ └──────┘ └──────┘        │
│ 3/5 kredytów       │ [Pagination/Load More]             │
│ Wyloguj           │                                     │
└─────────────────────────────────────────────────────────┘
```

**Mobile (<1024px):**

```
┌────────────────────────────┐
│ [☰] Logo  [Credits] [Avatar]│ ← Sticky Navbar
├────────────────────────────┤
│ Witaj, Jan!                │
│                            │
│ [Stat Card: Published]     │
│ [Stat Card: Sold]          │
│ [Stat Card: Earnings]      │
│                            │
│ Twoje ogłoszenia           │
│ [+ Nowe] [Filter▼] [Export]│
│                            │
│ [Ad Card 1 - Full Width]   │
│ [Ad Card 2 - Full Width]   │
│ [Ad Card 3 - Full Width]   │
└────────────────────────────┘
```

### 2.2 Component Breakdown

**Sidebar (`components/dashboard/Sidebar.tsx`):**
- Sticky positioning (`sticky top-0 h-screen`)
- Logo + brand at top
- Large orange CTA button "Nowe ogłoszenie"
- Navigation menu with icons (lucide-react)
- User profile dropdown at bottom (avatar, name, credits, logout)
- Plan badge (FREE/PREMIUM) next to Subskrypcja link

**Stats Cards (`components/dashboard/StatsCards.tsx`):**
- 3 cards in responsive grid (`grid-cols-1 md:grid-cols-3`)
- Icons: PackageOpen (published), CheckCircle (sold), TrendingUp (earnings)
- Data fetched from database aggregations
- "Twój zysk" card shows total `SUM(soldPrice)` with subtitle "Dzięki AI"

**Ad Card (`components/dashboard/AdCard.tsx`):**
- Aspect-ratio image header with platform badge overlay
- Title (2-line clamp for overflow)
- Date + Status badge
- Action buttons: "Podgląd" (primary), Dropdown menu (edit status, delete)
- Hover effect: subtle shadow lift
- Click on card → navigate to `/dashboard/ad/[id]`

**Filter Bar (`components/dashboard/FilterBar.tsx`):**
- Heading "Twoje ogłoszenia (count)"
- Status dropdown: ALL, DRAFT, PUBLISHED, SOLD, ARCHIVED
- Export CSV button (enabled only when ads selected)
- Responsive: stacks vertically on mobile

**Mobile Navigation:**
- Hamburger menu icon (visible only <1024px)
- Sheet component (slide from left) with same nav items as sidebar
- Credits badge visible in top navbar

### 2.3 Ad Detail Page (`/dashboard/ad/[id]`)

**Layout:**
- Back button to dashboard
- Reuse existing `AdResult` components (AdResultMain, AdResultMeta)
- Enhanced with status controls:
  - Dropdown: "Oznacz jako wystawione/sprzedane/archiwum"
  - Input: "Za ile sprzedałeś?" (shows when marking as sold)
- Sticky action bar at bottom:
  - "Regeneruj" (costs 1 credit, creates new version)
  - "Kopiuj wszystko" (title + description to clipboard)
  - "Usuń" (destructive action, shows confirmation)

**Implementation Note:**
Maximize code reuse. The existing `AdResult.tsx` already has perfect layout for displaying generated ads. Just add props for `showStatusControls` and callback handlers.

---

## 3. API Endpoints & Data Flow

### 3.1 NextAuth v5 Configuration

**IMPORTANT: NextAuth v5 (Auth.js) has different API than v4**

**File:** `auth.ts` (root of project)

```typescript
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
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
    Apple({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
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

**File:** `app/api/auth/[...nextauth]/route.ts`

```typescript
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

**Usage in API routes:**

```typescript
import { auth } from "@/auth"; // NOT getServerSession anymore

export async function GET(req: Request) {
  const session = await auth(); // Simple, no authOptions argument

  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ... rest of handler
}
```

**Usage in Server Components:**

```typescript
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) redirect('/auth/signin');

  // ... rest of component
}
```

**Key Differences from v4:**
- ✅ No more `authOptions` object passed everywhere
- ✅ Single `auth()` function works in API routes, Server Components, middleware
- ✅ Simpler import: `import { auth } from "@/auth"`
- ✅ Provider imports changed: `from "next-auth/providers/google"` → `from "next-auth/providers/google"`
- ✅ Export `handlers` for API route instead of creating handler manually

### 3.2 Generate Ad Endpoint (Extended)

**File:** `app/api/generate-ad/route.ts`

**Changes:**
1. Check if user is authenticated using NextAuth v5 `auth()`
2. If YES: Check credits, generate, save to DB, increment credits, return `adId`
3. If NO: Generate only, return `requiresAuth: true` (trigger modal)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth"; // NextAuth v5
import { generateAd } from "@/lib/openai";
import { checkAndResetCredits } from "@/lib/credits";
import { prisma } from "@/lib/prisma";
import { adRequestSchema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  try {
    const session = await auth(); // NextAuth v5 syntax
    const body = await req.json();

    // Walidacja Zod
    const validatedData = adRequestSchema.parse(body);

    // Opcja 1: Użytkownik ZALOGOWANY
    if (session?.user) {
      // Sprawdź i zresetuj kredyty jeśli minął miesiąc
      const user = await checkAndResetCredits(session.user.id);

      // Sprawdź limit kredytów
      if (user.plan === 'FREE' && user.creditsUsed >= 5) {
        return NextResponse.json(
          {
            error: 'Wykorzystałeś limit darmowych ogłoszeń. Przejdź na Premium!',
            code: 'CREDITS_EXCEEDED'
          },
          { status: 403 }
        );
      }

      // Generuj ogłoszenie przez OpenAI
      const result = await generateAd(validatedData);

      // Zapisz do bazy PRZED uploadem zdjęć (szybsza odpowiedź)
      const ad = await prisma.ad.create({
        data: {
          userId: user.id,
          platform: validatedData.platform,
          title: result.title,
          description: result.description,
          priceMin: result.priceMin,
          priceMax: result.priceMax,
          images: result.imageAnalysis, // Tymczasowo base64, update async
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

      // Inkrementuj creditsUsed
      await prisma.user.update({
        where: { id: user.id },
        data: { creditsUsed: { increment: 1 } }
      });

      // Async: Upload zdjęć do Supabase Storage (nie blokuj response)
      uploadImagesToStorage(ad.id, validatedData.images).catch(console.error);

      return NextResponse.json({
        ...result,
        adId: ad.id, // Zwróć ID do redirectu
        creditsRemaining: user.plan === 'PREMIUM' ? null : 5 - user.creditsUsed - 1,
      });
    }

    // Opcja 2: Użytkownik NIEZALOGOWANY (soft-wall)
    else {
      // Generuj ogłoszenie, ale NIE zapisuj
      const result = await generateAd(validatedData);

      return NextResponse.json({
        ...result,
        requiresAuth: true, // Signal do frontendu: pokaż modal logowania
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

### 3.3 Ads CRUD Endpoints

**GET /api/ads** - List user's ads

```typescript
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status'); // DRAFT, PUBLISHED, SOLD, ARCHIVED, ALL

  const where = {
    userId: session.user.id,
    ...(status && status !== 'ALL' ? { status: status as AdStatus } : {}),
  };

  const ads = await prisma.ad.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      platform: true,
      title: true,
      status: true,
      soldPrice: true,
      images: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ ads });
}
```

**POST /api/ads** - Save pending ad (after soft-wall login)

```typescript
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  const user = await checkAndResetCredits(session.user.id);
  if (user.plan === 'FREE' && user.creditsUsed >= 5) {
    return NextResponse.json({ error: 'Brak kredytów' }, { status: 403 });
  }

  const ad = await prisma.ad.create({
    data: {
      userId: user.id,
      ...body, // platform, title, description, etc.
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

**PATCH /api/ads/[id]** - Update ad status or soldPrice

```typescript
import { auth } from "@/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  await prisma.ad.updateMany({
    where: { id: params.id, userId: session.user.id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.soldPrice && { soldPrice: body.soldPrice }),
    },
  });

  return NextResponse.json({ success: true });
}
```

**DELETE /api/ads/[id]** - Delete ad + cleanup images

```typescript
import { auth } from "@/auth";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const ad = await prisma.ad.findFirst({
    where: { id: params.id, userId: session.user.id },
    select: { images: true }
  });

  if (!ad) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.ad.delete({ where: { id: params.id } });

  // Cleanup Supabase Storage (async, don't block)
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

### 3.4 CSV Export Endpoint

**POST /api/ads/export**

```typescript
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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

### 3.5 Templates CRUD

**GET /api/templates** - List user's templates

**POST /api/templates** - Create template
- If `isDefault: true`, set all other user's templates to `isDefault: false`

**PATCH /api/templates/[id]** - Update template
- Same logic for isDefault (only one can be default)

**DELETE /api/templates/[id]** - Delete template

(Full implementation details in code)

---

## 4. Templates Management

### 4.1 User Experience

**Two Ways to Create Templates:**

**A) From Dashboard (`/dashboard/templates` page):**
- User clicks "Szablony" in sidebar
- Sees grid of existing templates (cards with name, platform, tone, condition, delivery)
- Clicks "+ Nowy szablon" → Modal with full form
- Can edit/delete existing templates

**B) Quick Save from Form (`/` page):**
- User fills form on main page
- Clicks "Zapisz jako szablon" button/checkbox (below form)
- Modal: "Nazwij ten szablon: _______"
- Saves current form state as template

**Default Template:**
- Only one template can be marked as default (enforced in API)
- When user visits `/` page (logged in), form auto-fills with default template values
- Saves time for power users (e.g., handlarze who always sell clothes on Vinted)

### 4.2 Template Form Component

**File:** `components/dashboard/TemplateForm.tsx`

- Dialog modal (max-w-3xl, scrollable on mobile)
- Fields:
  - Template name (required, max 50 chars)
  - Platform selector (reuse existing component)
  - Tone selector (reuse existing component)
  - Condition selector (reuse existing component)
  - Delivery checkboxes (reuse existing component)
  - "Ustaw jako domyślny" checkbox
- Modes: `create` | `edit`
- On submit: POST/PATCH to `/api/templates`

### 4.3 Templates Page

**File:** `app/dashboard/templates/page.tsx`

- Heading: "Szablony" + description
- Button: "+ Nowy szablon" (opens TemplateForm modal)
- Grid layout (2 columns desktop, 1 column mobile)
- Empty state: "Nie masz jeszcze żadnych szablonów" + CTA button
- Template cards show:
  - Name + Star badge (if default)
  - Platform, Tone, Condition, Delivery (read-only view)
  - Edit and Delete buttons (dropdown or icons)

### 4.4 Auto-fill Main Form

**File:** `app/page.tsx` (modification)

```typescript
useEffect(() => {
  if (session?.user && !templatesLoaded) {
    fetch('/api/templates')
      .then(res => res.json())
      .then(data => {
        const defaultTemplate = data.templates.find(t => t.isDefault);
        if (defaultTemplate) {
          setPlatform(defaultTemplate.platform);
          setSelectedTone(defaultTemplate.tone);
          setCondition(defaultTemplate.condition);
          setDelivery(defaultTemplate.delivery);
        }
        setTemplatesLoaded(true);
      });
  }
}, [session, templatesLoaded]);
```

**UX Note:** Auto-fill happens silently on page load. User can override any field. This is convenience feature, not restriction.

---

## 5. Image Storage Strategy

### 5.1 Two-Phase Approach

**Phase 1: Generation (Guest or Logged-in)**
- Images uploaded as Base64 (existing implementation)
- Stored temporarily in browser memory
- Sent to OpenAI API for analysis

**Phase 2: Persistence (Logged-in only)**
- After saving ad to database, upload images to Supabase Storage
- Replace Base64 URLs with public Supabase URLs
- Update ad record in database with new URLs

**Why this approach?**
- Fast response time (don't wait for storage upload during generation)
- Base64 only lives in localStorage for 5-30 seconds (soft-wall flow)
- Database only stores lightweight URLs (not MB of Base64)
- Supabase Storage: 1 GB free = ~2000-5000 images

### 5.2 Supabase Storage Setup

**Bucket Configuration:**
- Name: `ad-images`
- Public access: Yes (ads are user-generated content, not sensitive)
- File size limit: 5 MB per image (enforced client-side)
- Path structure: `{userId}/{adId}/{timestamp}-{random}.jpg`

**Row Level Security (RLS) Policies:**

```sql
-- Users can upload to their own folder
CREATE POLICY "Users can upload own images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'ad-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Anyone can view (public bucket)
CREATE POLICY "Public images are viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'ad-images');
```

### 5.3 Upload Helper Function

**File:** `lib/storage.ts`

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

      // Upload to Supabase
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
        quality: (image as any).quality, // Preserve AI analysis
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

### 5.4 Background Upload Pattern

**In `/api/generate-ad/route.ts`:**

```typescript
// Save ad to DB with base64 images (fast)
const ad = await prisma.ad.create({ ... });

// Background upload (doesn't block response)
uploadImagesToStorage(ad.id, user.id, validatedData.images)
  .then(async (uploadedImages) => {
    // Update ad with Supabase URLs
    await prisma.ad.update({
      where: { id: ad.id },
      data: { images: uploadedImages }
    });
  })
  .catch(console.error);

// Return response immediately
return NextResponse.json({ ...result, adId: ad.id });
```

**Benefits:**
- User gets instant response (sub-1s after OpenAI)
- Images upload in background (2-5s for 8 images)
- If upload fails, ad still has base64 URLs (degraded but functional)

### 5.5 Image Cleanup on Delete

When user deletes ad, cleanup Supabase Storage:

```typescript
const ad = await prisma.ad.findFirst({ ... });
const images = ad.images as { url: string }[];

await prisma.ad.delete({ where: { id: params.id } });

// Async cleanup (don't block response)
images.forEach(async (img) => {
  if (img.url.includes('supabase')) {
    const path = img.url.split('/ad-images/')[1];
    await supabase.storage.from('ad-images').remove([path]);
  }
});
```

---

## 6. Deployment & Configuration

### 6.1 Environment Variables

**Required for Development (`.env.local`):**

```bash
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[openssl rand -base64 32]"

# OAuth Providers
GOOGLE_CLIENT_ID="[FROM_GOOGLE_CLOUD_CONSOLE].apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="[FROM_GOOGLE_CLOUD_CONSOLE]"
APPLE_CLIENT_ID="[FROM_APPLE_DEVELOPER]"
APPLE_CLIENT_SECRET="[FROM_APPLE_DEVELOPER]"

# Email (Optional)
EMAIL_SERVER="smtp://user:password@smtp.sendgrid.net:587"
EMAIL_FROM="noreply@marketplace-ai.pl"

# OpenAI
OPENAI_API_KEY="sk-proj-[YOUR_KEY]"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_ANON_KEY]"
```

### 6.2 OAuth Provider Setup

**Google OAuth:**

1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Enable Google+ API
4. Credentials → Create OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://marketplace-ai.pl/api/auth/callback/google`
7. Copy Client ID and Secret

**Apple OAuth (Optional):**

1. https://developer.apple.com/account
2. Certificates, IDs & Profiles → Identifiers
3. Register App ID with "Sign in with Apple"
4. Configure redirect URI: `https://marketplace-ai.pl/api/auth/callback/apple`
5. Generate Client Secret (requires .p8 private key)
6. Docs: https://next-auth.js.org/providers/apple

### 6.3 Prisma Setup

**Commands:**

```bash
# Install dependencies
npm install prisma @prisma/client @auth/prisma-adapter

# Initialize Prisma
npx prisma init

# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Push schema (for rapid prototyping)
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio
```

**Production Migration:**

```bash
# On Vercel, add to Build Command:
npx prisma migrate deploy && next build
```

### 6.4 Vercel Deployment

**Steps:**

1. Push to GitHub: `git push origin main`
2. Import repo in Vercel Dashboard
3. Framework: Next.js (auto-detected)
4. Add all environment variables from `.env.local`
5. Deploy

**Build Command (custom):**

```bash
npx prisma migrate deploy && next build
```

**Important:** Update `NEXTAUTH_URL` to production domain after first deploy.

### 6.5 Post-Deployment Checklist

**Security:**
- [ ] `NEXTAUTH_SECRET` is unique and secure (min 32 chars)
- [ ] OpenAI API key has usage limits set (e.g., $50/month)
- [ ] Supabase RLS policies are enabled
- [ ] Rate limiting on `/api/generate-ad` (optional: @upstash/ratelimit)

**Performance:**
- [ ] Prisma connection pooling enabled (`?pgbouncer=true`)
- [ ] Database indexes verified (see schema)
- [ ] Image optimization via Next.js Image component
- [ ] Vercel Analytics enabled

**Monitoring:**
- [ ] Test OAuth login (Google, Apple)
- [ ] Test soft-wall flow (guest → login → dashboard)
- [ ] Test credits reset (manually change `creditsReset` date)
- [ ] Test image upload to Supabase
- [ ] Test CSV export
- [ ] Test templates CRUD
- [ ] Mobile responsive testing

**Documentation:**
- [ ] Update README.md with new setup steps
- [ ] Document OAuth provider configuration
- [ ] Add database schema diagram
- [ ] Save backup of connection strings (password manager)

### 6.6 Cost Estimates

**Free Tier Limits:**
- Supabase: 500 MB DB + 1 GB storage + unlimited compute
- Vercel: 100 GB bandwidth/month
- OpenAI: Pay-as-you-go (~$0.0008 per generation with gpt-4o-mini)

**Expected Costs (1000 users, 50% FREE / 50% PREMIUM):**
- Infrastructure: $0 (free tiers sufficient)
- OpenAI API: ~$40-80/month (5000-10000 generations)
- **Total: ~150-300 zł/month**

**Revenue (500 PREMIUM @ 39 zł/month):**
- **19,500 zł/month**
- **Margin: ~99%**

---

## 7. Implementation Priorities

### Phase 1: Foundation (Days 1-2)
1. Prisma schema setup + migrations
2. NextAuth configuration (Google OAuth only for MVP)
3. Middleware protection for `/dashboard` routes
4. Credits system (lazy reset logic)

### Phase 2: Dashboard Core (Days 3-4)
5. Dashboard layout (Sidebar + responsive)
6. Stats cards (database aggregations)
7. Ad cards grid with filtering
8. Ad detail page (reuse AdResult components)
9. Status update functionality

### Phase 3: Storage & Export (Day 5)
10. Supabase Storage integration
11. Image upload helper + background job
12. CSV export endpoint
13. Soft-wall flow (localStorage → save after login)

### Phase 4: Templates (Day 6)
14. Templates CRUD API
15. Templates page UI
16. Template form modal
17. Auto-fill main form with default template

### Phase 5: Polish & Testing (Day 7)
18. Mobile responsive testing
19. Error handling + loading states
20. Toast notifications
21. OAuth error pages styling
22. Production deployment + testing

---

## 8. Success Metrics

**Conversion (Soft-Wall):**
- Target: 30-40% of guests convert to registered users
- Measure: `(Logins after generation) / (Total guest generations)`

**Activation (D1):**
- Target: 60% of new users generate 2nd ad within 24h
- Measure: `(Users with 2+ ads in first day) / (New signups)`

**Retention (D7):**
- Target: 30% of users return within 7 days
- Measure: `(Active users D7) / (Active users D1)`

**Premium Conversion:**
- Target: 10-15% of power users upgrade to Premium
- Measure: `(Premium users) / (Users with 5+ ads total)`

---

## Appendices

### A. Type Definitions

```typescript
// lib/types.ts additions

export type Plan = 'FREE' | 'PREMIUM';
export type AdStatus = 'DRAFT' | 'PUBLISHED' | 'SOLD' | 'ARCHIVED';

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  plan: Plan;
  creditsUsed: number;
  creditsReset: Date;
}

export interface Ad {
  id: string;
  userId: string;
  platform: Platform;
  title: string;
  description: string;
  status: AdStatus;
  soldPrice: number | null;
  priceMin: number | null;
  priceMax: number | null;
  images: ImageAnalysis[];
  parameters: AdParameters;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  userId: string;
  name: string;
  platform: Platform;
  tone: ToneStyle;
  condition: ProductCondition;
  delivery: DeliveryOption[];
  isDefault: boolean;
}

export interface AdParameters {
  condition: ProductCondition;
  tone: ToneStyle;
  delivery: DeliveryOption[];
  productName?: string;
  notes?: string;
  priceType: PriceType;
}
```

### B. Database Indexes Rationale

```prisma
// Ad model indexes
@@index([userId, createdAt(sort: Desc)])  // Dashboard: user's ads sorted by date
@@index([userId, status])                  // Filtering by status

// Template model indexes
@@index([userId, isDefault])               // Fast lookup for default template
```

These indexes optimize the most common queries:
- Loading dashboard ads (by user, sorted by date)
- Filtering ads by status
- Auto-filling form with default template

### C. Security Considerations

**Authentication:**
- Database sessions (more secure than JWT for this use case)
- OAuth providers handle password security (we never store passwords)
- Magic Link email as fallback (token expires in 24h)

**Authorization:**
- All API routes check `session?.user.id`
- Prisma queries filter by `userId` (users can only access their own data)
- Middleware protects entire `/dashboard` section

**Data Privacy:**
- Images stored in public Supabase bucket (user-generated content, not sensitive)
- User emails never exposed to other users
- No PII in analytics (use anonymous user IDs)

**Rate Limiting (Optional):**
```typescript
// Using @upstash/ratelimit
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
});

// In /api/generate-ad
const { success } = await ratelimit.limit(session.user.id);
if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
```

---

## Conclusion

This design document provides a complete, production-ready architecture for adding authentication, dashboard, and templates to the Marketplace Assistant application. The implementation follows industry best practices:

- **Product-Led Growth:** Soft-wall converts 30-40% of guests
- **Modern Stack:** NextAuth + Prisma + Supabase (battle-tested, scalable)
- **Cost-Efficient:** Free tiers cover first 1000 users (~99% margin)
- **User-Centric:** Fast, responsive, intuitive UX
- **Maintainable:** Type-safe, well-documented, modular code

The 7-day implementation timeline is realistic for an experienced developer, with clear phases and priorities. The system is designed to scale from MVP to 10,000+ users without architectural changes.

**Next Steps:** Create detailed implementation plan with task breakdown.
