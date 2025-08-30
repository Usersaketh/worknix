/**
 * resumes.ts - Stub data layer for Resume entities.
 * Currently unused by UI. Provides signatures so future Resume Builder work plugs in easily.
 * Default storage: localStorage under a versioned key.
 *
 * Migration path (Supabase/Postgres):
 *  - Make all functions async and call your backend / DB client.
 *  - Enforce row-level security: only owner (userId) or admin can access a resume.
 */
import { Resume } from '@/types/resume';
import { supabase } from '@/lib/supabase';

interface ResumeRow {
  id: string;
  user_id: string;
  title: string;
  data: string;
  created_at: string;
  updated_at?: string | null;
}

function mapRow(row: ResumeRow): Resume {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    content: row.data,
    createdAt: row.created_at,
    updatedAt: row.updated_at || row.created_at,
  };
}

export async function getUserResumes(userId: string): Promise<Resume[]> {
  const { data, error } = await supabase.from('resumes').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapRow);
}
export async function getResume(id: string): Promise<Resume | undefined> {
  const { data, error } = await supabase.from('resumes').select('*').eq('id', id).single();
  if (error) throw error;
  return data ? mapRow(data) : undefined;
}
export async function createResume(data: Omit<Resume,'id'|'createdAt'|'updatedAt'>): Promise<Resume> {
  const payload = {
    user_id: data.userId,
    title: data.title,
    data: data.content,
  };
  const { data: rows, error } = await supabase.from('resumes').insert(payload).select('*').single();
  if (error) throw error;
  return mapRow(rows);
}
export async function updateResume(resume: Resume): Promise<Resume> {
  const payload = {
    title: resume.title,
    data: resume.content,
  };
  const { data, error } = await supabase.from('resumes').update(payload).eq('id', resume.id).select('*').single();
  if (error) throw error;
  return mapRow(data);
}
export async function deleteResume(id: string): Promise<void> {
  const { error } = await supabase.from('resumes').delete().eq('id', id);
  if (error) throw error;
}

// Notes:
// - RLS should ensure only owners (user_id) can access their resumes.
// - Add policies in Supabase dashboard before exposing UI.
// - Consider versioning resumes for audit later.
