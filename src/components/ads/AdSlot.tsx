import { useEffect, useRef } from "react";

/**
 * AdSlot
 * - Renders a responsive AdSense slot.
 * - Requires VITE_ENABLE_ADS=true, VITE_ADSENSE_CLIENT_ID, and a slot id.
 * - Falls back to a subtle placeholder when ads are disabled.
 */
export function AdSlot({ slot, className = "", label = "Advertisement" }: { slot: string; className?: string; label?: string }) {
  const ref = useRef<HTMLModElement | null>(null);
  const enabled = import.meta.env.VITE_ENABLE_ADS === 'true';
  const client = import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined;

  useEffect(() => {
    if (!enabled || !client || !ref.current) return;
    try {
      // @ts-expect-error Google adsbygoogle is injected by AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // no-op
    }
  }, [enabled, client]);

  if (!enabled || !client) {
    return (
      <div className={`rounded-md border border-border bg-card text-muted-foreground text-xs p-3 text-center ${className}`}
           role="note" aria-label="Ad placeholder">
        {label}
      </div>
    );
  }

  return (
    <div className={className} aria-label={label}>
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        ref={ref}
      />
    </div>
  );
}
