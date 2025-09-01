import { supabase } from '@/lib/supabase';

export interface NotificationRow {
  id: string;
  title: string;
  body: string | null;
  created_at: string;
  time?: string | null; // optional relative time precomputed server-side (if added later)
}

export interface Notification {
  id: string;
  title: string;
  body?: string;
  createdAt: string;
  time?: string; // short relative label ("2m", etc.)
}

function mapRow(row: NotificationRow): Notification {
  return {
    id: row.id,
    title: row.title,
    body: row.body || undefined,
    createdAt: row.created_at,
    time: row.time || undefined,
  };
}

// Module-level suppression so we stop re-querying if the table doesn't exist.
let suppressRemote = false;
const DISABLED_BY_ENV = import.meta.env.VITE_DISABLE_NOTIFICATIONS === 'true';

export async function getNotifications(): Promise<Notification[]> {
  if (DISABLED_BY_ENV || suppressRemote) return [];
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) {
    // Swallow "not found" style errors (missing table / 404) and suppress future calls.
    const msg = error.message.toLowerCase();
    if (/not\s+found/.test(msg) || /does not exist/.test(msg)) {
      suppressRemote = true;
      if (typeof console !== 'undefined') {
        console.info('[notifications] Remote table missing; suppressing further requests. Set VITE_DISABLE_NOTIFICATIONS=true to silence this entirely.');
      }
      return [];
    }
    throw error;
  }
  return (data || []).map(mapRow);
}

// Optional real-time subscription helper
export function subscribeNotifications(onInsert: (n: Notification) => void) {
  if (DISABLED_BY_ENV || suppressRemote || !supabase) {
    return () => {};
  }
  try {
    const channel = supabase
      .channel('realtime:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        const row = payload.new as NotificationRow;
        onInsert(mapRow(row));
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          // If channel fails (e.g., table missing), suppress further attempts.
            suppressRemote = true;
            if (typeof console !== 'undefined') {
              console.info('[notifications] Realtime channel error; suppressing further subscription attempts.');
            }
        }
      });
    return () => { supabase.removeChannel(channel); };
  } catch {
    return () => {};
  }
}