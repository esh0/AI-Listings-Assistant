const PLAN_NAMES: Record<string, string> = {
    STARTER: "Starter",
    RESELER: "Reseler",
};

const PLAN_CREDITS: Record<string, number> = {
    STARTER: 30,
    RESELER: 80,
};

const PLAN_PRICES: Record<string, string> = {
    STARTER: "19,99 zł",
    RESELER: "49,99 zł",
};

export function subscriptionConfirmedEmailHtml(name: string, plan: string): string {
    const planName = PLAN_NAMES[plan] ?? plan;
    const credits = PLAN_CREDITS[plan] ?? 0;
    const price = PLAN_PRICES[plan] ?? "—";

    return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Subskrypcja aktywna!</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#059669,#10b981);padding:40px 40px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;">✅</div>
      <h1 style="margin:0;color:white;font-size:28px;font-weight:700;">Subskrypcja aktywna!</h1>
    </div>
    <div style="padding:40px;">
      <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.6;">Cześć ${name}! Twoja subskrypcja planu <strong>${planName}</strong> została aktywowana.</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin:24px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="color:#374151;font-size:15px;padding:6px 0;">Plan</td><td style="color:#374151;font-size:15px;font-weight:600;text-align:right;">${planName}</td></tr>
          <tr><td style="color:#374151;font-size:15px;padding:6px 0;">Kredyty miesięcznie</td><td style="color:#374151;font-size:15px;font-weight:600;text-align:right;">${credits}</td></tr>
          <tr><td style="color:#374151;font-size:15px;padding:6px 0;">Opłata miesięczna</td><td style="color:#374151;font-size:15px;font-weight:600;text-align:right;">${price}</td></tr>
        </table>
      </div>
      <div style="text-align:center;margin:32px 0;">
        <a href="https://marketplace-ai.pl/dashboard" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;display:inline-block;">Przejdź do dashboardu →</a>
      </div>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;">
      <p style="margin:0;color:#6b7280;font-size:14px;">Możesz zarządzać subskrypcją w panelu bocznym dashboardu (opcja „Zarządzaj subskrypcją").</p>
    </div>
    <div style="background:#f9fafb;padding:24px 40px;text-align:center;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">© 2026 Marketplace AI · <a href="https://marketplace-ai.pl/polityka-prywatnosci" style="color:#9ca3af;">Polityka prywatności</a> · <a href="https://marketplace-ai.pl/regulamin" style="color:#9ca3af;">Regulamin</a></p>
    </div>
  </div>
</body>
</html>`;
}
