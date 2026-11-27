import { Resend } from "resend";

/** Same verified From as other customer-facing Resend messages (contact, review request). */
export const ORDER_CONFIRMATION_FROM = "Jankesowa Pasieka <kontakt@jankesowapasieka.pl>";
export const ORDER_CONFIRMATION_REPLY_TO = "kontakt@jankesowapasieka.pl";
export const SHOP_URL = "https://jankesowapasieka.pl";
const LOGO_URL = `${SHOP_URL}/logo.png`;

export type OrderConfirmationProduct = {
  name: string;
  quantity: number;
  amount: number;
};

export type OrderConfirmationInput = {
  orderId: string;
  customerName?: string | null;
  customerEmail?: string | null;
  totalAmount: number;
  deliveryMethod?: string | null;
  parcelLocker?: string | null;
  address?: string | null;
  discountCode?: string | null;
  discountAmount?: number;
  shippingOptionAmount?: number;
  products?: OrderConfirmationProduct[];
};

export type OrderConfirmationEmail = {
  subject: string;
  html: string;
  text: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatPln(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  if (Number.isInteger(rounded)) return `${rounded} zł`;
  return `${rounded.toFixed(2).replace(".", ",")} zł`;
}

export function isRealCustomerEmail(email?: string | null): boolean {
  if (!email) return false;
  const value = email.trim();
  if (!value || value === "Brak") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 200;
}

function isShippingLine(name: string): boolean {
  const lower = name.toLowerCase();
  return (
    lower.includes("dostawa") ||
    lower.includes("paczkomat") ||
    lower.includes("odbiór osobisty") ||
    lower.includes("odbior osobisty")
  );
}

function splitItems(order: OrderConfirmationInput): {
  products: OrderConfirmationProduct[];
  shipping: number;
} {
  const products: OrderConfirmationProduct[] = [];
  let shippingFromItems = 0;
  for (const item of order.products || []) {
    if (isShippingLine(item.name || "")) {
      shippingFromItems += item.amount || 0;
    } else {
      products.push(item);
    }
  }
  const fromOption =
    typeof order.shippingOptionAmount === "number" && order.shippingOptionAmount > 0
      ? order.shippingOptionAmount
      : 0;
  return { products, shipping: fromOption > 0 ? fromOption : shippingFromItems };
}

function shippingLabel(method?: string | null): string {
  if (method === "parcel") return "Dostawa do Paczkomatu InPost";
  if (method === "address") return "Dostawa kurierem";
  return "Dostawa";
}

function deliveryText(order: OrderConfirmationInput): { text: string; html: string } {
  const method = order.deliveryMethod || "";

  if (method === "parcel") {
    const locker = (order.parcelLocker || "").trim();
    const lockerLine = locker
      ? `Przesyłkę wyślę do Paczkomatu InPost: ${locker}.`
      : "Przesyłkę wyślę do wybranego Paczkomatu InPost.";
    const rest =
      "Zwykle nadaję paczkę w ciągu 1–2 dni roboczych. Numer przesyłki oraz informacje o odbiorze InPost wyśle osobno — SMS-em, e-mailem albo w aplikacji.";
    const text = `${lockerLine}\n\n${rest}`;
    const lockerHtml = locker
      ? `Przesyłkę wyślę do Paczkomatu InPost: <strong>${escapeHtml(locker)}</strong>.`
      : "Przesyłkę wyślę do wybranego Paczkomatu InPost.";
    return {
      text,
      html: `<p style="margin:0 0 12px;font-size:17px;line-height:1.6;">${lockerHtml}</p><p style="margin:0;font-size:17px;line-height:1.6;">${rest}</p>`,
    };
  }

  if (method === "address") {
    const address = (order.address || "").trim();
    const intro = address
      ? `Przesyłkę wyślę kurierem pod adres:\n${address}`
      : "Przesyłkę wyślę kurierem pod podany adres.";
    const rest =
      "Zwykle nadaję paczkę w ciągu 1–2 dni roboczych. Numer przesyłki i powiadomienia o doręczeniu prześle osobno przewoźnik.";
    const text = `${intro}\n\n${rest}`;
    const introHtml = address
      ? `Przesyłkę wyślę kurierem pod adres:<br /><strong>${escapeHtml(address)}</strong>`
      : "Przesyłkę wyślę kurierem pod podany adres.";
    return {
      text,
      html: `<p style="margin:0 0 12px;font-size:17px;line-height:1.6;">${introHtml}</p><p style="margin:0;font-size:17px;line-height:1.6;">${rest}</p>`,
    };
  }

  if (method === "pickup") {
    const text =
      "Zamówienie będzie do odbioru osobiście. Odezwę się, żeby umówić dogodny termin i miejsce — w Topolnie, w Bydgoszczy albo w Świeciu.";
    return {
      text,
      html: `<p style="margin:0;font-size:17px;line-height:1.6;">${text}</p>`,
    };
  }

  const fallback = "Szczegóły dostawy potwierdzę w osobnej wiadomości.";
  return {
    text: fallback,
    html: `<p style="margin:0;font-size:17px;line-height:1.6;">${fallback}</p>`,
  };
}

export function buildOrderConfirmationEmail(order: OrderConfirmationInput): OrderConfirmationEmail {
  const greeting = "Dzień dobry,";
  const orderId = (order.orderId || "").trim() || "—";
  const subject = `Dziękujemy za zamówienie ${orderId} – Jankesowa Pasieka`;

  const { products, shipping } = splitItems(order);
  const discountAmount = order.discountAmount && order.discountAmount > 0 ? order.discountAmount : 0;
  const discountCode = (order.discountCode || "").trim();

  const productLines = products.map((item) => {
    const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
    const name = item.name || "Produkt";
    return `${qty} × ${name} — ${formatPln(item.amount)}`;
  });
  if (shipping > 0) {
    productLines.push(`${shippingLabel(order.deliveryMethod)} — ${formatPln(shipping)}`);
  } else if (order.deliveryMethod === "parcel" || order.deliveryMethod === "address") {
    productLines.push(`${shippingLabel(order.deliveryMethod)} — darmowa wysyłka`);
  }

  const productLinesHtml = products
    .map((item) => {
      const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
      const name = escapeHtml(item.name || "Produkt");
      return `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #E8D9C8;font-size:16px;line-height:1.5;">${qty}&nbsp;× ${name}</td>
        <td style="padding:8px 0 8px 16px;border-bottom:1px solid #E8D9C8;font-size:16px;line-height:1.5;text-align:right;white-space:nowrap;">${formatPln(item.amount)}</td>
      </tr>`;
    })
    .join("");

  let shippingRow = "";
  if (shipping > 0) {
    shippingRow = `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #E8D9C8;font-size:16px;line-height:1.5;">${escapeHtml(shippingLabel(order.deliveryMethod))}</td>
      <td style="padding:8px 0 8px 16px;border-bottom:1px solid #E8D9C8;font-size:16px;line-height:1.5;text-align:right;white-space:nowrap;">${formatPln(shipping)}</td>
    </tr>`;
  } else if (order.deliveryMethod === "parcel" || order.deliveryMethod === "address") {
    shippingRow = `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #E8D9C8;font-size:16px;line-height:1.5;">${escapeHtml(shippingLabel(order.deliveryMethod))}</td>
      <td style="padding:8px 0 8px 16px;border-bottom:1px solid #E8D9C8;font-size:16px;line-height:1.5;text-align:right;white-space:nowrap;">darmowa wysyłka</td>
    </tr>`;
  }

  const discountLine = discountAmount
    ? `Rabat${discountCode ? ` (kod ${discountCode})` : ""}: −${formatPln(discountAmount)}`
    : "";
  const discountRow = discountAmount
    ? `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #E8D9C8;font-size:16px;line-height:1.5;">Rabat${discountCode ? ` (kod ${escapeHtml(discountCode)})` : ""}</td>
      <td style="padding:8px 0 8px 16px;border-bottom:1px solid #E8D9C8;font-size:16px;line-height:1.5;text-align:right;white-space:nowrap;">−${formatPln(discountAmount)}</td>
    </tr>`
    : "";

  const delivery = deliveryText(order);

  const text = `${greeting}

dziękuję za zamówienie w Jankesowej Pasiece. Potwierdzam, że zamówienie ${orderId} zostało opłacone i do mnie dotarło.

Zamówione produkty:
${productLines.join("\n")}${discountLine ? `\n${discountLine}` : ""}

Razem: ${formatPln(order.totalAmount)}

${delivery.text}

Gdyby pojawiły się pytania, odpowiedz na tę wiadomość albo napisz na kontakt@jankesowapasieka.pl — chętnie pomogę.

Serdecznie pozdrawiam
Jankesowa Pasieka – Kujawy
${SHOP_URL}
`;

  const html = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#F5EDE4;font-family:Georgia,'Times New Roman',serif;color:#78350F;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px 40px;">
    <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.14em;text-transform:uppercase;color:#92400E;font-family:Arial,Helvetica,sans-serif;">Jankesowa Pasieka</p>
    <h1 style="margin:0 0 24px;font-size:26px;font-weight:normal;line-height:1.3;color:#78350F;">Dziękujemy za zamówienie</h1>
    <div style="background:#ffffff;border:1px solid #E8D9C8;border-radius:16px;overflow:hidden;">
      <div style="background:#3d2b1f;padding:20px 28px;text-align:center;">
        <img src="${LOGO_URL}" alt="Jankesowa Pasieka" width="72" height="72" style="display:inline-block;border-radius:50%;background:#fff;object-fit:contain" />
        <div style="margin-top:10px;color:#f5e6c8;font-size:18px;letter-spacing:0.5px;font-family:Georgia,'Times New Roman',serif;">Jankesowa Pasieka</div>
      </div>
      <div style="padding:28px 28px 24px;">
        <p style="margin:0 0 16px;font-size:17px;line-height:1.6;">${greeting}</p>
        <p style="margin:0 0 20px;font-size:17px;line-height:1.6;">dziękuję za zamówienie w Jankesowej Pasiece. Potwierdzam, że zamówienie <strong>${escapeHtml(orderId)}</strong> zostało opłacone i do mnie dotarło.</p>
        <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#92400E;font-family:Arial,Helvetica,sans-serif;">Zamówione produkty</p>
        <table style="width:100%;border-collapse:collapse;margin:0 0 8px;">
          ${productLinesHtml}
          ${shippingRow}
          ${discountRow}
          <tr>
            <td style="padding:12px 0 0;font-size:17px;line-height:1.5;"><strong>Razem</strong></td>
            <td style="padding:12px 0 0 16px;font-size:17px;line-height:1.5;text-align:right;white-space:nowrap;"><strong>${formatPln(order.totalAmount)}</strong></td>
          </tr>
        </table>
        <p style="margin:20px 0 8px;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#92400E;font-family:Arial,Helvetica,sans-serif;">Dostawa</p>
        ${delivery.html}
        <p style="margin:20px 0 0;font-size:16px;line-height:1.6;color:#92400E;">Gdyby pojawiły się pytania, odpowiedz na tę wiadomość albo napisz na <a href="mailto:kontakt@jankesowapasieka.pl" style="color:#92400E;">kontakt@jankesowapasieka.pl</a> — chętnie pomogę.</p>
        <p style="margin:24px 0 0;font-size:17px;line-height:1.6;">Serdecznie pozdrawiam<br />Jankesowa Pasieka – Kujawy</p>
      </div>
    </div>
    <p style="margin:20px 0 0;font-size:12px;line-height:1.5;color:#A16207;font-family:Arial,Helvetica,sans-serif;"><a href="${SHOP_URL}" style="color:#92400E;">jankesowapasieka.pl</a></p>
  </div>
</body>
</html>`;

  return { subject, html, text };
}

/**
 * Sends a shop confirmation to the customer. Does not replace Stripe's receipt.
 * Skips quietly when the address is missing. Throws only if Resend reports an error
 * after an attempted send — callers should catch so the webhook still succeeds.
 */
export async function sendOrderConfirmationEmail(
  order: OrderConfirmationInput,
  options?: { sessionId?: string }
): Promise<void> {
  const to = (order.customerEmail || "").trim();
  if (!isRealCustomerEmail(to)) {
    console.info("[order-confirmation] pominięto — brak adresu e-mail klienta", {
      orderId: order.orderId,
    });
    return;
  }

  const email = buildOrderConfirmationEmail(order);
  const resend = new Resend(process.env.RESEND_API_KEY);
  const sendOptions = options?.sessionId
    ? { idempotencyKey: `order-confirmation-${options.sessionId}` }
    : undefined;

  const { error } = await resend.emails.send(
    {
      from: ORDER_CONFIRMATION_FROM,
      to,
      replyTo: ORDER_CONFIRMATION_REPLY_TO,
      subject: email.subject,
      html: email.html,
      text: email.text,
    },
    sendOptions
  );

  if (error) {
    throw new Error(error.message || "Resend rejected the order confirmation email");
  }

  console.info("[order-confirmation] wysłano", {
    orderId: order.orderId,
    sessionId: options?.sessionId,
  });
}
