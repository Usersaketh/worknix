import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-secondary/20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">About Worknix</h1>
          <p className="text-muted-foreground text-lg">Focused job notifications portal for private and government opportunities.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Our mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We surface timely private sector and government openings in a fast, accessible, frontend‑only experience—no accounts or tracking.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What we offer</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Curated private job postings</li>
                <li>Highlighted government roles</li>
                <li>Featured tagging for priority listings</li>
                <li>Lightweight admin posting (key-protected)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
