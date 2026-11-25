"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAdsClickIdsFromLocation } from "@/lib/ads-click-ids";
import { getStoredConsent } from "@/lib/consent";

/**
 * Reads gclid/wbraid/gbraid from the landing URL and keeps them for checkout.
 * Persistent storage is used only when marketing consent is already granted.
 */
export default function AdsClickIdCapture() {
  const pathname = usePathname();

  useEffect(() => {
    captureAdsClickIdsFromLocation(getStoredConsent() === "granted");
  }, [pathname]);

  return null;
}
