import { Link } from "react-router-dom";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { addSubscription, sendSubscriptionConfirmation } from '@/data/subscriptions';
import { Card } from '@/components/ui/card';
import { Share2, MessageCircle } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await addSubscription(email);
      await sendSubscriptionConfirmation(email);
      toast({ title: 'Subscribed', description: 'Check your inbox for confirmation.' });
      setEmail('');
    } catch (err) {
      const msg = (err as { message?: string })?.message || 'Subscription failed';
      toast({ title: 'Subscribe failed', description: msg, variant: 'destructive' });
    } finally { setSubmitting(false); }
  };

  return (
    <footer className="mt-10 border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">Stay updated with new job postings & product updates. No spam.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <Input
                aria-label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                required
                className="sm:flex-1"
              />
              <Button type="submit" variant="professional" disabled={submitting}>{submitting? '...' : 'Subscribe'}</Button>
            </form>
            <div className="text-xs text-muted-foreground">We respect your privacy. Unsubscribe anytime.</div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Join our channels</h4>
            <div className="flex flex-col gap-2 max-w-xs">
              <a href={import.meta.env.VITE_TELEGRAM_URL || '#'} target="_blank" rel="noopener noreferrer">
                <Button type="button" variant="outline" className="w-full justify-start gap-2">
                  <Share2 className="h-4 w-4" /> Telegram
                </Button>
              </a>
              <a href={import.meta.env.VITE_WHATSAPP_URL || '#'} target="_blank" rel="noopener noreferrer">
                <Button type="button" variant="outline" className="w-full justify-start gap-2">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </Button>
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Navigate</h4>
            <nav className="flex flex-col gap-1 text-sm">
              <Link className="hover:text-primary" to="/about">About</Link>
              <Link className="hover:text-primary" to="/contact">Contact</Link>
              <Link className="hover:text-primary" to="/privacy">Privacy</Link>
              <Link className="hover:text-primary" to="/news">News</Link>
            </nav>
          </div>
        </div>
        <div className="mt-10 text-center text-muted-foreground">© {new Date().getFullYear()} Worknix. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
