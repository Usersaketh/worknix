import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Job } from '@/types/job';
import { useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';

interface JobCardProps {
  job: Job;
  highlightFeatured?: boolean;
  showBadges?: boolean;
  showDeadlineStatus?: boolean;
  clickableTitle?: boolean;
}

import { Link } from 'react-router-dom';

function JobCardBase({ job, highlightFeatured = true, showBadges = true, showDeadlineStatus = true, clickableTitle = false }: JobCardProps) {
  const navigate = useNavigate();
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

  const goPreview = () => navigate(`/jobs/${job.id}`);
  return (
  <Card className={`relative flex flex-col h-full border border-border hover:shadow-[var(--shadow-card)] transition-all ${isDeadlinePassed ? 'opacity-90' : ''}`}
  >
      {job.featured && highlightFeatured && (
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[hsl(var(--primary))] rounded-t-md" />
      )}
      <CardHeader className="pt-4">
        <CardTitle className="text-lg flex flex-wrap items-center gap-2">
          {job.imageUrl ? (
            <img src={job.imageUrl} alt={job.org} className="h-8 w-8 rounded object-cover border" loading="lazy" />
          ) : (
            <div className="h-8 w-8 rounded border bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
              {job.org.slice(0,2).toUpperCase()}
            </div>
          )}
          {clickableTitle ? (
            <Link to={`/jobs/${job.id}`} onClick={(e)=>e.stopPropagation()} className="hover:underline decoration-primary/50">
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
      <CardContent className="text-sm text-muted-foreground flex-1 flex flex-col gap-3 pb-5">
  <p className="line-clamp-3 leading-relaxed min-h-[3.9rem]">{job.description}</p>{/* line-clamp via plugin */}
        <div className="flex flex-wrap gap-3 text-xs">
          <span>
            {(() => {
              const days = Math.round((Date.now() - new Date(job.postedAt).getTime())/(1000*60*60*24));
              if (days <= 0) return 'Posted today';
              return `Posted ${days}d ago`;
            })()}
          </span>
          {job.deadline && <span className={isDeadlinePassed ? 'text-destructive' : ''}>{(() => {
            const diff = Math.round((new Date(job.deadline+'T23:59:59').getTime()-Date.now())/(1000*60*60*24));
            if (diff < 0) return 'Closed';
            if (diff === 0) return 'Closes today';
            return `Closes in ${diff}d`;
          })()}</span>}
        </div>
        <div className="flex-1" />
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline" onClick={goPreview}>Check Details</Button>
          <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button size="sm" variant="professional" className="w-full">Apply Now</Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

// Avoid re-renders unless vital job fields change
export const JobCard = memo(JobCardBase, (prev, next) => {
  const a = prev.job, b = next.job;
  return a.id === b.id && a.title === b.title && a.postedAt === b.postedAt && a.deadline === b.deadline && a.featured === b.featured && a.applyUrl === b.applyUrl;
});

export default JobCard;