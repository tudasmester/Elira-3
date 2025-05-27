import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook for real-time data synchronization
 * Automatically refetches course data at regular intervals
 * and when the window regains focus
 */
export function useRealTimeData() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Refetch data when window regains focus
    const handleFocus = () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/universities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/degrees'] });
    };

    // Refetch data when network comes back online
    const handleOnline = () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/universities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/degrees'] });
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleOnline);

    // Set up periodic data refresh every 30 seconds
    const interval = setInterval(() => {
      // Only refetch if the user is on a course-related page
      const currentPath = window.location.pathname;
      if (
        currentPath.includes('/courses') || 
        currentPath.includes('/course/') ||
        currentPath === '/' ||
        currentPath.includes('/category') ||
        currentPath.includes('/trending')
      ) {
        queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      }
    }, 30000); // 30 seconds

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
      clearInterval(interval);
    };
  }, [queryClient]);
}

/**
 * Hook for admin-specific real-time updates
 * More frequent updates for admin panel
 */
export function useAdminRealTimeData() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // More frequent updates for admin panel (every 10 seconds)
    const interval = setInterval(() => {
      const currentPath = window.location.pathname;
      if (currentPath.includes('/admin')) {
        queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
        queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
        queryClient.invalidateQueries({ queryKey: ['/api/admin/universities'] });
      }
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [queryClient]);
}

/**
 * Utility function to trigger immediate data refresh
 * Can be called after admin operations to sync user-facing data
 */
export function triggerDataRefresh(queryClient: any) {
  queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
  queryClient.invalidateQueries({ queryKey: ['/api/universities'] });
  queryClient.invalidateQueries({ queryKey: ['/api/degrees'] });
  queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
  queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
}