import { supabase } from '@/lib/supabase';

export interface Subscription {
  id: string;
  email: string;
  createdAt: string;
}

// Insert a new subscription email (newsletter). Returns created row or throws on error / duplicate.
export async function addSubscription(email: string): Promise<Subscription> {
  const trimmed = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) throw new Error('Invalid email');
  const { data, error } = await supabase
    .from('subscriptions')
    .insert({ email: trimmed })
    .select('*')
    .single();
  if (error) {
    // Postgres unique violation code via PostgREST surfaces as 23505 typically
    const msg = (error as { code?: string; message?: string }).code === '23505'
      ? 'Already subscribed'
      : ((error as { message?: string }).message || 'Subscription failed');
    throw new Error(msg);
  }
  return { id: data.id, email: data.email, createdAt: data.createdAt || data.created_at || new Date().toISOString() } as Subscription;
}

// Placeholder email confirmation util (extend later to call Edge Function or external API)
export async function sendSubscriptionConfirmation(email: string): Promise<void> {
  // Simulate async side-effect; replace with real implementation later.
  await new Promise(r => setTimeout(r, 300));
  return;
}