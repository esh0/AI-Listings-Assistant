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
            replyTo: CONTACT_EMAIL,
            to,
            subject,
            html,
        });
    } catch (err) {
        console.error("[email] Failed to send email to", to, err);
        // Don't throw — email failures should not break the main flow
    }
}

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
