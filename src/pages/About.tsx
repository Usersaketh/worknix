import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-secondary/20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">About Worknix</h1>
          <p className="text-muted-foreground text-lg">Professional resume builder and job discovery portal.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Our mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We help candidates create ATS-optimized resumes and connect with meaningful opportunities, including government roles, using a fast and accessible frontend experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What we offer</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Modern resume builder with professional templates</li>
                <li>Curated job listings with client-side search and filters</li>
                <li>Government job highlights with clarity on clearance needs</li>
                <li>Admin dashboard for content oversight (demo)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
