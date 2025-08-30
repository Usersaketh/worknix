import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Shield } from "lucide-react";
import { Job } from '@/types/job';
import { getJobs, addJob, deleteJob, toggleFeatured, updateJob, cleanupExpiredJobs } from '@/data/jobs';
import { toast } from '@/hooks/use-toast';

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("worknix_admin_tab") || "dashboard");
  useEffect(() => {
    localStorage.setItem("worknix_admin_tab", activeTab);
  }, [activeTab]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [opLoading, setOpLoading] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true); setJobsError(null);
  try { const data = await getJobs(); setJobs(data); } catch (e: unknown) { const msg = (e as { message?: string })?.message || 'Failed to load jobs'; setJobsError(msg); }
    finally { setLoading(false); }
  };
  useEffect(()=> { refresh(); }, []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<Job,'postedAt'|'id'>>({ title:'', org:'', location:'', kind:'private', description:'', applyUrl:'', deadline:'', featured:false, imageUrl:'', salary:'', pdfUrl:'' });

  // Form state
  const empty: Omit<Job,'id'|'postedAt'> = { title: '', org: '', location:'', kind: 'private', description: '', applyUrl: '', deadline: '', featured: false, imageUrl:'', salary:'', pdfUrl:'' };
  const [form, setForm] = useState<Omit<Job,'id'|'postedAt'>>(empty);
  const [error, setError] = useState<string | null>(null);
  const validate = (data: {title:string; org:string; applyUrl:string; deadline?: string; imageUrl?: string; salary?: string}) => {
    if (!data.title.trim()) return 'Title required';
    if (!data.org.trim()) return 'Organization required';
    try { new URL(data.applyUrl); } catch { return 'Apply URL invalid'; }
    if (data.deadline) {
      const d = new Date(data.deadline + 'T00:00:00');
      const today = new Date(); today.setHours(0,0,0,0);
      if (d < today) return 'Deadline must be today or future';
    }
    return null;
  };
  const addJobHandler = async () => {
    const v = validate(form);
    if (v) return setError(v);
    setOpLoading(true);
  try { const created = await addJob(form); await refresh(); toast({ title: 'Job created', description: created.title }); } catch(e: unknown){ const msg = (e as { message?: string })?.message || 'Create failed'; setError(msg); toast({ title: 'Create failed', description: msg, variant: 'destructive' }); }
    setOpLoading(false);
    setForm(empty);
    setError(null);
  };
  const startEdit = (job: Job) => {
    setEditingId(job.id);
  setEditForm({ title: job.title, org: job.org, location: job.location, kind: job.kind, description: job.description, applyUrl: job.applyUrl, deadline: job.deadline || '', featured: job.featured || false, imageUrl: job.imageUrl || '', salary: job.salary || '', pdfUrl: job.pdfUrl || '' });
  };
  const cancelEdit = () => { setEditingId(null); };
  const saveEdit = async (id: string) => {
    const v = validate(editForm);
    if (v) { setError(v); return; }
    const original = jobs.find(j => j.id === id);
    if (!original) return;
    setOpLoading(true);
  try { const updated = await updateJob(id, { ...editForm, deadline: editForm.deadline || undefined }); await refresh(); toast({ title: 'Job updated', description: updated.title }); } catch(e: unknown){ const msg = (e as { message?: string })?.message || 'Update failed'; setError(msg); toast({ title: 'Update failed', description: msg, variant: 'destructive' }); }
    setOpLoading(false);
    setEditingId(null);
    setError(null);
  };
  const removeJob = async (id: string) => { setOpLoading(true); try { await deleteJob(id); await refresh(); toast({ title: 'Job deleted', description: id }); } catch(e: unknown){ const msg = (e as { message?: string })?.message || 'Delete failed'; setError(msg); toast({ title: 'Delete failed', description: msg, variant: 'destructive' }); } setOpLoading(false); };
  const handleToggleFeatured = async (id: string) => { setOpLoading(true); try { const res = await toggleFeatured(id); await refresh(); toast({ title: res?.featured? 'Featured enabled':'Featured removed', description: res?.title }); } catch(e: unknown){ const msg = (e as { message?: string })?.message || 'Toggle failed'; setError(msg); toast({ title: 'Toggle failed', description: msg, variant: 'destructive' }); } setOpLoading(false); };

  const privateJobs = jobs.filter(j => j.kind === 'private').sort((a,b) => b.postedAt.localeCompare(a.postedAt));
  const govtJobs = jobs.filter(j => j.kind === 'govt').sort((a,b) => b.postedAt.localeCompare(a.postedAt));
  const featured = jobs.filter(j => j.featured).slice(0,6);

  return (
    <div className="min-h-screen bg-secondary/20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-primary to-primary-dark w-12 h-12 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Admin Portal</h1>
              <p className="text-xl text-muted-foreground">
                Manage jobs, candidates, and system settings
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="private">Private Jobs</TabsTrigger>
            <TabsTrigger value="govt">Govt Jobs</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-[var(--shadow-card)]"><CardContent className="p-6"><p className="text-muted-foreground text-sm">Total Jobs</p><p className="text-3xl font-bold">{jobs.length}</p></CardContent></Card>
              <Card className="shadow-[var(--shadow-card)]"><CardContent className="p-6"><p className="text-muted-foreground text-sm">Featured</p><p className="text-3xl font-bold">{featured.length}</p></CardContent></Card>
              <Card className="shadow-[var(--shadow-card)]"><CardContent className="p-6"><p className="text-muted-foreground text-sm">Govt Jobs</p><p className="text-3xl font-bold">{govtJobs.length}</p></CardContent></Card>
            </div>
            <Card className="shadow-[var(--shadow-card)] max-w-2xl">
              <CardHeader>
                <CardTitle>Post Job</CardTitle>
                <CardDescription>Create a new job entry</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
                  </div>
                  <div>
                    <Label htmlFor="org">Company / Dept</Label>
                    <Input id="org" value={form.org} onChange={e=>setForm(f=>({...f,org:e.target.value}))} />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} placeholder="Remote / City" />
                  </div>
                  <div>
                    <Label htmlFor="apply">Apply URL</Label>
                    <Input id="apply" value={form.applyUrl} onChange={e=>setForm(f=>({...f,applyUrl:e.target.value}))} />
                  </div>
                  <div>
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input id="deadline" type="date" value={form.deadline} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))} />
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">Logo / Image URL</Label>
                    <Input id="imageUrl" value={form.imageUrl} onChange={e=>setForm(f=>({...f,imageUrl:e.target.value}))} placeholder="https://..." />
                  </div>
                  <div>
                    <Label htmlFor="salary">Salary / Package</Label>
                    <Input id="salary" value={form.salary} onChange={e=>setForm(f=>({...f,salary:e.target.value}))} placeholder="$100k - $120k" />
                  </div>
                  <div>
                    <Label htmlFor="pdfUrl">Job PDF URL</Label>
                    <Input id="pdfUrl" value={(form as any).pdfUrl || ''} onChange={e=>setForm(f=>({...f, pdfUrl: e.target.value}))} placeholder="https://.../job.pdf" />
                  </div>
                  <div>
                    <Label htmlFor="kind">Type</Label>
                    <select id="kind" value={form.kind} onChange={e=>setForm(f=>({...f,kind:e.target.value as 'private'|'govt'}))} className="border border-border rounded-md px-3 py-2 w-full text-sm bg-background">
                      <option value="private">Private</option>
                      <option value="govt">Govt</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input id="featured" type="checkbox" checked={form.featured} onChange={e=>setForm(f=>({...f,featured:e.target.checked}))} />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="desc">Description</Label>
                  <Textarea id="desc" rows={4} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="text-right"><Button variant="professional" disabled={opLoading} onClick={addJobHandler}>{opLoading? 'Working...' : 'Create'}</Button></div>
              </CardContent>
            </Card>
            <Card className="shadow-[var(--shadow-card)] max-w-2xl">
              <CardHeader>
                <CardTitle>Maintenance</CardTitle>
                <CardDescription>Housekeeping utilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" disabled={opLoading} onClick={async ()=>{ setOpLoading(true); try { const removed = await cleanupExpiredJobs(); await refresh(); toast({ title: 'Cleanup complete', description: removed ? `${removed} expired deleted` : 'No expired jobs' }); } catch(e:unknown){ const msg=(e as {message?:string})?.message||'Cleanup failed'; toast({ title:'Cleanup failed', description: msg, variant:'destructive'});} finally { setOpLoading(false);} }}>Run Expired Cleanup</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Management Tab */}
          <TabsContent value="private" className="space-y-6">
            <h2 className="text-2xl font-bold">Private Jobs ({privateJobs.length})</h2>
            <Card className="shadow-[var(--shadow-card)]"><CardContent className="p-6 space-y-4">
              {privateJobs.length === 0 && <p className="text-muted-foreground">No private jobs posted.</p>}
              {loading && <p className="text-muted-foreground text-sm">Loading…</p>}
              {jobsError && <p className="text-destructive text-sm">{jobsError}</p>}
              {!loading && privateJobs.map(j => {
                const editing = editingId === j.id;
                return (
                  <div key={j.id} className="p-4 border rounded-lg flex flex-col gap-4">
                    {!editing && (
                      <div className="flex justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">{j.title}</h3>
                          <p className="text-sm text-muted-foreground">{j.org}</p>
                          <p className="text-xs text-muted-foreground mt-1">Posted {new Date(j.postedAt).toLocaleDateString()} {j.deadline && <>• Deadline {j.deadline}</>}</p>
                          {j.featured && <Badge className="mt-2" variant="secondary">Featured</Badge>}
                        </div>
                        <div className="flex flex-col gap-2 min-w-[160px]">
                          <Button variant="outline" size="sm" disabled={opLoading} onClick={()=>handleToggleFeatured(j.id)}>{j.featured?'Unfeature':'Feature'}</Button>
                          <Button variant="outline" size="sm" disabled={opLoading} onClick={()=>startEdit(j)}>Edit</Button>
                          <Button variant="outline" size="sm" disabled={opLoading} onClick={()=>removeJob(j.id)}><Trash2 className="h-4 w-4" /></Button>
                          <a href={j.applyUrl} target="_blank" rel="noopener noreferrer"><Button size="sm" variant="professional">Apply</Button></a>
                        </div>
                      </div>
                    )}
                    {editing && (
                      <div className="space-y-3">
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Title</Label>
                            <Input value={editForm.title} onChange={e=>setEditForm(f=>({...f,title:e.target.value}))} />
                          </div>
                          <div>
                            <Label className="text-xs">Org</Label>
                            <Input value={editForm.org} onChange={e=>setEditForm(f=>({...f,org:e.target.value}))} />
                          </div>
                          <div>
                            <Label className="text-xs">Location</Label>
                            <Input value={editForm.location} onChange={e=>setEditForm(f=>({...f,location:e.target.value}))} />
                          </div>
                          <div>
                            <Label className="text-xs">Apply URL</Label>
                            <Input value={editForm.applyUrl} onChange={e=>setEditForm(f=>({...f,applyUrl:e.target.value}))} />
                          </div>
                          <div>
                            <Label className="text-xs">Deadline</Label>
                            <Input type="date" value={editForm.deadline} onChange={e=>setEditForm(f=>({...f,deadline:e.target.value}))} />
                          </div>
                          <div>
                            <Label className="text-xs">Logo / Image URL</Label>
                            <Input value={editForm.imageUrl} onChange={e=>setEditForm(f=>({...f,imageUrl:e.target.value}))} />
                          </div>
                          <div>
                            <Label className="text-xs">Salary</Label>
                            <Input value={editForm.salary} onChange={e=>setEditForm(f=>({...f,salary:e.target.value}))} />
                          </div>
                          <div>
                            <Label className="text-xs">Job PDF URL</Label>
                            <Input value={(editForm as any).pdfUrl || ''} onChange={e=>setEditForm(f=>({...f,pdfUrl:e.target.value}))} />
                          </div>
                          <div>
                            <Label className="text-xs">Type</Label>
                            <select value={editForm.kind} onChange={e=>setEditForm(f=>({...f,kind:e.target.value as 'private'|'govt'}))} className="border border-border rounded-md px-3 py-2 w-full text-sm bg-background">
                              <option value="private">Private</option>
                              <option value="govt">Govt</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-2 pt-6">
                            <input id={`featured-${j.id}`} type="checkbox" checked={editForm.featured} onChange={e=>setEditForm(f=>({...f,featured:e.target.checked}))} />
                            <Label htmlFor={`featured-${j.id}`}>Featured</Label>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Description</Label>
                          <Textarea rows={3} value={editForm.description} onChange={e=>setEditForm(f=>({...f,description:e.target.value}))} />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" disabled={opLoading} onClick={cancelEdit}>Cancel</Button>
                          <Button size="sm" variant="professional" disabled={opLoading} onClick={()=>saveEdit(j.id)}>{opLoading? 'Saving...' : 'Save'}</Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent></Card>
          </TabsContent>

          {/* Govt Jobs Management Tab */}
          <TabsContent value="govt" className="space-y-6">
            <h2 className="text-2xl font-bold">Government Jobs ({govtJobs.length})</h2>
            <Card className="shadow-[var(--shadow-card)]"><CardContent className="p-6 space-y-4">
              {govtJobs.length === 0 && <p className="text-muted-foreground">No government jobs posted.</p>}
              {loading && <p className="text-muted-foreground text-sm">Loading…</p>}
              {jobsError && <p className="text-destructive text-sm">{jobsError}</p>}
              {!loading && govtJobs.map(j => {
                const editing = editingId === j.id;
                return (
                  <div key={j.id} className="p-4 border rounded-lg flex flex-col gap-4">
                    {!editing && (
                      <div className="flex justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">{j.title}</h3>
                          <p className="text-sm text-muted-foreground">{j.org}</p>
                          <p className="text-xs text-muted-foreground mt-1">Posted {new Date(j.postedAt).toLocaleDateString()} {j.deadline && <>• Deadline {j.deadline}</>}</p>
                          {j.featured && <Badge className="mt-2" variant="secondary">Featured</Badge>}
                        </div>
                        <div className="flex flex-col gap-2 min-w-[160px]">
                          <Button variant="outline" size="sm" disabled={opLoading} onClick={()=>handleToggleFeatured(j.id)}>{j.featured?'Unfeature':'Feature'}</Button>
                          <Button variant="outline" size="sm" disabled={opLoading} onClick={()=>startEdit(j)}>Edit</Button>
                          <Button variant="outline" size="sm" disabled={opLoading} onClick={()=>removeJob(j.id)}><Trash2 className="h-4 w-4" /></Button>
                          <a href={j.applyUrl} target="_blank" rel="noopener noreferrer"><Button size="sm" variant="professional">Apply</Button></a>
                        </div>
                      </div>
                    )}
                    {editing && (
                      <div className="space-y-3">
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Title</Label>
                            <Input value={editForm.title} onChange={e=>setEditForm(f=>({...f,title:e.target.value}))} />
                          </div>
                          <div>
                            <Label className="text-xs">Org</Label>
                            <Input value={editForm.org} onChange={e=>setEditForm(f=>({...f,org:e.target.value}))} />
                          </div>
                          <div>
                            <Label className="text-xs">Apply URL</Label>
                            <Input value={editForm.applyUrl} onChange={e=>setEditForm(f=>({...f,applyUrl:e.target.value}))} />
                          </div>
                          <div>
                            <Label className="text-xs">Deadline</Label>
                            <Input type="date" value={editForm.deadline} onChange={e=>setEditForm(f=>({...f,deadline:e.target.value}))} />
                          </div>
                          <div>
                            <Label className="text-xs">Type</Label>
                            <select value={editForm.kind} onChange={e=>setEditForm(f=>({...f,kind:e.target.value as 'private'|'govt'}))} className="border border-border rounded-md px-3 py-2 w-full text-sm bg-background">
                              <option value="private">Private</option>
                              <option value="govt">Govt</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-2 pt-6">
                            <input id={`featured-${j.id}`} type="checkbox" checked={editForm.featured} onChange={e=>setEditForm(f=>({...f,featured:e.target.checked}))} />
                            <Label htmlFor={`featured-${j.id}`}>Featured</Label>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Description</Label>
                          <Textarea rows={3} value={editForm.description} onChange={e=>setEditForm(f=>({...f,description:e.target.value}))} />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" disabled={opLoading} onClick={cancelEdit}>Cancel</Button>
                          <Button size="sm" variant="professional" disabled={opLoading} onClick={()=>saveEdit(j.id)}>{opLoading? 'Saving...' : 'Save'}</Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent></Card>
          </TabsContent>

        
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPortal;