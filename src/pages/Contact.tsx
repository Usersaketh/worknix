import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validEmail = (v: string) => /.+@.+\..+/.test(v);
  const canSubmit = form.name.trim().length > 1 && validEmail(form.email) && form.message.trim().length > 4 && !loading;

  const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'worknixinfo@gmail.com';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    const subject = encodeURIComponent(`Contact from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
  const mail = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    // Open mail client
    window.location.href = mail;
    toast({ title: 'Opening mail client', description: 'Finish sending your message there.' });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-secondary/20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Contact Us</h1>
          <p className="text-muted-foreground text-lg">We'd love to hear from you.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Send a message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Your full name" required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="you@example.com" required />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" rows={5} value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="How can we help?" required />
                  <p className="text-[11px] text-muted-foreground mt-1">Do not include sensitive information.</p>
                </div>
                <Button variant="professional" className="w-full" type="submit" disabled={!canSubmit}>{sent ? 'Sent' : (loading ? 'Sending…' : 'Submit')}</Button>
                {!validEmail(form.email) && form.email.length > 3 && <p className="text-xs text-destructive">Enter a valid email.</p>}
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Support</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-2">
              <p>For account or billing inquiries, please email {CONTACT_EMAIL}.</p>
              <p>We typically respond within 2 business days.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
