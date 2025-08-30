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

export async function getNotifications(): Promise<Notification[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data || []).map(mapRow);
}

// Optional real-time subscription helper
export function subscribeNotifications(onInsert: (n: Notification) => void) {
  const channel = supabase
    .channel('realtime:notifications')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
      const row = payload.new as NotificationRow;
      onInsert(mapRow(row));
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}