import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import {
  Search,
  GraduationCap,
  ArrowRight,
  Clock,
  Users,
  Star,
  Calendar,
  Award,
  Building,
  X
} from "lucide-react";
import { degrees } from "@/data/degrees";
import { universities } from "@/data/universities";

// Define degree levels
const degreeLevels = [
  { name: "Alapképzés (BA/BSc)", slug: "bachelor" },
  { name: "Mesterképzés (MA/MSc)", slug: "master" },
  { name: "Doktori képzés (PhD)", slug: "phd" },
  { name: "Szakirányú továbbképzés", slug: "specialization" },
  { name: "Felsőoktatási szakképzés", slug: "advanced-vocational" }
];

const DegreesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  
  // Filter degrees based on search query, selected university and level
  const filteredDegrees = degrees.filter(degree => {
    // Filter by search query
    if (searchQuery && !degree.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by university
    if (selectedUniversity && degree.universityId !== parseInt(selectedUniversity)) {
      return false;
    }
    
    // Filter by level
    if (selectedLevel && degree.level !== selectedLevel) {
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
              <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
              Diplomák és képzési programok
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
              Szerezzen értékes <span className="text-primary">diplomát</span> vezető magyar egyetemeken
            </h1>
            <p className="text-neutral-600 text-lg md:text-xl max-w-3xl mx-auto mb-8">
              Fedezze fel a teljes képzési programokat, amelyek elismert diplomához vezetnek. 
              Az Academion partneregyetemek képzései rugalmas, modern oktatási formában érhetők el.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-12">
              <Input
                type="text"
                placeholder="Keressen diplomás képzéseket..."
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
        
        {/* Filters Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            {/* University Filter */}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-neutral-700 mb-2">Egyetem</h3>
              <select
                className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={selectedUniversity || ""}
                onChange={(e) => setSelectedUniversity(e.target.value === "" ? null : e.target.value)}
              >
                <option value="">Összes egyetem</option>
                {universities.map((university) => (
                  <option key={university.id} value={university.id}>
                    {university.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Level Filter */}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-neutral-700 mb-2">Képzési szint</h3>
              <select
                className="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={selectedLevel || ""}
                onChange={(e) => setSelectedLevel(e.target.value === "" ? null : e.target.value)}
              >
                <option value="">Összes szint</option>
                {degreeLevels.map((level) => (
                  <option key={level.slug} value={level.slug}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Active Filters */}
          {(selectedUniversity || selectedLevel || searchQuery) && (
            <div className="mt-4 flex items-center">
              <span className="text-sm text-neutral-500 mr-2">Aktív szűrők:</span>
              <div className="flex flex-wrap gap-2">
                {selectedUniversity && (
                  <Badge 
                    variant="outline" 
                    className="flex items-center gap-1 px-3 py-1 border-neutral-300 bg-neutral-50"
                  >
                    <Building className="h-3 w-3" />
                    {universities.find(u => u.id === parseInt(selectedUniversity))?.name}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => setSelectedUniversity(null)}
                    />
                  </Badge>
                )}
                
                {selectedLevel && (
                  <Badge 
                    variant="outline" 
                    className="flex items-center gap-1 px-3 py-1 border-neutral-300 bg-neutral-50"
                  >
                    <GraduationCap className="h-3 w-3" />
                    {degreeLevels.find(l => l.slug === selectedLevel)?.name}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => setSelectedLevel(null)}
                    />
                  </Badge>
                )}
                
                {searchQuery && (
                  <Badge 
                    variant="outline" 
                    className="flex items-center gap-1 px-3 py-1 border-neutral-300 bg-neutral-50"
                  >
                    <Search className="h-3 w-3" />
                    "{searchQuery}"
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => setSearchQuery("")}
                    />
                  </Badge>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-neutral-500 text-xs"
                  onClick={() => {
                    setSelectedUniversity(null);
                    setSelectedLevel(null);
                    setSearchQuery("");
                  }}
                >
                  Összes törlése
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Results Count */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-900">
            Diplomás képzések
          </h2>
          <div className="text-neutral-600 font-medium">
            {filteredDegrees.length} találat
          </div>
        </div>
        
        {/* Degree Program Cards */}
        {filteredDegrees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredDegrees.map((degree) => {
              const university = universities.find(u => u.id === degree.universityId);
              
              return (
                <motion.div
                  key={degree.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100 flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  <div className="relative h-48">
                    <img 
                      src={degree.imageUrl} 
                      alt={degree.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent"></div>
                    
                    <div className="absolute top-3 right-3">
                      <Badge 
                        className={`
                          ${degree.level === 'bachelor' ? 'bg-blue-500' : ''}
                          ${degree.level === 'master' ? 'bg-purple-500' : ''}
                          ${degree.level === 'phd' ? 'bg-orange-500' : ''}
                          ${degree.level === 'specialization' ? 'bg-green-500' : ''}
                          ${degree.level === 'advanced-vocational' ? 'bg-cyan-500' : ''}
                          text-white
                        `}
                      >
                        {degreeLevels.find(l => l.slug === degree.level)?.name}
                      </Badge>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 w-full p-5 text-white">
                      <div className="flex items-center mb-2">
                        <div className="flex-shrink-0 w-8 h-8 mr-3 rounded-full overflow-hidden bg-white p-1">
                          <img 
                            src={university?.logoUrl} 
                            alt={university?.name} 
                            className="w-full h-full object-contain" 
                          />
                        </div>
                        <span className="font-medium">
                          {university?.name}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-1">
                        {degree.name}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-grow flex flex-col">                    
                    <p className="text-neutral-600 text-sm mb-4">
                      {degree.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-neutral-600 text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-neutral-400" />
                        <span>{degree.duration}</span>
                      </div>
                      <div className="flex items-center text-neutral-600 text-sm">
                        <Award className="h-4 w-4 mr-2 text-neutral-400" />
                        <span>{degree.credits} kredit</span>
                      </div>
                      <div className="flex items-center text-neutral-600 text-sm">
                        <Users className="h-4 w-4 mr-2 text-neutral-400" />
                        <span>{degree.studentCount} hallgató</span>
                      </div>
                      <div className="flex items-center text-neutral-600 text-sm">
                        <Star className="h-4 w-4 mr-2 text-yellow-500 fill-yellow-500" />
                        <span>{degree.rating} / 5.0</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100">
                      <div className="font-bold text-neutral-900">
                        {degree.price.toLocaleString('hu-HU')} Ft / félév
                      </div>
                      <Link href={`/degree/${degree.id}`}>
                        <Button variant="outline" className="text-primary border-primary hover:bg-primary/5">
                          Részletek
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-neutral-50 rounded-xl p-8 text-center border border-neutral-200">
            <p className="text-neutral-600 mb-4">
              Nincs találat a keresési feltételeknek megfelelően. Kérjük, próbáljon meg más keresési feltételeket.
            </p>
            <Button onClick={() => {
              setSelectedUniversity(null);
              setSelectedLevel(null);
              setSearchQuery("");
            }}>
              Összes képzési program megtekintése
            </Button>
          </div>
        )}
        
        {/* Apply Now CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 mt-16 text-white"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Kezdje el tanulmányait még ebben a félévben
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Az Academion partnerei rugalmas kezdési lehetőségeket kínálnak. Jelentkezzen most, és kezdje el tanulmányait az Ön számára legmegfelelőbb időpontban.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-primary hover:bg-white/90 font-medium text-lg py-6 px-8">
                Jelentkezés most
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 font-medium text-lg py-6 px-8">
                Tanácsadás kérése
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DegreesPage;