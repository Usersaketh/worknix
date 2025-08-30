import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { getNotifications, subscribeNotifications, Notification } from "@/data/notifications";

// Optional fallback (legacy). Disable by default to avoid showing static sample messages.
const ENABLE_FALLBACK = import.meta.env.VITE_ENABLE_NOTIFICATION_FALLBACK === 'true';
const FALLBACK_URL = "/notifications.json";

async function fetchFallback(): Promise<Notification[]> {
  if (!ENABLE_FALLBACK) return [];
  try {
    const res = await fetch(FALLBACK_URL, { headers: { "cache-control": "no-cache" } });
    if (!res.ok) return [];
    const raw = await res.json() as Array<{id:string; title:string; body?:string}>;
    const now = new Date().toISOString();
    return raw.map(r => ({ id: r.id, title: r.title, body: r.body, createdAt: now }));
  } catch { return []; }
}

// Relative time utility (simple, client-side)
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  return `${day}d`;
}

export default function Notifications({ asNavItem = false }: { asNavItem?: boolean }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [nowTick, setNowTick] = useState(Date.now()); // forces relative time recalculation
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const rows = await getNotifications();
        if (rows.length === 0) {
          const fb = await fetchFallback();
          return fb;
        }
        return rows;
      } catch {
        return await fetchFallback();
      }
    },
    refetchInterval: 120_000,
    staleTime: 60_000,
  });

  // Always subscribe to realtime so nav badge updates instantly.
  useEffect(() => {
    const unsub = subscribeNotifications((n) => {
      queryClient.setQueryData<Notification[]>(["notifications"], (old) => {
        const existing = old || [];
        // prevent duplicate id insertion
        if (existing.find(e => e.id === n.id)) return existing;
        return [n, ...existing];
      });
    });
    return unsub;
  }, [queryClient]);

  // Recompute relative times every 60s
  useEffect(() => {
    const t = setInterval(() => setNowTick(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  const decorated = useMemo(() => (data || []).map(n => ({
    ...n,
    rel: relativeTime(n.createdAt)
  })), [data, nowTick]);

  const count = decorated.length;

  // Close on outside click or ESC
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div className={asNavItem ? "w-full" : "relative"} ref={rootRef}>
      <button
        aria-label="Notifications"
        className={asNavItem
          ? `w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${open ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`
          : "relative inline-flex items-center justify-center w-9 h-9 rounded-md border hover:shadow-[var(--shadow-button)] transition"}
        onClick={() => setOpen((o) => !o)}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Bell className="h-4 w-4" />
        )}
        {asNavItem && <span className="text-sm font-medium">Notifications</span>}
        {count > 0 && (
          <span className={asNavItem
            ? "ml-auto bg-primary/90 text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full"
            : "absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full"}>
            {count}
          </span>
        )}
      </button>

      {open && (
        <Card className={asNavItem ? "mt-2 w-full p-2" : "absolute right-0 mt-2 w-80 p-2 z-50"}>
          <div className="max-h-80 overflow-auto divide-y">
            {isError && (
              <div className="p-3 text-sm text-destructive">{(error as { message?: string })?.message || 'Failed to load notifications'}</div>
            )}
            {(!data || data.length === 0) && !isLoading && !isError && (
              <div className="p-3 text-sm text-muted-foreground">No notifications</div>
            )}
            {decorated.map((n) => (
              <div key={n.id} className="p-3 hover:bg-secondary/40 rounded">
                <div className="text-sm font-medium">{n.title}</div>
                {n.body && <div className="text-xs text-muted-foreground mt-0.5">{n.body}</div>}
                <div className="text-[10px] text-muted-foreground mt-1">{n.rel}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
