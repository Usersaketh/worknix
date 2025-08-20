import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { AdProvider } from "./components/ads/AdProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
const Home = lazy(() => import("./pages/Home"));
const JobPortal = lazy(() => import("./pages/JobPortal"));
const GovtJob = lazy(() => import("./pages/GovtJob"));
const ResumeBuilder = lazy(() => import("./pages/ResumeBuilder"));
const AdminPortal = lazy(() => import("./pages/AdminPortal"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
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
              <Route path="/jobs" element={<JobPortal />} />
              <Route path="/govt-jobs" element={<GovtJob />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/admin" element={
                <ProtectedRoute isHost={true}>
                  <AdminPortal />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
