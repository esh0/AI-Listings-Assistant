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
    const dashboardUrl = `${SITE_URL}/dashboard/new`;

    return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Zostało Ci tylko 1 generacja</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#d97706,#f59e0b);padding:40px 40px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;">⚡</div>
      <h1 style="margin:0;color:white;font-size:28px;font-weight:700;">Zostało Ci tylko 1 generacja!</h1>
    </div>
    <div style="padding:40px;">
      <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.6;">Cześć ${name}! W Twoim planie <strong>${planDisplay}</strong> została już tylko <strong>1 generacja</strong> w tym miesiącu.</p>
      <p style="margin:0 0 24px;color:#374151;font-size:16px;line-height:1.6;">Żeby nie zatrzymywać się w połowie drogi, możesz szybko doładować konto:</p>
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:20px;margin:0 0 24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="color:#374151;font-size:15px;padding:6px 0;">Doładowanie kredytów</td><td style="color:#374151;font-size:15px;font-weight:600;text-align:right;">10 generacji jednorazowo</td></tr>
          <tr><td style="color:#374151;font-size:15px;padding:6px 0;">Cena</td><td style="color:#374151;font-size:15px;font-weight:600;text-align:right;">9,99 zł</td></tr>
        </table>
      </div>
      <div style="text-align:center;margin:32px 0 16px;">
        <a href="${pricingUrl}" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;display:inline-block;">Dokup kredyty →</a>
      </div>
      <p style="text-align:center;margin:0 0 32px;">
        <a href="${pricingUrl}" style="color:#6366f1;font-size:14px;text-decoration:none;">Sprawdź też plany Starter i Reseler z więcej generacjami miesięcznie →</a>
      </p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;">
      <p style="margin:0;color:#6b7280;font-size:14px;">Masz jeszcze 1 generację — <a href="${dashboardUrl}" style="color:#6366f1;">użyj jej teraz</a>.</p>
    </div>
    <div style="background:#f9fafb;padding:24px 40px;text-align:center;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">© 2026 Marketplace AI · <a href="${SITE_URL}/polityka-prywatnosci" style="color:#9ca3af;">Polityka prywatności</a> · <a href="${SITE_URL}/regulamin" style="color:#9ca3af;">Regulamin</a></p>
    </div>
  </div>
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
