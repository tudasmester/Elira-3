import React, { useState, useCallback, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, GraduationCap, 
  BarChart, Menu, X, UserCircle,
  LogOut, TrendingUp, BrainCircuit, Search
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@assets/eliranavbarszeles.png";
import { Badge } from "@/components/ui/badge";
import { useDeviceDetection, useTouchGestures } from "@/components/MobileResponsive";
import { useUserActionTracking } from "@/hooks/usePerformanceMonitoring";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { isMobile, isTablet } = useDeviceDetection();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Logout function
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);
  const { isAdmin } = useAdminAuth();
  const { trackAction } = useUserActionTracking();
  
  // Enhanced mobile menu toggle with analytics
  const toggleMenu = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsOpen(prev => {
      const newState = !prev;
      trackAction('navbar_menu_toggle', { 
        action: newState ? 'open' : 'close',
        device: 'mobile'
      });
      return newState;
    });
  }, [trackAction]);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        trackAction('navbar_escape_close', { device: 'mobile' });
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isOpen, trackAction]);
  
  const isActive = (path: string) => {
    return location === path;
  };

  // Handle navigation click tracking
  const handleNavClick = useCallback((path: string, label: string) => {
    trackAction('navbar_navigation', { 
      path, 
      label,
      device: isMobile ? 'mobile' : 'desktop'
    });
  }, [trackAction, isMobile]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        {/* Main Navigation */}
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 touch-manipulation"
            onClick={() => handleNavClick('/', 'logo')}
          >
            <img 
              src={logo} 
              alt="Elira" 
              className="h-8 w-auto object-contain"
            />
          </Link>
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/courses" 
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/courses") 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
              onClick={() => handleNavClick('/courses', 'courses')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Kurzusok
            </Link>
            
            <Link 
              href="/degrees" 
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/degrees") 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
              onClick={() => handleNavClick('/degrees', 'degrees')}
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Diplomák
            </Link>
            
            <Link 
              href="/trending" 
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/trending") 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
              onClick={() => handleNavClick('/trending', 'trending')}
            >
              <BarChart className="h-4 w-4 mr-2" />
              Trending
              <Badge className="ml-2 bg-orange-100 text-orange-800 text-xs px-2 py-0.5">Új</Badge>
            </Link>
            
            <Link 
              href="/careers" 
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/careers") 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
              onClick={() => handleNavClick('/careers', 'careers')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Karrierutak
            </Link>
            
            <Link 
              href="/career-paths-ai" 
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/career-paths-ai") 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
              onClick={() => handleNavClick('/career-paths-ai', 'ai-careers')}
            >
              <BrainCircuit className="h-4 w-4 mr-2" />
              AI Karriertervező
              <Badge className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-0.5">AI</Badge>
            </Link>
          </nav>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 text-neutral-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                          {user?.profileImageUrl ? (
                            <img 
                              src={user.profileImageUrl} 
                              alt="Profile" 
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <UserCircle className="h-6 w-6" />
                          )}
                          <span>{user?.firstName || 'Felhasználó'}</span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuGroup>
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard" className="flex items-center cursor-pointer">
                              <UserCircle className="h-4 w-4 mr-2" />
                              <span>Profilom</span>
                            </Link>
                          </DropdownMenuItem>
                          {isAdmin && (
                            <DropdownMenuItem asChild>
                              <Link href="/admin" className="flex items-center cursor-pointer text-primary">
                                <BarChart className="h-4 w-4 mr-2" />
                                <span>Admin Panel</span>
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem asChild>
                            <button onClick={logout} className="flex items-center cursor-pointer text-red-500 w-full text-left">
                              <LogOut className="h-4 w-4 mr-2" />
                              <span>Kijelentkezés</span>
                            </button>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <>
                    <Link href="/auth" className="text-neutral-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                      Bejelentkezés
                    </Link>
                    <Link href="/auth">
                      <Button className="bg-primary hover:bg-primary/90 text-white">
                        Csatlakozzon ingyen
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden px-4 py-3 border-t border-gray-200 bg-white">
            <nav className="space-y-1 mb-4">
              <Link 
                href="/courses" 
                className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 touch-manipulation"
                onClick={() => handleNavClick('/courses', 'courses-mobile')}
              >
                <BookOpen className="h-5 w-5 mr-3 text-gray-500" />
                Kurzusok
              </Link>
              <Link 
                href="/degrees" 
                className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 touch-manipulation"
                onClick={() => handleNavClick('/degrees', 'degrees-mobile')}
              >
                <GraduationCap className="h-5 w-5 mr-3 text-gray-500" />
                Diplomák
              </Link>
              <Link 
                href="/trending" 
                className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 touch-manipulation"
                onClick={() => handleNavClick('/trending', 'trending-mobile')}
              >
                <BarChart className="h-5 w-5 mr-3 text-gray-500" />
                Trending
                <Badge className="ml-2 bg-orange-100 text-orange-800 text-xs px-2 py-0.5">Új</Badge>
              </Link>
              <Link 
                href="/careers" 
                className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 touch-manipulation"
                onClick={() => handleNavClick('/careers', 'careers-mobile')}
              >
                <TrendingUp className="h-5 w-5 mr-3 text-gray-500" />
                Karrierutak
              </Link>
              <Link 
                href="/career-paths-ai" 
                className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 touch-manipulation"
                onClick={() => handleNavClick('/career-paths-ai', 'ai-careers-mobile')}
              >
                <BrainCircuit className="h-5 w-5 mr-3 text-gray-500" />
                AI Karriertervező
                <Badge className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-0.5">AI</Badge>
              </Link>
              <Link 
                href="/search" 
                className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 touch-manipulation"
                onClick={() => handleNavClick('/search', 'search-mobile')}
              >
                <Search className="h-5 w-5 mr-3 text-gray-500" />
                Keresés
              </Link>
            </nav>
            
            <div className="pt-2 flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 px-3 py-2 mb-2">
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="h-10 w-10 text-neutral-500" />
                    )}
                    <div>
                      <p className="font-medium text-neutral-800">{user?.firstName || 'Felhasználó'}</p>
                      <p className="text-xs text-neutral-500">{user?.email}</p>
                    </div>
                  </div>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full justify-center">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profilom
                    </Button>
                  </Link>
                  <Button 
                    onClick={logout}
                    className="w-full justify-center bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Kijelentkezés
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth">
                    <Button variant="outline" className="w-full justify-center">
                      Bejelentkezés
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button className="w-full justify-center bg-primary hover:bg-primary/90 text-white">
                      Csatlakozzon ingyen
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;