import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * A custom hook that scrolls the page to the top when the route changes
 */
export function useScrollTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
}