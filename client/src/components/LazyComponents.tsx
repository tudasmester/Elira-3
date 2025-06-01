import React, { lazy, Suspense } from 'react';
import { CourseGridSkeleton } from '@/components/ui/LoadingStates';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Simple lazy loading wrapper
function withLazyLoading<P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);

  return (props: P) => {
    const defaultFallback = fallback || <div className="p-4">Betöltés...</div>;

    return (
      <ErrorBoundary>
        <Suspense fallback={defaultFallback}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}

// Basic lazy loaded components - only for existing pages
export const LazyHome = withLazyLoading(
  () => import('@/pages/Home'),
  <div className="p-4">Betöltés...</div>
);

export const LazyCoursesPage = withLazyLoading(
  () => import('@/pages/CoursesPage'),
  <CourseGridSkeleton count={6} />
);

export const LazyCourseDetail = withLazyLoading(
  () => import('@/pages/CourseDetail'),
  <div className="p-4">Betöltés...</div>
);

export const LazyDashboard = withLazyLoading(
  () => import('@/pages/Dashboard'),
  <div className="p-4">Betöltés...</div>
);

export const LazyAuthPage = withLazyLoading(
  () => import('@/pages/AuthPage'),
  <div className="p-4">Betöltés...</div>
);