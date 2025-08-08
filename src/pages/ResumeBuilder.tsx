import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Eye, Plus, X, Save } from "lucide-react";

const ResumeBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/johndoe",
      summary: "Experienced software developer with 5+ years of expertise in building scalable web applications."
    },
    experience: [
      {
        id: 1,
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        startDate: "2022",
        endDate: "Present",
        description: "Led development of React-based applications serving 100k+ users daily. Improved performance by 40% through optimization strategies."
      }
    ],
    education: [
      {
        id: 1,
        degree: "Bachelor of Science in Computer Science",
        school: "University of California",
        location: "Berkeley, CA",
        startDate: "2016",
        endDate: "2020"
      }
    ],
    skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"]
  });

  const templates = [
    {
      id: 1,
      name: "Professional",
      description: "Clean and modern design perfect for corporate roles",
      preview: "🎯"
    },
    {
      id: 2,
      name: "Creative",
      description: "Bold design with colors, ideal for creative industries",
      preview: "🎨"
    },
    {
      id: 3,
      name: "Minimal",
      description: "Simple and elegant, focuses on content",
      preview: "📄"
    },
    {
      id: 4,
      name: "Executive",
      description: "Sophisticated layout for senior positions",
      preview: "👔"
    }
  ];

  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !resumeData.skills.includes(newSkill.trim())) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  return (
    <div className="min-h-screen bg-secondary/20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Resume Builder</h1>
          <p className="text-xl text-muted-foreground">
            Create professional, ATS-optimized resumes with our powerful builder
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Resume Builder Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Build Your Resume
                    </CardTitle>
                    <CardDescription>
                      Fill in your information to create a professional resume
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="professional" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={resumeData.personalInfo.name}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, name: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={resumeData.personalInfo.email}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={resumeData.personalInfo.location}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn Profile</Label>
                      <Input
                        id="linkedin"
                        value={resumeData.personalInfo.linkedin}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        rows={4}
                        value={resumeData.personalInfo.summary}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, summary: e.target.value }
                        })}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="experience" className="space-y-4 mt-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Work Experience</h3>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>
                    {resumeData.experience.map((exp, index) => (
                      <Card key={exp.id} className="p-4">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Job Title</Label>
                              <Input value={exp.title} />
                            </div>
                            <div>
                              <Label>Company</Label>
                              <Input value={exp.company} />
                            </div>
                            <div>
                              <Label>Start Date</Label>
                              <Input value={exp.startDate} />
                            </div>
                            <div>
                              <Label>End Date</Label>
                              <Input value={exp.endDate} />
                            </div>
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Textarea rows={3} value={exp.description} />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="education" className="space-y-4 mt-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Education</h3>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                    {resumeData.education.map((edu, index) => (
                      <Card key={edu.id} className="p-4">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Degree</Label>
                              <Input value={edu.degree} />
                            </div>
                            <div>
                              <Label>School</Label>
                              <Input value={edu.school} />
                            </div>
                            <div>
                              <Label>Start Date</Label>
                              <Input value={edu.startDate} />
                            </div>
                            <div>
                              <Label>End Date</Label>
                              <Input value={edu.endDate} />
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-4 mt-6">
                    <div>
                      <Label htmlFor="new-skill">Add Skills</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="new-skill"
                          placeholder="Enter a skill..."
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        />
                        <Button onClick={addSkill} variant="professional">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Your Skills</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {resumeData.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              className="ml-2 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Template Selection & Preview */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Template Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Choose Template</CardTitle>
                  <CardDescription>
                    Select a professional template for your resume
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedTemplate === template.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="text-2xl mb-2 text-center">{template.preview}</div>
                        <h4 className="font-semibold text-sm">{template.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Resume Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    Live preview of your resume
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border rounded-lg p-4 text-xs text-black min-h-[400px]">
                    <div className="text-center mb-4">
                      <h1 className="text-lg font-bold">{resumeData.personalInfo.name}</h1>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>{resumeData.personalInfo.email} | {resumeData.personalInfo.phone}</div>
                        <div>{resumeData.personalInfo.location}</div>
                        <div>{resumeData.personalInfo.linkedin}</div>
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="mb-4">
                      <h2 className="font-bold text-sm mb-2">PROFESSIONAL SUMMARY</h2>
                      <p className="text-xs leading-relaxed">{resumeData.personalInfo.summary}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h2 className="font-bold text-sm mb-2">EXPERIENCE</h2>
                      {resumeData.experience.map((exp) => (
                        <div key={exp.id} className="mb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-xs">{exp.title}</h3>
                              <div className="text-xs text-gray-600">{exp.company} | {exp.location}</div>
                            </div>
                            <div className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</div>
                          </div>
                          <p className="text-xs mt-1 leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mb-4">
                      <h2 className="font-bold text-sm mb-2">SKILLS</h2>
                      <div className="flex flex-wrap gap-1">
                        {resumeData.skills.map((skill) => (
                          <span key={skill} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="professional" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;