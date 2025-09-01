import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button';

const Footer = () => {
  // Newsletter subscription removed.
  const telegramUrl = import.meta.env.VITE_TELEGRAM_URL as string | undefined;
  const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL as string | undefined;

  return (
    <footer className="mt-10 border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Join our channels</h4>
            <div className="flex  md:flex-col gap-2  md:max-w-xs">
              <a href={telegramUrl || '#'} target="_blank" rel="noopener noreferrer">
                <Button
                  type="button"
                  className="w-full justify-start gap-2 bg-[#229ED9] hover:bg-[#1d89bd] dark:bg-[#229ED9] dark:hover:bg-[#1a78a2] text-white border-none shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#229ED9]/60 rounded-3xl"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
                    <path d="M11.944 0C5.352 0 0 5.353 0 11.944c0 6.59 5.352 11.944 11.944 11.944 6.59 0 11.944-5.353 11.944-11.944C23.888 5.353 18.535 0 11.944 0Zm5.514 8.205-2.05 9.664c-.155.688-.563.855-1.142.533l-3.164-2.332-1.526 1.469c-.169.168-.311.311-.636.311l.228-3.237 5.9-5.324c.256-.228-.056-.355-.397-.127l-7.29 4.59-3.14-.983c-.683-.215-.697-.683.142-1.011l12.261-4.727c.568-.21 1.064.127.883 1.004Z" />
                  </svg>
                  <span>Telegram</span>
                </Button>
              </a>
              <a href={whatsappUrl || '#'} target="_blank" rel="noopener noreferrer">
                <Button
                  type="button"
                  className="w-full justify-start gap-2 bg-[#25D366] hover:bg-[#1fb457] dark:bg-[#25D366] dark:hover:bg-[#1ca64f] text-white border-none shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]/60 rounded-3xl"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.515 7.403h-.004a11.815 11.815 0 0 1-6.01-1.656l-.43-.255-4.463 1.165 1.192-4.352-.28-.446a11.86 11.86 0 0 1-1.823-6.37c.002-6.556 5.338-11.89 11.896-11.89 3.182 0 6.167 1.24 8.413 3.488a11.82 11.82 0 0 1 3.484 8.406c-.003 6.557-5.339 11.892-11.895 11.892" />
                  </svg>
                  <span>WhatsApp</span>
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
              <Link className="hover:text-primary" to="/terms">Terms</Link>
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
