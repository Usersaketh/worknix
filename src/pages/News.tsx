import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function News() {
  return (
    <div className="min-h-screen bg-secondary/20 pt-24 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-[var(--shadow-card)] text-center py-20">
          <CardHeader>
            <CardTitle className="text-4xl font-bold">News & Updates</CardTitle>
            <CardDescription className="text-lg">Stay tuned — curated product & market updates arriving soon.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">We are building an insights feed for hiring trends, government recruitment alerts, resume best practices, and platform improvements. Check back shortly.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}