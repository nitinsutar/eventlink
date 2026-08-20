import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(key);
}

function getFrom() {
  return process.env.RESEND_FROM_EMAIL || "EventLink <onboarding@resend.dev>";
}

export async function sendInquiryNotification(params: {
  to: string;
  vendorName: string;
  managerName: string;
  message: string;
  eventType?: string | null;
  city?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
}) {
  const { to, vendorName, managerName, message, eventType, city, contactPhone, contactEmail } =
    params;

  const subject = `New inquiry for ${vendorName}`;

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color: #111;">New inquiry received</h2>
      <p>Hi <strong>${vendorName}</strong>,</p>
      <p>You have a new inquiry from <strong>${managerName}</strong>.</p>
      <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <p style="margin: 0 0 8px;"><strong>Message:</strong></p>
        <p style="margin: 0; white-space: pre-wrap;">${message}</p>
      </div>
      ${eventType ? `<p><strong>Event type:</strong> ${eventType}</p>` : ""}
      ${city ? `<p><strong>City:</strong> ${city}</p>` : ""}
      ${contactPhone ? `<p><strong>Phone:</strong> ${contactPhone}</p>` : ""}
      ${contactEmail ? `<p><strong>Email:</strong> ${contactEmail}</p>` : ""}
      <p style="margin-top: 24px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://eventlink.in"}/dashboard/vendor"
           style="background: #F59E0B; color: #000; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          View in Dashboard
        </a>
      </p>
      <p style="color: #888; font-size: 12px; margin-top: 32px;">EventLink — India's event marketplace</p>
    </div>
  `;

  const resend = getResend();
  return resend.emails.send({
    from: getFrom(),
    to,
    subject,
    html,
  });
}

export async function sendReviewNotification(params: {
  to: string;
  vendorName: string;
  managerName: string;
  rating: number;
  comment?: string | null;
}) {
  const { to, vendorName, managerName, rating, comment } = params;

  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  const subject = `New ${rating}-star review for ${vendorName}`;

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color: #111;">You received a new review</h2>
      <p>Hi <strong>${vendorName}</strong>,</p>
      <p><strong>${managerName}</strong> left you a review.</p>
      <p style="font-size: 24px; color: #F59E0B; margin: 16px 0;">${stars}</p>
      ${comment ? `<div style="background: #f5f5f5; border-radius: 8px; padding: 16px;"><p style="margin:0; white-space: pre-wrap;">${comment}</p></div>` : ""}
      <p style="margin-top: 24px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://eventlink.in"}/dashboard/vendor"
           style="background: #F59E0B; color: #000; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          View in Dashboard
        </a>
      </p>
      <p style="color: #888; font-size: 12px; margin-top: 32px;">EventLink — India's event marketplace</p>
    </div>
  `;

  const resend = getResend();
  return resend.emails.send({
    from: getFrom(),
    to,
    subject,
    html,
  });
}
