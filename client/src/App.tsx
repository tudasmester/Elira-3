import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Lazy load components to prevent loading issues
const Home = React.lazy(() => import("@/pages/Home"));
const OnboardingRegister = React.lazy(() => import("@/pages/OnboardingRegister"));
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const Settings = React.lazy(() => import("@/pages/Settings"));
const CourseDetail = React.lazy(() => import("@/pages/CourseDetail"));
const Trending = React.lazy(() => import("@/pages/Trending"));
const Courses = React.lazy(() => import("@/pages/Courses"));
const Degrees = React.lazy(() => import("@/pages/Degrees"));
const DegreeDetail = React.lazy(() => import("@/pages/DegreeDetail"));
const CategoryPage = React.lazy(() => import("@/pages/CategoryPage"));
const CareerDevelopment = React.lazy(() => import("@/pages/CareerDevelopment"));
const CareerDetail = React.lazy(() => import("@/pages/CareerDetail"));
const CareerPathsAI = React.lazy(() => import("@/pages/CareerPathsAI"));
const PremiumSubscription = React.lazy(() => import("@/pages/PremiumSubscription"));
const SubscriptionPlans = React.lazy(() => import("@/pages/SubscriptionPlans"));
const AdminDashboard = React.lazy(() => import("@/pages/AdminDashboard"));
const AdminCourseForm = React.lazy(() => import("@/pages/AdminCourseForm"));
const AdminCourseDetail = React.lazy(() => import("@/pages/AdminCourseDetail"));
const AdminContentSync = React.lazy(() => import("@/pages/AdminContentSync"));
const AdminContentBuilder = React.lazy(() => import("@/pages/AdminContentBuilder"));
const AdminSetup = React.lazy(() => import("@/pages/AdminSetup"));
const AuthPageLogin = React.lazy(() => import("@/pages/AuthPageLogin"));
const PasswordReset = React.lazy(() => import("@/pages/PasswordReset"));
const SearchPage = React.lazy(() => import("@/pages/SearchPage"));
const NotFound = React.lazy(() => import("@/pages/not-found"));
const Layout = React.lazy(() => import("@/components/Layout"));
const ScrollToTop = React.lazy(() => import("@/components/ui/ScrollToTop"));

function Router() {
  const [location] = useLocation();
  
  // Enable real-time data synchronization
  // useRealTimeData();
  
  // Don't use the Layout on onboarding pages
  const useLayout = !location.startsWith("/onboarding");
  
  const content = (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/onboarding" component={OnboardingRegister} />
        <Route path="/auth" component={AuthPageLogin} />
        <Route path="/password-reset" component={PasswordReset} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/settings" component={Settings} />
        <Route path="/course/:id" component={CourseDetail} />
        <Route path="/trending" component={Trending} />
        <Route path="/courses" component={Courses} />
        <Route path="/search" component={SearchPage} />
        <Route path="/degrees" component={Degrees} />
        <Route path="/degree/:id" component={DegreeDetail} />
        <Route path="/category/:slug" component={CategoryPage} />
        <Route path="/careers" component={CareerDevelopment} />
        <Route path="/career/:id" component={CareerDetail} />
        <Route path="/career-paths-ai" component={CareerPathsAI} />
        <Route path="/career-paths/:careerId" component={CareerPathsAI} />
        <Route path="/premium" component={PremiumSubscription} />
        <Route path="/subscription-plans" component={SubscriptionPlans} />
        <Route path="/admin-setup" component={AdminSetup} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/sync" component={AdminContentSync} />
        <Route path="/admin/courses/new" component={AdminCourseForm} />
        <Route path="/admin/courses/:id" component={AdminCourseDetail} />
        <Route path="/admin/courses/:id/edit" component={AdminCourseForm} />
        <Route path="/admin/courses/:id/content" component={AdminContentBuilder} />

        <Route component={NotFound} />
      </Switch>
    </React.Suspense>
  );

  return useLayout ? <Layout>{content}</Layout> : content;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Router />
          <Toaster />
          <ScrollToTop />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
