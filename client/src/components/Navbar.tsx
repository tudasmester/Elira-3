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
        
        {/* Enhanced Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 z-50 animate-in slide-in-from-top-4 duration-300">
            {/* Menu Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Felfedezés</h3>
                  <p className="text-xs text-gray-600">Válassz a kategóriák közül</p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="px-4 py-2 space-y-1">
              <Link 
                href="/courses" 
                className={`group flex items-center px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 touch-manipulation ${
                  isActive("/courses") 
                    ? "bg-blue-50 text-blue-700 shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                }`}
                onClick={() => handleNavClick('/courses', 'courses-mobile')}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors mr-4">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Kurzusok</div>
                  <div className="text-sm text-gray-500">Tanfolyamok és képzések</div>
                </div>
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </Link>

              <Link 
                href="/degrees" 
                className={`group flex items-center px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 touch-manipulation ${
                  isActive("/degrees") 
                    ? "bg-green-50 text-green-700 shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                }`}
                onClick={() => handleNavClick('/degrees', 'degrees-mobile')}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors mr-4">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Diplomák</div>
                  <div className="text-sm text-gray-500">Egyetemi programok</div>
                </div>
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </Link>

              <Link 
                href="/trending" 
                className={`group flex items-center px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 touch-manipulation ${
                  isActive("/trending") 
                    ? "bg-orange-50 text-orange-700 shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                }`}
                onClick={() => handleNavClick('/trending', 'trending-mobile')}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors mr-4">
                  <BarChart className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold flex items-center">
                    Trending
                    <Badge className="ml-2 bg-orange-500 text-white text-xs px-2 py-1 animate-pulse">Új</Badge>
                  </div>
                  <div className="text-sm text-gray-500">Népszerű tartalmak</div>
                </div>
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                </div>
              </Link>

              <Link 
                href="/careers" 
                className={`group flex items-center px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 touch-manipulation ${
                  isActive("/careers") 
                    ? "bg-purple-50 text-purple-700 shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                }`}
                onClick={() => handleNavClick('/careers', 'careers-mobile')}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors mr-4">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Karrierutak</div>
                  <div className="text-sm text-gray-500">Szakmai fejlődés</div>
                </div>
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
              </Link>

              <Link 
                href="/career-paths-ai" 
                className={`group flex items-center px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 touch-manipulation ${
                  isActive("/career-paths-ai") 
                    ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                }`}
                onClick={() => handleNavClick('/career-paths-ai', 'ai-careers-mobile')}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 group-hover:from-indigo-200 group-hover:to-purple-200 transition-all mr-4">
                  <BrainCircuit className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold flex items-center">
                    AI Karriertervező
                    <Badge className="ml-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs px-2 py-1">AI</Badge>
                  </div>
                  <div className="text-sm text-gray-500">Mesterséges intelligencia</div>
                </div>
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                </div>
              </Link>

              <Link 
                href="/search" 
                className={`group flex items-center px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 touch-manipulation ${
                  isActive("/search") 
                    ? "bg-gray-50 text-gray-700 shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                }`}
                onClick={() => handleNavClick('/search', 'search-mobile')}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors mr-4">
                  <Search className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Keresés</div>
                  <div className="text-sm text-gray-500">Találd meg amit keresel</div>
                </div>
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                </div>
              </Link>
            </nav>
            
            {/* User Section */}
            <div className="border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white">
              {isAuthenticated ? (
                <div className="px-4 py-4">
                  {/* User Profile Card */}
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {user?.profileImageUrl ? (
                          <img 
                            src={user.profileImageUrl} 
                            alt="Profile" 
                            className="h-12 w-12 rounded-xl object-cover border-2 border-blue-100"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                            <UserCircle className="h-7 w-7 text-blue-600" />
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {user?.firstName || 'Felhasználó'}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                        <div className="flex items-center mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-xs text-green-600 font-medium">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Link href="/dashboard">
                      <Button 
                        variant="outline" 
                        className="w-full justify-between h-12 rounded-xl border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                            <UserCircle className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium">Profilom</span>
                        </div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </Button>
                    </Link>
                    
                    <Button 
                      onClick={logout}
                      className="w-full justify-between h-12 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 transition-all group"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                          <LogOut className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="font-medium">Kijelentkezés</span>
                      </div>
                      <div className="w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-6">
                  {/* Welcome Section */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <UserCircle className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Üdvözlünk az Elirában!</h3>
                    <p className="text-sm text-gray-600">Csatlakozz hozzánk és kezdd el a tanulást</p>
                  </div>

                  {/* Auth Buttons */}
                  <div className="space-y-3">
                    <Link href="/auth">
                      <Button 
                        variant="outline" 
                        className="w-full justify-center h-12 rounded-xl border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                            <UserCircle className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                          </div>
                          <span className="font-medium">Bejelentkezés</span>
                        </div>
                      </Button>
                    </Link>
                    
                    <Link href="/auth">
                      <Button className="w-full justify-center h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-white bg-opacity-20 flex items-center justify-center mr-3">
                            <UserCircle className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-semibold">Csatlakozás ingyen</span>
                        </div>
                      </Button>
                    </Link>
                  </div>

                  {/* Benefits */}
                  <div className="mt-4 bg-blue-50 rounded-xl p-3">
                    <div className="flex items-center justify-center space-x-6 text-xs text-blue-700">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                        Ingyenes kurzusok
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                        AI támogatás
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                        Diplomák
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;