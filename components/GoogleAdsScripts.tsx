import Script from "next/script";
import { getGadsId } from "@/lib/consent";

/**
 * Loads Google tag (gtag.js) after consent defaults are set in root layout <head>.
 * Uses NEXT_PUBLIC_GADS_ID or the public fallback AW-18561285258.
 */
export default function GoogleAdsScripts() {
  const gadsId = getGadsId();

  const configScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = window.gtag || gtag;
    gtag('js', new Date());
    gtag('config', '${gadsId}');
  `;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gadsId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-ads-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: configScript }}
      />
    </>
  );
}
