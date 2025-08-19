import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-secondary/20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">Your privacy matters to us.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              Worknix is a frontend-only application. We do not store personal data on a server. Any information you enter is kept in the session in your browser unless you export it manually.
            </p>
            <p>
              Ads may be displayed through Google AdSense when enabled. AdSense may use cookies and similar technologies as governed by Google's policies. You can manage your preferences through your Google account and browser settings.
            </p>
            <p>
              If you contact us, we will use your provided email solely to respond to your inquiry.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
