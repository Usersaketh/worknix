import { z } from "zod";

export const JobItemSchema = z.object({
  id: z.string().or(z.number()).transform(String),
  title: z.string(),
  company: z.string().optional().default(""),
  location: z.string().optional().default("Remote"),
  type: z.string().optional().default("Full-time"),
  salary: z.string().optional().default(""),
  postedAt: z.string().optional().default(""),
  description: z.string().optional().default(""),
  skills: z.array(z.string()).optional().default([]),
});
export type JobItem = z.infer<typeof JobItemSchema>;

export const GovtJobItemSchema = z.object({
  id: z.string().or(z.number()).transform(String),
  title: z.string(),
  department: z.string().optional().default(""),
  location: z.string().optional().default("Remote"),
  type: z.string().optional().default("Full-time"),
  salary: z.string().optional().default(""),
  postedAt: z.string().optional().default(""),
  description: z.string().optional().default(""),
  skills: z.array(z.string()).optional().default([]),
  clearance: z.string().optional().default("Public Trust"),
});
export type GovtJobItem = z.infer<typeof GovtJobItemSchema>;

export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { "cache-control": "no-cache" } });
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return (await res.json()) as T;
}

export async function getJobsFeed(): Promise<JobItem[]> {
  const url = import.meta.env.VITE_JOBS_FEED_URL as string | undefined;
  if (!url) throw new Error("Jobs feed URL not configured");
  const raw = await fetchJson<unknown[]>(url);
  return raw.map((r) => JobItemSchema.parse(r));
}

export async function getGovtJobsFeed(): Promise<GovtJobItem[]> {
  const url = import.meta.env.VITE_GOVT_FEED_URL as string | undefined;
  if (!url) throw new Error("Govt jobs feed URL not configured");
  const raw = await fetchJson<unknown[]>(url);
  return raw.map((r) => GovtJobItemSchema.parse(r));
}
