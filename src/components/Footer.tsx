import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-10 border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
          <div className="text-muted-foreground">
            © {new Date().getFullYear()} Worknix. All rights reserved.
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <Link className="hover:text-primary" to="/about">About</Link>
            <Link className="hover:text-primary" to="/contact">Contact</Link>
            <Link className="hover:text-primary" to="/privacy">Privacy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
