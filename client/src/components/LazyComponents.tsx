import React, { lazy, Suspense } from 'react';
import { PageLoadingSpinner, ContentLoadingState } from '@/components/ui/LoadingStates';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Higher-order component for lazy loading with error boundaries and loading states
function withLazyLoading<P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  fallback?: React.ReactNode,
  loadingType?: 'page' | 'content' | 'custom'
) {
  const LazyComponent = lazy(importFunc);

  return function LazyWrapper(props: P) {
    const getFallback = () => {
      if (fallback) return fallback;
      
      switch (loadingType) {
        case 'page':
          return <PageLoadingSpinner />;
        case 'content':
          return <ContentLoadingState type="courses" />;
        default:
          return <PageLoadingSpinner message="Komponens betöltése..." />;
      }
    };

    return (
      <ErrorBoundary>
        <Suspense fallback={getFallback()}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}

// Lazy loaded page components with appropriate loading states
export const LazyHome = withLazyLoading(
  () => import('@/pages/Home'),
  <PageLoadingSpinner message="Főoldal betöltése..." />,
  'page'
);

export const LazyDashboard = withLazyLoading(
  () => import('@/pages/Dashboard'),
  <PageLoadingSpinner message="Irányítópult betöltése..." />,
  'page'
);

export const LazyCourses = withLazyLoading(
  () => import('@/pages/Courses'),
  <ContentLoadingState type="courses" />,
  'content'
);

export const LazyTrending = withLazyLoading(
  () => import('@/pages/Trending'),
  <ContentLoadingState type="courses" message="Népszerű kurzusok betöltése..." />,
  'content'
);

export const LazyCourseDetail = withLazyLoading(
  () => import('@/pages/CourseDetail'),
  <PageLoadingSpinner message="Kurzus részleteinek betöltése..." />,
  'page'
);

export const LazyCareerDevelopment = withLazyLoading(
  () => import('@/pages/CareerDevelopment'),
  <ContentLoadingState type="users" message="Karrierfejlesztési tartalmak betöltése..." />,
  'content'
);

export const LazyCareerDetail = withLazyLoading(
  () => import('@/pages/CareerDetail'),
  <PageLoadingSpinner message="Karrier részletek betöltése..." />,
  'page'
);

export const LazySearchPage = withLazyLoading(
  () => import('@/pages/SearchPage'),
  <ContentLoadingState type="courses" message="Keresési felület betöltése..." />,
  'content'
);

export const LazySettings = withLazyLoading(
  () => import('@/pages/Settings'),
  <PageLoadingSpinner message="Beállítások betöltése..." />,
  'page'
);

// Admin components with special loading states
export const LazyAdminDashboard = withLazyLoading(
  () => import('@/pages/AdminDashboard'),
  <ContentLoadingState type="analytics" message="Admin irányítópult betöltése..." />,
  'content'
);

export const LazyAdminCourseForm = withLazyLoading(
  () => import('@/pages/AdminCourseForm'),
  <PageLoadingSpinner message="Kurzus szerkesztő betöltése..." />,
  'page'
);

export const LazyAdminCourseDetail = withLazyLoading(
  () => import('@/pages/AdminCourseDetail'),
  <PageLoadingSpinner message="Admin kurzus részletek betöltése..." />,
  'page'
);

export const LazyAdminContentSync = withLazyLoading(
  () => import('@/pages/AdminContentSync'),
  <ContentLoadingState type="analytics" message="Szinkronizációs felület betöltése..." />,
  'content'
);

export const LazyAdminContentBuilder = withLazyLoading(
  () => import('@/pages/AdminContentBuilder'),
  <PageLoadingSpinner message="Tartalomszerkesztő betöltése..." />,
  'page'
);

// Premium and subscription components
export const LazyPremiumSubscription = withLazyLoading(
  () => import('@/pages/PremiumSubscription'),
  <PageLoadingSpinner message="Prémium előfizetés betöltése..." />,
  'page'
);

export const LazySubscriptionPlans = withLazyLoading(
  () => import('@/pages/SubscriptionPlans'),
  <PageLoadingSpinner message="Előfizetési csomagok betöltése..." />,
  'page'
);

// Heavy components that benefit from code splitting
export const LazyCareerPathsAI = withLazyLoading(
  () => import('@/pages/CareerPathsAI'),
  <ContentLoadingState type="analytics" message="AI karriertanácsadó betöltése..." />,
  'content'
);

export const LazyOnboardingRegister = withLazyLoading(
  () => import('@/pages/OnboardingRegister'),
  <PageLoadingSpinner message="Regisztrációs folyamat betöltése..." />,
  'page'
);

// Category and degree pages
export const LazyCategoryPage = withLazyLoading(
  () => import('@/pages/CategoryPage'),
  <ContentLoadingState type="courses" message="Kategória tartalmak betöltése..." />,
  'content'
);

export const LazyDegrees = withLazyLoading(
  () => import('@/pages/Degrees'),
  <ContentLoadingState type="courses" message="Szakok betöltése..." />,
  'content'
);

export const LazyDegreeDetail = withLazyLoading(
  () => import('@/pages/DegreeDetail'),
  <PageLoadingSpinner message="Szak részletek betöltése..." />,
  'page'
);

// Auth pages
export const LazyAuthPageLogin = withLazyLoading(
  () => import('@/pages/AuthPageLogin'),
  <PageLoadingSpinner message="Bejelentkezési felület betöltése..." />,
  'page'
);

export const LazyPasswordReset = withLazyLoading(
  () => import('@/pages/PasswordReset'),
  <PageLoadingSpinner message="Jelszó visszaállítás betöltése..." />,
  'page'
);

export const LazyAdminSetup = withLazyLoading(
  () => import('@/pages/AdminSetup'),
  <PageLoadingSpinner message="Admin beállítások betöltése..." />,
  'page'
);

// Preload critical components on app initialization
export function preloadCriticalComponents() {
  // Preload components likely to be needed immediately
  const criticalComponents = [
    () => import('@/pages/Home'),
    () => import('@/pages/Courses'),
    () => import('@/pages/AuthPageLogin'),
  ];

  // Preload on idle or with a small delay
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      criticalComponents.forEach(importFunc => importFunc());
    });
  } else {
    setTimeout(() => {
      criticalComponents.forEach(importFunc => importFunc());
    }, 2000);
  }
}

// Component for prefetching routes on hover/focus
interface PrefetchRouteProps {
  routeImport: () => Promise<any>;
  children: React.ReactNode;
  className?: string;
}

export function PrefetchRoute({ routeImport, children, className }: PrefetchRouteProps) {
  const handleMouseEnter = () => {
    routeImport().catch(() => {
      // Silently handle prefetch errors
    });
  };

  return (
    <div 
      className={className}
      onMouseEnter={handleMouseEnter}
      onFocus={handleMouseEnter}
    >
      {children}
    </div>
  );
}