import { NextResponse } from "next/server";
import { getStock } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export async function GET() {
  const stock = await getStock();
  return NextResponse.json({ stock }, { headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" } });
}
