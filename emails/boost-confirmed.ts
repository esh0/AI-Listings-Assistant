export function boostConfirmedEmailHtml(name: string, credits: number): string {
    return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kredyty dodane!</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#d97706,#f59e0b);padding:40px 40px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;">⚡</div>
      <h1 style="margin:0;color:white;font-size:28px;font-weight:700;">Kredyty dodane!</h1>
    </div>
    <div style="padding:40px;">
      <p style="margin:0 0 24px;color:#374151;font-size:16px;line-height:1.6;">Cześć ${name}! Zakup się powiódł — dodaliśmy <strong>${credits} kredytów</strong> do Twojego konta.</p>
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:20px;margin:24px 0;text-align:center;">
        <div style="font-size:48px;font-weight:700;color:#d97706;">+${credits}</div>
        <div style="color:#92400e;font-size:16px;margin-top:8px;">kredytów dodanych do konta</div>
        <div style="color:#6b7280;font-size:13px;margin-top:4px;">Kredyty z Dostawki nie wygasają</div>
      </div>
      <div style="text-align:center;margin:32px 0;">
        <a href="https://marketplace-ai.pl/dashboard/new" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;display:inline-block;">Generuj ogłoszenie →</a>
      </div>
    </div>
    <div style="background:#f9fafb;padding:24px 40px;text-align:center;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">© 2026 Marketplace AI · <a href="https://marketplace-ai.pl/polityka-prywatnosci" style="color:#9ca3af;">Polityka prywatności</a></p>
    </div>
  </div>
</body>
</html>`;
}
