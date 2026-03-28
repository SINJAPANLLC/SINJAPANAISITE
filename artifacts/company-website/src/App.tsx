import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/CookieBanner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import { visitorLogStore } from "@/hooks/use-admin-data";
import Home from "@/pages/Home";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Admin from "@/pages/Admin";
import Download from "@/pages/Download";
import Brochure from "@/pages/Brochure";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function VisitorTracker() {
  const [location] = useLocation();
  useEffect(() => {
    if (location.startsWith("/admin")) return;
    visitorLogStore.add({
      path: location,
      title: document.title,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      ts: Date.now(),
    });
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/admin" component={Admin} />
      <Route path="/download" component={Download} />
      <Route path="/brochure" component={Brochure} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <VisitorTracker />
            <Router />
            <CookieBanner />
          </WouterRouter>
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
