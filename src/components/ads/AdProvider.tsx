import { useEffect } from "react";

/**
 * AdProvider
 * - Loads AdSense script when VITE_ENABLE_ADS is 'true' and publisher ID exists.
 * - Keeps ads off in dev unless explicitly enabled.
 */
export function AdProvider() {
  useEffect(() => {
    const enabled = import.meta.env.VITE_ENABLE_ADS === 'true';
    const client = import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined;
    if (!enabled || !client) return;

    // Avoid duplicate script inserts
    const existing = document.querySelector("script[data-adsbygoogle]") as HTMLScriptElement | null;
    if (existing) return;

    const script = document.createElement('script');
    script.setAttribute('data-adsbygoogle', 'true');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    return () => {
      // Keep script to prevent duplicate loads on route changes.
    };
  }, []);

  return null;
}
