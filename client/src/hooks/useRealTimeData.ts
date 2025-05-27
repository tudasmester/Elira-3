import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Real-time data synchronization hook for user-facing pages
export function useRealTimeData() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Refresh course data every 30 seconds for regular updates
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/universities'] });
    }, 30000);

    // Refresh data when user comes back to the tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
        queryClient.invalidateQueries({ queryKey: ['/api/universities'] });
      }
    };

    // Refresh data when user comes back online
    const handleOnline = () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/universities'] });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [queryClient]);
}

// Real-time data synchronization hook for admin panel (more frequent updates)
export function useAdminRealTimeData() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Refresh admin data every 10 seconds for real-time management
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/universities'] });
    }, 10000);

    // Immediate refresh when admin comes back to tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
        queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
        queryClient.invalidateQueries({ queryKey: ['/api/admin/universities'] });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [queryClient]);
}

// Function to trigger immediate data refresh across the platform
export function triggerDataRefresh(queryClient: any) {
  // Refresh all user-facing data immediately
  queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
  queryClient.invalidateQueries({ queryKey: ['/api/universities'] });
  queryClient.invalidateQueries({ queryKey: ['/api/degrees'] });
  
  // Also refresh any specific course queries
  queryClient.invalidateQueries({ 
    predicate: (query: any) => query.queryKey[0] === '/api/courses'
  });
}