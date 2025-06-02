import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import Home from "@/pages/Home";
import OnboardingRegister from "@/pages/OnboardingRegister";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
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
import SubscriptionPlans from "@/pages/SubscriptionPlans";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminDashboardNew from "@/pages/AdminDashboardNew";
import AdminCoursesPage from "@/pages/AdminCoursesPage";
import AdminUsersPage from "@/pages/AdminUsersPage";
import AdminUniversitiesPage from "@/pages/AdminUniversitiesPage";
import AdminAnalyticsPage from "@/pages/AdminAnalyticsPage";
import AdminQuizPage from "@/pages/AdminQuizPage";
import AdminCourseManager from "@/pages/AdminCourseManager";
import AdminCourseForm from "@/pages/AdminCourseForm";
import AdminCourseCreatePage from "@/pages/AdminCourseCreatePage";
import AdminCourseCreationPage from "@/pages/AdminCourseCreationPage";
import AdminCourseEditPage from "@/pages/AdminCourseEditPage";
import AdminCourseDetailSimple from "@/pages/AdminCourseDetailSimple";
import AdminCourseView from "@/pages/AdminCourseView";
import AdminContentSync from "@/pages/AdminContentSync";
import AdminContentBuilder from "@/pages/AdminContentBuilder";
import AdminLessonManagementPage from "@/pages/AdminLessonManagementPage";
import AdminSetup from "@/pages/AdminSetup";
import CourseCreationWizard from "@/pages/CourseCreationWizard";
import CourseContentBuilder from "@/pages/CourseContentBuilder";
import ActivitySystemDemo from "@/pages/ActivitySystemDemo";
import AuthPageLogin from "@/pages/AuthPageLogin";
import PasswordReset from "@/pages/PasswordReset";
import SearchPage from "@/pages/SearchPage";
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
      <Route path="/admin" component={AdminCourseManager} />
      <Route path="/admin/courses" component={AdminCourseManager} />

      <Route path="/admin/users" component={AdminUsersPage} />
      <Route path="/admin/universities" component={AdminUniversitiesPage} />
      <Route path="/admin/analytics" component={AdminAnalyticsPage} />
      <Route path="/admin/sync" component={AdminContentSync} />
      <Route path="/admin/courses/new" component={AdminCourseCreatePage} />
      <Route path="/admin/courses/wizard" component={CourseCreationWizard} />
      <Route path="/admin/courses/:id" component={AdminCourseView} />
      <Route path="/admin/courses/:id/edit" component={AdminCourseEditPage} />
      <Route path="/admin/courses/:id/content" component={AdminContentBuilder} />
      <Route path="/admin/content-builder" component={CourseContentBuilder} />
      <Route path="/admin/modules/:moduleId/lessons" component={AdminLessonManagementPage} />
      <Route path="/admin/activity-system" component={ActivitySystemDemo} />

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
