import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, MapPin, Clock, DollarSign, Building, Filter } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";

const JobPortal = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $160k",
      postedDate: "2 days ago",
      description: "We're looking for an experienced frontend developer to join our growing team...",
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
      logo: "🚀"
    },
    {
      id: 2,
      title: "UX/UI Designer",
      company: "Design Studio",
      location: "New York, NY",
      type: "Full-time",
      salary: "$80k - $110k",
      postedDate: "1 week ago",
      description: "Join our creative team to design amazing user experiences...",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      logo: "🎨"
    },
    {
      id: 3,
      title: "Product Manager",
      company: "StartupXYZ",
      location: "Remote",
      type: "Full-time",
      salary: "$100k - $140k",
      postedDate: "3 days ago",
      description: "Lead product strategy and work with cross-functional teams...",
      skills: ["Product Strategy", "Agile", "Analytics", "Leadership"],
      logo: "💡"
    },
    {
      id: 4,
      title: "Data Scientist",
      company: "AI Innovations",
      location: "Seattle, WA",
      type: "Full-time",
      salary: "$130k - $170k",
      postedDate: "5 days ago",
      description: "Analyze complex datasets and build machine learning models...",
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
      logo: "📊"
    },
    {
      id: 5,
      title: "Backend Engineer",
      company: "CloudTech",
      location: "Austin, TX",
      type: "Contract",
      salary: "$90k - $120k",
      postedDate: "1 day ago",
      description: "Build scalable backend systems and APIs...",
      skills: ["Node.js", "AWS", "Docker", "PostgreSQL"],
      logo: "⚡"
    },
    {
      id: 6,
      title: "Marketing Manager",
      company: "GrowthCo",
      location: "Los Angeles, CA",
      type: "Full-time",
      salary: "$70k - $95k",
      postedDate: "4 days ago",
      description: "Drive marketing campaigns and brand growth strategies...",
      skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
      logo: "📈"
    }
  ];

  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote"];
  const locations = ["San Francisco, CA", "New York, NY", "Remote", "Seattle, WA", "Austin, TX", "Los Angeles, CA"];

  const [searchParams, setSearchParams] = useSearchParams();
  // Initialize from URL once
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const types = (searchParams.get("types") || "").split(",").filter(Boolean);
    const locs = (searchParams.get("locs") || "").split(",").filter(Boolean);
    setSearchQuery(q);
    setSelectedTypes(types.filter((t) => jobTypes.includes(t)));
    setSelectedLocations(locs.filter((l) => locations.includes(l)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedTypes.length) params.set("types", selectedTypes.join(","));
    if (selectedLocations.length) params.set("locs", selectedLocations.join(","));
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedTypes, selectedLocations, setSearchParams]);

  const matchesSearch = (text: string) => text.toLowerCase().includes(searchQuery.toLowerCase());
  const filteredJobs = jobs.filter(job => {
    const searchOk =
      matchesSearch(job.title) ||
      matchesSearch(job.company) ||
      job.skills.some((s) => matchesSearch(s));
    const typeOk = selectedTypes.length === 0 || selectedTypes.includes(job.type);
    const locationOk = selectedLocations.length === 0 || selectedLocations.includes(job.location);
    return searchOk && typeOk && locationOk;
  });
  const [sort, setSort] = useState("Most Recent");
  const sortedJobs = useMemo(() => {
    const arr = [...filteredJobs];
    if (sort === "Salary: High to Low") {
      return arr.sort((a, b) => parseInt(b.salary.replace(/[^0-9]/g, "")) - parseInt(a.salary.replace(/[^0-9]/g, "")));
    }
    if (sort === "Salary: Low to High") {
      return arr.sort((a, b) => parseInt(a.salary.replace(/[^0-9]/g, "")) - parseInt(b.salary.replace(/[^0-9]/g, "")));
    }
    // Most Recent or Relevance default (no reliable date parsing here)
    return arr;
  }, [filteredJobs, sort]);

  const [shownCount, setShownCount] = useState(6);
  const visibleJobs = useMemo(() => sortedJobs.slice(0, shownCount), [sortedJobs, shownCount]);

  // Read page from URL
  useEffect(() => {
    const p = parseInt(searchParams.get("p") || "1", 10);
    if (p > 1) setShownCount(p * 6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist page to URL
  useEffect(() => {
    const p = Math.max(1, Math.ceil(shownCount / 6));
    const params = new URLSearchParams(searchParams);
    if (p > 1) params.set("p", String(p)); else params.delete("p");
    setSearchParams(params, { replace: true });
  }, [shownCount, searchParams, setSearchParams]);

  const toggleIn = (arr: string[], setArr: (v: string[]) => void, value: string) => {
    setArr(arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
  };

  const removeType = (t: string) => setSelectedTypes((prev) => prev.filter((v) => v !== t));
  const removeLocation = (l: string) => setSelectedLocations((prev) => prev.filter((v) => v !== l));
  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedLocations([]);
  };
  const clearSearch = () => setSearchQuery("");

  return (
    <div className="min-h-screen bg-secondary/20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Find Your Dream Job</h1>
          <p className="text-xl text-muted-foreground">
            Discover opportunities that match your skills and aspirations
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search jobs, companies, or skills..."
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

            {(selectedTypes.length > 0 || selectedLocations.length > 0 || searchQuery) && (
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
                {selectedLocations.map((l) => (
                  <Badge key={`l-${l}`} variant="secondary" className="text-sm">
                    {l}
                    <button className="ml-2" aria-label={`Remove ${l}`} onClick={() => removeLocation(l)}>
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
  <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_JOBS || "0000000001"} className="mb-8" />

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
                  <h4 className="font-semibold mb-3">Location</h4>
                  <div className="space-y-2">
                    {locations.map((location) => (
                      <label key={location} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedLocations.includes(location)}
                          onChange={() => toggleIn(selectedLocations, setSelectedLocations, location)}
                          aria-label={`Filter by location ${location}`}
                        />
                        <span className="text-sm">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => { setSelectedTypes([]); setSelectedLocations([]); }}
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
              <p className="text-muted-foreground">Showing {sortedJobs.length} jobs</p>
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
                  <p className="mb-3">No jobs match your filters.</p>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedTypes([]); setSelectedLocations([]); setSearchQuery(""); }}>
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
                                {job.company}
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
                            <Badge variant="outline">{job.type}</Badge>
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
                  Load More Jobs
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPortal;