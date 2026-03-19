export function subscriptionCancelledEmailHtml(name: string): string {
    return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Subskrypcja anulowana</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#6b7280,#9ca3af);padding:40px 40px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;">📋</div>
      <h1 style="margin:0;color:white;font-size:28px;font-weight:700;">Subskrypcja anulowana</h1>
    </div>
    <div style="padding:40px;">
      <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.6;">Cześć ${name}. Twoja subskrypcja została anulowana i Twoje konto zostało przełączone na <strong>plan Free</strong>.</p>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:24px 0;">
        <p style="margin:0 0 12px;color:#374151;font-size:15px;font-weight:600;">Co zmienia się na planie Free?</p>
        <ul style="margin:0;padding:0 0 0 20px;color:#6b7280;font-size:14px;line-height:1.8;">
          <li>5 kredytów miesięcznie (zamiast 30 lub 80)</li>
          <li>Do 3 zdjęć per ogłoszenie</li>
          <li>Brak dostępu do szablonów (plan Reseler)</li>
        </ul>
      </div>
      <p style="margin:0 0 24px;color:#374151;font-size:16px;line-height:1.6;">Wszystkie Twoje ogłoszenia i dane są bezpieczne i nadal dostępne. Możesz wrócić do płatnego planu w dowolnym momencie.</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="https://marketplace-ai.pl/pricing" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;display:inline-block;">Zobacz plany →</a>
      </div>
    </div>
    <div style="background:#f9fafb;padding:24px 40px;text-align:center;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">© 2026 Marketplace AI · <a href="https://marketplace-ai.pl/polityka-prywatnosci" style="color:#9ca3af;">Polityka prywatności</a></p>
    </div>
  </div>
</body>
</html>`;
}
