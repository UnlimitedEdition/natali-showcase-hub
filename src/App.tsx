import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CookieBanner } from "@/components/gdpr/CookieBanner";
import React, { Suspense } from "react";

// Lazy load all page components
const Home = React.lazy(() => import("./pages/Home"));
const Podcast = React.lazy(() => import("./pages/Podcast"));
const Kitchen = React.lazy(() => import("./pages/Kitchen"));
const Stories = React.lazy(() => import("./pages/Stories"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Admin = React.lazy(() => import("./pages/Admin"));
const Privacy = React.lazy(() => import("./pages/Privacy"));
const Impressum = React.lazy(() => import("./pages/Impressum"));
const Terms = React.lazy(() => import("./pages/Terms"));
const Cookies = React.lazy(() => import("./pages/Cookies"));
const DatabaseInspector = React.lazy(() => import("./pages/DatabaseInspector"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/podcast" element={<Podcast />} />
                <Route path="/kitchen" element={<Kitchen />} />
                <Route path="/stories" element={<Stories />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/impressum" element={<Impressum />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/database-inspector" element={<DatabaseInspector />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <CookieBanner />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;