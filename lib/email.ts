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
