import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import {
  Search,
  TrendingUp,
  Briefcase,
  GraduationCap,
  LineChart,
  Shield,
  PenTool,
  DollarSign,
  X,
  ChevronRight,
  Clock,
  Users,
  Star,
  BarChart,
  Heart,
  HeartOff,
  Sparkles,
  Filter,
  SlidersHorizontal,
  CheckCircle,
  Zap,
  Code
} from 'lucide-react';
import { courses } from '@/data/courses';
import CoursePreviewModal from '@/components/CoursePreviewModal';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Import career paths data
import { careerPaths, careerCategories, difficultyLevels } from '@/data/careers';

// Helper function to render the appropriate icon based on iconType
const renderCareerIcon = (iconType: string, iconColor: string) => {
  const className = `h-6 w-6 ${iconColor}`;
  
  switch (iconType) {
    case 'lineChart':
      return <LineChart className={className} />;
    case 'trendingUp':
      return <TrendingUp className={className} />;
    case 'penTool':
      return <PenTool className={className} />;
    case 'shield':
      return <Shield className={className} />;
    case 'barChart':
      return <BarChart className={className} />;
    case 'code':
      return <Code className={className} />;
    case 'users':
      return <Users className={className} />;
    default:
      return <BarChart className={className} />;
  }
};

const CareerDevelopment: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [savedCareers, setSavedCareers] = useState<string[]>(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem('savedCareers');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedFilters, setSelectedFilters] = useState<{
    difficulty: string[];
    category: string[];
    trending: boolean | null;
  }>({
    difficulty: [],
    category: [],
    trending: null
  });
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [previewCourse, setPreviewCourse] = useState<any | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Save to localStorage when savedCareers changes
  useEffect(() => {
    localStorage.setItem('savedCareers', JSON.stringify(savedCareers));
  }, [savedCareers]);

  // Filter careers based on search query and filters
  const filteredCareers = careerPaths.filter(career => {
    // Text search filter
    const matchesSearch = !searchQuery || (
      career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    // Tab filter
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "popular" && career.isPopular) || 
      (activeTab === "trending" && career.isTrending) ||
      (activeTab === "saved" && savedCareers.includes(career.id));
    
    // Category filter
    const matchesCategory = selectedFilters.category.length === 0 || 
      selectedFilters.category.includes(career.category);
    
    // Difficulty filter
    const matchesDifficulty = selectedFilters.difficulty.length === 0 || 
      selectedFilters.difficulty.includes(career.difficulty);
    
    // Trending filter
    const matchesTrending = selectedFilters.trending === null || 
      (selectedFilters.trending === true && career.isTrending);
    
    return matchesSearch && matchesTab && matchesCategory && matchesDifficulty && matchesTrending;
  });

  const handlePreviewCourse = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setPreviewCourse(course);
      setIsPreviewOpen(true);
    }
  };
  
  const toggleSavedCareer = (careerId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    setSavedCareers(prev => {
      if (prev.includes(careerId)) {
        return prev.filter(id => id !== careerId);
      } else {
        return [...prev, careerId];
      }
    });
  };
  
  const toggleFilter = (type: 'difficulty' | 'category', value: string) => {
    setSelectedFilters(prev => {
      const current = [...prev[type]];
      const index = current.indexOf(value);
      
      if (index >= 0) {
        current.splice(index, 1);
      } else {
        current.push(value);
      }
      
      return {
        ...prev,
        [type]: current
      };
    });
  };
  
  const toggleTrendingFilter = () => {
    setSelectedFilters(prev => ({
      ...prev,
      trending: prev.trending === null ? true : (prev.trending ? null : true)
    }));
  };
  
  const resetFilters = () => {
    setSelectedFilters({
      difficulty: [],
      category: [],
      trending: null
    });
    setSearchQuery("");
  };
  
  // Get unique categories and difficulties for filter options
  const categories = Array.from(new Set(careerPaths.map(career => career.category)));
  const difficulties = Array.from(new Set(careerPaths.map(career => career.difficulty)));

  return (
    <div className="bg-gradient-to-b from-neutral-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-blue-500/10 opacity-70"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiIGlkPSJhIj48c3RvcCBzdG9wLWNvbG9yPSIjRkZGIiBvZmZzZXQ9IjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIwIiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMCAwaDcyMHY0MDBIMHoiIGZpbGw9InVybCgjYSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] bg-center bg-no-repeat opacity-100"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative text-center py-16 md:py-24 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-primary/20 text-primary mb-6 px-4 py-2 text-base">
                <TrendingUp className="h-4 w-4 mr-2" />
                Karrierutak
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-8 leading-tight">
                Induljon el az <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">álomkarrierjének</span> útján
              </h1>
              
              <p className="text-neutral-700 text-lg md:text-xl max-w-3xl mx-auto mb-10">
                Fedezze fel a jövő legkeresettebb karrierútjait, és szerezze meg a szükséges készségeket 
                gyakorlati képzéseinken keresztül. Karrierváltást tervez? Segítünk az első lépésektől.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <Badge className="bg-blue-100 text-blue-800 text-sm px-3 py-1">Technológia</Badge>
                <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">Marketing</Badge>
                <Badge className="bg-purple-100 text-purple-800 text-sm px-3 py-1">Design</Badge>
                <Badge className="bg-amber-100 text-amber-800 text-sm px-3 py-1">Üzlet</Badge>
                <Badge className="bg-rose-100 text-rose-800 text-sm px-3 py-1">Oktatás</Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  Találd meg karrierutad
                </Button>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  Ingyenes karrierkonzultáció
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Search and Filters Section */}
        <div className="mb-10">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-200">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
              {/* Search bar */}
              <div className="relative w-full md:w-2/3">
                <Input
                  type="text"
                  placeholder="Keressen karrierutakat, készségeket..."
                  className="w-full pl-12 pr-4 py-6 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-neutral-500">
                  <Search className="h-5 w-5" />
                </span>
                {searchQuery && (
                  <button 
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              {/* Filter button */}
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className={Object.values(selectedFilters).some(
                          filter => (Array.isArray(filter) && filter.length > 0) || filter === true
                        ) ? "border-primary text-primary" : ""}
                        onClick={() => setShowDetailedView(!showDetailedView)}
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Szűrési beállítások</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className={selectedFilters.trending ? "border-primary text-primary" : ""}
                        onClick={toggleTrendingFilter}
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Feltörekvő karrierutak</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {Object.values(selectedFilters).some(
                  filter => (Array.isArray(filter) && filter.length > 0) || filter === true
                ) && (
                  <Button 
                    variant="ghost" 
                    className="text-neutral-600" 
                    onClick={resetFilters}
                  >
                    Visszaállítás
                  </Button>
                )}
              </div>
            </div>
            
            {/* Detailed filter view */}
            {showDetailedView && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t pt-5 mt-2"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category filters */}
                  <div>
                    <h3 className="font-medium text-neutral-900 mb-3">Kategóriák</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => {
                        const isSelected = selectedFilters.category.includes(category);
                        const categoryLabel = careerCategories[category as keyof typeof careerCategories]?.name || category;
                        return (
                          <Badge 
                            key={category} 
                            className={`cursor-pointer ${isSelected ? 'bg-primary text-white hover:bg-primary/90' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'}`}
                            onClick={() => toggleFilter('category', category)}
                          >
                            {categoryLabel}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Difficulty filters */}
                  <div>
                    <h3 className="font-medium text-neutral-900 mb-3">Nehézségi szint</h3>
                    <div className="flex flex-wrap gap-2">
                      {difficulties.map(difficulty => {
                        const isSelected = selectedFilters.difficulty.includes(difficulty);
                        return (
                          <Badge 
                            key={difficulty} 
                            className={`cursor-pointer ${isSelected ? 'bg-primary text-white hover:bg-primary/90' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'}`}
                            onClick={() => toggleFilter('difficulty', difficulty)}
                          >
                            {difficulty}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Tabs Navigation */}
            <div className="mt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="all">Összes</TabsTrigger>
                  <TabsTrigger value="popular">Népszerű</TabsTrigger>
                  <TabsTrigger value="trending">Feltörekvő</TabsTrigger>
                  <TabsTrigger value="saved">Mentett</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        
        {/* Career Path Cards */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-900">
              {activeTab === "all" && "Összes karrierút"}
              {activeTab === "popular" && "Népszerű karrierutak"}
              {activeTab === "trending" && "Feltörekvő karrierutak"}
              {activeTab === "saved" && "Mentett karrierutak"}
            </h2>
            <div className="text-neutral-600 font-medium">
              {filteredCareers.length} karrierút
            </div>
          </div>
          
          {filteredCareers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {filteredCareers.map((career) => (
                <Link href={`/career/${career.id}`} key={career.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100 flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="relative">
                      <img 
                        src={career.imageUrl} 
                        alt={career.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent"></div>
                      
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary/90 text-white border-none">
                          {career.jobOutlook}
                          <span className="ml-1 font-bold text-green-300">{career.growthRate}</span>
                        </Badge>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-white/90 mr-3">
                            {renderCareerIcon(career.iconType, career.iconColor)}
                          </div>
                          <h3 className="text-2xl font-bold text-white">{career.title}</h3>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4 flex space-x-0.5">
                        {Array(5).fill(0).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(career.rating) ? "text-yellow-500 fill-yellow-500" : "text-neutral-300"}`} 
                          />
                        ))}
                        <span className="ml-1 text-xs text-white font-medium">{career.rating}</span>
                      </div>
                      
                      <button 
                        className="absolute top-4 right-16 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
                        onClick={(e) => toggleSavedCareer(career.id, e)}
                      >
                        {savedCareers.includes(career.id) ? (
                          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                        ) : (
                          <Heart className="h-4 w-4 text-neutral-600" />
                        )}
                      </button>
                      
                      {career.isTrending && (
                        <div className="absolute bottom-4 right-4">
                          <Badge className="bg-amber-500/90 text-white border-none">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Feltörekvő
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                          <span className="font-semibold text-neutral-800">{career.averageSalary}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-neutral-500" />
                          <span className="text-neutral-600">{career.timeToComplete}</span>
                        </div>
                      </div>
                      
                      <p className="text-neutral-600 mb-4">
                        {career.description}
                      </p>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-neutral-900 mb-2">Megszerezhető készségek:</h4>
                        <div className="flex flex-wrap gap-2">
                          {career.skills.slice(0, 4).map((skill, index) => (
                            <Badge key={index} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                              {skill}
                            </Badge>
                          ))}
                          {career.skills.length > 4 && (
                            <Badge className="bg-neutral-100 text-neutral-800">
                              +{career.skills.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-neutral-400" />
                          <span className="text-sm text-neutral-500">{career.students.toLocaleString('hu-HU')} tanuló</span>
                        </div>
                        <Button className="bg-primary hover:bg-primary/90 text-white">
                          Részletek
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-neutral-50 rounded-xl p-8 text-center border border-neutral-200">
              <p className="text-neutral-600 mb-4">
                Nincs találat a keresési feltételeknek megfelelően. Kérjük, próbáljon meg más keresési feltételeket.
              </p>
              <Button onClick={resetFilters}>
                Szűrők visszaállítása
              </Button>
            </div>
          )}
        </div>
        
        {/* Why Choose a Career Path Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-neutral-900">Miért válasszon karrierutat?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="p-3 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Strukturált tanulás</h3>
              <p className="text-neutral-600">Lépésről lépésre haladhat a karriercéljai felé egy jól megtervezett tanulási útvonalon.</p>
            </div>
            
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="p-3 bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Versenyképes fizetés</h3>
              <p className="text-neutral-600">A karrierutakon megszerzett készségek a legkeresettebb és legjobban fizetett pozíciókra készítik fel.</p>
            </div>
            
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="p-3 bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Iparági tanúsítványok</h3>
              <p className="text-neutral-600">A képzések során iparági tanúsítványokat szerezhet, amelyek növelik az elhelyezkedési esélyeit.</p>
            </div>
            
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="p-3 bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Karrier mentorálás</h3>
              <p className="text-neutral-600">Személyes mentorálást kap a karrierváltás teljes folyamata során, beleértve az álláskeresést is.</p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary to-primary/80 rounded-xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Készen áll a karrierváltásra?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Váltson karriert az Academion segítségével, és induljon el egy izgalmas, jól fizető szakmai úton. 
            Minden szükséges támogatást megkap, hogy sikeres legyen az új területen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-neutral-100">
              Ingyenes karrierkonzultáció
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
              Kérdezzen szakértőinktől
            </Button>
          </div>
        </div>
      </div>
      
      {/* Course Preview Modal */}
      {previewCourse && (
        <CoursePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          course={previewCourse}
        />
      )}
    </div>
  );
};

export default CareerDevelopment;