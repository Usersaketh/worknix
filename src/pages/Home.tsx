import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Briefcase, FileText, Users, Target, CheckCircle, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-ats.jpg";
import { AdSlot } from "@/components/ads/AdSlot";

const Home = () => {
  const features = [
    {
      icon: Briefcase,
      title: "Job Portal",
      description: "Browse thousands of job opportunities from top companies worldwide.",
      link: "/jobs"
    },
    {
      icon: FileText,
      title: "Resume Builder",
      description: "Create professional ATS-optimized resumes with our premium templates.",
      link: "/resume-builder"
    }
  ];

  const stats = [
    { icon: Briefcase, label: "Active Jobs", value: "2,500+" },
    { icon: Users, label: "Companies", value: "500+" },
    { icon: FileText, label: "Resumes Created", value: "10,000+" },
    { icon: Target, label: "Success Rate", value: "85%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                Your Career Journey
                <span className="block bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                  Starts Here
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Connect with top employers, build professional resumes, and manage your career 
                with our comprehensive ATS platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/jobs">
                  <Button size="lg" variant="professional" className="px-8 py-6 text-lg">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Find Jobs
                  </Button>
                </Link>
                <Link to="/resume-builder">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                    <FileText className="mr-2 h-5 w-5" />
                    Build Resume
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-elegant)] bg-gradient-to-r from-primary/10 to-primary-dark/10 p-2">
                <img
                  src={heroImage}
                  alt="Professional ATS workspace with diverse team reviewing resumes and conducting interviews"
                  className="w-full h-auto rounded-xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-primary to-primary-dark rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-accent to-primary rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* In-content Ad (responsive) */}
      <div className="px-4 max-w-7xl mx-auto">
        <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_HOME || "0000000000"} className="my-6" />
      </div>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-gradient-to-r from-primary to-primary-dark w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools you need to advance your career.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-card to-card/80 border-border/50">
                  <CardHeader className="text-center">
                    <div className="bg-gradient-to-r from-primary to-primary-dark w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base mb-6">
                      {feature.description}
                    </CardDescription>
                    <Link to={feature.link}>
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of professionals who have already found their dream jobs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-6">
              Create Account
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;