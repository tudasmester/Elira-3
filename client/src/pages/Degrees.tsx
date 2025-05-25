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
  GraduationCap,
  Users,
  Star,
  Calendar,
  Clock,
  X,
  ChevronRight,
  Building,
  BarChart,
  Clock3
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import elteImage from "../assets/ELTE.png";
import bmeImage from "../assets/bme.png";
import corvinusImage from "../assets/corvinus_logo_angol_sz_transparent.png";
// Using a placeholder for OTP Bank logo
const otpImage = "https://upload.wikimedia.org/wikipedia/commons/6/63/OTP_Bank_logo.svg";

// Define universities
const universities = [
  { id: 1, name: "Budapesti Műszaki és Gazdaságtudományi Egyetem", logo: bmeImage, slug: "bme" },
  { id: 2, name: "Eötvös Loránd Tudományegyetem", logo: elteImage, slug: "elte" },
  { id: 3, name: "Corvinus Egyetem", logo: corvinusImage, slug: "corvinus" },
  { id: 4, name: "Debreceni Egyetem", logo: "https://unideb.hu/sites/default/files/dokumentumok-munkavallaloknak/arculati_kezikonyv/logok/de_logok_19.png", slug: "debreceni" },
  { id: 5, name: "Szegedi Tudományegyetem", logo: "https://u-szeged.hu/site/upload/2022/03/szte-cimer-1.png", slug: "szte" },
];

// Define degree programs
const degreePrograms = [
  {
    id: 1,
    university: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
    universityLogo: bmeImage,
    title: "BSc Gazdasági Informatika",
    description: "Sajátítsa el a vállalati informatikai rendszerek tervezéséhez és üzemeltetéséhez szükséges ismereteket.",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    type: "BSc",
    level: "Alapképzés",
    duration: "6 félév",
    students: 358,
    rating: 4.8,
    isFeatured: true,
    categories: ["informatika", "gazdaság"],
    price: 350000,
    partnerCompanies: ["OTP Bank", "Morgan Stanley", "IBM"]
  },
  {
    id: 2,
    university: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
    universityLogo: bmeImage,
    title: "BSc Számítógépes Tudományok",
    description: "Szerezzen átfogó ismereteket a programozás, algoritmusok és adatszerkezetek területén.",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    type: "BSc",
    level: "Alapképzés",
    duration: "6 félév",
    students: 412,
    rating: 4.7,
    isFeatured: true,
    categories: ["informatika", "programozás"],
    price: 350000,
    partnerCompanies: ["Microsoft", "EPAM", "Ericsson"]
  },
  {
    id: 3,
    university: "Eötvös Loránd Tudományegyetem",
    universityLogo: elteImage,
    title: "BSc Marketing",
    description: "Ismerje meg a modern marketing eszköztárát és sajátítsa el a sikeres kampányok tervezésének módszereit.",
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    type: "BSc",
    level: "Alapképzés",
    duration: "6 félév",
    students: 278,
    rating: 4.6,
    isFeatured: false,
    categories: ["marketing", "kommunikáció"],
    price: 310000,
    partnerCompanies: ["Vodafone", "Telenor", "Ogilvy"]
  },
  {
    id: 4,
    university: "Corvinus Egyetem",
    universityLogo: corvinusImage,
    title: "MSc Vezetés és Szervezés",
    description: "Fejlessze vezetői képességeit és tanulja meg a modern szervezetfejlesztési módszereket.",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    type: "MSc",
    level: "Mesterképzés",
    duration: "4 félév",
    students: 198,
    rating: 4.9,
    isFeatured: true,
    categories: ["menedzsment", "vezetés"],
    price: 390000,
    partnerCompanies: ["McKinsey", "Deloitte", "OTP Bank"]
  },
  {
    id: 5,
    university: "Debreceni Egyetem",
    universityLogo: "https://unideb.hu/sites/default/files/dokumentumok-munkavallaloknak/arculati_kezikonyv/logok/de_logok_19.png",
    title: "BSc Programtervező Informatikus",
    description: "Szerezzen ismereteket a modern szoftverfejlesztés módszereiről és eszközeiről.",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    type: "BSc",
    level: "Alapképzés",
    duration: "6 félév",
    students: 325,
    rating: 4.6,
    isFeatured: false,
    categories: ["informatika", "programozás"],
    price: 320000,
    partnerCompanies: ["IT Services", "Continental", "NI Hungary"]
  },
  {
    id: 6,
    university: "Szegedi Tudományegyetem",
    universityLogo: "https://u-szeged.hu/site/upload/2022/03/szte-cimer-1.png",
    title: "MSc Molekuláris Biológia",
    description: "Ismerje meg a modern molekuláris biológia kutatási módszereit és eredményeit.",
    imageUrl: "https://images.unsplash.com/photo-1576086776739-3955cfd8c076?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    type: "MSc",
    level: "Mesterképzés",
    duration: "4 félév",
    students: 156,
    rating: 4.7,
    isFeatured: false,
    categories: ["biológia", "tudomány"],
    price: 350000,
    partnerCompanies: ["Richter Gedeon", "TEVA", "Sanofi"]
  },
  {
    id: 7,
    university: "Corvinus Egyetem",
    universityLogo: corvinusImage,
    title: "BSc Nemzetközi Gazdálkodás",
    description: "Szerezzen átfogó ismereteket a nemzetközi gazdaságról, kereskedelemről és pénzügyekről.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    type: "BSc",
    level: "Alapképzés",
    duration: "7 félév",
    students: 289,
    rating: 4.8,
    isFeatured: true,
    categories: ["gazdaság", "nemzetközi"],
    price: 380000,
    partnerCompanies: ["OTP Bank", "Raiffeisen", "KPMG"]
  },
  {
    id: 8,
    university: "Eötvös Loránd Tudományegyetem",
    universityLogo: elteImage,
    title: "MSc Adattudomány",
    description: "Fejlessze képességeit az adatelemzés, gépi tanulás és nagy adathalmazok feldolgozása területén.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    type: "MSc",
    level: "Mesterképzés",
    duration: "4 félév",
    students: 175,
    rating: 4.9,
    isFeatured: true,
    categories: ["adattudomány", "informatika"],
    price: 370000,
    partnerCompanies: ["Morgan Stanley", "Emarsys", "Ericsson"]
  }
];

const DegreesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("osszes");
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  
  // Filter programs based on search query, tab, and selected university
  const filteredPrograms = degreePrograms.filter(program => {
    // Filter by search query
    if (searchQuery && !program.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by university
    if (selectedUniversity && program.university !== selectedUniversity) {
      return false;
    }
    
    // Filter by tab
    if (activeTab === "alapkepzes" && program.type !== "BSc") {
      return false;
    }
    if (activeTab === "mesterkepzes" && program.type !== "MSc") {
      return false;
    }
    if (activeTab === "kiemelt" && !program.isFeatured) {
      return false;
    }
    
    return true;
  });
  
  const totalStudents = degreePrograms.reduce((sum, program) => sum + program.students, 0);
  
  return (
    <div className="bg-gradient-to-b from-neutral-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 via-primary/20 to-purple-600/10 opacity-70"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiIGlkPSJhIj48c3RvcCBzdG9wLWNvbG9yPSIjRkZGIiBvZmZzZXQ9IjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIwIiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMCAwaDcyMHY0MDBIMHoiIGZpbGw9InVybCgjYSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] bg-center bg-no-repeat opacity-100"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative text-center py-16 md:py-24 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-primary/20 text-primary mb-6 px-4 py-2 text-base">
                <GraduationCap className="h-4 w-4 mr-2" />
                Online Diplomaprogramok
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-8 leading-tight">
                Szerezzen diplomát az <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-primary">élvonalbeli egyetemektől</span>
              </h1>
              
              <p className="text-neutral-700 text-lg md:text-xl max-w-3xl mx-auto mb-10">
                Válasszon a legjobb magyar egyetemek akkreditált diplomaprogramjai közül, és tanuljon teljesen online, 
                rugalmas időbeosztással, megfizethető áron.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {universities.slice(0, 5).map((university) => (
                  <div key={university.id} className="flex items-center bg-white rounded-full px-3 py-1.5 shadow-sm border border-neutral-100">
                    <img 
                      src={university.logo} 
                      alt={university.name} 
                      className="h-6 w-6 object-contain mr-2" 
                    />
                    <span className="text-sm font-medium text-neutral-800">{university.name}</span>
                  </div>
                ))}
              </div>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <Input
                  type="text"
                  placeholder="Keressen diplomaprogramot..."
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
        
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
            <div className="flex items-center mb-2">
              <div className="p-3 rounded-full bg-primary/10 mr-4">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{degreePrograms.length}</p>
                <p className="text-neutral-600">Diplomaprogram</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
            <div className="flex items-center mb-2">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{universities.length}</p>
                <p className="text-neutral-600">Partneregyetem</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
            <div className="flex items-center mb-2">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{totalStudents.toLocaleString('hu-HU')}</p>
                <p className="text-neutral-600">Aktív hallgató</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <Tabs defaultValue="osszes" className="w-full max-w-md" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="osszes">Összes</TabsTrigger>
                <TabsTrigger value="alapkepzes">Alapképzés</TabsTrigger>
                <TabsTrigger value="mesterkepzes">Mesterképzés</TabsTrigger>
                <TabsTrigger value="kiemelt">Kiemelt</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="text-neutral-600 font-medium">
              {filteredPrograms.length} program
            </div>
          </div>
          
          {/* University Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              variant={selectedUniversity === null ? "default" : "outline"}
              className={selectedUniversity === null ? "bg-primary text-white" : "border-neutral-200 text-neutral-700"}
              onClick={() => setSelectedUniversity(null)}
            >
              Összes egyetem
            </Button>
            
            {universities.map((university) => (
              <Button 
                key={university.id}
                variant={selectedUniversity === university.name ? "default" : "outline"}
                className={selectedUniversity === university.name 
                  ? "bg-primary text-white" 
                  : "border-neutral-200 text-neutral-700"}
                onClick={() => setSelectedUniversity(university.name)}
              >
                <img 
                  src={university.logo} 
                  alt={university.name}
                  className="h-5 w-5 object-contain mr-2"
                />
                {university.name}
              </Button>
            ))}
          </div>
          
          {/* Degree Program Cards */}
          {filteredPrograms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100 flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  <div className="relative">
                    <img 
                      src={program.imageUrl} 
                      alt={program.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    
                    <div className="absolute top-3 left-3">
                      <Badge className={program.type === "BSc" ? "bg-blue-500 text-white" : "bg-purple-500 text-white"}>
                        {program.type}
                      </Badge>
                    </div>
                    
                    <div className="absolute bottom-3 right-3 flex space-x-0.5">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < Math.floor(program.rating) ? "text-yellow-500 fill-yellow-500" : "text-neutral-300"}`} 
                        />
                      ))}
                      <span className="ml-1 text-xs text-white font-medium">{program.rating}</span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 w-8 h-8 mr-3 rounded-full overflow-hidden border border-neutral-200 bg-white p-1">
                        <img 
                          src={program.universityLogo} 
                          alt={`${program.university} logó`} 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <span className="text-sm text-neutral-600 font-medium truncate">
                        {program.university}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-neutral-800 mb-2 line-clamp-2">
                      {program.title}
                    </h3>
                    
                    <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                      {program.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm text-neutral-500 mt-auto">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-neutral-400" />
                        <span>{program.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-neutral-400" />
                        <span>{program.students.toLocaleString('hu-HU')} hallgató</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 mb-4">
                      <p className="text-sm text-neutral-500 mb-1">Vállalati partnerek:</p>
                      <div className="flex flex-wrap gap-1">
                        {program.partnerCompanies.map((company, idx) => (
                          <Badge key={idx} variant="outline" className="bg-neutral-50 text-neutral-700">
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100">
                      <div>
                        <span className="font-bold text-neutral-900">{program.price.toLocaleString('hu-HU')} Ft</span>
                        <span className="text-neutral-500 text-xs"> / félév</span>
                      </div>
                      <Link href={`/degree/${program.id}`}>
                        <Button className="bg-primary hover:bg-primary/90 text-white">
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
                setSelectedUniversity(null);
                setSearchQuery("");
                setActiveTab("osszes");
              }}>
                Összes program megtekintése
              </Button>
            </div>
          )}
        </div>
        
        {/* Partner Companies Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Együttműködő vállalatok</h2>
          <div className="bg-white p-8 rounded-xl border border-neutral-200">
            <p className="text-neutral-600 mb-8 text-center">
              Diplomaprogramjaink a vezető vállalatok szakértőivel együttműködve készülnek, 
              hogy a legfrissebb iparági ismereteket kaphassa.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {['OTP Bank', 'Morgan Stanley', 'KPMG', 'Microsoft', 'Ericsson', 'IBM', 'EPAM', 'Deloitte', 'Vodafone', 'Telenor', 'Richter Gedeon', 'McKinsey'].map((company, index) => (
                <div key={index} className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                  {company === 'OTP Bank' ? (
                    <img src={otpImage} alt={company} className="h-12 object-contain" />
                  ) : (
                    <div className="text-lg font-bold text-neutral-400 hover:text-primary transition-colors">{company}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-primary rounded-xl p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Szerezzen diplomát és indítsa el karrierjét</h2>
            <p className="text-white/90 mb-8">
              Diplomaprogramjaink a munkaerőpiac igényeire szabottak, hogy Ön a végzés után azonnal elhelyezkedjen. 
              Rugalmas online tanulás, elismert diploma, megfizethetőség.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-white/90">
                Program tanácsadás
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                Tájékoztató anyag letöltése
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DegreesPage;