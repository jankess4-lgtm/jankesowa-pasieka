import Stripe from "stripe";
import { products } from "./products";

// Stany magazynowe trzymane w metadanych technicznego produktu w Stripe
// (nie jest sprzedawany, active=false). Klucze: s_<id produktu>.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
export const TRACKED_IDS = [1, 2, 4, 5, 6];

async function findInventoryProduct(): Promise<Stripe.Product> {
  for await (const p of stripe.products.list({ limit: 100, active: false })) {
    if (p.metadata?.jp_inventory === "1") return p;
  }
  const metadata: Record<string, string> = { jp_inventory: "1", processed: "" };
  for (const id of TRACKED_IDS) {
    metadata[`s_${id}`] = String(products.find((p) => p.id === id)?.inStock ?? 0);
  }
  const created = await stripe.products.create({
    name: "Stany magazynowe (techniczny – nie usuwać)",
    active: false,
    metadata,
  });
  return created;
}

function parse(p: Stripe.Product): Record<number, number> {
  const out: Record<number, number> = {};
  for (const id of TRACKED_IDS) {
    const v = Number(p.metadata?.[`s_${id}`]);
    out[id] = Number.isFinite(v) ? v : products.find((x) => x.id === id)?.inStock ?? 0;
  }
  return out;
}

export async function getStock(): Promise<Record<number, number>> {
  try {
    return parse(await findInventoryProduct());
  } catch (e) {
    console.error("Stany: błąd odczytu, używam wartości z kodu", e);
    const out: Record<number, number> = {};
    for (const id of TRACKED_IDS) out[id] = products.find((x) => x.id === id)?.inStock ?? 0;
    return out;
  }
}

/** Odejmuje sprzedane słoiki raz na sesję płatności */
export async function decrementStock(sessionId: string, used: Record<string, number>) {
  const p = await findInventoryProduct();
  const processed = (p.metadata?.processed || "").split(",").filter(Boolean);
  const key = sessionId.slice(-12);
  if (processed.includes(key)) return;
  const stock = parse(p);
  const metadata: Record<string, string> = {};
  for (const [id, qty] of Object.entries(used)) {
    const n = Number(id);
    if (!TRACKED_IDS.includes(n)) continue;
    metadata[`s_${n}`] = String(Math.max(0, (stock[n] ?? 0) - Number(qty)));
  }
  metadata.processed = [...processed, key].slice(-35).join(",");
  await stripe.products.update(p.id, { metadata });
}
