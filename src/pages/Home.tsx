import { useEffect, useState, useMemo } from 'react';
import Seo from '@/components/Seo';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Building2, Star, Search } from "lucide-react";
import img1 from "@/assets/carousel_1.png";
import img2 from "@/assets/carousel_2.png";
import img3 from "@/assets/carousel_3.png";
import HeroSlideshow from '@/components/HeroSlideshow';
import { AdSlot } from "@/components/ads/AdSlot";
import { Job } from "@/types/job";
import { JobCard } from '@/components/JobCard';
import { getJobs } from '@/data/jobs';
import { toast } from '@/hooks/use-toast';

const Home = () => {

  // Jobs fetched from Supabase
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true); setError(null);
      try {
        const data = await getJobs();
        setJobs(data);
        toast({ title: 'Jobs loaded', description: `${data.length} opportunities available.` });
      } catch (e: unknown) {
        const msg = (e as { message?: string })?.message || 'Failed to load jobs';
        setError(msg);
        toast({ title: 'Load failed', description: msg, variant: 'destructive' });
      } finally { setLoading(false); }
    })();
  }, []);

  // Normalize & filter by search (title/org)
  const filtered = useMemo(() => {
    const now = new Date();
    const base = jobs.filter(j => {
      if (j.deadline) {
        const d = new Date(j.deadline + 'T23:59:59');
        if (d < now && (now.getTime() - d.getTime()) > 24 * 60 * 60 * 1000) return false; // >24h past deadline => expired
      }
      return true;
    });
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter(j => j.title.toLowerCase().includes(q) || j.org.toLowerCase().includes(q));
  }, [jobs, search]);

  const featured = useMemo(() => filtered
    .filter(j => j.featured)
    .sort((a, b) => b.postedAt.localeCompare(a.postedAt))
    .slice(0, 6), [filtered]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30">
  <Seo title="Home" description="Curated private & government job opportunities. Search and apply instantly." />
  {/* Hero Section */}
      <section className="pt-10 pb-16 px-4 relative overflow-hidden md:pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left ">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Your Career Journey
            <span className="block bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
          Starts Here
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
            Curated private & government job opportunities in one place. No login required—search, discover & apply instantly.
          </p>
          {/* Search Input */}
          <div className="max-w-xl mx-auto lg:mx-0 mb-8">
            <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs by title or organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-12 text-base"
          />
            </div>
            {search && (
          <p className="text-xs text-muted-foreground mt-2">
            Showing results for <span className="font-medium">{search}</span> ({filtered.length} match{filtered.length!==1 && 'es'})
          </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a href="#private-jobs">
          <Button size="lg" variant="professional" className="px-8 py-6 text-lg">
            <Briefcase className="mr-2 h-5 w-5" />
            Private Jobs
          </Button>
            </a>
            <a href="#govt-jobs">
          <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
            <Building2 className="mr-2 h-5 w-5" />
            Govt Jobs
          </Button>
            </a>
          </div>
        </div>
  <div className="relative hidden md:block pb-8">
          <HeroSlideshow
            images={[
              { src: img1, alt: 'Find your Job' },
              { src: img2, alt: 'Apply instantly' },
              { src: img3, alt: 'Land your dream job' }
            ]}
            intervalMs={8000}
            transitionMs={900}
            fit="contain"
            className="bg-background/40 rounded-2xl"
          />
          </div>
          </div>
        </div>
      </section>

      {/* In-content Ad (responsive) */}
      <div className="px-4 max-w-7xl mx-auto">
        <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_HOME || "0000000000"} className="my-6" />
      </div>


      {/* Featured Jobs Section */}
  <section id="featured-jobs" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 flex-col md:flex-row gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3 flex items-center gap-3">
                <span className="bg-gradient-to-r from-primary to-primary-dark w-12 h-12 rounded-xl flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary-foreground" />
                </span>
                Featured Roles
              </h2>
      <p className="text-muted-foreground max-w-xl">Highlighted opportunities hand-picked for visibility. Recently posted & actively hiring. Updated <span className="font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>.</p>
            </div>
          </div>
          {loading && (
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_,i)=>(
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <CardTitle className="h-5 bg-muted rounded w-2/3" />
                    <CardDescription className="h-4 bg-muted rounded w-1/2" />
                  </CardHeader>
                  <CardContent 
                  className="space-y-3">
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                    <div className="h-9 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {!loading && error && <p className="text-destructive text-sm">{error}</p>}
          {!loading && !error && featured.length ? (
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
              {featured.map(j => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          ) : (!loading && !error && (
            <p className="text-muted-foreground">No featured jobs{search ? ' match your search.' : ' yet.'}</p>
          ))}
        </div>
      </section>

      {/* Dedicated Ad Slot below Featured */}
      <div className="px-4 max-w-7xl mx-auto">
        <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_HOME_FEATURED || import.meta.env.VITE_ADSENSE_SLOT_HOME || "0000000000"} className="my-6" />
      </div>

      {/* Consolidated Jobs Sections */}
  <section id="private-jobs" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 flex-col md:flex-row gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3 flex items-center gap-3">
                <span className="bg-gradient-to-r from-primary to-primary-dark w-12 h-12 rounded-xl flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-primary-foreground" />
                </span>
                Private Sector Jobs
              </h2>
              <p className="text-muted-foreground max-w-xl">Latest hand-curated roles across engineering, product, design, marketing and more. We review postings for clarity and remove stale listings. Updated <span className="font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>.</p>
            </div>
            <Button className='hidden md:block' variant="outline" size="sm" onClick={() => window.location.hash = "private-jobs"}>View All</Button>
          </div>
          <JobPreview kind="private" jobs={filtered} />
          <div className="mt-8 text-center"><Link to="/jobs/private"><Button variant="outline">View All Private Jobs</Button></Link></div>
        </div>
      </section>

	<section id="govt-jobs" className="py-16 px-4 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 flex-col md:flex-row gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3 flex items-center gap-3">
                <span className="bg-gradient-to-r from-primary to-primary-dark w-12 h-12 rounded-xl flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </span>
                Government Jobs
              </h2>
              <p className="text-muted-foreground max-w-xl">Highlighted open roles from select public sector departments & agencies. We strive for accuracy but always verify via the official notification. Updated <span className="font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>.</p>
              <p className="text-xs text-muted-foreground mt-2">Disclaimer: Government job details are summarized; refer to the official publication for authoritative information.</p>
            </div>
            <Button className='hidden md:block' variant="outline" size="sm" onClick={() => window.location.hash = "govt-jobs"}>View All</Button>
          </div>
          <JobPreview kind="govt" jobs={filtered} />
          <div className="mt-8 text-center"><Link to="/jobs/govt"><Button variant="outline">View All Govt Jobs</Button></Link></div>
        </div>
      </section>

      {/* Minimal CTA */}
      <section className="py-16 px-4 bg-card/40">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold">Stay Updated</h2>
            <p className="text-muted-foreground">Bookmark this page. Fresh private & government roles are refreshed regularly.</p>
            <Button variant="professional" size="lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to Top</Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          {/* Mobile accordion */}
          <div className="md:hidden">
            {/* Using shadcn accordion */}
            {/** Keep content data-driven for maintainability */}
            <MobileFaqAccordion />
          </div>
          {/* Desktop static grid */}
          <div className="hidden md:grid gap-6 md:grid-cols-2 text-sm text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Are listings verified?</h3>
              <p>We curate and periodically re-check active roles. Always confirm critical details on the official site before applying.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Do I need an account?</h3>
              <p>No. You can search and apply directly without logging in. Accounts will arrive later for saved jobs & alerts.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">How often is data updated?</h3>
              <p>Updates happen continuously as new roles are added. Expired postings are cleaned to keep results relevant.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Why is a job missing?</h3>
              <p>It may have expired or been filled. Use the Contact page to suggest additions or corrections.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

// --- Job preview component (refactored to receive jobs externally) ---
function JobPreview({ kind, jobs }: { kind: 'private'|'govt'; jobs: Job[] }) {
  const navigate = useNavigate();
  const list = useMemo(() => jobs
    .filter(j => j.kind === kind)
    .sort((a, b) => b.postedAt.localeCompare(a.postedAt))
    .slice(0, 4), [jobs, kind]);

  if (!list.length) return <p className="text-muted-foreground">No {kind === 'private' ? 'private' : 'government'} jobs{jobs.length ? ' match your search.' : ' yet.'}</p>;

  return (
    <div className="grid gap-6 md:grid-cols-4">
      {list.map(j => (
        <Card
          key={j.id}
          className="group hover:shadow-[var(--shadow-elegant)] transition-all flex flex-col h-full"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 group-hover:underline decoration-primary/40 underline-offset-2">{j.title}{j.featured && <Star className="h-4 w-4 text-warning" />}</CardTitle>
            <CardDescription>{j.org}</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground flex flex-col flex-1 gap-3">
            <p className="line-clamp-3 leading-relaxed min-h-[3.9rem]">{j.description}</p>
            <p>Posted {new Date(j.postedAt).toLocaleDateString()} {j.deadline && <>• Deadline {j.deadline}</>}</p>
            <div className="flex-1" />
            <div className="pt-1 grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" onClick={()=> navigate(`/jobs/${j.id}`)}>Check Details</Button>
              <a href={j.applyUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="professional" className="w-full">Apply Now</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Mobile FAQ accordion component (isolated for clarity)
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function MobileFaqAccordion() {
  const faqs: { q: string; a: string }[] = [
    { q: 'Are listings verified?', a: 'We curate and periodically re-check active roles. Always confirm critical details on the official site before applying.' },
    { q: 'Do I need an account?', a: 'No. You can search and apply directly without logging in. Accounts will arrive later for saved jobs & alerts.' },
    { q: 'How often is data updated?', a: 'Updates happen continuously as new roles are added. Expired postings are cleaned to keep results relevant.' },
    { q: 'Why is a job missing?', a: 'It may have expired or been filled. Use the Contact page to suggest additions or corrections.' },
  ];
  return (
    <Accordion type="single" collapsible className="w-full border rounded-md divide-y">
      {faqs.map((f, i) => (
        <AccordionItem value={`faq-${i}`} key={f.q} className="border-none">
          <AccordionTrigger className="text-sm text-left px-3 py-2 hover:no-underline">{f.q}</AccordionTrigger>
          <AccordionContent className="text-xs px-3 pb-3 text-muted-foreground leading-relaxed">
            {f.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}