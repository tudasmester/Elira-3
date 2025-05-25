import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link, useParams } from "wouter";
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
import { courses } from "@/data/courses";

// Define course categories with their icons and descriptions
const categoryDetails = {
  informatika: {
    name: "Informatika és Programozás",
    icon: <Code className="h-6 w-6 text-blue-500" />,
    description: "Informatikai és programozási ismeretek kezdőknek és haladóknak. Fedezze fel a webes fejlesztés, mobilalkalmazás-fejlesztés, és szoftverfejlesztés világát.",
    popularTopics: ["Web fejlesztés", "Python", "JavaScript", "Java", "Mobile App fejlesztés", "React", "Angular", "Node.js"]
  },
  adattudomany: {
    name: "Adattudomány",
    icon: <Database className="h-6 w-6 text-purple-500" />,
    description: "Adatelemzés, gépi tanulás és mesterséges intelligencia kurzusok. Tanuljon meg adatokból értékes információkat kinyerni és adatvezérelt döntéseket hozni.",
    popularTopics: ["Adatelemzés", "Gépi tanulás", "Python for Data Science", "Big Data", "AI alapok", "Deep Learning", "Statisztika", "R programozás"]
  },
  uzlet: {
    name: "Üzlet és Menedzsment",
    icon: <Briefcase className="h-6 w-6 text-amber-500" />,
    description: "Üzleti készségek és menedzsment ismeretek. Fedezze fel a projektmenedzsment, marketing, pénzügy és vállalkozói ismeretek területeit.",
    popularTopics: ["Projektmenedzsment", "Marketing", "Vállalkozás", "Vezetői készségek", "Pénzügy alapok", "HR menedzsment", "Üzleti stratégia", "Értékesítés"]
  },
  oktatas: {
    name: "Oktatás",
    icon: <School className="h-6 w-6 text-green-500" />,
    description: "Pedagógiai készségek és oktatási módszertanok. Sajátítsa el a modern oktatási technikákat és a tanítás művészetét.",
    popularTopics: ["Pedagógia", "E-learning", "Oktatástechnológia", "Tantervfejlesztés", "Speciális oktatás", "Oktatási módszerek", "Tantermi menedzsment", "Értékelési technikák"]
  },
  egeszsegugy: {
    name: "Egészségügy",
    icon: <HeartPulse className="h-6 w-6 text-red-500" />,
    description: "Egészségügyi és orvostudományi ismeretek. Fedezze fel az anatómia, a közegészségügy és az egészségügyi ellátás alapjait.",
    popularTopics: ["Anatómia", "Közegészségügy", "Ápolási ismeretek", "Egészségügyi informatika", "Táplálkozás", "Mentális egészség", "Elsősegély", "Gyógyszerészet alapok"]
  },
  nyelvek: {
    name: "Nyelvek",
    icon: <Globe className="h-6 w-6 text-cyan-500" />,
    description: "Nyelvi kurzusok különböző szinteken. Tanuljon angolul, németül, franciául vagy más nyelveken a nulláról vagy fejlessze meglévő nyelvtudását.",
    popularTopics: ["Angol", "Német", "Francia", "Olasz", "Spanyol", "Orosz", "Kínai", "Üzleti nyelvhasználat"]
  },
  matematika: {
    name: "Matematika",
    icon: <Calculator className="h-6 w-6 text-indigo-500" />,
    description: "Matematikai koncepciók és alkalmazások. Az alapoktól a haladó témákig, mint a lineáris algebra, kalkulus, és diszkrét matematika.",
    popularTopics: ["Algebra", "Kalkulus", "Lineáris algebra", "Valószínűségszámítás", "Diszkrét matematika", "Matematikai analízis", "Számelmélet", "Geometria"]
  },
  statisztika: {
    name: "Statisztika",
    icon: <BarChart className="h-6 w-6 text-orange-500" />,
    description: "Statisztikai módszerek és alkalmazások. Tanulja meg az adatelemzés, hipotézisvizsgálat és statisztikai modellezés alapjait.",
    popularTopics: ["Leíró statisztika", "Következtetéses statisztika", "Hipotézisvizsgálat", "Regresszió analízis", "Idősorelemzés", "Bayesi statisztika", "SPSS", "Statisztikai programozás"]
  }
};

// Default category details if slug is not found
const defaultCategory = {
  name: "Kategória",
  icon: <BookOpen className="h-6 w-6 text-neutral-500" />,
  description: "Fedezze fel kurzusainkat ebben a kategóriában.",
  popularTopics: ["Alaptémák", "Népszerű témák", "Új tartalmak"]
};

const CategoryPage: React.FC = () => {
  const { slug } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  
  // Get category details based on slug
  const category = categoryDetails[slug as keyof typeof categoryDetails] || defaultCategory;
  
  // Filter courses based on category and search query
  const filteredCourses = courses.filter(course => {
    // Filter by category
    if (course.category !== category.name && 
        !course.category.includes(category.name.split(' ')[0])) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by level
    if (selectedLevel && course.level !== selectedLevel) {
      return false;
    }
    
    return true;
  });
  
  // Get available levels from filtered courses
  const availableLevels = Array.from(new Set(filteredCourses.map(course => course.level)));
  
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
            <div className="mb-4 flex justify-center">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                {category.icon}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
              {category.name} <span className="text-primary">kurzusok</span>
            </h1>
            <p className="text-neutral-600 text-lg md:text-xl max-w-3xl mx-auto mb-8">
              {category.description}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-12">
              <Input
                type="text"
                placeholder={`Keressen a(z) ${category.name.toLowerCase()} kategóriában...`}
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
        
        {/* Popular Topics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            Népszerű témák ebben a kategóriában
          </h2>
          <div className="flex flex-wrap gap-3">
            {category.popularTopics.map((topic, index) => (
              <Badge 
                key={index} 
                className="px-3 py-2 text-sm font-medium bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-50 cursor-pointer"
                onClick={() => setSearchQuery(topic)}
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Filters */}
        {availableLevels.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-neutral-700 mb-2">Szint</h3>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={selectedLevel === null ? "default" : "outline"} 
                className={selectedLevel === null 
                  ? "px-3 py-2 cursor-pointer bg-primary text-white" 
                  : "px-3 py-2 cursor-pointer"
                }
                onClick={() => setSelectedLevel(null)}
              >
                Összes
              </Badge>
              
              {availableLevels.map((level, index) => (
                <Badge 
                  key={index} 
                  variant={selectedLevel === level ? "default" : "outline"} 
                  className={selectedLevel === level 
                    ? "px-3 py-2 cursor-pointer bg-primary text-white" 
                    : "px-3 py-2 cursor-pointer"
                  }
                  onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                >
                  {level}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Results Count */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-900">
            {searchQuery ? `Találatok a(z) "${searchQuery}" keresésre` : "Kurzusok"}
          </h2>
          <div className="text-neutral-600 font-medium">
            {filteredCourses.length} kurzus
          </div>
        </div>
        
        {/* Course Cards */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
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
                  
                  <div className="flex items-center mt-auto">
                    <Badge variant="outline" className="mr-2 text-neutral-600 border-neutral-200">
                      {course.level}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
                    <div>
                      {course.isFree ? (
                        <span className="font-bold text-emerald-600">Ingyenes</span>
                      ) : (
                        <span className="font-bold text-neutral-900">35 000 Ft</span>
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
              setSelectedLevel(null);
              setSearchQuery("");
            }}>
              Összes kurzus megtekintése
            </Button>
          </div>
        )}
        
        {/* Register CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 mt-16 text-white"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Fejlessze készségeit a {category.name.toLowerCase()} területén
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Az Academion kurzusok a legfrissebb szakmai tartalmakat kínálják a legjobb magyar oktatóktól. Csatlakozzon most és fejlődjön szakmailag!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-primary hover:bg-white/90 font-medium text-lg py-6 px-8">
                Iratkozzon fel
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 font-medium text-lg py-6 px-8">
                Több információ
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryPage;