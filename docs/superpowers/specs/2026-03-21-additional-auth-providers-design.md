# Additional Auth Providers — Facebook OAuth + Magic Link

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Facebook OAuth and email magic link (via Resend) as additional sign-in methods alongside existing Google OAuth, to cover Polish users without Gmail accounts.

**Architecture:** Minimal-change approach — add two providers to the existing `auth.ts` providers array, extend the sign-in page UI with a Facebook button and email form, and add a magic link email template. No database schema changes required.

**Tech Stack:** NextAuth v5 (Auth.js), FacebookProvider, ResendProvider, Resend API (existing key), Prisma adapter (already configured), VerificationToken model (already in schema).

---

## Scope

Two independent additions treated as one cohesive feature:
1. **Facebook OAuth** — social login button, same flow as Google
2. **Email magic link** — email input form, sends link via Resend, shows confirmation UI

---

## File Changes

| File | Change |
|------|--------|
| `auth.ts` | Add `FacebookProvider` and `ResendProvider` to `providers[]` |
| `app/auth/signin/page.tsx` | Add Facebook button, email form, sent-confirmation state |
| `emails/magic-link.ts` | New file — HTML template for magic link email |
| `.env.local` | Add `AUTH_FACEBOOK_ID`, `AUTH_FACEBOOK_SECRET` |
| `CHANGELOG.md` | Add v1.3.0 entry |

No changes to: `prisma/schema.prisma`, `lib/email.ts`, middleware, API routes.

---

## Section 1: auth.ts

Add two providers to the `providers` array:

```ts
import FacebookProvider from "next-auth/providers/facebook";
import ResendProvider from "next-auth/providers/resend";
import { magicLinkEmailHtml } from "@/emails/magic-link";

providers: [
  GoogleProvider({ ... }), // existing
  FacebookProvider({
    clientId: process.env.AUTH_FACEBOOK_ID!,
    clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
  }),
  ResendProvider({
    apiKey: process.env.RESEND_API_KEY!,
    from: `Marketplace AI <${process.env.RESEND_NOREPLY_EMAIL ?? "noreply@marketplace-ai.pl"}>`,
    async sendVerificationRequest({ identifier: email, url }) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: `Marketplace AI <${process.env.RESEND_NOREPLY_EMAIL ?? "noreply@marketplace-ai.pl"}>`,
        replyTo: process.env.RESEND_CONTACT_EMAIL ?? "kontakt@marketplace-ai.pl",
        to: email,
        subject: "Twój link do logowania — Marketplace AI",
        html: magicLinkEmailHtml(url),
      });
    },
  }),
],
```

**Note:** `VerificationToken` model and `PrismaAdapter` are already configured — no additional setup needed for magic link token storage.

---

## Section 2: app/auth/signin/page.tsx

### UI layout

```
┌─────────────────────────────────┐
│         [logo]                  │
│    Marketplace AI               │
│  Zaloguj się aby zarządzać...   │
│                                 │
│  [G] Kontynuuj z Google         │
│  [f] Kontynuuj z Facebook       │
│                                 │
│  ─────── lub ───────            │
│                                 │
│  [  twoj@email.pl          ]    │
│  [  Wyślij link logowania  ]    │
│                                 │
│  (po submit — stan emailSent:)  │
│  ✉ Sprawdź skrzynkę pocztową.   │
│    Link ważny 10 minut.         │
│    Nie widzisz? Sprawdź spam.   │
│                                 │
│  Logując się akceptujesz...     │
│  ← Wróć do strony głównej       │
└─────────────────────────────────┘
```

### State

```ts
const [email, setEmail] = useState("");
const [emailSent, setEmailSent] = useState(false);
const [emailLoading, setEmailLoading] = useState(false);
```

### Magic link submit handler

```ts
const handleEmailSignIn = async (e: React.FormEvent) => {
  e.preventDefault();
  setEmailLoading(true);
  await signIn("resend", { email, callbackUrl, redirect: false });
  setEmailSent(true);
  setEmailLoading(false);
};
```

### Confirmation state (shown when emailSent === true)

```tsx
<div className="text-center space-y-2 py-4">
  <p className="font-medium">Sprawdź skrzynkę pocztową</p>
  <p className="text-sm text-muted-foreground">
    Wysłaliśmy link do: <strong>{email}</strong>
  </p>
  <p className="text-sm text-muted-foreground">
    Link jest ważny 10 minut. Nie widzisz wiadomości? Sprawdź folder spam.
  </p>
</div>
```

### Design tokens

Use existing design tokens throughout — no hardcoded colors. Facebook button styled identically to Google button (`bg-card hover:bg-muted border border-input`).

---

## Section 3: emails/magic-link.ts

New file, same style as `emails/welcome.ts` — branded HTML email:

- Gradient header: `linear-gradient(135deg, #6366f1, #8b5cf6)` (fioletowy, jak welcome email)
- Icon: ✉ or 🔐
- Heading: "Twój link do logowania"
- Body: "Kliknij przycisk poniżej aby zalogować się do Marketplace AI. Link jest ważny przez 10 minut."
- CTA button: `Zaloguj się →` — links to the magic link URL
- Security note: "Jeśli nie prosiłeś o ten link, zignoruj tę wiadomość."
- Footer: polityka prywatności, regulamin links

```ts
export function magicLinkEmailHtml(url: string): string {
  // returns full HTML string
}
```

---

## Section 4: Environment Variables

### New vars needed

```
# .env.local
AUTH_FACEBOOK_ID=your_facebook_app_id
AUTH_FACEBOOK_SECRET=your_facebook_app_secret
```

`RESEND_API_KEY`, `RESEND_NOREPLY_EMAIL`, `RESEND_CONTACT_EMAIL` — already exist, reused.

### Facebook App setup (manual, outside code)

1. Go to developers.facebook.com → Create App → Consumer type
2. Add product: "Facebook Login for Business"
3. Under Facebook Login settings, add Valid OAuth Redirect URI:
   - Production: `https://marketplace-ai.pl/api/auth/callback/facebook`
   - Development: `http://localhost:3000/api/auth/callback/facebook`
4. Copy App ID and App Secret to env vars
5. App permissions needed: `public_profile`, `email` — both exempt from App Review

### Vercel deployment

Add `AUTH_FACEBOOK_ID` and `AUTH_FACEBOOK_SECRET` to Vercel environment variables (Settings → Environment Variables) for both Preview and Production environments.

---

## Error Handling

- Facebook OAuth errors handled by NextAuth automatically — redirects to `/auth/signin?error=...`
- Magic link: `signIn("resend", { redirect: false })` — never throws to UI; `emailSent` state always set to `true` regardless of Resend API result (prevents email enumeration)
- Resend 100/day free tier limit: if exceeded, user sees confirmation screen but email never arrives — acceptable on current scale; upgrade to $20/month when needed

---

## Out of Scope

- "Resend link" / retry button — deliberately excluded (Option C chosen)
- Microsoft / Apple / other providers
- Changes to dashboard, API routes, middleware
- Database schema changes
