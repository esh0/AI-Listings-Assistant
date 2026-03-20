# Email Low-Credits Trigger Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** (1) Switch all outgoing emails from `kontakt@` sender to `noreply@` with `Reply-To: kontakt@` so users can reply but the sender is clearly non-interactive. (2) Send a one-time Polish-language email via Resend when an authenticated user's subscription credits drop to exactly 1, prompting them to buy a boost or upgrade their plan.

**Architecture:** `lib/email.ts` is the single Resend client — updating `sendEmail()` there propagates the sender change to all 4 existing emails (welcome, subscription confirmed, boost confirmed, subscription cancelled) automatically. Two new env vars are added: `RESEND_NOREPLY_EMAIL` (sender) and `RESEND_CONTACT_EMAIL` (Reply-To). The low-credits trigger fires inside `consumeCredit()` in `lib/credits.ts` as fire-and-forget, guarded by a `lastLowCreditEmailAt` field with atomic `updateMany` dedup.

**Tech Stack:** Resend SDK (already installed v6.9.3), Prisma 5.22.0, TypeScript, Next.js 15 App Router (Node.js runtime)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `lib/email.ts` | Modify | Add `RESEND_NOREPLY_EMAIL` sender + `Reply-To: RESEND_CONTACT_EMAIL`; add `sendLowCreditsEmail` |
| `emails/welcome.ts` | Modify | Update hardcoded `kontakt@` in body text to use `RESEND_CONTACT_EMAIL` |
| `prisma/schema.prisma` | Modify | Add `lastLowCreditEmailAt DateTime?` to `User` model |
| `lib/credits.ts` | Modify | Add `maybeNotifyLowCredits` helper, call it fire-and-forget in `consumeCredit` |

No new routes. No UI changes. Four files total.

---

## Task 0: Switch sender to `noreply@` with `Reply-To: kontakt@`

**Files:**
- Modify: `lib/email.ts`
- Modify: `emails/welcome.ts`

All 4 existing emails (welcome, subscription confirmed, boost confirmed, subscription cancelled) call `sendEmail()` from `lib/email.ts`. Changing the sender there propagates automatically — no need to touch `auth.ts` or `stripe/webhook/route.ts`.

- [ ] **Step 1: Update `lib/email.ts` — change sender and add Reply-To**

Replace the top of `lib/email.ts` (lines 1–24, the entire existing file content) with:

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const NOREPLY_EMAIL = process.env.RESEND_NOREPLY_EMAIL ?? "noreply@marketplace-ai.pl";
const CONTACT_EMAIL = process.env.RESEND_CONTACT_EMAIL ?? "kontakt@marketplace-ai.pl";

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
    if (!process.env.RESEND_API_KEY) {
        console.warn("[email] RESEND_API_KEY not set, skipping email to:", to);
        return;
    }

    try {
        await resend.emails.send({
            from: `Marketplace AI <${NOREPLY_EMAIL}>`,
            reply_to: CONTACT_EMAIL,
            to,
            subject,
            html,
        });
    } catch (err) {
        console.error("[email] Failed to send email to", to, err);
        // Don't throw — email failures should not break the main flow
    }
}
```

- [ ] **Step 2: Update hardcoded `kontakt@` in `emails/welcome.ts`**

In `emails/welcome.ts` line 24, replace the hardcoded email address:

```diff
- <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">Jeśli masz pytania, odpiszemy na: <a href="mailto:kontakt@marketplace-ai.pl" style="color:#6366f1;">kontakt@marketplace-ai.pl</a></p>
+ <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">Jeśli masz pytania, napisz do nas: <a href="mailto:kontakt@marketplace-ai.pl" style="color:#6366f1;">kontakt@marketplace-ai.pl</a></p>
```

> The URL stays hardcoded (`kontakt@marketplace-ai.pl`) — this is a user-visible link in email body, not the sender address. The text changes from "odpiszemy na" to "napisz do nas" since they can now reply directly to the email thanks to `Reply-To`.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/email.ts emails/welcome.ts
git commit -m "feat: switch email sender to noreply@ with Reply-To kontakt@"
```

---

## Task 1: Add `lastLowCreditEmailAt` to Prisma schema

**Files:**
- Modify: `prisma/schema.prisma` (User model, around line 51–70)

- [ ] **Step 1: Add the field to the User model**

In `prisma/schema.prisma`, add `lastLowCreditEmailAt` after `boostCredits`:

```diff
  boostCredits     Int       @default(0)
+ lastLowCreditEmailAt DateTime?
  stripeCustomerId     String?  @unique
```

- [ ] **Step 2: Push schema to database**

```bash
DIRECT_URL=<pooler_url> DATABASE_URL=<pooler_url> npx prisma db push
```

Expected output: `Your database is now in sync with your Prisma schema.`

> Port 5432 direct connection is blocked on the dev network. Use the pooler URL for **both** variables (see CLAUDE.md "Database Migrations").

- [ ] **Step 3: Regenerate Prisma client**

```bash
npx prisma generate
```

Expected output: `Generated Prisma Client` with no errors.

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add lastLowCreditEmailAt field to User for email dedup"
```

---

## Task 2: Add `sendLowCreditsEmail` to existing `lib/email.ts`

**Files:**
- Modify: `lib/email.ts`

The file already exists with a `sendEmail()` generic helper and uses `RESEND_FROM_EMAIL` env var. We add the low-credits-specific function below the existing code. Do **not** replace or change anything that is already there.

- [ ] **Step 1: Append to `lib/email.ts`**

Add the following code **after** the existing `sendEmail` export (at the bottom of the file):

```typescript
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marketplace-ai.pl";

function buildLowCreditsHtml(name: string, plan: string): string {
    const planDisplay = plan === "FREE" ? "Free" : plan === "STARTER" ? "Starter" : "Reseler";
    const pricingUrl = `${SITE_URL}/pricing`;

    return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 16px;color:#111;">
  <p style="font-size:24px;font-weight:bold;margin-bottom:4px;">Marketplace <em style="color:#7c3aed;">AI</em></p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
  <p>Hej ${name},</p>
  <p>W Twoim planie <strong>${planDisplay}</strong> została już tylko <strong>1 generacja</strong> w tym miesiącu.</p>
  <p>Żeby nie zatrzymywać się w połowie drogi, możesz szybko doładować konto:</p>
  <table style="margin:24px 0;border-collapse:collapse;width:100%;">
    <tr>
      <td style="padding:12px 16px;border:1px solid #e5e7eb;border-radius:8px 0 0 8px;background:#f9fafb;">
        <strong>Doładowanie kredytów</strong><br>
        <span style="color:#6b7280;font-size:14px;">10 generacji jednorazowo</span>
      </td>
      <td style="padding:12px 16px;border:1px solid #e5e7eb;border-left:none;text-align:center;white-space:nowrap;">
        <strong>9,99 zł</strong>
      </td>
      <td style="padding:12px 16px;border:1px solid #e5e7eb;border-left:none;border-radius:0 8px 8px 0;text-align:center;">
        <a href="${pricingUrl}" style="background:#7c3aed;color:#fff;padding:8px 16px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">Kup teraz</a>
      </td>
    </tr>
  </table>
  <p style="color:#6b7280;font-size:14px;">
    Chcesz więcej generacji co miesiąc?
    <a href="${pricingUrl}" style="color:#7c3aed;">Sprawdź plany Starter i Reseler →</a>
  </p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
  <p style="color:#9ca3af;font-size:12px;">
    Marketplace AI · <a href="${SITE_URL}" style="color:#9ca3af;">${SITE_URL}</a><br>
    Otrzymujesz ten email ponieważ jesteś zarejestrowanym użytkownikiem.
  </p>
</body>
</html>`;
}

export interface LowCreditsEmailUser {
    id: string;
    email: string;
    name: string | null;
    plan: import("@prisma/client").Plan;
}

/**
 * Send "1 credit remaining" email via Resend.
 * Safe to call fire-and-forget — logs errors but never throws.
 * Uses the existing sendEmail() helper internally.
 */
export async function sendLowCreditsEmail(user: LowCreditsEmailUser): Promise<void> {
    const name = user.name ?? "użytkowniku";

    await sendEmail(
        user.email,
        `Zostało Ci tylko 1 generacja — nie zatrzymuj się teraz`,
        buildLowCreditsHtml(name, user.plan),
    );

    console.log(`[email] Low-credits email sent to ${user.email} (plan: ${user.plan})`);
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors referencing `lib/email.ts`.

- [ ] **Step 3: Commit**

```bash
git add lib/email.ts
git commit -m "feat: add sendLowCreditsEmail to email module"
```

---

## Task 3: Wire trigger into `lib/credits.ts`

**Files:**
- Modify: `lib/credits.ts`

- [ ] **Step 1: Add import at top of `lib/credits.ts`**

Add this import after the existing `prisma` import:

```typescript
import { sendLowCreditsEmail } from "@/lib/email";
```

- [ ] **Step 2: Replace the `consumeCredit` function**

Replace the entire `consumeCredit` function (lines 60–91) with the version below. The `maybeNotifyLowCredits` helper is added after it:

```typescript
/**
 * Consume one credit for ad generation.
 * Uses subscription credits first, then boost credits.
 * Atomic: uses conditional UPDATE to prevent TOCTOU race conditions.
 * Side-effect: sends low-credits email (fire-and-forget) when subscription
 * credits drop to exactly 1.
 */
export async function consumeCredit(userId: string): Promise<void> {
    // Atomic decrement of subscription credits (only if > 0)
    const subResult = await prisma.user.updateMany({
        where: { id: userId, creditsAvailable: { gt: 0 } },
        data: { creditsAvailable: { decrement: 1 } },
    });

    if (subResult.count > 0) {
        // Fire-and-forget: check if we should send low-credits email
        maybeNotifyLowCredits(userId).catch(() => {});
        return;
    }

    // Atomic decrement of boost credits (only if > 0)
    const boostResult = await prisma.user.updateMany({
        where: { id: userId, boostCredits: { gt: 0 } },
        data: { boostCredits: { decrement: 1 } },
    });

    if (boostResult.count > 0) return; // Boost credits used — no email for boost path

    // No credits available — fetch plan for user-friendly error message
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true },
    });

    if (user?.plan === "FREE") {
        throw new Error(
            "Wykorzystałeś wszystkie darmowe kredyty (5/miesiąc). Przejdź na plan Starter dla 30 generacji miesięcznie."
        );
    }
    throw new Error(
        "Brak dostępnych kredytów. Dokup pakiet kredytów lub zmień plan na wyższy."
    );
}

/**
 * Atomically claim the low-credits email slot, then send if slot was claimed.
 * Uses a conditional updateMany (WHERE lastLowCreditEmailAt IS NULL OR < 25 days ago)
 * so only one concurrent caller can win the slot — reduces double-send probability.
 * Not a hard guarantee under all race conditions, but sufficient for this use case.
 */
async function maybeNotifyLowCredits(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            plan: true,
            creditsAvailable: true,
        },
    });

    if (!user) return;
    if (user.creditsAvailable !== 1) return;

    const twentyFiveDaysAgo = new Date(Date.now() - 25 * 24 * 60 * 60 * 1000);

    // Atomically claim the send slot: only update if no email was sent recently
    const claimed = await prisma.user.updateMany({
        where: {
            id: userId,
            OR: [
                { lastLowCreditEmailAt: null },
                { lastLowCreditEmailAt: { lt: twentyFiveDaysAgo } },
            ],
        },
        data: { lastLowCreditEmailAt: new Date() },
    });

    if (claimed.count === 0) return; // Another request already claimed the slot

    await sendLowCreditsEmail({
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
    });
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/credits.ts
git commit -m "feat: send low-credits email when subscription credits drop to 1"
```

---

## Task 4: Add env var and verify end-to-end

**Files:**
- Modify: `.env.local` (not committed — add manually)

The project already uses `RESEND_API_KEY` — only `RESEND_API_KEY` needs to be set if it isn't already. The old `RESEND_FROM_EMAIL` is replaced by two new vars: `RESEND_NOREPLY_EMAIL` and `RESEND_CONTACT_EMAIL`.

- [ ] **Step 1: Update `.env.local`**

```bash
# Replace RESEND_FROM_EMAIL with:
RESEND_API_KEY=re_your_key_here
RESEND_NOREPLY_EMAIL=noreply@marketplace-ai.pl
RESEND_CONTACT_EMAIL=kontakt@marketplace-ai.pl
```

> For local testing, set `RESEND_NOREPLY_EMAIL=onboarding@resend.dev` (Resend sandbox — no domain verification needed). Remove `RESEND_FROM_EMAIL` if it was previously set.

- [ ] **Step 2: Start dev server**

```bash
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
npm run dev
```

- [ ] **Step 3: Manual smoke test**

Use Prisma Studio (`npx prisma studio`) or direct DB query to manipulate test data:

1. Sign in to the app with your account
2. Set your user's `creditsAvailable = 2` and `lastLowCreditEmailAt = NULL`
3. Generate one ad → credits decrement to 1
4. Check server logs for: `[email] Low-credits email sent to <your@email>`
5. Check inbox or Resend Dashboard → Emails tab to confirm delivery
6. Generate another ad → credits decrement to 0
7. Confirm **no second email** in logs or Resend dashboard (dedup guard held)
8. Set `creditsAvailable = 2`, `lastLowCreditEmailAt = NULL` again
9. Generate one ad → credits decrement to 1
10. Confirm email sent again (25-day window is past because we nulled the field)

- [ ] **Step 4: Add env vars to Vercel (production)**

In Vercel Dashboard → Project → Settings → Environment Variables:
- `RESEND_API_KEY` = production key from Resend
- `RESEND_NOREPLY_EMAIL` = `noreply@marketplace-ai.pl`
- `RESEND_CONTACT_EMAIL` = `kontakt@marketplace-ai.pl`
- Remove `RESEND_FROM_EMAIL` if it was previously set in Vercel

> Domain verification for production: Resend Dashboard → Domains → Add `marketplace-ai.pl` → add the TXT/MX DNS records as instructed. Both `noreply@` and `kontakt@` must be verified senders (or use a catch-all on the domain).

- [ ] **Step 5: Update CLAUDE.md env vars section**

Add to the `RESEND_*` env var docs in CLAUDE.md (in `.env.local` template):

```
# Email (Resend)
RESEND_API_KEY=re_your_key_here
RESEND_NOREPLY_EMAIL=noreply@marketplace-ai.pl
RESEND_CONTACT_EMAIL=kontakt@marketplace-ai.pl
```

- [ ] **Step 6: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: document RESEND env vars in CLAUDE.md"
```

---

## Summary

| Task | Files changed | What it does |
|---|---|---|
| 0 | `lib/email.ts`, `emails/welcome.ts` | Switches sender to `noreply@`, adds `Reply-To: kontakt@` |
| 1 | `prisma/schema.prisma` | Adds `lastLowCreditEmailAt` dedup field |
| 2 | `lib/email.ts` (modified) | Appends `sendLowCreditsEmail` + HTML builder |
| 3 | `lib/credits.ts` | Wires `maybeNotifyLowCredits` fire-and-forget into `consumeCredit` |
| 4 | `.env.local` + Vercel + CLAUDE.md | Adds new env vars, smoke tests end-to-end |

No new routes. No UI changes. Fire-and-forget so generation latency is unaffected. Double-send protection via atomic `updateMany WHERE lastLowCreditEmailAt IS NULL OR < 25daysAgo`.
