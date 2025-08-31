import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJob } from '@/data/jobs';
import { Job } from '@/types/job';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { sanitize } from '@/lib/sanitize';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import Seo from '@/components/Seo';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true); setError(null);
      try {
        const data = await getJob(id);
        if (!data) { setError('Job not found'); toast({ title: 'Not found', description: 'Job does not exist', variant: 'destructive' }); }
        setJob(data);
      } catch (e: unknown) {
        const msg = (e as { message?: string })?.message || 'Failed to load job';
        setError(msg); toast({ title: 'Load failed', description: msg, variant: 'destructive' });
      } finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading job…</div>;
  if (error) return <div className="p-8 text-center text-destructive text-sm">{error}</div>;
  if (!job) return null;

  const isDeadlinePassed = job.deadline ? new Date(job.deadline + 'T23:59:59') < new Date() : false;

  return (
    <div className="min-h-screen bg-secondary/20 pt-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Seo
          title={job.title}
          description={`${job.title} at ${job.org}${job.location ? ' • ' + job.location : ''}${job.deadline ? ' – Deadline ' + job.deadline : ''}`}
          image={job.imageUrl}
          canonical={`${location.origin}/jobs/${job.id}`}
          articlePublishedTime={job.postedAt}
        />
        <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'JobPosting',
          title: job.title,
          description: job.description,
          hiringOrganization: { '@type': 'Organization', name: job.org },
          datePosted: job.postedAt,
          validThrough: job.deadline || undefined,
          jobLocationType: job.location ? 'ON_SITE' : 'VIRTUAL',
          applicantLocationRequirements: job.location ? [{ '@type': 'Country', name: 'India' }] : undefined,
          employmentType: 'FULL_TIME',
          directApply: true,
          identifier: { '@type': 'PropertyValue', name: 'Worknix', value: job.id },
          url: `${location.origin}/jobs/${job.id}`,
          image: job.imageUrl || 'https://lovable.dev/opengraph-image-p98pqg.png',
          industry: job.kind === 'govt' ? 'Government' : 'Private',
        }) }} />
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader className="space-y-4">
            <div className="flex items-start gap-4 flex-wrap">
              {job.imageUrl && <img src={job.imageUrl} alt={job.org} className="h-20 w-20 object-cover rounded border" />}
              <div className="flex-1 min-w-[220px]">
                <CardTitle className="text-3xl font-bold flex flex-wrap gap-2 items-center">
                  {job.title}
                  {job.featured && <Badge variant="secondary">Featured</Badge>}
                  {isDeadlinePassed && <Badge variant="warning">Deadline Passed</Badge>}
                </CardTitle>
                <CardDescription className="text-base mt-1 flex flex-col gap-1">
                  <span>{job.org}{job.location ? ` • ${job.location}` : ''}</span>
                  {job.salary && <span className="text-sm font-medium text-foreground">{job.salary}</span>}
                  {job.deadline && <span className={isDeadlinePassed ? 'text-destructive text-sm' : 'text-sm'}>Deadline: {job.deadline}</span>}
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"><Button variant="professional">Apply Now</Button></a>
              {job.pdfUrl && <a href={job.pdfUrl} target="_blank" rel="noopener noreferrer"><Button variant="outline">Download PDF</Button></a>}
              <Button variant="outline" onClick={()=>{ if(navigator.share){ navigator.share({ title: job.title, text: job.title + ' – ' + job.org, url: location.href }); } else { navigator.clipboard.writeText(location.href); } }}>
                Share
              </Button>
              <Link to={job.kind === 'govt' ? '/jobs/govt' : '/jobs/private'}><Button variant="outline">Back to list</Button></Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold mb-2 text-foreground">Job Description</h3>
              <p className="whitespace-pre-wrap text-muted-foreground" dangerouslySetInnerHTML={{ __html: sanitize(job.description).replace(/\n/g,'<br/>') }} />
            </div>
            <div className="text-xs text-muted-foreground flex flex-wrap gap-4">
              <span>Posted {new Intl.RelativeTimeFormat(undefined,{numeric:'auto'}).format(Math.round((new Date(job.postedAt).getTime()-Date.now())/ (1000*60*60*24)), 'day')}</span>
              {job.deadline && <span>Closes {new Intl.RelativeTimeFormat(undefined,{numeric:'auto'}).format(Math.round((new Date(job.deadline+'T23:59:59').getTime()-Date.now())/(1000*60*60*24)), 'day')}</span>}
              <span>Type: {job.kind}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}