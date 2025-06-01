import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { 
  Menu, X, Search, Filter, ChevronDown, 
  Smartphone, Tablet, Monitor, TouchpadIcon
} from "lucide-react";

interface MobileResponsiveProps {
  children: React.ReactNode;
  className?: string;
}

// Hook to detect device type and screen size
export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 0,
    screenHeight: 0,
    orientation: 'landscape' as 'portrait' | 'landscape'
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDeviceInfo({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        screenWidth: width,
        screenHeight: height,
        orientation: width > height ? 'landscape' : 'portrait'
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
};

// Mobile-first navigation component
export const MobileNavigation: React.FC<{
  items: Array<{ label: string; href: string; icon?: React.ReactNode }>;
  currentPath: string;
}> = ({ items, currentPath }) => {
  const { isMobile } = useDeviceDetection();
  const [isOpen, setIsOpen] = useState(false);

  if (!isMobile) return null;

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <div className="space-y-4 mt-6">
            {items.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  currentPath === item.href 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </motion.a>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

// Touch-friendly course card for mobile
export const MobileCourseCard: React.FC<{
  course: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    rating?: number;
    price?: number;
    duration?: string;
    level: string;
    university: string;
  };
  onTap?: () => void;
}> = ({ course, onTap }) => {
  const { isMobile } = useDeviceDetection();

  return (
    <motion.div
      whileTap={{ scale: isMobile ? 0.98 : 1 }}
      className="touch-manipulation"
    >
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${
          isMobile ? 'min-h-[120px] p-3' : 'p-4'
        }`}
        onClick={onTap}
      >
        <div className={`flex ${isMobile ? 'space-x-3' : 'space-x-4'}`}>
          <img 
            src={course.imageUrl} 
            alt={course.title}
            className={`rounded-lg object-cover flex-shrink-0 ${
              isMobile ? 'w-16 h-16' : 'w-20 h-20'
            }`}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className={`font-semibold line-clamp-2 ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>
                {course.title}
              </h3>
              {course.price !== undefined && (
                <Badge variant="secondary" className={isMobile ? 'text-xs' : 'text-sm'}>
                  {course.price === 0 ? 'Ingyenes' : `${course.price.toLocaleString()} Ft`}
                </Badge>
              )}
            </div>
            
            <p className={`text-gray-600 line-clamp-2 mb-2 ${
              isMobile ? 'text-xs' : 'text-sm'
            }`}>
              {course.description}
            </p>
            
            <div className={`flex items-center justify-between ${
              isMobile ? 'text-xs' : 'text-sm'
            }`}>
              <div className="flex items-center space-x-2 text-gray-500">
                <span>{course.university}</span>
                <span>•</span>
                <span>{course.level}</span>
              </div>
              
              {course.rating && (
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">★</span>
                  <span>{course.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Mobile-optimized filter drawer
export const MobileFilterDrawer: React.FC<{
  filters: any;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}> = ({ filters, onFilterChange, onClearFilters, activeFilterCount }) => {
  const { isMobile } = useDeviceDetection();
  const [isOpen, setIsOpen] = useState(false);

  if (!isMobile) return null;

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 touch-manipulation">
          <Filter className="h-4 w-4" />
          <span>Szűrők</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4 max-h-[80vh] overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Szűrők</h3>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                onClick={onClearFilters}
                className="text-red-600 hover:text-red-700"
              >
                Törlés
              </Button>
            )}
          </div>
          
          {/* Filter content would go here - similar to desktop but optimized for touch */}
          <div className="grid grid-cols-1 gap-4">
            {/* Categories, levels, etc. with touch-friendly checkboxes */}
          </div>
          
          <Button 
            onClick={() => setIsOpen(false)}
            className="w-full mt-6"
          >
            Alkalmazás
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

// Performance-optimized responsive container
export const ResponsiveContainer: React.FC<MobileResponsiveProps> = ({ 
  children, 
  className = "" 
}) => {
  const { isMobile, isTablet, isDesktop } = useDeviceDetection();
  
  return (
    <div className={`
      transition-all duration-300 ease-in-out
      ${isMobile ? 'px-4 py-3' : ''}
      ${isTablet ? 'px-6 py-4' : ''}
      ${isDesktop ? 'px-8 py-6' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

// Touch gesture handler for swipe actions
export const useTouchGestures = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold: number = 50
) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    
    if (isHorizontalSwipe && Math.abs(distanceX) > threshold) {
      if (distanceX > 0 && onSwipeLeft) {
        onSwipeLeft();
      } else if (distanceX < 0 && onSwipeRight) {
        onSwipeRight();
      }
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd: onTouchEndHandler
  };
};

// Device-specific optimizations
export const DeviceOptimizations: React.FC = () => {
  const { isMobile, isTablet } = useDeviceDetection();

  useEffect(() => {
    // Add viewport meta tag for proper mobile scaling
    if (isMobile && !document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(viewport);
    }

    // Prevent zoom on input focus (iOS)
    if (isMobile) {
      const inputs = document.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        if (!input.getAttribute('style')?.includes('font-size')) {
          (input as HTMLElement).style.fontSize = '16px';
        }
      });
    }

    // Add touch-action optimizations
    document.body.style.touchAction = 'manipulation';
    
    // Optimize for high-DPI displays
    if (window.devicePixelRatio > 1) {
      document.documentElement.style.setProperty('--pixel-ratio', window.devicePixelRatio.toString());
    }
  }, [isMobile, isTablet]);

  return null;
};

export default {
  useDeviceDetection,
  MobileNavigation,
  MobileCourseCard,
  MobileFilterDrawer,
  ResponsiveContainer,
  useTouchGestures,
  DeviceOptimizations
};