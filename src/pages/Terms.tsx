import Seo from '@/components/Seo';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <Seo title="Terms" description="Worknix terms of service." />
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="text-sm text-muted-foreground">Last updated {new Date().toISOString().slice(0,10)}</p>
      <section className="space-y-4 text-sm leading-relaxed">
        <p>These Terms govern your use of the Worknix site. By accessing or using the site you agree to these Terms.</p>
        <p>Jobs are aggregated or user-submitted and may change or expire without notice. Always verify details at the official source before applying.</p>
        <p>We don’t guarantee hiring outcomes, salary accuracy, or uninterrupted availability of the service.</p>
        <p>You agree not to scrape, resell, or misuse the data provided. Content may not be copied at scale without permission.</p>
        <p>We may update these Terms. Continued use after changes constitutes acceptance of the revised Terms.</p>
        <p>Contact us for questions at the Contact page.</p>
      </section>
    </div>
  );
}