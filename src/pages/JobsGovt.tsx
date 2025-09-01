import { useEffect, useState, useMemo } from 'react';
import Seo from '@/components/Seo';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Job } from '@/types/job';
import { JobCard } from '@/components/JobCard';
import { AdSlot } from '@/components/ads/AdSlot';
import { getJobs } from '@/data/jobs';
import { toast } from '@/hooks/use-toast';

type SortKey = 'newest' | 'deadline';

export default function JobsGovt() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [orgFilter, setOrgFilter] = useState('all');
  const [sort, setSort] = useState<SortKey>('newest');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { (async ()=> { setLoading(true); setError(null); try { const data = await getJobs('govt'); setJobs(data); toast({ title: 'Loaded', description: `${data.length} govt jobs.` }); } catch(e: unknown){ const msg = (e as { message?: string })?.message || 'Failed to load'; setError(msg); toast({ title: 'Load failed', description: msg, variant: 'destructive' }); } finally { setLoading(false);} })(); }, []);

  const orgOptions = useMemo(() => {
    const set = new Set<string>();
    jobs.filter(j => j.kind==='govt').forEach(j => set.add(j.org));
    return Array.from(set).sort();
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const now = new Date();
    return jobs.filter(j => {
      let expired = false;
      if (j.deadline) {
        const deadlineDate = new Date(j.deadline + 'T23:59:59');
        if (deadlineDate < now && (now.getTime() - deadlineDate.getTime()) > 24 * 60 * 60 * 1000) expired = true;
      }
      if (expired) return false;
      return (!q || j.title.toLowerCase().includes(q) || j.org.toLowerCase().includes(q) || (j.location||'').toLowerCase().includes(q)) && (orgFilter==='all' || j.org===orgFilter);
    });
  }, [jobs, search, orgFilter]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sort === 'newest') return list.sort((a,b)=>b.postedAt.localeCompare(a.postedAt));
    if (sort === 'deadline') return list.sort((a,b)=> (a.deadline||'').localeCompare(b.deadline||''));
    return list;
  }, [filtered, sort]);

  return (
    <div className="min-h-screen bg-secondary/20 pt-6">
      <Seo title="Government Jobs" description="Browse curated government job openings and public sector opportunities." />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mb-8 shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Government Job Listings</CardTitle>
            <CardDescription>All currently posted public sector & agency roles.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <Input placeholder="Search jobs..." value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            <Select value={orgFilter} onValueChange={v=>setOrgFilter(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orgs</SelectItem>
                {orgOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={v=>setSort(v as SortKey)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading && Array.from({length:6}).map((_,i)=>(
            <Card key={i} className="p-4 animate-pulse space-y-3">
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-9 bg-muted rounded" />
            </Card>
          ))}
          {error && <p className="text-destructive text-sm">{error}</p>}
          {!loading && sorted.length === 0 && <p className="text-muted-foreground">No jobs match current filters.</p>}
          {sorted.map((j, idx) => (
            <>
              <JobCard job={j} key={j.id} clickableTitle />
              {import.meta.env.VITE_ENABLE_ADS === 'true' && (idx+1) % 6 === 0 && (
                <div className="sm:col-span-2 lg:col-span-3" key={`ad-${j.id}`}>
                  <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_GOVT || import.meta.env.VITE_ADSENSE_SLOT_JOBS || '0000000000'} />
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}