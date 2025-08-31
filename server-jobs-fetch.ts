// server-jobs-fetch.ts
// Build-time helper to fetch job IDs for sitemap.
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(url, key);

export async function fetchJobIds(): Promise<string[]> {
  if (!url || !key) return [];
  const { data, error } = await supabase.from('jobs').select('id').limit(5000);
  if (error) {
    console.warn('fetchJobIds error', error.message);
    return [];
  }
  return (data || []).map(r => r.id);
}

// CommonJS proxy generator (so sitemap script can require compiled output easily)
if (require.main === module) {
  fetchJobIds().then(ids => console.log(JSON.stringify(ids))).catch(e => { console.error(e); process.exit(1); });
}
