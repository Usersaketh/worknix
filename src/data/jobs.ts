/**
 * jobs.ts - Data access layer for Job entities.
 *
 * Default implementation uses localStorage for persistence so the UI can run fully client-side.
 * To migrate to Supabase/Postgres later:
 *  - Replace the storage functions with RPC / REST / client queries.
 *  - Keep the exported function signatures identical so UI code does not change.
 *  - Optionally add caching / react-query integration where these functions are called.
 */
import { Job } from '@/types/job';
import { supabase } from '@/lib/supabase';

// Row shape from the Supabase jobs table
interface JobRow {
  id: string;
  title: string;
  org: string;
  location: string;
  kind: 'private' | 'govt';
  description: string | null;
  apply_url: string;
  deadline: string | null;
  featured: boolean | null;
  posted_at: string;
  image_url: string | null;
  salary: string | null;
  pdf_url: string | null;
}

// Map DB row -> Job (camelCase plus date normalization to YYYY-MM-DD for deadline)
function mapRow(row: JobRow): Job {
  return {
    id: row.id,
    title: row.title,
    org: row.org,
  location: row.location,
    kind: row.kind,
    description: row.description || '',
    applyUrl: row.apply_url,
    deadline: row.deadline ? new Date(row.deadline).toISOString().slice(0, 10) : undefined,
    featured: !!row.featured,
    postedAt: row.posted_at,
  imageUrl: row.image_url || undefined,
  salary: row.salary || undefined,
  pdfUrl: row.pdf_url || undefined,
  };
}

function throwIfError(error: unknown): asserts error is null | undefined {
  if (error) {
    
    console.error('[jobs:data] Supabase error', error);
    const errObj = error as { message?: string; code?: string; details?: string; hint?: string };
    const parts = [errObj.message, errObj.code, errObj.details, errObj.hint].filter(Boolean);
    const msg = parts.join(' | ') || 'Supabase query failed';
    throw new Error(msg);
  }
}

// 1. getJobs(kind?)
export async function getJobs(kind?: 'private' | 'govt'): Promise<Job[]> {
  let query = supabase.from('jobs').select('*').order('posted_at', { ascending: false });
  if (kind) query = query.eq('kind', kind);
  const { data, error } = await query;
  throwIfError(error);
  return (data || []).map(mapRow);      
}

// 2. getJob(id)
export async function getJob(id: string): Promise<Job | null> {
  const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = row not found
  if (!data) return null;
  return mapRow(data);
}

// 3. addJob(job)
export async function addJob(job: Omit<Job, 'id' | 'postedAt'>): Promise<Job> {
  const payload: Record<string, unknown> = {
    title: job.title,
    org: job.org,
    location: job.location,
    kind: job.kind,
    description: job.description,
    apply_url: job.applyUrl,
    deadline: job.deadline ? job.deadline : null,
    featured: job.featured ?? false,
    image_url: job.imageUrl || null,
    salary: job.salary || null,
  };
  const maybePdf = (job as unknown as { pdfUrl?: string }).pdfUrl;
  if (maybePdf !== undefined && maybePdf !== '') {
    payload.pdf_url = maybePdf;
  }
  const { data, error } = await supabase.from('jobs').insert(payload).select('*').single();
  throwIfError(error);
  return mapRow(data);
}

// 4. updateJob(id, patch)
export async function updateJob(id: string, patch: Partial<Job>): Promise<Job> {
  const updatePayload: Partial<JobRow> = {} as Partial<JobRow>;
  if (patch.title !== undefined) updatePayload.title = patch.title;
  if (patch.org !== undefined) updatePayload.org = patch.org;
  if (patch.location !== undefined) (updatePayload as Partial<JobRow>).location = patch.location;
  if (patch.kind !== undefined) updatePayload.kind = patch.kind;
  if (patch.description !== undefined) updatePayload.description = patch.description;
  if (patch.applyUrl !== undefined) updatePayload.apply_url = patch.applyUrl;
  if (patch.deadline !== undefined) updatePayload.deadline = patch.deadline || null;
  if (patch.featured !== undefined) updatePayload.featured = patch.featured;
  if (patch.imageUrl !== undefined) (updatePayload as Partial<JobRow>).image_url = patch.imageUrl || null;
  if (patch.salary !== undefined) (updatePayload as Partial<JobRow>).salary = patch.salary || null;
  const patchPdf = (patch as unknown as { pdfUrl?: string }).pdfUrl;
  if (patchPdf !== undefined) (updatePayload as Partial<JobRow>).pdf_url = patchPdf || null;
  const { data, error } = await supabase.from('jobs').update(updatePayload).eq('id', id).select('*').single();
  throwIfError(error);
  return mapRow(data);
}

// 5. deleteJob(id)
export async function deleteJob(id: string): Promise<void> {
  const { error } = await supabase.from('jobs').delete().eq('id', id);
  throwIfError(error);
}

// Additional helper retained for UI convenience
export async function toggleFeatured(id: string): Promise<Job | undefined> {
  const current = await getJob(id);
  if (!current) return undefined;
  return updateJob(id, { featured: !current.featured });
}

// Backward compatibility wrappers (existing code may still import these names)
export const createJob = addJob; // Omit<Job,'id'|'postedAt'> signature aligns
// Existing code previously called updateJob(job: Job). Provide a shim:
export async function updateJobLegacy(job: Job): Promise<Job> { return updateJob(job.id, job); }

// 6. cleanupExpiredJobs: delete jobs whose deadline is >48h past
export async function cleanupExpiredJobs(): Promise<number> {
  const now = new Date();
  const cutoff = new Date(now.getTime() - 48 * 60 * 60 * 1000); // 48h ago
  // fetch jobs with deadline before cutoff
  const { data, error } = await supabase
    .from('jobs')
    .select('id, deadline')
    .not('deadline', 'is', null)
    .lt('deadline', cutoff.toISOString().slice(0,10));
  throwIfError(error);
  const ids = (data || []).map(r => (r as { id: string }).id);
  if (!ids.length) return 0;
  const { error: delError } = await supabase.from('jobs').delete().in('id', ids);
  throwIfError(delError);
  return ids.length;
}
