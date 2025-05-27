import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import Home from "@/pages/Home";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import CourseDetail from "@/pages/CourseDetail";
import Trending from "@/pages/Trending";
import Courses from "@/pages/Courses";
import Degrees from "@/pages/Degrees";
import DegreeDetail from "@/pages/DegreeDetail";
import CategoryPage from "@/pages/CategoryPage";
import CareerDevelopment from "@/pages/CareerDevelopment";
import CareerDetail from "@/pages/CareerDetail";
import CareerPathsAI from "@/pages/CareerPathsAI";
import PremiumSubscription from "@/pages/PremiumSubscription";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminCourseForm from "@/pages/AdminCourseForm";
import AdminCourseDetail from "@/pages/AdminCourseDetail";
import AdminContentSync from "@/pages/AdminContentSync";
import AdminSetup from "@/pages/AdminSetup";
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
      <Route path="/" component={Home} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/course/:id" component={CourseDetail} />
      <Route path="/trending" component={Trending} />
      <Route path="/courses" component={Courses} />
      <Route path="/degrees" component={Degrees} />
      <Route path="/degree/:id" component={DegreeDetail} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/careers" component={CareerDevelopment} />
      <Route path="/career/:id" component={CareerDetail} />
      <Route path="/career-paths-ai" component={CareerPathsAI} />
      <Route path="/career-paths/:careerId" component={CareerPathsAI} />
      <Route path="/premium" component={PremiumSubscription} />
      <Route path="/admin-setup" component={AdminSetup} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/sync" component={AdminContentSync} />
      <Route path="/admin/courses/new" component={AdminCourseForm} />
      <Route path="/admin/courses/:id" component={AdminCourseDetail} />
      <Route path="/admin/courses/:id/edit" component={AdminCourseForm} />
      <Route component={NotFound} />
    </Switch>
  );

  return useLayout ? <Layout>{content}</Layout> : content;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ScrollToTop />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
