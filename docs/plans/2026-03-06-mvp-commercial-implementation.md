# Marketplace Assistant — Plan Implementacji (Faza 1: MVP Komercyjne)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Przygotowanie Marketplace Assistant do komercyjnego uruchomienia: zmiana modelu AI, guest tracking, nowe tiery cenowe, integracja płatności Stripe.

**Architecture:** Cztery niezależne etapy wdrażane sekwencyjnie. Każdy etap ma testy, commit i weryfikację. Stripe integracja przez Checkout Sessions + Webhooks. Guest tracking przez UUID (localStorage) + IP hash (API). Nowe tiery w Prisma enum + credits logic.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Prisma/PostgreSQL, Stripe (nowy), OpenAI API (zmiana modelu), Zod, NextAuth v5

---

## Etap 1: Zmiana modelu AI (o4-mini → GPT-4.1 mini)

### Task 1.1: Zmiana modelu w konfiguracji OpenAI

**Files:**
- Modify: `lib/openai.ts:363` (zmiana nazwy modelu)
- Modify: `lib/openai.ts:375` (dostosowanie max_tokens — GPT-4.1 mini używa `max_tokens` zamiast `max_completion_tokens`)

**Step 1: Zmień model w `lib/openai.ts`**

W linii 363 zmień:
```typescript
// BYŁO:
model: "o4-mini",

// JEST:
model: "gpt-4.1-mini",
```

W linii 375 zmień parametr tokenów (GPT-4.1 mini używa `max_tokens`, nie `max_completion_tokens`):
```typescript
// BYŁO:
max_completion_tokens: 4000,

// JEST:
max_tokens: 4000,
```

**Step 2: Zweryfikuj działanie**

Run: `npm run build`
Expected: Build przechodzi bez błędów.

Następnie uruchom dev server i wygeneruj testowe ogłoszenie na każdej platformie (OLX, Allegro, Facebook, Vinted) z różnymi tonami. Porównaj jakość z poprzednimi wynikami.

**Step 3: Commit**

```bash
git add lib/openai.ts
git commit -m "feat(ai): switch from o4-mini to gpt-4.1-mini model

Reduces API costs by ~60-65% while maintaining comparable quality.
GPT-4.1 mini is a generative model (not reasoning), better suited
for content generation tasks. Uses max_tokens instead of
max_completion_tokens."
```

---

### Task 1.2: Aktualizacja dokumentacji i typów

**Files:**
- Modify: `CLAUDE.md` (sekcja AI Model Configuration)
- Modify: `.env.example` (komentarz o modelu)

**Step 1: Zaktualizuj CLAUDE.md**

W sekcji "## AI Model Configuration" zmień:
```markdown
The app uses OpenAI's `gpt-4.1-mini` model with:
- `response_format: { type: "json_object" }` for structured output
- `max_tokens: 4000` for comprehensive single-tone listings
```

**Step 2: Zaktualizuj komentarz w `.env.example`**

Zmień komentarz przy `OPENAI_API_KEY`:
```
# OpenAI API (requires GPT-4.1 mini access with vision)
OPENAI_API_KEY=sk-your-api-key-here
```

**Step 3: Commit**

```bash
git add CLAUDE.md .env.example
git commit -m "docs: update AI model references to gpt-4.1-mini"
```

---

## Etap 2: Guest Tracking (3-warstwowa identyfikacja)

### Task 2.1: Stworzenie guest tracking service (backend)

**Files:**
- Create: `lib/guest-tracking.ts`
- Modify: `prisma/schema.prisma` (nowy model GuestUsage)

**Step 1: Dodaj model GuestUsage do schematu Prisma**

W `prisma/schema.prisma` dodaj po modelu Template (po linii ~103):

```prisma
model GuestUsage {
    id            String   @id @default(cuid())
    guestId       String
    ipHash        String
    generationsUsed Int    @default(0)
    firstUsedAt   DateTime @default(now())
    lastUsedAt    DateTime @updatedAt

    @@unique([guestId])
    @@index([ipHash])
}
```

**Step 2: Uruchom migrację Prisma**

Run: `npx prisma migrate dev --name add-guest-usage`
Expected: Migration applied successfully.

**Step 3: Stwórz `lib/guest-tracking.ts`**

```typescript
import { prisma } from "./prisma";
import { createHash } from "crypto";

// Guest limits
const GUEST_MAX_GENERATIONS_PER_UUID = 3;
const GUEST_MAX_GENERATIONS_PER_IP_24H = 5;
const GUEST_MAX_IMAGES = 1;

/**
 * Hash IP address (one-way, RODO-safe)
 */
export function hashIP(ip: string): string {
    return createHash("sha256")
        .update(ip + (process.env.AUTH_SECRET || "salt"))
        .digest("hex");
}

/**
 * Check if guest has remaining generations
 * Returns: { allowed: boolean, reason?: string, remainingByUuid: number, remainingByIp: number }
 */
export async function checkGuestLimit(
    guestId: string,
    ipHash: string
): Promise<{
    allowed: boolean;
    reason?: string;
    remainingByUuid: number;
    remainingByIp: number;
}> {
    // Check UUID-based limit
    const guestUsage = await prisma.guestUsage.findUnique({
        where: { guestId },
    });

    const usedByUuid = guestUsage?.generationsUsed ?? 0;
    const remainingByUuid = Math.max(0, GUEST_MAX_GENERATIONS_PER_UUID - usedByUuid);

    // Check IP-based limit (last 24h)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const ipUsageResult = await prisma.guestUsage.aggregate({
        where: {
            ipHash,
            lastUsedAt: { gte: twentyFourHoursAgo },
        },
        _sum: { generationsUsed: true },
    });

    const usedByIp = ipUsageResult._sum.generationsUsed ?? 0;
    const remainingByIp = Math.max(0, GUEST_MAX_GENERATIONS_PER_IP_24H - usedByIp);

    if (remainingByUuid <= 0) {
        return {
            allowed: false,
            reason: "Wykorzystałeś darmowy limit generacji. Zarejestruj się za darmo i otrzymaj 5 generacji miesięcznie!",
            remainingByUuid: 0,
            remainingByIp,
        };
    }

    if (remainingByIp <= 0) {
        return {
            allowed: false,
            reason: "Zbyt wiele generacji z Twojej sieci. Zarejestruj się za darmo, aby kontynuować.",
            remainingByUuid,
            remainingByIp: 0,
        };
    }

    return { allowed: true, remainingByUuid, remainingByIp };
}

/**
 * Consume one guest generation credit
 */
export async function consumeGuestCredit(
    guestId: string,
    ipHash: string
): Promise<void> {
    await prisma.guestUsage.upsert({
        where: { guestId },
        create: {
            guestId,
            ipHash,
            generationsUsed: 1,
        },
        update: {
            generationsUsed: { increment: 1 },
            ipHash, // Update IP in case guest changed network
        },
    });
}

export { GUEST_MAX_GENERATIONS_PER_UUID, GUEST_MAX_GENERATIONS_PER_IP_24H, GUEST_MAX_IMAGES };
```

**Step 4: Commit**

```bash
git add prisma/schema.prisma lib/guest-tracking.ts
git commit -m "feat(guest): add guest tracking service with UUID + IP rate limiting

3-layer guest identification:
- UUID (localStorage) with 3 generations limit
- IP hash (SHA-256) with 5 generations per 24h
- Hard-wall after limits exceeded
RODO-safe: no personal data stored."
```

---

### Task 2.2: Integracja guest tracking z API generacji

**Files:**
- Modify: `app/api/generate-ad/route.ts` (dodanie guest tracking logic)
- Modify: `lib/schemas.ts` (dodanie guestId do schema)

**Step 1: Dodaj guestId do schema walidacji**

W `lib/schemas.ts`, w `generateAdRequestSchema` (linia ~43), dodaj pole opcjonalne:

```typescript
// Dodaj do obiektu generateAdRequestSchema, np. po polu `images`:
guestId: z.string().min(1).max(100).optional(),
```

**Step 2: Zmodyfikuj API route `/api/generate-ad`**

W `app/api/generate-ad/route.ts` dodaj import i logikę guest tracking:

Na górze pliku (po istniejących importach):
```typescript
import { checkGuestLimit, consumeGuestCredit, hashIP, GUEST_MAX_IMAGES } from "@/lib/guest-tracking";
import { headers } from "next/headers";
```

W funkcji POST, po walidacji body (po linii ~19), dodaj logikę gości:

```typescript
// Guest tracking for unauthenticated users
if (!session?.user?.id) {
    const { guestId } = validatedData;

    if (!guestId) {
        return NextResponse.json(
            { error: "Identyfikator gościa jest wymagany" },
            { status: 400 }
        );
    }

    // Enforce guest image limit
    if (validatedData.images.length > GUEST_MAX_IMAGES) {
        return NextResponse.json(
            { error: `Goście mogą przesłać maksymalnie ${GUEST_MAX_IMAGES} zdjęcie. Zarejestruj się, aby przesyłać więcej.` },
            { status: 400 }
        );
    }

    // Get IP hash
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim()
        || headersList.get("x-real-ip")
        || "unknown";
    const ipHash = hashIP(ip);

    // Check guest limits
    const guestCheck = await checkGuestLimit(guestId, ipHash);
    if (!guestCheck.allowed) {
        return NextResponse.json(
            { error: guestCheck.reason },
            { status: 429 }
        );
    }

    // Consume guest credit after successful generation (move below generateAd call)
    // We'll consume after generation succeeds — see below
}
```

Następnie, po udanym wywołaniu `generateAd()` (po linii ~65), ale przed `return`, dodaj:

```typescript
// Consume guest credit after successful generation
if (!session?.user?.id && validatedData.guestId) {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim()
        || headersList.get("x-real-ip")
        || "unknown";
    const ipHash = hashIP(ip);
    await consumeGuestCredit(validatedData.guestId, ipHash);
}
```

**Uwaga:** `headers()` w Next.js 15 jest async — upewnij się, że oba wywołania używają `await headers()`.

**Step 3: Zweryfikuj build**

Run: `npm run build`
Expected: Build przechodzi.

**Step 4: Commit**

```bash
git add app/api/generate-ad/route.ts lib/schemas.ts
git commit -m "feat(guest): integrate guest tracking with generation API

- Validates guestId for unauthenticated requests
- Enforces guest image limit (1 per generation)
- Checks UUID + IP limits before generation
- Consumes guest credit after successful generation
- Returns 429 with Polish message when limits exceeded"
```

---

### Task 2.3: Guest UUID na frontendzie

**Files:**
- Create: `lib/guest-id.ts` (client-side UUID helper)
- Modify: `components/AdGeneratorForm.tsx` (wysyłanie guestId z requestem)

**Step 1: Stwórz `lib/guest-id.ts`**

```typescript
"use client";

const GUEST_ID_KEY = "marketplace_guest_id";

/**
 * Get or create a stable guest UUID for rate limiting.
 * Stored in localStorage. Not personal data (RODO-safe).
 */
export function getGuestId(): string {
    if (typeof window === "undefined") return "";

    let guestId = localStorage.getItem(GUEST_ID_KEY);
    if (!guestId) {
        guestId = `guest_${crypto.randomUUID()}`;
        localStorage.setItem(GUEST_ID_KEY, guestId);
    }
    return guestId;
}
```

**Step 2: Zmodyfikuj `components/AdGeneratorForm.tsx`**

Na górze pliku (po istniejących importach) dodaj:
```typescript
import { getGuestId } from "@/lib/guest-id";
```

W funkcji `handleSubmit()` (linia ~193), znajdź miejsce gdzie budowany jest body requestu do `/api/generate-ad` (linia ~221-229). Dodaj `guestId` do body:

```typescript
// Dodaj guestId do body requestu (tylko dla gości)
const requestBody = {
    platform,
    productName: productName || undefined,
    condition,
    priceType,
    price: priceType === "user_provided" ? parseFloat(price) : undefined,
    tone: selectedTone,
    delivery,
    notes: notes || undefined,
    images: imagesForRequest,
    // Guest tracking
    ...(!session?.user?.id && { guestId: getGuestId() }),
};
```

**Uwaga:** Sprawdź dokładną strukturę body w pliku — dopasuj nazwy pól do istniejącego kodu.

**Step 3: Commit**

```bash
git add lib/guest-id.ts components/AdGeneratorForm.tsx
git commit -m "feat(guest): add client-side guest UUID and send with generation requests

- Generates stable UUID per browser (localStorage)
- Sends guestId with unauthenticated generation requests
- UUID not personal data (RODO-safe)"
```

---

### Task 2.4: Obsługa błędów guest tracking w UI

**Files:**
- Modify: `components/AdGeneratorForm.tsx` (obsługa 429 response)

**Step 1: Zaktualizuj obsługę błędów w `handleSubmit()`**

W `components/AdGeneratorForm.tsx`, w bloku catch lub w obsłudze response (po linii ~240), upewnij się że 429 jest obsługiwane z komunikatem zachęcającym do rejestracji:

```typescript
if (response.status === 429) {
    const data = await response.json();
    setError(data.error || "Limit generacji wyczerpany. Zarejestruj się, aby kontynuować.");
    setIsLoading(false);
    return;
}
```

Sprawdź, czy istniejący error handling już obsługuje 429. Jeśli tak, upewnij się że komunikat jest z API (nie generyczny).

**Step 2: Commit**

```bash
git add components/AdGeneratorForm.tsx
git commit -m "feat(guest): handle 429 rate limit response in UI with registration CTA"
```

---

## Etap 3: Nowe tiery cenowe

### Task 3.1: Aktualizacja Prisma schema — nowe plany

**Files:**
- Modify: `prisma/schema.prisma` (rozszerzenie enum Plan, dodanie pól)
- Modify: `lib/types.ts` (aktualizacja typów)
- Modify: `lib/credits.ts` (nowa logika kredytów)

**Step 1: Zaktualizuj enum Plan w Prisma**

W `prisma/schema.prisma` (linia 105-108), zmień:
```prisma
enum Plan {
    FREE
    STARTER
    RESELER
    BUSINESS
}
```

Dodaj nowe pola do modelu User (po linii ~60):
```prisma
model User {
    // ... istniejące pola ...
    plan              Plan     @default(FREE)
    creditsAvailable  Int      @default(5)     // zmiana z 3 na 5
    creditsResetAt    DateTime @default(now())
    boostCredits      Int      @default(0)     // dostawki (nie wygasają)
    maxImagesPerGen   Int      @default(2)     // limit zdjęć per generacja
    // ... relacje ...
}
```

**Step 2: Uruchom migrację**

Run: `npx prisma migrate dev --name add-new-tiers-and-boost-credits`

**UWAGA:** Migracja zmieni domyślne creditsAvailable z 3 na 5 dla nowych użytkowników. Istniejący użytkownicy zachowają swoje wartości.

**Step 3: Zaktualizuj `lib/credits.ts`**

Zmień `CREDIT_LIMITS` (linia 7-10):
```typescript
export const CREDIT_LIMITS: Record<string, number> = {
    FREE: 5,
    STARTER: 30,
    RESELER: 80,
    BUSINESS: 200,
};

export const IMAGE_LIMITS: Record<string, number> = {
    FREE: 2,
    STARTER: 5,
    RESELER: 8,
    BUSINESS: 12,
};
```

Zaktualizuj `consumeCredit()` (linia 50-72) żeby obsługiwała boostCredits:
```typescript
export async function consumeCredit(userId: string): Promise<void> {
    const user = await getUserData(userId);
    if (!user) throw new Error("Użytkownik nie znaleziony");

    // First try subscription credits
    if (user.creditsAvailable > 0) {
        await prisma.user.update({
            where: { id: userId },
            data: { creditsAvailable: { decrement: 1 } },
        });
        return;
    }

    // Then try boost credits
    if (user.boostCredits > 0) {
        await prisma.user.update({
            where: { id: userId },
            data: { boostCredits: { decrement: 1 } },
        });
        return;
    }

    // No credits available
    if (user.plan === "FREE") {
        throw new Error(
            "Wykorzystałeś wszystkie darmowe kredyty (5/miesiąc). Przejdź na plan Starter dla 30 generacji miesięcznie."
        );
    }
    throw new Error(
        "Brak dostępnych kredytów. Dokup pakiet kredytów lub zmień plan na wyższy."
    );
}
```

Zaktualizuj `hasCredits()`:
```typescript
export async function hasCredits(userId: string): Promise<boolean> {
    const user = await getUserData(userId);
    if (!user) return false;
    return user.creditsAvailable > 0 || user.boostCredits > 0;
}

export async function getAvailableCredits(userId: string): Promise<number> {
    const user = await getUserData(userId);
    if (!user) return 0;
    return user.creditsAvailable + user.boostCredits;
}
```

Zaktualizuj `resetCredits()` żeby resetowała tylko subskrypcyjne:
```typescript
export async function resetCredits(userId: string): Promise<void> {
    const user = await getUserData(userId);
    if (!user) throw new Error("Użytkownik nie znaleziony");

    const limit = CREDIT_LIMITS[user.plan] ?? CREDIT_LIMITS.FREE;
    await prisma.user.update({
        where: { id: userId },
        data: {
            creditsAvailable: limit,
            creditsResetAt: new Date(),
        },
    });
}
```

Zastąp `upgradeToPremium()` bardziej generyczną funkcją:
```typescript
export async function changePlan(userId: string, plan: string): Promise<void> {
    const limit = CREDIT_LIMITS[plan];
    const imageLimit = IMAGE_LIMITS[plan];
    if (limit === undefined || imageLimit === undefined) {
        throw new Error(`Nieznany plan: ${plan}`);
    }

    await prisma.user.update({
        where: { id: userId },
        data: {
            plan: plan as Plan,
            creditsAvailable: limit,
            maxImagesPerGen: imageLimit,
            creditsResetAt: new Date(),
        },
    });
}

export async function addBoostCredits(userId: string, amount: number): Promise<void> {
    await prisma.user.update({
        where: { id: userId },
        data: { boostCredits: { increment: amount } },
    });
}
```

**Step 4: Zaktualizuj typy w `lib/types.ts`**

Zmień/dodaj:
```typescript
// Aktualizacja istniejących typów — jeśli Plan jest importowany z Prisma, nic nie trzeba zmieniać
// Jeśli jest zdefiniowany lokalnie, dodaj nowe plany
```

**Step 5: Commit**

```bash
git add prisma/schema.prisma lib/credits.ts lib/types.ts
git commit -m "feat(tiers): add Starter/Reseler/Business plans with boost credits

- 4 tiers: Free(5), Starter(30), Reseler(80), Business(200)
- Image limits per tier: 2/5/8/12
- Boost credits (one-time purchases, don't expire)
- Credits consumed: subscription first, then boost
- changePlan() replaces upgradeToPremium()"
```

---

### Task 3.2: Aktualizacja auth callbacks i session

**Files:**
- Modify: `auth.ts` (dodanie boostCredits i maxImagesPerGen do JWT/session)

**Step 1: Zaktualizuj JWT callback w `auth.ts`**

W JWT callback (linia ~24-45), dodaj nowe pola:

```typescript
// W sekcji gdzie pobieramy dane z DB:
const dbUser = await prisma.user.findUnique({
    where: { id: token.sub },
    select: {
        id: true,
        plan: true,
        creditsAvailable: true,
        boostCredits: true,
        maxImagesPerGen: true,
    },
});

if (dbUser) {
    token.id = dbUser.id;
    token.plan = dbUser.plan;
    token.creditsAvailable = dbUser.creditsAvailable;
    token.boostCredits = dbUser.boostCredits;
    token.maxImagesPerGen = dbUser.maxImagesPerGen;
}
```

W session callback, dodaj nowe pola:
```typescript
session.user.boostCredits = token.boostCredits as number;
session.user.maxImagesPerGen = token.maxImagesPerGen as number;
```

**Step 2: Zaktualizuj typy sesji**

Jeśli NextAuth wymaga rozszerzenia typów (TypeScript), sprawdź czy istnieje plik `types/next-auth.d.ts` lub dodaj deklaracje w odpowiednim pliku.

**Step 3: Commit**

```bash
git add auth.ts
git commit -m "feat(tiers): add boostCredits and maxImagesPerGen to JWT session"
```

---

### Task 3.3: Walidacja limitu zdjęć per tier w API

**Files:**
- Modify: `app/api/generate-ad/route.ts` (sprawdzanie maxImagesPerGen)

**Step 1: Dodaj walidację limitu zdjęć**

W `app/api/generate-ad/route.ts`, po sprawdzeniu kredytów (po guest tracking), dodaj walidację limitu zdjęć dla zalogowanych użytkowników:

```typescript
if (session?.user?.id) {
    const maxImages = session.user.maxImagesPerGen ?? 2;
    if (validatedData.images.length > maxImages) {
        return NextResponse.json(
            {
                error: `Twój plan pozwala na maksymalnie ${maxImages} zdjęć na generację. Zmień plan na wyższy, aby przesyłać więcej.`,
            },
            { status: 400 }
        );
    }
}
```

**Step 2: Commit**

```bash
git add app/api/generate-ad/route.ts
git commit -m "feat(tiers): enforce per-tier image limit in generation API"
```

---

### Task 3.4: Aktualizacja UI — sidebar credits display

**Files:**
- Modify: `components/Sidebar.tsx` (wyświetlanie boostCredits + nowe plany)

**Step 1: Zaktualizuj wyświetlanie kredytów w Sidebar**

W `components/Sidebar.tsx`, znajdź sekcję wyświetlającą kredyty i plan. Zaktualizuj:

- Wyświetlaj plan badge z nową nazwą (FREE/STARTER/RESELER/BUSINESS)
- Wyświetlaj kredyty: `{creditsAvailable} + {boostCredits} dostawkowych`
- Dla Business z 200 kredytami: wyświetlaj liczbę, nie ∞

**Step 2: Commit**

```bash
git add components/Sidebar.tsx
git commit -m "feat(tiers): update sidebar to display new plan names and boost credits"
```

---

### Task 3.5: Aktualizacja UploadDropzone — dynamiczny limit zdjęć

**Files:**
- Modify: `components/UploadDropzone.tsx` (dynamiczny maxImages z session)
- Modify: `components/AdGeneratorForm.tsx` (przekazywanie maxImages)

**Step 1: Zaktualizuj UploadDropzone**

W `components/UploadDropzone.tsx`, zmień stały `MAX_IMAGES` na prop:

```typescript
interface UploadDropzoneProps {
    // ... istniejące props ...
    maxImages?: number;  // dynamiczny limit z planu
}
```

Użyj `maxImages` prop zamiast stałej `MAX_IMAGES` w walidacji i komunikatach.

**Step 2: Zaktualizuj AdGeneratorForm**

W `components/AdGeneratorForm.tsx`, przekazuj `maxImages` do UploadDropzone:

```typescript
const maxImages = session?.user?.maxImagesPerGen ?? (session?.user ? 2 : 1);

<UploadDropzone maxImages={maxImages} ... />
```

Dla gości: limit 1 (z guest tracking).
Dla zalogowanych: z sesji (`maxImagesPerGen`).

**Step 3: Commit**

```bash
git add components/UploadDropzone.tsx components/AdGeneratorForm.tsx
git commit -m "feat(tiers): dynamic image upload limit based on user plan"
```

---

## Etap 4: System płatności Stripe

### Task 4.1: Instalacja i konfiguracja Stripe

**Files:**
- Modify: `package.json` (nowa zależność)
- Create: `lib/stripe.ts` (Stripe client + config)
- Modify: `.env.example` (nowe zmienne środowiskowe)

**Step 1: Zainstaluj Stripe SDK**

Run: `npm install stripe`

**Step 2: Dodaj zmienne środowiskowe do `.env.example`**

```
# Stripe Payments
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Stripe Price IDs (create in Stripe Dashboard)
STRIPE_PRICE_STARTER_MONTHLY=price_xxx
STRIPE_PRICE_RESELER_MONTHLY=price_xxx
STRIPE_PRICE_BUSINESS_MONTHLY=price_xxx
STRIPE_PRICE_BOOST_10=price_xxx
STRIPE_PRICE_BOOST_30=price_xxx
STRIPE_PRICE_BOOST_60=price_xxx
```

**Step 3: Stwórz `lib/stripe.ts`**

```typescript
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-12-18.acacia", // użyj najnowszej wersji API
    typescript: true,
});

// Subscription tier mapping
export const STRIPE_PLANS = {
    STARTER: {
        priceId: process.env.STRIPE_PRICE_STARTER_MONTHLY!,
        name: "Starter",
        price: 1999, // grosze (19.99 zł)
    },
    RESELER: {
        priceId: process.env.STRIPE_PRICE_RESELER_MONTHLY!,
        name: "Reseler",
        price: 4999,
    },
    BUSINESS: {
        priceId: process.env.STRIPE_PRICE_BUSINESS_MONTHLY!,
        name: "Business",
        price: 9999,
    },
} as const;

// Boost credit packs
export const STRIPE_BOOSTS = {
    BOOST_10: {
        priceId: process.env.STRIPE_PRICE_BOOST_10!,
        credits: 10,
        price: 999,
    },
    BOOST_30: {
        priceId: process.env.STRIPE_PRICE_BOOST_30!,
        credits: 30,
        price: 2499,
    },
    BOOST_60: {
        priceId: process.env.STRIPE_PRICE_BOOST_60!,
        credits: 60,
        price: 3999,
    },
} as const;
```

**Step 4: Commit**

```bash
git add package.json package-lock.json lib/stripe.ts .env.example
git commit -m "feat(payments): add Stripe SDK and configuration

- Stripe SDK installed
- Stripe client with API key
- Plan and boost price ID mappings
- Environment variables documented"
```

---

### Task 4.2: Dodaj stripeCustomerId do User

**Files:**
- Modify: `prisma/schema.prisma` (pole stripeCustomerId)
- Modify: `prisma/schema.prisma` (pole stripeSubscriptionId)

**Step 1: Dodaj pola Stripe do modelu User**

```prisma
model User {
    // ... istniejące pola ...
    stripeCustomerId      String?  @unique
    stripeSubscriptionId  String?  @unique
    // ... relacje ...
}
```

**Step 2: Uruchom migrację**

Run: `npx prisma migrate dev --name add-stripe-fields-to-user`

**Step 3: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(payments): add Stripe customer and subscription IDs to User model"
```

---

### Task 4.3: API endpoint — tworzenie Checkout Session (subskrypcje)

**Files:**
- Create: `app/api/stripe/checkout/route.ts`

**Step 1: Stwórz endpoint**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe, STRIPE_PLANS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
    }

    const body = await request.json();
    const { plan } = body;

    const planConfig = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS];
    if (!planConfig) {
        return NextResponse.json({ error: "Nieprawidłowy plan" }, { status: 400 });
    }

    // Get or create Stripe customer
    let user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { stripeCustomerId: true, email: true, name: true },
    });

    let customerId = user?.stripeCustomerId;

    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user?.email || undefined,
            name: user?.name || undefined,
            metadata: { userId: session.user.id },
        });
        customerId = customer.id;

        await prisma.user.update({
            where: { id: session.user.id },
            data: { stripeCustomerId: customerId },
        });
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        payment_method_types: ["card", "blik"],
        line_items: [
            {
                price: planConfig.priceId,
                quantity: 1,
            },
        ],
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard?upgrade=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/pricing?upgrade=cancelled`,
        metadata: {
            userId: session.user.id,
            plan,
        },
    });

    return NextResponse.json({ url: checkoutSession.url });
}
```

**Step 2: Commit**

```bash
git add app/api/stripe/checkout/route.ts
git commit -m "feat(payments): add Stripe Checkout session endpoint for subscriptions

- Creates/reuses Stripe customer
- Supports card + BLIK payment methods
- Includes userId and plan in metadata"
```

---

### Task 4.4: API endpoint — tworzenie Checkout Session (dostawki)

**Files:**
- Create: `app/api/stripe/boost/route.ts`

**Step 1: Stwórz endpoint**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe, STRIPE_BOOSTS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
    }

    const body = await request.json();
    const { boostPack } = body;

    const boostConfig = STRIPE_BOOSTS[boostPack as keyof typeof STRIPE_BOOSTS];
    if (!boostConfig) {
        return NextResponse.json({ error: "Nieprawidłowy pakiet" }, { status: 400 });
    }

    // Get or create Stripe customer
    let user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { stripeCustomerId: true, email: true, name: true },
    });

    let customerId = user?.stripeCustomerId;

    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user?.email || undefined,
            name: user?.name || undefined,
            metadata: { userId: session.user.id },
        });
        customerId = customer.id;

        await prisma.user.update({
            where: { id: session.user.id },
            data: { stripeCustomerId: customerId },
        });
    }

    // Create checkout session for one-time payment
    const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "payment",
        payment_method_types: ["card", "blik"],
        line_items: [
            {
                price: boostConfig.priceId,
                quantity: 1,
            },
        ],
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard?boost=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/pricing?boost=cancelled`,
        metadata: {
            userId: session.user.id,
            boostPack,
            credits: boostConfig.credits.toString(),
        },
    });

    return NextResponse.json({ url: checkoutSession.url });
}
```

**Step 2: Commit**

```bash
git add app/api/stripe/boost/route.ts
git commit -m "feat(payments): add Stripe Checkout session endpoint for credit boosts

- One-time payment mode for boost packs
- Supports card + BLIK
- Credits amount in session metadata"
```

---

### Task 4.5: Stripe Webhook handler

**Files:**
- Create: `app/api/stripe/webhook/route.ts`

**Step 1: Stwórz webhook handler**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_BOOSTS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { changePlan, addBoostCredits } from "@/lib/credits";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
        // Subscription created or updated
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId;

            if (!userId) break;

            if (session.mode === "subscription") {
                // Subscription checkout completed
                const plan = session.metadata?.plan;
                if (plan) {
                    await prisma.user.update({
                        where: { id: userId },
                        data: { stripeSubscriptionId: session.subscription as string },
                    });
                    await changePlan(userId, plan);
                }
            } else if (session.mode === "payment") {
                // Boost credit purchase
                const credits = parseInt(session.metadata?.credits || "0", 10);
                if (credits > 0) {
                    await addBoostCredits(userId, credits);
                }
            }
            break;
        }

        // Subscription renewed (monthly payment)
        case "invoice.paid": {
            const invoice = event.data.object as Stripe.Invoice;
            const subscriptionId = invoice.subscription as string;

            if (!subscriptionId) break;

            // Find user by subscription ID
            const user = await prisma.user.findFirst({
                where: { stripeSubscriptionId: subscriptionId },
            });

            if (user) {
                // Reset monthly credits on successful payment
                const limit = await import("@/lib/credits").then(
                    (m) => m.CREDIT_LIMITS[user.plan] ?? m.CREDIT_LIMITS.FREE
                );
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        creditsAvailable: limit,
                        creditsResetAt: new Date(),
                    },
                });
            }
            break;
        }

        // Subscription cancelled or payment failed
        case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;

            const user = await prisma.user.findFirst({
                where: { stripeSubscriptionId: subscription.id },
            });

            if (user) {
                // Downgrade to FREE
                await changePlan(user.id, "FREE");
                await prisma.user.update({
                    where: { id: user.id },
                    data: { stripeSubscriptionId: null },
                });
            }
            break;
        }

        default:
            // Unhandled event type
            break;
    }

    return NextResponse.json({ received: true });
}
```

**Step 2: Dodaj webhook route do middleware exclusion**

W `middleware.ts`, upewnij się że route `/api/stripe/webhook` nie jest blokowany przez middleware auth. Obecny matcher już wyklucza `api` routes, więc powinno działać.

**Step 3: Commit**

```bash
git add app/api/stripe/webhook/route.ts
git commit -m "feat(payments): add Stripe webhook handler

Handles:
- checkout.session.completed: upgrades plan or adds boost credits
- invoice.paid: resets monthly credits on renewal
- customer.subscription.deleted: downgrades to FREE"
```

---

### Task 4.6: API endpoint — Stripe Customer Portal

**Files:**
- Create: `app/api/stripe/portal/route.ts`

**Step 1: Stwórz endpoint portalu klienta**

```typescript
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
        return NextResponse.json(
            { error: "Brak aktywnej subskrypcji" },
            { status: 400 }
        );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
}
```

**Step 2: Commit**

```bash
git add app/api/stripe/portal/route.ts
git commit -m "feat(payments): add Stripe Customer Portal endpoint

Allows users to manage subscription, update payment method,
view invoices, and cancel subscription."
```

---

### Task 4.7: Strona cenowa `/pricing`

**Files:**
- Create: `app/pricing/page.tsx`

**Step 1: Stwórz stronę cenową**

Stwórz publiczną stronę z:
- 4 kolumny tierów (Free / Starter / Reseler / Business)
- Wyróżniony Reseler (najpopularniejszy)
- Tabela porównania feature'ów
- Sekcja dostawek kredytów
- Przyciski "Wybierz plan" → wywołują `/api/stripe/checkout`
- Przyciski "Kup kredyty" → wywołują `/api/stripe/boost`
- Sekcja FAQ (accordion)

Ten plik będzie duży — powinien wykorzystywać istniejące komponenty UI (Card, Button, Badge).

Dla niezalogowanych: przyciski kierują do `/auth/signin?callbackUrl=/pricing`
Dla zalogowanych: przyciski tworzą Checkout Session i redirectują do Stripe

**Step 2: Commit**

```bash
git add app/pricing/page.tsx
git commit -m "feat(payments): add public pricing page with tier comparison

- 4 tiers with feature comparison table
- Boost credit packs section
- Checkout buttons for subscriptions and boosts
- FAQ section
- Redirects to auth for unauthenticated users"
```

---

### Task 4.8: Aktualizacja Sidebar — link do zarządzania subskrypcją

**Files:**
- Modify: `components/Sidebar.tsx`

**Step 1: Dodaj link do portalu Stripe**

W sidebar, pod sekcją kredytów, dodaj:
- Dla płatnych planów: przycisk "Zarządzaj subskrypcją" → wywołuje `/api/stripe/portal`
- Dla Free: link "Zmień plan" → `/pricing`

**Step 2: Commit**

```bash
git add components/Sidebar.tsx
git commit -m "feat(payments): add subscription management links to sidebar"
```

---

### Task 4.9: Aktualizacja nawigacji — link do cennika

**Files:**
- Modify: `components/Sidebar.tsx` (dodanie linku Cennik)
- Modify: `app/page.tsx` (dodanie linku w header)

**Step 1: Dodaj link "Cennik" do nawigacji**

W Sidebar: dodaj element nawigacyjny "Cennik" → `/pricing`
W stronie głównej (header): dodaj link "Cennik" obok "Zaloguj się"

**Step 2: Commit**

```bash
git add components/Sidebar.tsx app/page.tsx
git commit -m "feat(payments): add pricing links to navigation"
```

---

### Task 4.10: Finalna weryfikacja i dokumentacja

**Files:**
- Modify: `CLAUDE.md` (aktualizacja dokumentacji)
- Modify: `docs/BUSINESS.md` (oznaczenie wdrożonych feature'ów)

**Step 1: Zaktualizuj CLAUDE.md**

Dodaj sekcje:
- Stripe configuration (Price IDs, webhook setup)
- New tier system description
- Guest tracking description
- Updated API routes list

**Step 2: Zaktualizuj docs/BUSINESS.md**

Oznacz wdrożone elementy z Roadmap Faza 1.

**Step 3: Run full build verification**

Run: `npm run build`
Expected: Build przechodzi bez błędów.

Run: `npm run lint`
Expected: Brak błędów lint.

**Step 4: Final commit**

```bash
git add CLAUDE.md docs/BUSINESS.md
git commit -m "docs: update documentation with new tiers, payments, and guest tracking"
```

---

## Podsumowanie etapów

| Etap | Tasks | Szacowany czas |
|---|---|---|
| 1. Zmiana modelu AI | 1.1-1.2 | Krótki |
| 2. Guest Tracking | 2.1-2.4 | Średni |
| 3. Nowe Tiery | 3.1-3.5 | Średni |
| 4. Stripe Payments | 4.1-4.10 | Długi |

**Łącznie:** 21 tasków, ~4 commity na etap.

**Zależności:**
- Etap 1 jest niezależny
- Etap 2 jest niezależny
- Etap 3 wymaga migracji DB (niezależny od 1 i 2)
- Etap 4 wymaga Etapu 3 (nowe plany muszą istnieć przed Stripe)
