import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Job } from '@/types/job';
import { useMemo } from 'react';

interface JobCardProps {
  job: Job;
  highlightFeatured?: boolean;
  showBadges?: boolean;
  showDeadlineStatus?: boolean;
  clickableTitle?: boolean;
}

import { Link } from 'react-router-dom';

export function JobCard({ job, highlightFeatured = true, showBadges = true, showDeadlineStatus = true, clickableTitle = false }: JobCardProps) {
  const { isDeadlinePassed, isNew, deadlineLabel, status } = useMemo(() => {
    const now = new Date();
    const deadlineDate = job.deadline ? new Date(job.deadline + 'T23:59:59') : null; // end of day
    const isDeadlinePassed = deadlineDate ? deadlineDate < now : false;
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysLeft = !deadlineDate || isDeadlinePassed ? null : Math.ceil((deadlineDate.getTime() - now.getTime()) / msPerDay);
    const posted = new Date(job.postedAt).getTime();
    const isNew = posted >= Date.now() - 7 * msPerDay;
    let deadlineLabel: string | null = null;
    let status: 'open' | 'closed' | 'expired' = 'open';
    if (deadlineDate) {
      if (deadlineDate < now) {
        const diffMs = now.getTime() - deadlineDate.getTime();
        if (diffMs > 24 * 60 * 60 * 1000) status = 'expired'; else status = 'closed';
      }
    }
    if (status === 'closed') deadlineLabel = 'Closed';
    else if (daysLeft !== null) deadlineLabel = daysLeft === 0 ? 'Closes Today' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`;
  return { isDeadlinePassed, isNew, deadlineLabel, status };
  }, [job.deadline, job.postedAt]);

  return (
    <Card className={`hover:shadow-[var(--shadow-elegant)] transition-all flex flex-col ${highlightFeatured && job.featured ? 'border border-primary/50 bg-primary/5' : ''} ${isDeadlinePassed ? 'opacity-90' : ''}`}>
      <CardHeader>
        <CardTitle className="text-lg flex flex-wrap items-center gap-2">
          {job.imageUrl ? (
            <img src={job.imageUrl} alt={job.org} className="h-8 w-8 rounded object-cover border" loading="lazy" />
          ) : (
            <div className="h-8 w-8 rounded border bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
              {job.org.slice(0,2).toUpperCase()}
            </div>
          )}
          {clickableTitle ? (
            <Link to={`/jobs/${job.id}`} className="hover:underline decoration-primary/50">
              {job.title}
            </Link>
          ) : job.title}
          {job.featured && highlightFeatured && <Badge variant="secondary">Featured</Badge>}
          {showBadges && isNew && <Badge variant="success">New</Badge>}
          {showBadges && status === 'closed' && <Badge variant="warning">Closed</Badge>}
          {showDeadlineStatus && !isDeadlinePassed && deadlineLabel && <Badge variant="outline" className="border-primary text-primary">{deadlineLabel}</Badge>}
        </CardTitle>
        <CardDescription className="flex flex-col gap-1">
          <span>{job.org}{job.location ? ` • ${job.location}` : ''}</span>
          {job.salary && (
            <span className="text-xs font-bold text-green-600">
              {job.salary}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground flex-1 flex flex-col">
        <p className="line-clamp-4 leading-relaxed">{job.description.slice(0, 220)}{job.description.length > 220 ? '…' : ''}</p>
        <div className="flex flex-wrap gap-3 text-xs my-auto">
          <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
          {job.deadline && <span className={isDeadlinePassed ? 'text-destructive' : ''}>Deadline {job.deadline}</span>}
        </div>
        <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="professional" className="w-full">Apply</Button>
        </a>
      </CardContent>
    </Card>
  );
}