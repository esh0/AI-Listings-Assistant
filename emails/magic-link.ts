const SITE_URL = "https://marketplace-ai.pl";

export function magicLinkEmailHtml(url: string): string {
    return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Twój link do logowania</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px 40px 32px;text-align:center;">
      <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:12px 20px;margin-bottom:16px;">
        <span style="color:white;font-weight:700;font-size:20px;">Marketplace AI</span>
      </div>
      <h1 style="margin:0;color:white;font-size:28px;font-weight:700;">Twój link do logowania</h1>
    </div>
    <div style="padding:40px;">
      <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.6;">Kliknij przycisk poniżej, aby zalogować się do <strong>Marketplace AI</strong>. Link jest ważny przez <strong>24 godziny</strong>.</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${url}" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;display:inline-block;">Zaloguj się →</a>
      </div>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;">
      <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">Jeśli nie prosiłeś(-aś) o ten link, zignoruj tę wiadomość. Twoje konto jest bezpieczne.</p>
    </div>
    <div style="background:#f9fafb;padding:24px 40px;text-align:center;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">© 2026 Marketplace AI · <a href="${SITE_URL}/polityka-prywatnosci" style="color:#9ca3af;">Polityka prywatności</a> · <a href="${SITE_URL}/regulamin" style="color:#9ca3af;">Regulamin</a></p>
    </div>
  </div>
</body>
</html>`;
}
