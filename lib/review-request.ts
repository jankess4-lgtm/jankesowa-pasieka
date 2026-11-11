import { Resend } from "resend";
import { GOOGLE_WRITE_REVIEW_URL } from "@/lib/google-profile";

export const REVIEW_REQUEST_FROM = "Jankesowa Pasieka <kontakt@jankesowapasieka.pl>";
export const REVIEW_REQUEST_TEST_INBOX = "jankesowa.pasieka@gmail.com";
const REVIEW_DELAY_MS = 7 * 24 * 60 * 60 * 1000;

export type ReviewRequestInput = {
  sessionId: string;
  customerEmail: string;
  customerName?: string;
};

export type ReviewRequestEmail = {
  subject: string;
  html: string;
  text: string;
};

function firstNameFrom(name?: string): string | null {
  if (!name) return null;
  const first = name.trim().split(/\s+/)[0] ?? "";
  if (first.length < 2 || first.length > 30) return null;
  if (!/^[A-Za-zÀ-öø-ÿĄąĆćĘęŁłŃńÓóŚśŹźŻż-]+$/.test(first)) return null;
  return first;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Calm, one-time review request. No incentives — Google policy. */
export function buildReviewRequestEmail(input: { customerName?: string }): ReviewRequestEmail {
  const first = firstNameFrom(input.customerName);
  const greeting = first ? `Dzień dobry ${first},` : "Dzień dobry,";
  const greetingHtml = first ? `Dzień dobry ${escapeHtml(first)},` : "Dzień dobry,";

  const subject = "Krótka prośba od pszczelarza";

  const text = `${greeting}

minął już około tydzień od Twojego zamówienia w Jankesowej Pasiece. Mam nadzieję, że miód dobrze do Was dotarł i smakuje.

Jeśli masz chwilę, będę wdzięczny za szczerą opinię w Google. Pomaga to innym znaleźć miód prosto z pasieki — od pszczelarza, bez pośredników.

Wystaw opinię w Google:
${GOOGLE_WRITE_REVIEW_URL}

To oczywiście nieobowiązkowe. Gdyby coś było nie tak z przesyłką albo słoikiem, napisz śmiało na kontakt@jankesowapasieka.pl albo zadzwoń pod +48 514 070 298 — chętnie pomogę.

Serdecznie pozdrawiam
Krzysztof
Jankesowa Pasieka
Topolno, Kujawy nad Wisłą
https://jankesowapasieka.pl

To jednorazowa wiadomość związana z Twoim zamówieniem, nie zapisujemy Cię do newslettera.
`;

  const html = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#F5EDE4;font-family:Georgia,'Times New Roman',serif;color:#78350F;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px 40px;">
    <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.14em;text-transform:uppercase;color:#92400E;font-family:Arial,Helvetica,sans-serif;">Jankesowa Pasieka</p>
    <h1 style="margin:0 0 24px;font-size:28px;font-weight:normal;line-height:1.25;color:#78350F;">${subject}</h1>
    <div style="background:#ffffff;border:1px solid #E8D9C8;border-radius:16px;padding:28px 28px 24px;">
      <p style="margin:0 0 16px;font-size:17px;line-height:1.6;">${greetingHtml}</p>
      <p style="margin:0 0 16px;font-size:17px;line-height:1.6;">minął już około tydzień od Twojego zamówienia w Jankesowej Pasiece. Mam nadzieję, że miód dobrze do Was dotarł i smakuje.</p>
      <p style="margin:0 0 24px;font-size:17px;line-height:1.6;">Jeśli masz chwilę, będę wdzięczny za szczerą opinię w Google. Pomaga to innym znaleźć miód prosto z pasieki — od pszczelarza, bez pośredników.</p>
      <p style="margin:0 0 24px;text-align:center;">
        <a href="${GOOGLE_WRITE_REVIEW_URL}" style="display:inline-block;background:#92400E;color:#F5EDE4;text-decoration:none;padding:12px 22px;border-radius:999px;font-family:Arial,Helvetica,sans-serif;font-size:15px;">Wystaw opinię w Google</a>
      </p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#92400E;">To oczywiście nieobowiązkowe. Gdyby coś było nie tak z przesyłką albo słoikiem, napisz śmiało na <a href="mailto:kontakt@jankesowapasieka.pl" style="color:#92400E;">kontakt@jankesowapasieka.pl</a> albo zadzwoń pod <a href="tel:+48514070298" style="color:#92400E;">+48 514 070 298</a> — chętnie pomogę.</p>
      <p style="margin:24px 0 0;font-size:17px;line-height:1.6;">Serdecznie pozdrawiam<br />Krzysztof<br />Jankesowa Pasieka<br />Topolno, Kujawy nad Wisłą</p>
    </div>
    <p style="margin:20px 0 0;font-size:12px;line-height:1.5;color:#A16207;font-family:Arial,Helvetica,sans-serif;">To jednorazowa wiadomość związana z Twoim zamówieniem, nie zapisujemy Cię do newslettera.<br /><a href="https://jankesowapasieka.pl" style="color:#92400E;">jankesowapasieka.pl</a></p>
  </div>
</body>
</html>`;

  return { subject, html, text };
}

export type ReviewRequestResolution =
  | { action: "skip"; reason: string }
  | { action: "schedule"; to: string; test: boolean; scheduledAt: string };

/**
 * Live customer e-mails go out only when REVIEW_REQUEST_LIVE=true.
 * REVIEW_REQUEST_TEST=true schedules the same message solely to the test inbox,
 * never to the customer's address. Default (unset) is skip — safe on preview.
 */
export function resolveReviewRequest(
  input: ReviewRequestInput,
  now = new Date()
): ReviewRequestResolution {
  const email = input.customerEmail.trim();
  if (!email || !email.includes("@")) {
    return { action: "skip", reason: "brak adresu e-mail klienta" };
  }

  const live = process.env.REVIEW_REQUEST_LIVE === "true";
  const test = process.env.REVIEW_REQUEST_TEST === "true";
  const scheduledAt = new Date(now.getTime() + REVIEW_DELAY_MS).toISOString();

  if (live) {
    return { action: "schedule", to: email, test: false, scheduledAt };
  }
  if (test) {
    return {
      action: "schedule",
      to: process.env.REVIEW_REQUEST_TEST_TO || REVIEW_REQUEST_TEST_INBOX,
      test: true,
      scheduledAt,
    };
  }
  return {
    action: "skip",
    reason: "REVIEW_REQUEST_LIVE i REVIEW_REQUEST_TEST nie są włączone — pomijam wysyłkę",
  };
}

export async function scheduleReviewRequestEmail(input: ReviewRequestInput): Promise<void> {
  const decision = resolveReviewRequest(input);
  const email = buildReviewRequestEmail({ customerName: input.customerName });

  if (decision.action === "skip") {
    console.info("[review-request] pominięto", {
      sessionId: input.sessionId,
      reason: decision.reason,
    });
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const subject = decision.test ? `[TEST] ${email.subject}` : email.subject;

  const { error } = await resend.emails.send(
    {
      from: REVIEW_REQUEST_FROM,
      to: decision.to,
      replyTo: "kontakt@jankesowapasieka.pl",
      subject,
      html: email.html,
      text: email.text,
      scheduledAt: decision.scheduledAt,
    },
    { idempotencyKey: `review-request-${input.sessionId}` }
  );

  if (error) {
    console.error("[review-request] Resend error", error);
    return;
  }

  console.info("[review-request] zaplanowano", {
    sessionId: input.sessionId,
    to: decision.to,
    test: decision.test,
    scheduledAt: decision.scheduledAt,
  });
}
