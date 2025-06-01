import React, { useEffect } from "react";
import SearchSystem from "@/components/SearchSystem";
import { useDeviceDetection, ResponsiveContainer, DeviceOptimizations } from "@/components/MobileResponsive";
import { usePerformanceMonitoring, useUserActionTracking } from "@/hooks/usePerformanceMonitoring";

const SearchPage: React.FC = () => {
  const { isMobile, isTablet } = useDeviceDetection();
  const { metrics } = usePerformanceMonitoring();
  const { trackAction } = useUserActionTracking();

  useEffect(() => {
    // Track page visit
    trackAction('page_visit', { 
      page: 'search',
      device: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
    });
  }, [trackAction, isMobile, isTablet]);

  return (
    <>
      <DeviceOptimizations />
      <ResponsiveContainer className="min-h-screen bg-gray-50">
        <SearchSystem />
      </ResponsiveContainer>
    </>
  );
};

export default SearchPage;