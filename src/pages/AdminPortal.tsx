import { Suspense, lazy, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Shield,
  Settings,
  Building2
} from "lucide-react";

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("worknix_admin_tab") || "dashboard");
  useEffect(() => {
    localStorage.setItem("worknix_admin_tab", activeTab);
  }, [activeTab]);
  const AdminDashboardCharts = lazy(() => import("./admin/AdminDashboardCharts"));

  // Sample data for charts
  const applicationData = [
    { month: 'Jan', applications: 120 },
    { month: 'Feb', applications: 190 },
    { month: 'Mar', applications: 150 },
    { month: 'Apr', applications: 220 },
    { month: 'May', applications: 280 },
    { month: 'Jun', applications: 310 }
  ];

  const statusData = [
    { name: 'Applied', value: 45, color: '#3b82f6' },
    { name: 'Reviewing', value: 25, color: '#f59e0b' },
    { name: 'Interview', value: 20, color: '#10b981' },
    { name: 'Rejected', value: 10, color: '#ef4444' }
  ];

  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      status: "Active",
      applications: 45,
      posted: "2024-01-15",
      type: "Full-time"
    },
    {
      id: 2,
      title: "UX/UI Designer",
      company: "Design Studio",
      status: "Active",
      applications: 32,
      posted: "2024-01-10",
      type: "Full-time"
    },
    {
      id: 3,
      title: "Product Manager",
      company: "StartupXYZ",
      status: "Paused",
      applications: 28,
      posted: "2024-01-08",
      type: "Remote"
    }
  ];

  const candidates = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      position: "Senior Frontend Developer",
      status: "Interview",
      score: 95,
      applied: "2024-01-20"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@email.com",
      position: "UX/UI Designer",
      status: "Reviewing",
      score: 88,
      applied: "2024-01-18"
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily.davis@email.com",
      position: "Product Manager",
      status: "Applied",
      score: 82,
      applied: "2024-01-16"
    }
  ];

  const govtJobs = [
    {
      id: 1,
      title: "Software Engineer",
      department: "Department of Defense",
      status: "Active",
      applications: 67,
      posted: "2024-01-15",
      clearance: "Secret",
      location: "Washington, DC"
    },
    {
      id: 2,
      title: "Data Analyst",
      department: "Department of Health & Human Services",
      status: "Active",
      applications: 45,
      posted: "2024-01-12",
      clearance: "Public Trust",
      location: "Bethesda, MD"
    },
    {
      id: 3,
      title: "Cybersecurity Specialist",
      department: "Department of Homeland Security",
      status: "Paused",
      applications: 89,
      posted: "2024-01-10",
      clearance: "Top Secret",
      location: "Remote"
    },
    {
      id: 4,
      title: "Policy Analyst",
      department: "Department of Education",
      status: "Active",
      applications: 34,
      posted: "2024-01-08",
      clearance: "Public Trust",
      location: "Washington, DC"
    }
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Paused': return 'secondary';
      case 'Interview': return 'default';
      case 'Reviewing': return 'secondary';
      case 'Applied': return 'outline';
      default: return 'outline';
    }
  };

  const [jobStatus, setJobStatus] = useState<string>("All");
  const filteredAdminJobs = jobs.filter(j => jobStatus === "All" || j.status === jobStatus);
  const [siteTitle, setSiteTitle] = useState<string>(() => localStorage.getItem("worknix_site_title") || "Worknix");
  const [enableAds, setEnableAds] = useState<boolean>(() => localStorage.getItem("worknix_enable_ads") === "true");
  const saveSettings = () => {
    localStorage.setItem("worknix_site_title", siteTitle);
    localStorage.setItem("worknix_enable_ads", String(enableAds));
  };

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
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="govt-jobs">Govt Jobs</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="resumes">Resumes</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <Card className="shadow-[var(--shadow-card)]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Total Jobs</p>
                      <p className="text-3xl font-bold text-foreground">156</p>
                      <p className="text-success text-sm">+12% from last month</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow-card)]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Govt Jobs</p>
                      <p className="text-3xl font-bold text-foreground">24</p>
                      <p className="text-success text-sm">+8% from last month</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow-card)]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Total Applications</p>
                      <p className="text-3xl font-bold text-foreground">2,547</p>
                      <p className="text-success text-sm">+18% from last month</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow-card)]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Resumes Created</p>
                      <p className="text-3xl font-bold text-foreground">892</p>
                      <p className="text-success text-sm">+25% from last month</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow-card)]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Success Rate</p>
                      <p className="text-3xl font-bold text-foreground">85%</p>
                      <p className="text-success text-sm">+3% from last month</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts lazy-loaded */}
            <Suspense fallback={<Card className="shadow-[var(--shadow-card)] p-6 text-center">Loading charts…</Card>}>
              <AdminDashboardCharts applicationData={applicationData} statusData={statusData} />
            </Suspense>
          </TabsContent>

          {/* Jobs Management Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Job Management</h2>
              <div className="flex items-center gap-3">
                <select
                  className="border border-border rounded-md px-3 py-2 text-sm"
                  value={jobStatus}
                  onChange={(e) => setJobStatus(e.target.value)}
                  aria-label="Filter by status"
                >
                  <option>All</option>
                  <option>Active</option>
                  <option>Paused</option>
                </select>
                <Button variant="professional">
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </div>
            </div>

            <Card className="shadow-[var(--shadow-card)]">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredAdminJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        <p className="text-muted-foreground">{job.company}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant={getStatusBadgeVariant(job.status)}>
                            {job.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {job.applications} applications
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Posted: {job.posted}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Govt Jobs Management Tab */}
          <TabsContent value="govt-jobs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Government Job Management</h2>
              <Button variant="professional">
                <Plus className="h-4 w-4 mr-2" />
                Post New Govt Job
              </Button>
            </div>

            <Card className="shadow-[var(--shadow-card)]">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {govtJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        <p className="text-muted-foreground">{job.department}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant={getStatusBadgeVariant(job.status)}>
                            {job.status}
                          </Badge>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            {job.clearance}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {job.applications} applications
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {job.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Candidate Management</h2>
              <div className="flex gap-2">
                <Input placeholder="Search candidates..." className="w-64" />
                <Button variant="outline">Filter</Button>
              </div>
            </div>

            <Card className="shadow-[var(--shadow-card)]">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {candidates.map((candidate) => (
                    <div key={candidate.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                        <p className="text-muted-foreground">{candidate.email}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-muted-foreground">
                            Applied for: {candidate.position}
                          </span>
                          <Badge variant={getStatusBadgeVariant(candidate.status)}>
                            {candidate.status}
                          </Badge>
                          <span className="text-sm text-success font-semibold">
                            Score: {candidate.score}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="professional" size="sm">
                          Contact
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resumes Tab */}
          <TabsContent value="resumes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Resume Analytics</h2>
              <Button variant="outline">Export Data</Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-[var(--shadow-card)]">
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">892</h3>
                  <p className="text-muted-foreground">Total Resumes</p>
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow-card)]">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-12 w-12 text-success mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">156</h3>
                  <p className="text-muted-foreground">This Month</p>
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow-card)]">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-warning mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">4.8</h3>
                  <p className="text-muted-foreground">Avg. Rating</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Settings className="h-5 w-5" /> Settings</h2>
            <Card className="shadow-[var(--shadow-card)] max-w-xl">
              <CardHeader>
                <CardTitle>Site Configuration</CardTitle>
                <CardDescription>Persisted locally for demo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site-title">Site Title</Label>
                  <Input id="site-title" value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                  <input id="ads-toggle" type="checkbox" checked={enableAds} onChange={(e) => setEnableAds(e.target.checked)} />
                  <Label htmlFor="ads-toggle">Enable ads (demo-only)</Label>
                </div>
                <div className="pt-2">
                  <Button variant="professional" onClick={saveSettings}>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">System Settings</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Configure system-wide settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input id="site-name" value="Worknix" />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input id="contact-email" value="admin@worknix.com" />
                  </div>
                  <div>
                    <Label htmlFor="description">Site Description</Label>
                    <Textarea id="description" rows={3} value="Professional job platform for job seekers and employers" />
                  </div>
                  <Button variant="professional">Save Changes</Button>
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user permissions and roles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold">Admin Users</p>
                      <p className="text-sm text-muted-foreground">5 active admins</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold">Job Posters</p>
                      <p className="text-sm text-muted-foreground">234 company accounts</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold">Job Seekers</p>
                      <p className="text-sm text-muted-foreground">1,245 active users</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPortal;