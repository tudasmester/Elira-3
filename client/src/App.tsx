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
  LazySettings,
  LazyCourseDetail,
  LazyTrending,
  LazyCourses,
  LazyDegrees,
  LazyDegreeDetail,
  LazyCategoryPage,
  LazyCareerDevelopment,
  LazyCareerDetail,
  LazyCareerPathsAI,
  LazyPremiumSubscription,
  LazySubscriptionPlans,
  LazyAdminDashboard,
  LazyAdminCourseForm,
  LazyAdminCourseDetail,
  LazyAdminContentSync,
  LazyAdminContentBuilder,
  LazyOnboardingRegister,
  LazyAuthPageLogin,
  LazyPasswordReset,
  LazySearchPage,
  LazyAdminSetup,
  preloadCriticalComponents
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
      <Route path="/onboarding" component={LazyOnboardingRegister} />
      <Route path="/auth" component={LazyAuthPageLogin} />
      <Route path="/password-reset" component={LazyPasswordReset} />
      <Route path="/dashboard" component={LazyDashboard} />
      <Route path="/settings" component={LazySettings} />
      <Route path="/course/:id" component={LazyCourseDetail} />
      <Route path="/trending" component={LazyTrending} />
      <Route path="/courses" component={LazyCourses} />
      <Route path="/search" component={LazySearchPage} />
      <Route path="/degrees" component={LazyDegrees} />
      <Route path="/degree/:id" component={LazyDegreeDetail} />
      <Route path="/category/:slug" component={LazyCategoryPage} />
      <Route path="/careers" component={LazyCareerDevelopment} />
      <Route path="/career/:id" component={LazyCareerDetail} />
      <Route path="/career-paths-ai" component={LazyCareerPathsAI} />
      <Route path="/career-paths/:careerId" component={LazyCareerPathsAI} />
      <Route path="/premium" component={LazyPremiumSubscription} />
      <Route path="/subscription-plans" component={LazySubscriptionPlans} />
      <Route path="/admin-setup" component={LazyAdminSetup} />
      <Route path="/admin" component={LazyAdminDashboard} />
      <Route path="/admin/sync" component={LazyAdminContentSync} />
      <Route path="/admin/courses/new" component={LazyAdminCourseForm} />
      <Route path="/admin/courses/:id" component={LazyAdminCourseDetail} />
      <Route path="/admin/courses/:id/edit" component={LazyAdminCourseForm} />
      <Route path="/admin/courses/:id/content" component={LazyAdminContentBuilder} />

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
