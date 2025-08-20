import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, MapPin, Clock, DollarSign, Building, Filter, Shield } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";

const GovtJob = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedClearances, setSelectedClearances] = useState<string[]>([]);

  const govtJobs = [
    {
      id: 1,
      title: "Software Engineer",
      department: "Department of Defense",
      location: "Washington, DC",
      type: "Full-time",
      salary: "$85k - $120k",
      postedDate: "3 days ago",
      description: "Develop and maintain critical software systems for national security...",
      skills: ["Java", "Spring Boot", "Oracle", "Security Clearance"],
      logo: "🛡️",
      clearance: "Secret"
    },
    {
      id: 2,
      title: "Data Analyst",
      department: "Department of Health & Human Services",
      location: "Bethesda, MD",
      type: "Full-time",
      salary: "$65k - $95k",
      postedDate: "1 week ago",
      description: "Analyze healthcare data to support policy decisions and program evaluation...",
      skills: ["Python", "R", "SQL", "Statistical Analysis"],
      logo: "🏥",
      clearance: "Public Trust"
    },
    {
      id: 3,
      title: "Project Manager",
      department: "Department of Transportation",
      location: "Arlington, VA",
      type: "Full-time",
      salary: "$90k - $130k",
      postedDate: "5 days ago",
      description: "Manage infrastructure projects and coordinate with multiple stakeholders...",
      skills: ["Project Management", "Agile", "Stakeholder Management", "Budget Planning"],
      logo: "🚗",
      clearance: "Public Trust"
    },
    {
      id: 4,
      title: "Cybersecurity Specialist",
      department: "Department of Homeland Security",
      location: "Remote",
      type: "Full-time",
      salary: "$100k - $140k",
      postedDate: "2 days ago",
      description: "Protect critical infrastructure and government systems from cyber threats...",
      skills: ["Cybersecurity", "Incident Response", "SIEM", "Network Security"],
      logo: "🔒",
      clearance: "Top Secret"
    },
    {
      id: 5,
      title: "Policy Analyst",
      department: "Department of Education",
      location: "Washington, DC",
      type: "Full-time",
      salary: "$70k - $100k",
      postedDate: "4 days ago",
      description: "Analyze education policies and develop recommendations for improvement...",
      skills: ["Policy Analysis", "Research", "Data Analysis", "Report Writing"],
      logo: "📚",
      clearance: "Public Trust"
    },
    {
      id: 6,
      title: "Contract Specialist",
      department: "General Services Administration",
      location: "Philadelphia, PA",
      type: "Full-time",
      salary: "$75k - $110k",
      postedDate: "1 day ago",
      description: "Manage government contracts and procurement processes...",
      skills: ["Contract Management", "Procurement", "Negotiation", "Federal Regulations"],
      logo: "📋",
      clearance: "Public Trust"
    }
  ];

  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote"];
  const departments = [
    "Department of Defense",
    "Department of Health & Human Services",
    "Department of Transportation",
    "Department of Homeland Security",
    "Department of Education",
    "General Services Administration"
  ];
  const clearances = ["Public Trust", "Secret", "Top Secret", "None Required"];
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const types = (searchParams.get("types") || "").split(",").filter(Boolean);
    const depts = (searchParams.get("depts") || "").split(",").filter(Boolean);
    const cls = (searchParams.get("cls") || "").split(",").filter(Boolean);
    setSearchQuery(q);
    setSelectedTypes(types.filter((t) => jobTypes.includes(t)));
    setSelectedDepartments(depts.filter((d) => departments.includes(d)));
    setSelectedClearances(cls.filter((c) => clearances.includes(c)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedTypes.length) params.set("types", selectedTypes.join(","));
    if (selectedDepartments.length) params.set("depts", selectedDepartments.join(","));
    if (selectedClearances.length) params.set("cls", selectedClearances.join(","));
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedTypes, selectedDepartments, selectedClearances, setSearchParams]);

  const matchesSearch = (t: string) => t.toLowerCase().includes(searchQuery.toLowerCase());
  const filteredJobs = govtJobs.filter((job) => {
    const searchOk =
      matchesSearch(job.title) ||
      matchesSearch(job.department) ||
      job.skills.some((s) => matchesSearch(s));
    const typeOk = selectedTypes.length === 0 || selectedTypes.includes(job.type);
    const deptOk = selectedDepartments.length === 0 || selectedDepartments.includes(job.department);
    const clearOk =
      selectedClearances.length === 0 ||
      selectedClearances.includes(job.clearance || "None Required");
    return searchOk && typeOk && deptOk && clearOk;
  });

  const toggleIn = (arr: string[], setArr: (v: string[]) => void, value: string) => {
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const removeType = (t: string) => setSelectedTypes((prev) => prev.filter((v) => v !== t));
  const removeDept = (d: string) => setSelectedDepartments((prev) => prev.filter((v) => v !== d));
  const removeClearance = (c: string) => setSelectedClearances((prev) => prev.filter((v) => v !== c));
  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedDepartments([]);
    setSelectedClearances([]);
  };
  const clearSearch = () => setSearchQuery("");

  const [sort, setSort] = useState("Most Recent");
  const sortedJobs = useMemo(() => {
    const arr = [...filteredJobs];
    if (sort === "Salary: High to Low") {
      return arr.sort((a, b) => parseInt((b.salary || "0").replace(/[^0-9]/g, "")) - parseInt((a.salary || "0").replace(/[^0-9]/g, "")));
    }
    if (sort === "Salary: Low to High") {
      return arr.sort((a, b) => parseInt((a.salary || "0").replace(/[^0-9]/g, "")) - parseInt((b.salary || "0").replace(/[^0-9]/g, "")));
    }
    return arr;
  }, [filteredJobs, sort]);
  const [shownCount, setShownCount] = useState(6);
  const visibleJobs = useMemo(() => sortedJobs.slice(0, shownCount), [sortedJobs, shownCount]);
  useEffect(() => {
    const p = parseInt(searchParams.get("p") || "1", 10);
    if (p > 1) setShownCount(p * 6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const p = Math.max(1, Math.ceil(shownCount / 6));
    const params = new URLSearchParams(searchParams);
    if (p > 1) params.set("p", String(p)); else params.delete("p");
    setSearchParams(params, { replace: true });
  }, [shownCount, searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-secondary/20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Government Job Opportunities</h1>
          <p className="text-xl text-muted-foreground">
            Serve your country and build your career with federal government positions
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search government jobs, departments, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="professional" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {(selectedTypes.length > 0 || selectedDepartments.length > 0 || selectedClearances.length > 0 || searchQuery) && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {searchQuery && (
                  <Badge variant="secondary" className="text-sm">
                    Search: {searchQuery}
                    <button className="ml-2" aria-label="Clear search" onClick={clearSearch}>
                      ×
                    </button>
                  </Badge>
                )}
                {selectedTypes.map((t) => (
                  <Badge key={`t-${t}`} variant="secondary" className="text-sm">
                    {t}
                    <button className="ml-2" aria-label={`Remove ${t}`} onClick={() => removeType(t)}>
                      ×
                    </button>
                  </Badge>
                ))}
                {selectedDepartments.map((d) => (
                  <Badge key={`d-${d}`} variant="secondary" className="text-sm">
                    {d}
                    <button className="ml-2" aria-label={`Remove ${d}`} onClick={() => removeDept(d)}>
                      ×
                    </button>
                  </Badge>
                ))}
                {selectedClearances.map((c) => (
                  <Badge key={`c-${c}`} variant="secondary" className="text-sm">
                    {c}
                    <button className="ml-2" aria-label={`Remove ${c}`} onClick={() => removeClearance(c)}>
                      ×
                    </button>
                  </Badge>
                ))}
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="ml-auto">
                  Clear filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

  {/* In-list Ad */}
  <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_GOVT || "0000000002"} className="mb-8" />

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Job Type</h4>
                  <div className="space-y-2">
                    {jobTypes.map((type) => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedTypes.includes(type)}
                          onChange={() => toggleIn(selectedTypes, setSelectedTypes, type)}
                          aria-label={`Filter by job type ${type}`}
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-3">Department</h4>
                  <div className="space-y-2">
                    {departments.map((dept) => (
                      <label key={dept} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedDepartments.includes(dept)}
                          onChange={() => toggleIn(selectedDepartments, setSelectedDepartments, dept)}
                          aria-label={`Filter by department ${dept}`}
                        />
                        <span className="text-sm">{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-3">Security Clearance</h4>
                  <div className="space-y-2">
                    {clearances.map((clearance) => (
                      <label key={clearance} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedClearances.includes(clearance)}
                          onChange={() => toggleIn(selectedClearances, setSelectedClearances, clearance)}
                          aria-label={`Filter by clearance ${clearance}`}
                        />
                        <span className="text-sm">{clearance}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => { setSelectedTypes([]); setSelectedDepartments([]); setSelectedClearances([]); }}
                    aria-label="Clear all filters"
                  >
                    Clear all
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-muted-foreground">Showing {sortedJobs.length} government jobs</p>
              <select
                className="border border-border rounded-md px-3 py-2 text-sm"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort jobs"
              >
                <option>Most Recent</option>
                <option>Salary: High to Low</option>
                <option>Salary: Low to High</option>
                <option>Relevance</option>
              </select>
            </div>

            <div className="space-y-6">
              {sortedJobs.length === 0 ? (
                <Card className="p-6 text-center text-muted-foreground">
                  <p className="mb-3">No government jobs match your filters.</p>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedTypes([]); setSelectedDepartments([]); setSelectedClearances([]); setSearchQuery(""); }}>
                    Reset filters
                  </Button>
                </Card>
              ) : visibleJobs.map((job) => (
                <Card key={job.id} className="group hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{job.logo}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-4 text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Building className="h-4 w-4" />
                                {job.department}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {job.postedDate}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-success font-semibold mb-2">
                              <DollarSign className="h-4 w-4" />
                              {job.salary}
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline">{job.type}</Badge>
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                {job.clearance}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {job.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <Button variant="professional" size="sm" className="ml-4">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            {shownCount < sortedJobs.length && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" onClick={() => setShownCount((c) => c + 6)}>
                  Load More Government Jobs
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovtJob; 
