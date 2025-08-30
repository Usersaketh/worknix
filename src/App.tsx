import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { AdProvider } from "./components/ads/AdProvider";
import ScrollToTop from "./components/ScrollToTop";
const Home = lazy(() => import("./pages/Home"));
const AdminPortal = lazy(() => import("./pages/AdminPortal"));
const JobsPrivate = lazy(() => import("./pages/JobsPrivate"));
const JobsGovt = lazy(() => import("./pages/JobsGovt"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdProvider />
        <ScrollToTop />
        <Navigation />
        <main id="main-content" tabIndex={-1}>
          <Suspense fallback={<div className="p-6 text-center text-muted-foreground">Loading…</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs/private" element={<JobsPrivate />} />
              <Route path="/jobs/govt" element={<JobsGovt />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/admin" element={<AdminGate><AdminPortal /></AdminGate>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Gate admin by query key vs env
const AdminGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);
  const key = params.get('key');
  const required = import.meta.env.VITE_ADMIN_KEY;
  if (!required) return <div className="p-8 text-center text-sm text-muted-foreground">Admin key not configured.</div>;
  if (key !== required) return <div className="p-10 text-center">
    <p className="text-lg font-semibold mb-2">Restricted</p>
    <p className="text-muted-foreground">Supply ?key=YOUR_KEY to access admin.</p>
  </div>;
  return <>{children}</>;
};

export default App;
