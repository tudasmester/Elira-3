import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, GraduationCap, 
  BarChart, Menu, X, UserCircle,
  LogOut, TrendingUp, BrainCircuit, Target
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
import logo from "@assets/eliraicon.png";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isAdmin } = useAdminAuth();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        {/* Main Navigation */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img src={logo} alt="Elira logo" className="h-10 w-10" />
            </Link>
            
            {/* Mobile menu button */}
            {isMobile && (
              <button 
                onClick={toggleMenu}
                className="ml-4 p-2 rounded-md text-neutral-700 hover:bg-neutral-100"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            )}
          </div>
          
          {/* Centered Navigation */}
          {!isMobile && (
            <div className="flex-1 flex justify-center">
              <nav className="flex space-x-1">
                <Link href="/courses" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/courses") 
                    ? "text-primary bg-primary/5" 
                    : "text-neutral-700 hover:text-primary hover:bg-neutral-50"
                }`}>
                  <BookOpen className="h-4 w-4 mr-1" />
                  Kurzusok
                </Link>
                <Link href="/degrees" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/degrees") 
                    ? "text-primary bg-primary/5" 
                    : "text-neutral-700 hover:text-primary hover:bg-neutral-50"
                }`}>
                  <GraduationCap className="h-4 w-4 mr-1" />
                  Diplomák
                </Link>
                <Link href="/trending" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/trending") 
                    ? "text-primary bg-primary/5" 
                    : "text-neutral-700 hover:text-primary hover:bg-neutral-50"
                }`}>
                  <BarChart className="h-4 w-4 mr-1" />
                  Trending
                  <Badge className="ml-2 bg-orange-100 text-orange-800 text-[10px] py-0 px-1.5">Új</Badge>
                </Link>
                <Link href="/careers" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/careers") 
                    ? "text-primary bg-primary/5" 
                    : "text-neutral-700 hover:text-primary hover:bg-neutral-50"
                }`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Karrierutak
                </Link>
                <Link href="/career-paths-ai" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/career-paths-ai") 
                    ? "text-primary bg-primary/5" 
                    : "text-neutral-700 hover:text-primary hover:bg-neutral-50"
                }`}>
                  <BrainCircuit className="h-4 w-4 mr-1" />
                  AI Karriertervező
                  <Badge className="ml-2 bg-purple-100 text-purple-800 text-[10px] py-0 px-1.5">Új</Badge>
                </Link>

              </nav>
            </div>
          )}
          
          {/* Right Side Auth Buttons */}
          <div className="flex-shrink-0 flex items-center space-x-1 md:space-x-4">
            {!isMobile && !isLoading && (
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
                            <button onClick={() => {
                              localStorage.removeItem('auth_token');
                              window.location.href = '/';
                            }} className="flex items-center cursor-pointer text-red-500 w-full text-left">
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
        {isMobile && isOpen && (
          <div className="px-4 py-3 border-t border-neutral-100 bg-white">
            <nav className="space-y-1 mb-4">
              <Link href="/courses" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                <BookOpen className="h-5 w-5 mr-3 text-neutral-500" />
                Kurzusok
              </Link>
              <Link href="/degrees" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                <GraduationCap className="h-5 w-5 mr-3 text-neutral-500" />
                Diplomák
              </Link>
              <Link href="/trending" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                <BarChart className="h-5 w-5 mr-3 text-neutral-500" />
                Trending
                <Badge className="ml-2 bg-orange-100 text-orange-800 text-[10px] py-0 px-1.5">Új</Badge>
              </Link>
              <Link href="/careers" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                <TrendingUp className="h-5 w-5 mr-3 text-neutral-500" />
                Karrierutak
              </Link>
              <Link href="/career-paths-ai" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                <BrainCircuit className="h-5 w-5 mr-3 text-neutral-500" />
                AI Karriertervező
                <Badge className="ml-2 bg-purple-100 text-purple-800 text-[10px] py-0 px-1.5">Új</Badge>
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
                    onClick={() => {
                      localStorage.removeItem('auth_token');
                      window.location.href = '/';
                    }}
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