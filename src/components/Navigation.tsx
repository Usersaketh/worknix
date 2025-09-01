import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Home, Briefcase, Building2, Menu, X } from "lucide-react";
import Notifications from "./Notifications";
import { ThemeToggle } from './ThemeToggle';
import { useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/jobs/private", label: "Private Jobs", icon: Briefcase },
    { path: "/jobs/govt", label: "Govt Jobs", icon: Building2 },
  { path: "/news", label: "News", icon: Shield },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-card shadow-[var(--shadow-card)] border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center ">
            <img
              src="/Worknix_Favicon.png"
              alt="Worknix logo"
              className="w-10 h-10 pb-1 rounded-lg object-contain"
            />
            <span className="text-2xl font-bold text-foreground">Worknix</span>
          </Link>
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-muted focus:outline-none focus-visible:ring focus-visible:ring-primary"
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen(o => !o)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              
              return (
                <Link key={item.path} to={item.path} aria-current={isActive ? "page" : undefined}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            <Notifications />
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pt-4 pb-4 space-y-2 border-t border-border">
          {navItems.map(item => {
            const Icon = item.icon; const isActive = currentPath === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={()=>setMobileOpen(false)} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t mt-2 space-y-2">
            <ThemeToggle />
            <Notifications asNavItem />
          </div>
        </div>
      )}
      {/* Secondary nav row for policy links on small screens */}
      <div className="md:hidden px-4 pb-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
        <Link to="/about" className="hover:text-primary">About</Link>
        <Link to="/contact" className="hover:text-primary">Contact</Link>
        <Link to="/privacy" className="hover:text-primary">Privacy</Link>
      </div>
    </nav>
  );
};

export default Navigation;