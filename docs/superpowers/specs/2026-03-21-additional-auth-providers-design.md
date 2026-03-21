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

No changes to: `prisma/schema.prisma`, middleware, API routes.

---

## Section 1: auth.ts

Add two providers to the `providers` array. ResendProvider uses `sendVerificationRequest` to reuse the existing `sendEmail()` helper from `lib/email.ts` — consistent with how the welcome email is sent in the `signIn` callback.

```ts
import FacebookProvider from "next-auth/providers/facebook";
import ResendProvider from "next-auth/providers/resend";

providers: [
  GoogleProvider({ ... }), // existing

  FacebookProvider({
    clientId: process.env.AUTH_FACEBOOK_ID!,
    clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
  }),

  ResendProvider({
    // maxAge controls VerificationToken expiry — set to 24h (Auth.js default)
    // UI copy must match: "Link ważny 24 godziny"
    async sendVerificationRequest({ identifier: email, url }) {
      const { sendEmail } = await import("@/lib/email");
      const { magicLinkEmailHtml } = await import("@/emails/magic-link");
      await sendEmail(
        email,
        "Twój link do logowania — Marketplace AI",
        magicLinkEmailHtml(url),
      );
    },
  }),
],
```

**Notes:**
- `sendEmail()` already has RESEND_API_KEY guard, correct `from`/`replyTo`, and error handling — no duplication needed.
- `VerificationToken` model and `PrismaAdapter` are already configured — no additional setup for token storage.
- Token expiry defaults to 24 hours in Auth.js v5. UI copy must say "24 godziny", not "10 minut".

**Welcome email and magic link users:**
The existing `signIn` callback fires for all providers including magic link. For magic link, the user is created when the token is first requested, but `signIn` fires when they click the link — potentially minutes later. The 60-second `createdAt` window check means welcome email will fire reliably only if the user clicks the link within 60 seconds of account creation (first-ever sign-in). This is accepted behavior — magic link users may not receive a welcome email on first sign-in. No code change required; document as known limitation.

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
│  Sprawdź skrzynkę pocztową      │
│  Wysłaliśmy link do: {email}    │
│  Link ważny 24 godziny.         │
│  Nie widzisz? Sprawdź spam.     │
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

Must use `try/finally` to guarantee loading state reset on error:

```ts
const handleEmailSignIn = async (e: React.FormEvent) => {
  e.preventDefault();
  setEmailLoading(true);
  try {
    await signIn("resend", { email, callbackUrl, redirect: false });
    // Always show confirmation regardless of result — prevents email enumeration
    setEmailSent(true);
  } finally {
    setEmailLoading(false);
  }
};
```

**Note on `callbackUrl` flow:** `signIn("resend", { redirect: false })` stores `callbackUrl` in the `VerificationToken`. When the user clicks the magic link, NextAuth handles the `/api/auth/callback/resend` route automatically and redirects to `callbackUrl`. No manual redirect needed on the client side after `emailSent = true`.

### Email input field

Must include `type="email"`, `required`, and `autoComplete="email"` to prevent submission with empty or malformed addresses:

```tsx
<input
  type="email"
  required
  autoComplete="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="twoj@email.pl"
  className="w-full h-12 px-4 rounded-lg border border-input bg-background text-foreground"
/>
```

### Confirmation state (shown when emailSent === true)

```tsx
<div className="text-center space-y-2 py-4">
  <p className="font-medium">Sprawdź skrzynkę pocztową</p>
  <p className="text-sm text-muted-foreground">
    Wysłaliśmy link do: <strong>{email}</strong>
  </p>
  <p className="text-sm text-muted-foreground">
    Link jest ważny 24 godziny. Nie widzisz wiadomości? Sprawdź folder spam.
  </p>
</div>
```

### Facebook button — icon and color

lucide-react has no Facebook icon. Use an inline SVG with the official Facebook `f` logo. The brand color `#1877F2` is a hardcoded exception (same policy as platform-specific colors like OLX orange). Button outer style matches Google button (`bg-card hover:bg-muted border border-input`):

```tsx
<Button
  onClick={handleFacebookSignIn}
  className="w-full h-12 bg-card hover:bg-muted text-foreground border border-input"
>
  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
  Kontynuuj z Facebook
</Button>
```

### Design tokens

Use existing design tokens throughout — no hardcoded colors except Facebook brand blue in SVG fill.

---

## Section 3: emails/magic-link.ts

New file, same style as `emails/welcome.ts` — pure HTML string, no emoji in body (inconsistent email client rendering), use text symbols instead.

```ts
export function magicLinkEmailHtml(url: string): string { ... }
```

Template structure:
- Gradient header: `linear-gradient(135deg, #6366f1, #8b5cf6)` — matches welcome email
- Header icon: use Unicode lock symbol `&#128274;` or omit — no emoji
- Heading: "Twój link do logowania"
- Body: "Kliknij przycisk poniżej, aby zalogować się do Marketplace AI. Link jest ważny przez 24 godziny."
- CTA button: `Zaloguj się →` (styled same as other email CTAs — gradient bg `#6366f1` to `#8b5cf6`, white text)
- Security note: "Jeśli nie prosiłes(-aś) o ten link, zignoruj tę wiadomość. Twoje konto jest bezpieczne."
- Footer: links to `/polityka-prywatnosci` and `/regulamin`, © 2026 Marketplace AI

---

## Section 4: Environment Variables

### New vars needed

```
# .env.local
AUTH_FACEBOOK_ID=your_facebook_app_id
AUTH_FACEBOOK_SECRET=your_facebook_app_secret
```

`RESEND_API_KEY`, `RESEND_NOREPLY_EMAIL`, `RESEND_CONTACT_EMAIL` — already exist, reused by `sendEmail()`.

### Facebook App setup (manual, outside code)

1. Go to developers.facebook.com → Create App → Consumer type
2. Add product: "Facebook Login for Business"
3. Under Facebook Login settings, add Valid OAuth Redirect URIs:
   - Production: `https://marketplace-ai.pl/api/auth/callback/facebook`
   - Development: `http://localhost:3000/api/auth/callback/facebook`
4. Copy App ID → `AUTH_FACEBOOK_ID`, App Secret → `AUTH_FACEBOOK_SECRET`
5. Permissions needed: `public_profile`, `email` — both exempt from App Review
6. **IMPORTANT:** App starts in Development mode — only test users can log in. Before launch, switch to **Live mode** in App Dashboard → App Review → Go Live. This is required for real users to authenticate.

### Vercel deployment

Add `AUTH_FACEBOOK_ID` and `AUTH_FACEBOOK_SECRET` to Vercel environment variables (Settings → Environment Variables) for both Preview and Production environments.

---

## Error Handling

- Facebook OAuth errors: handled by NextAuth automatically — redirects to `/auth/signin?error=...`
- Magic link submit: `try/finally` guarantees `emailLoading` resets; `emailSent` always set to `true` on success regardless of Resend result (prevents email enumeration)
- Resend 100/day free tier: if exceeded, user sees confirmation screen but email never arrives — acceptable at current scale; upgrade to $20/month when needed

---

## Known Limitations

- **Welcome email for magic link users:** The 60-second `createdAt` window in the `signIn` callback means new users who sign in via magic link may not receive a welcome email (link click typically happens after 60 seconds). Accepted — no code change.
- **Resend 100/day cap:** Hard limit on free plan. No retry UI by design (option C).

---

## Out of Scope

- "Resend link" / retry button — deliberately excluded (Option C chosen)
- Microsoft / Apple / other providers
- Changes to dashboard, API routes, middleware
- Database schema changes
