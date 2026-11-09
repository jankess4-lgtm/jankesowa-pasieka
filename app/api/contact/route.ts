import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Jankesowa Pasieka <kontakt@jankesowapasieka.pl>";
const OWNER_TO = "jankesowa.pasieka@gmail.com";
const SHOP_URL = "https://jankesowapasieka.pl";
const LOGO_URL = `${SHOP_URL}/logo.png`;

const MAX_NAME = 120;
const MAX_EMAIL = 200;
const MAX_PHONE = 40;
const MAX_MESSAGE = 4000;

/** Simple in-memory rate limit (best-effort on serverless). */
const recentByIp = new Map<string, number[]>();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= MAX_EMAIL;
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function allowRequest(ip: string): boolean {
  const now = Date.now();
  const prev = (recentByIp.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (prev.length >= RATE_MAX) {
    recentByIp.set(ip, prev);
    return false;
  }
  prev.push(now);
  recentByIp.set(ip, prev);
  return true;
}

function ownerEmailHtml(params: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): string {
  const { name, email, phone, message } = params;
  return `
    <div style="font-family:Georgia,serif;color:#3d2b1f;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="margin:0 0 16px;font-size:22px">Nowa wiadomość z formularza kontaktowego</h2>
      <p style="margin:0 0 8px"><strong>Imię i nazwisko:</strong> ${name}</p>
      <p style="margin:0 0 8px"><strong>Email:</strong> ${email}</p>
      ${phone ? `<p style="margin:0 0 8px"><strong>Telefon:</strong> ${phone}</p>` : ""}
      <p style="margin:16px 0 8px"><strong>Wiadomość:</strong></p>
      <p style="margin:0;white-space:pre-wrap;line-height:1.5">${message}</p>
    </div>
  `;
}

function customerConfirmHtml(params: {
  name: string;
  message: string;
}): string {
  const { name, message } = params;
  const firstName = name.split(/\s+/)[0] || name;
  return `
    <div style="font-family:Georgia,'Times New Roman',serif;background:#F5EDE4;padding:28px 16px">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid #e8d9c8;overflow:hidden">
        <div style="background:#3d2b1f;padding:20px 28px;text-align:center">
          <img src="${LOGO_URL}" alt="Jankesowa Pasieka" width="72" height="72" style="display:inline-block;border-radius:50%;background:#fff;object-fit:contain" />
          <div style="margin-top:10px;color:#f5e6c8;font-size:18px;letter-spacing:0.5px">Jankesowa Pasieka</div>
        </div>
        <div style="padding:28px;color:#3d2b1f;font-size:16px;line-height:1.55">
          <p style="margin:0 0 14px">Dzień dobry${firstName ? `, ${firstName}` : ""},</p>
          <p style="margin:0 0 14px">
            dziękuję za wiadomość. Dotarła do mnie bezpiecznie i odpowiem
            <strong>niezwłocznie</strong>, zwykle w ciągu <strong>24 godzin</strong>
            (w dni robocze).
          </p>
          <p style="margin:0 0 8px;font-size:14px;color:#6b5344">Kopia Twojej wiadomości:</p>
          <div style="margin:0 0 20px;padding:14px 16px;background:#F5EDE4;border-radius:12px;border:1px solid #e8d9c8;white-space:pre-wrap;font-size:15px">${message}</div>
          <p style="margin:0 0 14px">
            Jeśli coś pilnego, możesz też zadzwonić: <a href="tel:+48514070298" style="color:#b8860b;text-decoration:none">+48 514 070 298</a>.
          </p>
          <p style="margin:0 0 4px">Serdecznie pozdrawiam,</p>
          <p style="margin:0 0 2px"><strong>Krzysztof Jankowski</strong></p>
          <p style="margin:0 0 16px">Jankesowa Pasieka</p>
          <p style="margin:0;font-size:14px">
            <a href="${SHOP_URL}" style="color:#b8860b">${SHOP_URL.replace("https://", "")}</a><br />
            <a href="mailto:kontakt@jankesowapasieka.pl" style="color:#b8860b">kontakt@jankesowapasieka.pl</a>
          </p>
        </div>
      </div>
      <p style="max-width:560px;margin:14px auto 0;text-align:center;font-size:12px;color:#8a7464;font-family:system-ui,sans-serif">
        Ta wiadomość została wysłana automatycznie po wypełnieniu formularza na stronie.
      </p>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Brak konfiguracji poczty" }, { status: 500 });
    }

    const ip = clientIp(request);
    if (!allowRequest(ip)) {
      return NextResponse.json(
        { error: "Zbyt wiele prób. Spróbuj za kilka minut." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const phone = String(body?.phone ?? "").trim();
    const message = String(body?.message ?? "").trim();
    const honeypot = String(body?.website ?? body?.company ?? "").trim();

    // Bots fill hidden fields — silently succeed without sending.
    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Prosimy wypełnić wymagane pola" }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Nieprawidłowy adres e-mail" }, { status: 400 });
    }
    if (
      name.length > MAX_NAME ||
      phone.length > MAX_PHONE ||
      message.length > MAX_MESSAGE
    ) {
      return NextResponse.json({ error: "Zbyt długa treść formularza" }, { status: 400 });
    }

    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      phone: escapeHtml(phone),
      message: escapeHtml(message),
    };

    // 1) Notify shop owner (reply goes to the customer).
    const ownerResult = await resend.emails.send({
      from: FROM,
      to: OWNER_TO,
      replyTo: email,
      subject: `Nowa wiadomość od ${name}`,
      html: ownerEmailHtml(safe),
    });

    if (ownerResult.error) {
      console.error("contact owner email error:", ownerResult.error);
      return NextResponse.json({ error: "Błąd wysyłania" }, { status: 500 });
    }

    // 2) One automatic confirmation to the customer (fixed template only).
    const confirmResult = await resend.emails.send({
      from: FROM,
      to: email,
      replyTo: "kontakt@jankesowapasieka.pl",
      subject: "Dziękujemy za wiadomość — Jankesowa Pasieka",
      html: customerConfirmHtml({ name: safe.name, message: safe.message }),
    });

    if (confirmResult.error) {
      // Owner already got the message; log but still return success to the customer.
      console.error("contact confirm email error:", confirmResult.error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Błąd wysyłania" }, { status: 500 });
  }
}
