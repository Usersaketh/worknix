export interface Job {
  id: string;
  title: string;
  org: string; // company / department
  location: string; // job location (city/region or Remote)
  kind: 'private' | 'govt';
  description: string;
  applyUrl: string;
  deadline?: string; // ISO date (YYYY-MM-DD)
  featured?: boolean;
  postedAt: string; // ISO timestamp
  imageUrl?: string; // optional company logo/banner
  salary?: string; // optional salary/package text
}
