import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  resourceLoadTimes: Record<string, number>;
  userEngagement: {
    timeOnPage: number;
    scrollDepth: number;
    clickCount: number;
    sessionDuration: number;
  };
  networkInfo: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
}

export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const startTime = useRef(Date.now());
  const scrollDepth = useRef(0);
  const clickCount = useRef(0);
  const maxScrollDepth = useRef(0);

  useEffect(() => {
    // Core Web Vitals monitoring
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({
                ...prev,
                firstContentfulPaint: entry.startTime
              }));
            }
            break;
          
          case 'largest-contentful-paint':
            setMetrics(prev => ({
              ...prev,
              largestContentfulPaint: entry.startTime
            }));
            break;
          
          case 'first-input':
            setMetrics(prev => ({
              ...prev,
              firstInputDelay: (entry as any).processingStart - entry.startTime
            }));
            break;
          
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              setMetrics(prev => ({
                ...prev,
                cumulativeLayoutShift: (prev.cumulativeLayoutShift || 0) + (entry as any).value
              }));
            }
            break;
        }
      }
    });

    // Register observers
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      console.warn('Performance Observer not supported');
    }

    // Page load time
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      setMetrics(prev => ({
        ...prev,
        pageLoadTime: navigation.loadEventEnd - navigation.fetchStart
      }));
    });

    // Resource load times
    const updateResourceMetrics = () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const resourceTimes: Record<string, number> = {};
      
      resources.forEach(resource => {
        const url = new URL(resource.name).pathname;
        resourceTimes[url] = resource.responseEnd - resource.requestStart;
      });
      
      setMetrics(prev => ({
        ...prev,
        resourceLoadTimes: resourceTimes
      }));
    };

    setTimeout(updateResourceMetrics, 2000);

    // Network information
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setMetrics(prev => ({
        ...prev,
        networkInfo: {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        }
      }));
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // User engagement tracking
  useEffect(() => {
    const trackScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrolled / maxScroll) * 100);
      
      if (scrollPercentage > maxScrollDepth.current) {
        maxScrollDepth.current = scrollPercentage;
      }
      
      scrollDepth.current = scrollPercentage;
    };

    const trackClicks = () => {
      clickCount.current += 1;
    };

    const updateEngagementMetrics = () => {
      setMetrics(prev => ({
        ...prev,
        userEngagement: {
          timeOnPage: Date.now() - startTime.current,
          scrollDepth: maxScrollDepth.current,
          clickCount: clickCount.current,
          sessionDuration: Date.now() - startTime.current
        }
      }));
    };

    window.addEventListener('scroll', trackScroll, { passive: true });
    document.addEventListener('click', trackClicks);
    
    const engagementInterval = setInterval(updateEngagementMetrics, 5000);

    return () => {
      window.removeEventListener('scroll', trackScroll);
      document.removeEventListener('click', trackClicks);
      clearInterval(engagementInterval);
    };
  }, []);

  // Send metrics to backend
  const sendMetrics = async () => {
    try {
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...metrics,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          referrer: document.referrer
        })
      });
    } catch (error) {
      console.error('Failed to send performance metrics:', error);
    }
  };

  // Send metrics on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/performance', JSON.stringify(metrics));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [metrics]);

  return {
    metrics,
    sendMetrics
  };
};

// Hook for tracking specific user actions
export const useUserActionTracking = () => {
  const trackAction = async (action: string, details?: Record<string, any>) => {
    try {
      await fetch('/api/analytics/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          details,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      });
    } catch (error) {
      console.error('Failed to track user action:', error);
    }
  };

  return { trackAction };
};

// Hook for monitoring API performance
export const useAPIPerformanceMonitoring = () => {
  const trackAPICall = async (endpoint: string, method: string, duration: number, status: number) => {
    try {
      await fetch('/api/analytics/api-performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint,
          method,
          duration,
          status,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to track API performance:', error);
    }
  };

  return { trackAPICall };
};