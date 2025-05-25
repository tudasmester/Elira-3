import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * A component that scrolls the window to the top when the route changes
 */
const ScrollToTop = () => {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
};

export default ScrollToTop;