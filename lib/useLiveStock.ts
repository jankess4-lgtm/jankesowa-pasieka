"use client";
import { useEffect, useState } from "react";

let cache: Promise<Record<number, number> | null> | null = null;

/** Aktualny stan z serwera dla produktu (undefined = nie śledzony / jeszcze wczytywany) */
export function useLiveStock(id: number): number | undefined {
  const [value, setValue] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (!cache) {
      cache = fetch("/api/stock").then((r) => (r.ok ? r.json() : null)).then((d) => d?.stock ?? null).catch(() => null);
    }
    cache.then((s) => { if (s && id in s) setValue(Number(s[id])); });
  }, [id]);
  return value;
}
