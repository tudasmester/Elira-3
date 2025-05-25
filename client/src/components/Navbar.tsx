import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, Search, BookOpen, GraduationCap, 
  BarChart, Code, Database, School, HeartPulse, 
  Briefcase, Menu, X, Globe, Calculator, UserCircle,
  LogOut, TrendingUp
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "../assets/academion2.png";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSearch } from "@/hooks/useSearch";
import SearchResults from "@/components/SearchResults";
import { AnimatePresence } from "framer-motion";

// Define course categories
const courseCategories = [
  { name: "Informatika és Programozás", icon: <Code className="h-4 w-4 mr-2" />, slug: "informatika" },
  { name: "Adattudomány", icon: <Database className="h-4 w-4 mr-2" />, slug: "adattudomany" },
  { name: "Üzlet és Menedzsment", icon: <Briefcase className="h-4 w-4 mr-2" />, slug: "uzlet" },
  { name: "Oktatás", icon: <School className="h-4 w-4 mr-2" />, slug: "oktatas" },
  { name: "Egészségügy", icon: <HeartPulse className="h-4 w-4 mr-2" />, slug: "egeszsegugy" },
  { name: "Nyelvek", icon: <Globe className="h-4 w-4 mr-2" />, slug: "nyelvek" },
  { name: "Matematika", icon: <Calculator className="h-4 w-4 mr-2" />, slug: "matematika" },
  { name: "Statisztika", icon: <BarChart className="h-4 w-4 mr-2" />, slug: "statisztika" },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { query, setQuery, results, isLoading: searchLoading, isSearchOpen, setIsSearchOpen, closeSearch } = useSearch();
  const searchRef = useRef<HTMLDivElement>(null);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsSearchOpen]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        {/* Main Navigation */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src={logo} alt="Academion logo" className="h-8" />
            </Link>
            
            {/* Mobile menu button */}
            {isMobile ? (
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
            ) : (
              <div className="relative ml-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center text-neutral-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition duration-200">
                      <span>Kategóriák</span>
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64">
                    <DropdownMenuGroup>
                      {courseCategories.map((category) => (
                        <DropdownMenuItem key={category.slug} asChild>
                          <Link href={`/category/${category.slug}`} className="flex items-center cursor-pointer">
                            {category.icon}
                            <span>{category.name}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            
            {!isMobile && (
              <nav className="ml-6 hidden md:flex space-x-1">
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
              </nav>
            )}
          </div>
          
          {!isMobile && (
            <div className="flex-1 max-w-xl px-6">
              <div className="relative" ref={searchRef}>
                <Input
                  type="text"
                  placeholder="Mit szeretne tanulni?"
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                />
                <span className="absolute left-3 top-2.5 text-neutral-500">
                  <Search className="h-4 w-4" />
                </span>
                {query && (
                  <button 
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
                    onClick={() => setQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                
                <AnimatePresence>
                  {isSearchOpen && (
                    <SearchResults 
                      results={results} 
                      query={query} 
                      isLoading={searchLoading} 
                      onResultClick={closeSearch}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-1 md:space-x-4">
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
                          <DropdownMenuItem asChild>
                            <a href="/api/logout" className="flex items-center cursor-pointer text-red-500">
                              <LogOut className="h-4 w-4 mr-2" />
                              <span>Kijelentkezés</span>
                            </a>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <>
                    <a href="/api/login" className="text-neutral-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                      Bejelentkezés
                    </a>
                    <a href="/api/login">
                      <Button className="bg-primary hover:bg-primary/90 text-white">
                        Csatlakozzon ingyen
                      </Button>
                    </a>
                  </>
                )}
              </>
            )}
            {isMobile && !isOpen && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="p-2"
                onClick={toggleMenu}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobile && isOpen && (
          <div className="px-4 py-3 border-t border-neutral-100 bg-white">
            <div className="relative mb-4" ref={searchRef}>
              <Input
                type="text"
                placeholder="Mit szeretne tanulni?"
                className="w-full pl-10 pr-4 py-2 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
              />
              <span className="absolute left-3 top-2.5 text-neutral-500">
                <Search className="h-4 w-4" />
              </span>
              {query && (
                <button 
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
                  onClick={() => setQuery('')}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              
              <AnimatePresence>
                {isSearchOpen && (
                  <SearchResults 
                    results={results} 
                    query={query} 
                    isLoading={searchLoading} 
                    onResultClick={closeSearch}
                  />
                )}
              </AnimatePresence>
            </div>
            
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
              
              <div className="pt-2 pb-1">
                <p className="px-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Kategóriák
                </p>
              </div>
              
              {courseCategories.map((category) => (
                <Link key={category.slug} href={`/category/${category.slug}`}>
                  <a className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                    <span className="h-5 w-5 mr-3 text-neutral-500 flex items-center justify-center">
                      {category.icon}
                    </span>
                    {category.name}
                  </a>
                </Link>
              ))}
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
                  <a href="/api/logout">
                    <Button className="w-full justify-center bg-red-50 hover:bg-red-100 text-red-600 border border-red-200">
                      <LogOut className="mr-2 h-4 w-4" />
                      Kijelentkezés
                    </Button>
                  </a>
                </>
              ) : (
                <>
                  <a href="/api/login">
                    <Button variant="outline" className="w-full justify-center">
                      Bejelentkezés
                    </Button>
                  </a>
                  <a href="/api/login">
                    <Button className="w-full justify-center bg-primary hover:bg-primary/90 text-white">
                      Csatlakozzon ingyen
                    </Button>
                  </a>
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
