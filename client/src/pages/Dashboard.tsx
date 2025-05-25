import React, { useState } from "react";
import { Bell, Search, User, BookOpen, GraduationCap, Calendar, Badge as BadgeIcon, 
  Settings, LogOut, ChevronDown, Bookmark, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { courses } from "@/data/courses";

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock enrollment data - in a real app this would come from the backend
  const enrolledCourses = courses.slice(0, 3);
  const savedCourses = courses.slice(3, 6);
  const completedCourses = courses.slice(6, 8);
  
  // User progress data
  const userProgress = {
    totalCourses: 3,
    completedCourses: 1,
    completionPercentage: 33,
    certificates: 1,
    totalHours: 24,
    completedHours: 8
  };
  
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/">
                <div className="text-primary text-2xl font-bold font-heading cursor-pointer">Academion</div>
              </Link>
              <nav className="ml-10 hidden md:flex space-x-8">
                <Link href="/courses" className="text-neutral-700 hover:text-primary font-medium">Kurzusok</Link>
                <Link href="/degrees" className="text-neutral-700 hover:text-primary font-medium">Diplomák</Link>
                <Link href="/trending" className="text-neutral-700 hover:text-primary font-medium">Trending</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Keresés..."
                  className="pl-10 pr-4 py-2 border border-neutral-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button className="p-2 rounded-full text-neutral-600 hover:bg-neutral-100 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 rounded-full">
                      {user?.profileImageUrl ? (
                        <img 
                          src={user.profileImageUrl} 
                          alt="Profile"
                          className="h-8 w-8 rounded-full object-cover border border-neutral-200"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                      <ChevronDown className="h-4 w-4 text-neutral-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profilom</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>Kurzusaim</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Beállítások</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href="/api/logout" className="flex items-center w-full cursor-pointer text-red-500">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Kijelentkezés</span>
                        </a>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with User Info */}
        <div className="relative overflow-hidden rounded-xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-teal-600 to-blue-600 opacity-95"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiIGlkPSJhIj48c3RvcCBzdG9wLWNvbG9yPSIjRkZGIiBvZmZzZXQ9IjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIwIiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMCAwaDcyMHY0MDBIMHoiIGZpbGw9InVybCgjYSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] bg-center bg-no-repeat opacity-50"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="relative p-8 md:p-12 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-4 text-white/90 text-sm">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  <span>Személyes tanulási portál</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  {isLoading ? 'Betöltés...' : (
                    user?.firstName ? (
                      <>
                        Üdvözöljük, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">{user.firstName}!</span>
                      </>
                    ) : (
                      'Üdvözöljük az Academion platformon!'
                    )
                  )}
                </h1>
                
                <p className="text-white/90 mb-6 text-lg max-w-xl">
                  Folytassa a tanulást! Az Ön személyre szabott irányítópultja minden szükséges eszközt biztosít a folyamatos fejlődéshez.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link href="/courses">
                    <Button className="bg-white text-primary hover:bg-white/90 shadow-lg font-medium">
                      <Search className="mr-2 h-4 w-4" />
                      Kurzusok böngészése
                    </Button>
                  </Link>
                  <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/20">
                    <Calendar className="mr-2 h-4 w-4" />
                    Órarend megtekintése
                  </Button>
                </div>
                
                <div className="flex items-center mt-8 space-x-4">
                  <div className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-green-300 mr-2 animate-pulse"></div>
                    <span className="text-white/90 text-sm">Legutóbbi bejelentkezés: Ma, 14:30</span>
                  </div>
                  <div className="h-4 border-l border-white/20"></div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-white/80" />
                    <span className="text-white/90 text-sm">Tanulási idő: {userProgress.completedHours} óra</span>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/3 flex justify-center">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 shadow-lg w-full max-w-xs">
                  <div className="flex items-center mb-4">
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="h-16 w-16 rounded-full object-cover mr-4 border-2 border-white/30" 
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mr-4 border border-white/30">
                        <User className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Tanulói profil'}
                      </h2>
                      <p className="text-sm text-white/70">{user?.email || 'Nincs email cím'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-sm text-white/80 mb-1">
                        <span>Tanulási haladás</span>
                        <span className="font-bold">{userProgress.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2.5">
                        <div 
                          className="bg-white h-2.5 rounded-full" 
                          style={{ width: `${userProgress.completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/10 p-3 rounded-lg text-center">
                        <p className="text-white text-xl font-bold">{userProgress.completedCourses}</p>
                        <p className="text-xs text-white/80">Teljesített kurzus</p>
                      </div>
                      <div className="bg-white/10 p-3 rounded-lg text-center">
                        <p className="text-white text-xl font-bold">{userProgress.certificates}</p>
                        <p className="text-xs text-white/80">Oklevél</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview" className="text-sm">Áttekintés</TabsTrigger>
              <TabsTrigger value="my-courses" className="text-sm">Kurzusaim</TabsTrigger>
              <TabsTrigger value="saved" className="text-sm">Mentett kurzusok</TabsTrigger>
              <TabsTrigger value="certificates" className="text-sm">Oklevelek</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Action Items */}
              <div>
                <h2 className="text-lg font-bold mb-4">Teendők</h2>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Profil befejezése</h3>
                      <p className="text-sm text-neutral-500">Adja meg tanulási preferenciáit a személyre szabott élményért</p>
                    </div>
                    <Button size="sm">Befejezés</Button>
                  </div>
                  <div className="flex items-center p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="h-8 w-8 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center mr-4">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Tanulási terv létrehozása</h3>
                      <p className="text-sm text-neutral-500">Állítsa össze saját tanulási tervét, hogy könnyebben elérje céljait</p>
                    </div>
                    <Button size="sm">Létrehozás</Button>
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div>
                <h2 className="text-lg font-bold mb-4">Tanulási statisztikák</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">Összes kurzus</span>
                    </div>
                    <p className="text-2xl font-bold">{userProgress.totalCourses}</p>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">
                        <BadgeIcon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">Befejezett</span>
                    </div>
                    <p className="text-2xl font-bold">{userProgress.completedCourses}</p>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                        <Clock className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">Tanulási idő</span>
                    </div>
                    <p className="text-2xl font-bold">{userProgress.completedHours} óra</p>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mr-2">
                        <Star className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">Oklevelek</span>
                    </div>
                    <p className="text-2xl font-bold">{userProgress.certificates}</p>
                  </div>
                </div>
              </div>

              {/* Continue Learning */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Tanulás folytatása</h2>
                  <Link href="/courses" className="text-primary hover:underline text-sm font-medium">Összes megtekintése</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrolledCourses.slice(0, 2).map((course) => (
                    <div key={course.id} className="flex bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                      <div className="w-1/3">
                        <img 
                          src={course.imageUrl} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-2/3 p-4">
                        <div className="flex items-center mb-1">
                          <img 
                            src={course.universityLogo} 
                            alt={course.university} 
                            className="w-5 h-5 object-contain mr-2" 
                          />
                          <span className="text-xs text-neutral-600">{course.university}</span>
                        </div>
                        <h3 className="font-bold mt-1 mb-1">{course.title}</h3>
                        <p className="text-sm text-neutral-500 mb-2">{course.level} • {course.category}</p>
                        <div className="w-full bg-neutral-200 rounded-full h-1.5 mb-2">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.round(Math.random() * 60 + 10)}%` }}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-neutral-500">Hátralévő idő: {Math.round(Math.random() * 4 + 1)} hét</span>
                          <Button size="sm" variant="outline">Folytatás</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="my-courses">
              <div className="mb-4">
                <h2 className="text-lg font-bold mb-4">Felvett kurzusok</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {enrolledCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                      <div className="relative">
                        <img 
                          src={course.imageUrl} 
                          alt={course.title} 
                          className="w-full h-40 object-cover"
                        />
                        {course.category && (
                          <Badge className="absolute top-2 right-2 bg-secondary">{course.category}</Badge>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <img 
                            src={course.universityLogo} 
                            alt={course.university} 
                            className="w-6 h-6 object-contain mr-2" 
                          />
                          <span className="text-sm text-neutral-600">{course.university}</span>
                        </div>
                        <h3 className="font-bold mb-1">{course.title}</h3>
                        <p className="text-sm text-neutral-500 mb-2">{course.level} • {course.isFree ? 'Ingyenes' : 'Fizetős'}</p>
                        <div className="w-full bg-neutral-200 rounded-full h-1.5 mb-3">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.round(Math.random() * 80 + 5)}%` }}></div>
                        </div>
                        <Button className="w-full">Folytatás</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="saved">
              <div className="mb-4">
                <h2 className="text-lg font-bold mb-4">Mentett kurzusok</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {savedCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                      <div className="relative">
                        <img 
                          src={course.imageUrl} 
                          alt={course.title} 
                          className="w-full h-40 object-cover"
                        />
                        {course.isFree && (
                          <Badge className="absolute top-2 right-2 bg-tertiary">Ingyenes</Badge>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <img 
                            src={course.universityLogo} 
                            alt={course.university} 
                            className="w-6 h-6 object-contain mr-2" 
                          />
                          <span className="text-sm text-neutral-600">{course.university}</span>
                        </div>
                        <h3 className="font-bold mb-1">{course.title}</h3>
                        <p className="text-sm text-neutral-500 mb-4">{course.level} • {course.category}</p>
                        <div className="flex space-x-2">
                          <Button className="flex-1">Felveszem</Button>
                          <Button variant="outline" className="w-10 p-0 flex items-center justify-center">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="certificates">
              <div className="mb-4">
                <h2 className="text-lg font-bold mb-4">Megszerzett oklevelek</h2>
                {userProgress.certificates > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {completedCourses.slice(0, userProgress.certificates).map((course) => (
                      <div key={course.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <img 
                                src={course.universityLogo} 
                                alt={course.university} 
                                className="w-12 h-12 object-contain mr-3" 
                              />
                              <div>
                                <h3 className="font-bold text-lg">{course.title}</h3>
                                <p className="text-sm text-neutral-600">{course.university}</p>
                              </div>
                            </div>
                            <BadgeIcon className="h-10 w-10 text-yellow-500" />
                          </div>
                          <div className="border-t border-b border-neutral-200 py-4 mb-4">
                            <p className="text-sm text-neutral-700 mb-2">
                              Kiállítva: {new Date().toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p className="text-sm text-neutral-700">
                              Oklevél azonosító: ACAD-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-HU
                            </p>
                          </div>
                          <div className="flex space-x-3">
                            <Button variant="outline" className="flex-1">Letöltés</Button>
                            <Button className="flex-1">Megosztás</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-neutral-50 p-8 rounded-lg border border-neutral-200 text-center">
                    <BadgeIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-2">Még nincs oklevele</h3>
                    <p className="text-neutral-600 mb-4">Fejezzen be egy kurzust az első oklevél megszerzéséhez!</p>
                    <Button>Kurzusok böngészése</Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Recommended Courses */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Ajánlott kurzusok</h2>
            <Link href="/courses" className="text-primary hover:underline text-sm font-medium">Összes megtekintése</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.slice(8, 11).map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="relative">
                  <img 
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-40 object-cover"
                  />
                  {course.category === "Technológia" && (
                    <div className="absolute top-2 right-2 bg-tertiary text-tertiary-foreground text-xs font-bold px-2 py-1 rounded">Népszerű</div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <img 
                      src={course.universityLogo}
                      alt={course.university}
                      className="w-6 h-6 rounded-full object-contain mr-2"
                    />
                    <span className="text-sm text-neutral-600">{course.university}</span>
                  </div>
                  <h3 className="font-bold mb-1">{course.title}</h3>
                  <p className="text-sm text-neutral-500 mb-4">{course.level} • {course.category}</p>
                  <Button className="w-full">Megtekintés</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;