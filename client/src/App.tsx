import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppStateProvider } from "@/hooks/useAppState";
import { SkipToContent } from "@/components/ui/AccessibilityFeatures";
import { initializePerformanceOptimizations } from "@/lib/cdnOptimization";
import { initCacheCleanup, warmCache } from "@/lib/caching";
import {
  LazyHome,
  LazyDashboard,
  LazyCourseDetail,
  LazyCoursesPage,
  LazyAuthPage
} from "@/components/LazyComponents";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import ScrollToTop from "@/components/ui/ScrollToTop";

function Router() {
  const [location] = useLocation();
  
  // Enable real-time data synchronization
  useRealTimeData();
  
  // Don't use the Layout on onboarding pages
  const useLayout = !location.startsWith("/onboarding");
  
  const content = (
    <Switch>
      <Route path="/" component={LazyHome} />
      <Route path="/auth" component={LazyAuthPage} />
      <Route path="/dashboard" component={LazyDashboard} />
      <Route path="/course/:id" component={LazyCourseDetail} />
      <Route path="/courses" component={LazyCoursesPage} />
      <Route component={NotFound} />
    </Switch>
  );

  return useLayout ? <Layout>{content}</Layout> : content;
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AppStateProvider>
            <TooltipProvider>
              <SkipToContent />
              <Toaster />
              <ScrollToTop />
              <Router />
            </TooltipProvider>
          </AppStateProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
