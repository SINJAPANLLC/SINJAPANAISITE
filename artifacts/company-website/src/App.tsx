import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/CookieBanner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useEffect, useRef } from "react";
import Home from "@/pages/Home";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Admin from "@/pages/Admin";
import Download from "@/pages/Download";
import Brochure from "@/pages/Brochure";
import ColumnList from "@/pages/Column";
import ColumnPost from "@/pages/ColumnPost";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function generateSessionId() {
  const key = "sj_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem(key, id); }
  return id;
}

function VisitorTracker() {
  const [location] = useLocation();
  const enterTime = useRef<number>(Date.now());

  useEffect(() => {
    if (location.startsWith("/admin")) return;
    enterTime.current = Date.now();

    const sessionId = generateSessionId();
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: location,
        title: document.title,
        referrer: document.referrer || null,
        sessionId,
        timeOnPage: null,
      }),
    }).catch(() => {});

    return () => {
      const elapsed = Math.floor((Date.now() - enterTime.current) / 1000);
      if (elapsed > 2) {
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: location, title: document.title, sessionId, timeOnPage: elapsed }),
        }).catch(() => {});
      }
    };
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
      <Route path="/column" component={ColumnList} />
      <Route path="/column/:slug" component={ColumnPost} />
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
