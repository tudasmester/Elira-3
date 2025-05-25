import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import {
  Search,
  Filter,
  ArrowRight,
  BookOpen,
  Users,
  Star,
  Clock,
  Code,
  Database,
  Briefcase,
  School,
  HeartPulse,
  Globe,
  Calculator,
  BarChart,
  X,
  Eye
} from "lucide-react";
import CoursePreviewModal from "@/components/CoursePreviewModal";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { courses } from "@/data/courses";

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

const CoursesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("osszes");
  const [previewCourse, setPreviewCourse] = useState<typeof courses[0] | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const openPreview = (course: typeof courses[0]) => {
    setPreviewCourse(course);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };
  
  // Filter courses based on active filter, search query, and tab
  const filteredCourses = courses.filter(course => {
    // Filter by category if activeFilter is set
    if (activeFilter && course.category !== activeFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by tab
    if (activeTab === "ingyenes" && !course.isFree) {
      return false;
    }
    if (activeTab === "fizetős" && course.isFree) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="bg-gradient-to-b from-neutral-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-primary/20 to-purple-500/10 opacity-70"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiIGlkPSJhIj48c3RvcCBzdG9wLWNvbG9yPSIjRkZGIiBvZmZzZXQ9IjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIwIiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMCAwaDcyMHY0MDBIMHoiIGZpbGw9InVybCgjYSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] bg-center bg-no-repeat opacity-100"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative text-center py-16 md:py-24 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-primary/20 text-primary mb-6 px-4 py-2 text-base">
                <BookOpen className="h-4 w-4 mr-2" />
                350+ kurzus elérhető
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-8 leading-tight">
                Fedezze fel az <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-primary">Academion</span> kurzusokat
              </h1>
              
              <p className="text-neutral-700 text-lg md:text-xl max-w-3xl mx-auto mb-10">
                Válasszon a magyar egyetemek és oktatási intézmények által kínált kurzusok széles választékából, 
                és sajátítsa el a jövő készségeit.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <Badge className="bg-blue-100 text-blue-800 text-sm px-3 py-1">Programozás</Badge>
                <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">Adattudomány</Badge>
                <Badge className="bg-purple-100 text-purple-800 text-sm px-3 py-1">Üzleti ismeretek</Badge>
                <Badge className="bg-amber-100 text-amber-800 text-sm px-3 py-1">Nyelvek</Badge>
                <Badge className="bg-rose-100 text-rose-800 text-sm px-3 py-1">Marketing</Badge>
              </div>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <Input
                  type="text"
                  placeholder="Keressen kurzusokat..."
                  className="w-full pl-12 pr-4 py-6 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg shadow-lg"
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
            </motion.div>
          </div>
        </div>
        
        {/* Category Filters */}
        <div className="mb-8 overflow-x-auto pb-4">
          <div className="flex space-x-2 min-w-max">
            <Button 
              variant={activeFilter === null ? "default" : "outline"}
              className={activeFilter === null ? "bg-primary text-white" : "border-neutral-200 text-neutral-700"}
              onClick={() => setActiveFilter(null)}
            >
              Összes kategória
            </Button>
            
            {courseCategories.map((category) => (
              <Button 
                key={category.slug}
                variant={activeFilter === category.name ? "default" : "outline"}
                className={activeFilter === category.name 
                  ? "bg-primary text-white" 
                  : "border-neutral-200 text-neutral-700"}
                onClick={() => setActiveFilter(category.name)}
              >
                {category.icon}
                {category.name}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Tabs and Results */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <Tabs defaultValue="osszes" className="w-full max-w-md" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="osszes">Összes kurzus</TabsTrigger>
                <TabsTrigger value="ingyenes">Ingyenes</TabsTrigger>
                <TabsTrigger value="fizetős">Fizetős</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="text-neutral-600 font-medium">
              {filteredCourses.length} kurzus
            </div>
          </div>
          
          {/* Course Cards */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100 flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  <div className="relative">
                    <img 
                      src={course.imageUrl} 
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    
                    <div className="absolute top-3 right-3 flex space-x-2">
                      {course.isFree && (
                        <Badge className="bg-emerald-500 text-white">
                          Ingyenes
                        </Badge>
                      )}
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="bg-white/90 hover:bg-white text-primary rounded-full shadow-md h-8 w-8 p-0"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openPreview(course);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="absolute bottom-3 right-3 flex space-x-0.5">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < Math.floor(course.rating) ? "text-yellow-500 fill-yellow-500" : "text-neutral-300"}`} 
                        />
                      ))}
                      <span className="ml-1 text-xs text-white font-medium">{course.rating}</span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 w-8 h-8 mr-3 rounded-full overflow-hidden border border-neutral-200 bg-white p-1">
                        <img 
                          src={course.universityLogo} 
                          alt={`${course.university} logó`} 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <span className="text-sm text-neutral-600 font-medium truncate">
                        {course.university}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-neutral-800 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4 text-sm text-neutral-500 mt-auto">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-neutral-400" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-neutral-400" />
                        <span>{course.students.toLocaleString('hu-HU')} hallgató</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100">
                      <div>
                        {course.isFree ? (
                          <span className="font-bold text-emerald-600">Ingyenes</span>
                        ) : (
                          <span className="font-bold text-neutral-900">{course.price.toLocaleString('hu-HU')} Ft</span>
                        )}
                      </div>
                      <Link href={`/course/${course.id}`}>
                        <Button variant="outline" className="text-primary border-primary hover:bg-primary/5">
                          Részletek
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-neutral-50 rounded-xl p-8 text-center border border-neutral-200">
              <p className="text-neutral-600 mb-4">
                Nincs találat a keresési feltételeknek megfelelően. Kérjük, próbáljon meg más keresési feltételeket.
              </p>
              <Button onClick={() => {
                setActiveFilter(null);
                setSearchQuery("");
                setActiveTab("osszes");
              }}>
                Összes kurzus megtekintése
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Course Preview Modal */}
      {previewCourse && (
        <CoursePreviewModal 
          isOpen={isPreviewOpen}
          onClose={closePreview}
          course={previewCourse}
        />
      )}
    </div>
  );
};

export default CoursesPage;