export function welcomeEmailHtml(name: string): string {
    return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Witaj w Marketplace AI!</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px 40px 32px;text-align:center;">
      <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:12px 20px;margin-bottom:16px;">
        <span style="color:white;font-weight:700;font-size:20px;">Marketplace AI</span>
      </div>
      <h1 style="margin:0;color:white;font-size:28px;font-weight:700;">Witaj, ${name}!</h1>
    </div>
    <div style="padding:40px;">
      <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.6;">Twoje konto w <strong>Marketplace AI</strong> jest gotowe. Możesz teraz generować profesjonalne ogłoszenia sprzedażowe na OLX, Allegro Lokalnie, Facebook Marketplace i Vinted.</p>
      <p style="margin:0 0 24px;color:#374151;font-size:16px;line-height:1.6;">Twój darmowy plan zawiera <strong>5 kredytów miesięcznie</strong> — wystarczy na przetestowanie wszystkich funkcji aplikacji.</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="https://marketplace-ai.pl/dashboard" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;display:inline-block;">Przejdź do dashboardu →</a>
      </div>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;">
      <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">Jeśli masz pytania, odpiszemy na: <a href="mailto:kontakt@marketplace-ai.pl" style="color:#6366f1;">kontakt@marketplace-ai.pl</a></p>
    </div>
    <div style="background:#f9fafb;padding:24px 40px;text-align:center;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">© 2026 Marketplace AI · <a href="https://marketplace-ai.pl/polityka-prywatnosci" style="color:#9ca3af;">Polityka prywatności</a> · <a href="https://marketplace-ai.pl/regulamin" style="color:#9ca3af;">Regulamin</a></p>
    </div>
  </div>
</body>
</html>`;
}
