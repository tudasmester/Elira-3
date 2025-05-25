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
  X
} from "lucide-react";
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
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-primary/10 text-primary mb-4 px-3 py-1.5">
              <BookOpen className="h-3.5 w-3.5 mr-1.5" />
              350+ kurzus elérhető
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
              Fedezze fel az <span className="text-primary">Academion</span> kurzusokat
            </h1>
            <p className="text-neutral-600 text-lg md:text-xl max-w-3xl mx-auto mb-8">
              Válasszon a magyar egyetemek és oktatási intézmények által kínált kurzusok széles választékából, 
              és sajátítsa el a jövő készségeit.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-12">
              <Input
                type="text"
                placeholder="Keressen kurzusokat..."
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
          </motion.div>
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
                    
                    <div className="absolute top-3 right-3">
                      {course.isFree && (
                        <Badge className="bg-emerald-500 text-white">
                          Ingyenes
                        </Badge>
                      )}
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
    </div>
  );
};

export default CoursesPage;