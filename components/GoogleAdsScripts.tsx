import Script from "next/script";

/**
 * Loads Google tag (gtag.js) after consent defaults are set in root layout <head>.
 * Renders nothing when NEXT_PUBLIC_GADS_ID is unset.
 */
export default function GoogleAdsScripts() {
  const gadsId = process.env.NEXT_PUBLIC_GADS_ID;
  if (!gadsId) return null;

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
