/**
 * auth.ts - Authentication abstraction (stub).
 *
 * Current behavior: always returns a hard-coded admin user so existing admin UI works.
 * Retains query ?key= fallback check to mimic simple shared-secret gating.
 *
 * Future (Supabase/Auth provider):
 *  - Replace getCurrentUser implementation with real session lookup (JWT, cookie, etc.).
 *  - signIn/signOut to call provider SDK.
 *  - Add role claims (admin/user) enforcement; possibly move gate logic into ProtectedRoute.
 */
import { User } from '@/types/user';
import { supabase } from '@/lib/supabase';

export async function getCurrentUser(): Promise<User | null> {
  // Supabase session first
  try {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      return { id: data.user.id, email: data.user.email || 'unknown', role: 'admin' }; // Temporary: treat all as admin until roles added
    }
  } catch {/* ignore */}
  // Fallback legacy ?key= gate for quick local admin
  const keyParam = new URLSearchParams(window.location.search).get('key');
  const configured = import.meta.env.VITE_ADMIN_KEY;
  const isLocalhost = ['localhost','127.0.0.1',''].includes(window.location.hostname);
  if ((configured && keyParam === configured) || isLocalhost) {
    return { id: 'legacy-admin', email: 'admin@legacy', role: 'admin' };
  }
  return null;
}

export async function signIn(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { id: data.user.id, email: data.user.email || email, role: 'admin' };
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
