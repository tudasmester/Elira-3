import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import {
  Search,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Users,
  Star,
  Clock,
  ExternalLink,
  BarChart3,
  Award,
  Heart,
  ThumbsUp,
  Play,
  ChevronRight,
  X,
  Calendar
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import bmeImage from "../assets/bme.png";
import elteImage from "../assets/ELTE.png";
import corvinusImage from "../assets/corvinus_logo_angol_sz_transparent.png";
import academionImage from "../assets/academion (3).png";

// Define trending topics
const trendingTopics = [
  { id: 1, name: "Mesterséges Intelligencia", icon: "🤖", slug: "ai" },
  { id: 2, name: "Adatvizualizáció", icon: "📊", slug: "data-viz" },
  { id: 3, name: "Üzleti Elemzés", icon: "📈", slug: "business-analytics" },
  { id: 4, name: "Fenntarthatóság", icon: "🌱", slug: "sustainability" },
  { id: 5, name: "Digitális Marketing", icon: "📱", slug: "digital-marketing" },
  { id: 6, name: "Kiberbiztonság", icon: "🔒", slug: "cybersecurity" },
  { id: 7, name: "Frontend Fejlesztés", icon: "💻", slug: "frontend" },
  { id: 8, name: "Adattudomány", icon: "📉", slug: "data-science" },
];

// Define trending courses and articles
type TrendingItem = {
  id: number;
  type: "course" | "article" | "webinar" | "video";
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  popularity: number;
  // Course specific
  level?: string;
  duration?: string;
  university?: string;
  universityLogo?: string;
  author?: string;
  views?: number;
  rating?: number;
  // Article specific
  authorTitle?: string;
  publishDate?: string;
  readTime?: string;
  likes?: number;
  // Webinar specific
  date?: string;
  time?: string;
  presenter?: string;
  presenterTitle?: string;
  registrations?: number;
  // Video specific
  instructor?: string;
  instructorTitle?: string;
};

const trendingContent: TrendingItem[] = [
  {
    id: 1,
    type: "course",
    title: "Mesterséges Intelligencia Alapjai",
    description: "Átfogó bevezetés a mesterséges intelligencia elméletébe és gyakorlati alkalmazásaiba.",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&h=300&auto=format&fit=crop",
    category: "Mesterséges Intelligencia",
    level: "Kezdő",
    duration: "8 hét",
    university: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
    universityLogo: bmeImage,
    author: "Dr. Nagy Péter",
    views: 12450,
    rating: 4.8,
    popularity: 98
  },
  {
    id: 2,
    type: "article",
    title: "Az Adatvizualizáció 10 Aranyszabálya",
    description: "Hogyan készítsünk hatékony és vizuálisan vonzó adatvizualizációkat? A legjobb gyakorlatok és tippek.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&h=300&auto=format&fit=crop",
    category: "Adatvizualizáció",
    author: "Kovács Anna",
    authorTitle: "Senior Adatelemző, OTP Bank",
    publishDate: "2025-05-15",
    readTime: "8 perc",
    views: 8790,
    likes: 342,
    popularity: 93
  },
  {
    id: 3,
    type: "course",
    title: "Üzleti Elemzés Haladóknak",
    description: "Mélyebb betekintés az üzleti elemzés módszertanába, esettanulmányokkal és gyakorlati példákkal.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&h=300&auto=format&fit=crop",
    category: "Üzleti Elemzés",
    level: "Haladó",
    duration: "6 hét",
    university: "Corvinus Egyetem",
    universityLogo: corvinusImage,
    author: "Dr. Szabó János",
    views: 7680,
    rating: 4.7,
    popularity: 90
  },
  {
    id: 4,
    type: "webinar",
    title: "Fenntartható Vállalati Stratégiák a 2025-ös Évben",
    description: "Élő webinárium a fenntarthatósági szempontok vállalati stratégiába történő integrálásáról.",
    imageUrl: "https://images.unsplash.com/photo-1472721318575-363e9974d1e9?q=80&w=600&h=300&auto=format&fit=crop",
    category: "Fenntarthatóság",
    date: "2025-06-10",
    time: "14:00",
    duration: "90 perc",
    presenter: "Zöld Katalin",
    presenterTitle: "Fenntarthatósági Igazgató, Magyar Telekom",
    registrations: 560,
    popularity: 87
  },
  {
    id: 5,
    type: "article",
    title: "A TikTok Marketing Legújabb Trendjei",
    description: "Hogyan használhatják a vállalkozások hatékonyan a TikTok platformot a 2025-ös évben?",
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&h=300&auto=format&fit=crop",
    category: "Digitális Marketing",
    author: "Fehér Nóra",
    authorTitle: "Social Media Stratéga, Wavemaker",
    publishDate: "2025-05-20",
    readTime: "6 perc",
    views: 9120,
    likes: 287,
    popularity: 86
  },
  {
    id: 6,
    type: "course",
    title: "Kibervédelmi Alapismeretek",
    description: "Védje meg vállalkozását és személyes adatait a kibertámadásoktól ezzel a gyakorlatorientált kurzussal.",
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=600&h=300&auto=format&fit=crop",
    category: "Kiberbiztonság",
    level: "Kezdő",
    duration: "5 hét",
    university: "Eötvös Loránd Tudományegyetem",
    universityLogo: elteImage,
    author: "Dr. Fekete István",
    views: 6950,
    rating: 4.6,
    popularity: 85
  },
  {
    id: 7,
    type: "video",
    title: "Modern Frontend Fejlesztés React-tal",
    description: "Gyakorlati bemutatás a modern frontend fejlesztési technikákról és a React könyvtár használatáról.",
    imageUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=600&h=300&auto=format&fit=crop",
    category: "Frontend Fejlesztés",
    duration: "47 perc",
    instructor: "Varga Tamás",
    instructorTitle: "Senior Frontend Fejlesztő, EPAM",
    views: 8560,
    likes: 764,
    popularity: 83
  },
  {
    id: 8,
    type: "course",
    title: "Adatelemzés Python-nal",
    description: "Ismerje meg az adatelemzés alapjait és a Python programozási nyelv használatát adattudományi feladatokra.",
    imageUrl: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=600&h=300&auto=format&fit=crop",
    category: "Adattudomány",
    level: "Közepes",
    duration: "10 hét",
    university: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
    universityLogo: bmeImage,
    author: "Dr. Tóth Zoltán",
    views: 10250,
    rating: 4.9,
    popularity: 95
  }
];

const TrendingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("osszes");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Filter content based on search query, tab, and selected category
  const filteredContent = trendingContent.filter(item => {
    // Filter by search query
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (activeCategory && item.category !== activeCategory) {
      return false;
    }
    
    // Filter by tab/type
    if (activeTab === "kurzusok" && item.type !== "course") {
      return false;
    }
    if (activeTab === "cikkek" && item.type !== "article") {
      return false;
    }
    if (activeTab === "webinarok" && item.type !== "webinar") {
      return false;
    }
    if (activeTab === "videok" && item.type !== "video") {
      return false;
    }
    
    return true;
  });
  
  // Sort by popularity
  const sortedContent = [...filteredContent].sort((a, b) => b.popularity - a.popularity);

  return (
    <div className="bg-gradient-to-b from-neutral-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-amber-500/10 to-primary/20 opacity-80"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiIGlkPSJhIj48c3RvcCBzdG9wLWNvbG9yPSIjRkZGIiBvZmZzZXQ9IjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIwIiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMCAwaDcyMHY0MDBIMHoiIGZpbGw9InVybCgjYSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] bg-center bg-no-repeat opacity-100"></div>
          
          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
          
          <div className="relative text-center py-16 md:py-24 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-amber-500/20 text-amber-700 mb-6 px-4 py-2 text-base">
                <TrendingUp className="h-4 w-4 mr-2" />
                A legújabb trendek
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-8 leading-tight">
                Fedezze fel a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500">legfrissebb tartalmakat</span>
              </h1>
              
              <p className="text-neutral-700 text-lg md:text-xl max-w-3xl mx-auto mb-10">
                Ismerje meg a legaktuálisabb tanulási trendeket, népszerű kurzusokat és szakértői cikkeket, 
                amelyek segítenek naprakész maradni a gyorsan változó világban.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {trendingTopics.slice(0, 6).map((topic) => (
                  <motion.div
                    key={topic.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveCategory(topic.name === activeCategory ? null : topic.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-colors duration-200 ${
                      activeCategory === topic.name 
                        ? 'bg-primary text-white' 
                        : 'bg-white hover:bg-neutral-100 text-neutral-800'
                    } shadow-sm border border-neutral-200`}
                  >
                    <span className="text-xl">{topic.icon}</span>
                    <span className="font-medium">{topic.name}</span>
                  </motion.div>
                ))}
              </div>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <Input
                  type="text"
                  placeholder="Keressen a trendek között..."
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
        
        {/* Content Filter Tabs */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <Tabs defaultValue="osszes" className="w-full max-w-md" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="osszes">Összes</TabsTrigger>
                <TabsTrigger value="kurzusok">Kurzusok</TabsTrigger>
                <TabsTrigger value="cikkek">Cikkek</TabsTrigger>
                <TabsTrigger value="webinarok">Webinárok</TabsTrigger>
                <TabsTrigger value="videok">Videók</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="text-neutral-600 font-medium">
              {sortedContent.length} találat
            </div>
          </div>
          
          {/* Trending Content */}
          {sortedContent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedContent.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100 flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  <div className="relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    
                    <div className="absolute top-3 left-3">
                      <Badge className={
                        item.type === "course" ? "bg-primary text-white" :
                        item.type === "article" ? "bg-blue-500 text-white" :
                        item.type === "webinar" ? "bg-purple-500 text-white" :
                        "bg-rose-500 text-white"
                      }>
                        {item.type === "course" ? "Kurzus" : 
                         item.type === "article" ? "Cikk" : 
                         item.type === "webinar" ? "Webinár" : "Videó"}
                      </Badge>
                    </div>
                    
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-amber-400 text-amber-900">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {item.popularity}% Népszerű
                      </Badge>
                    </div>
                    
                    {item.type === "course" && (
                      <div className="absolute bottom-3 right-3 flex space-x-0.5">
                        {Array(5).fill(0).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < Math.floor(item.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-neutral-300"}`} 
                          />
                        ))}
                        <span className="ml-1 text-xs text-white font-medium">{item.rating}</span>
                      </div>
                    )}
                    
                    {(item.type === "webinar" || item.type === "video") && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors cursor-pointer">
                          <Play className="h-5 w-5 text-white fill-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 flex-grow flex flex-col">
                    {item.type === "course" && (
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 mr-3 rounded-full overflow-hidden border border-neutral-200 bg-white p-1">
                          <img 
                            src={item.universityLogo} 
                            alt={`${item.university} logó`} 
                            className="w-full h-full object-contain" 
                          />
                        </div>
                        <span className="text-sm text-neutral-600 font-medium truncate">
                          {item.university}
                        </span>
                      </div>
                    )}
                    
                    {(item.type === "article" || item.type === "webinar" || item.type === "video") && (
                      <div className="flex items-center mb-3">
                        <div className="flex-shrink-0 w-8 h-8 mr-3 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                          <img 
                            src={academionImage}
                            alt="Academion"
                            className="w-6 h-6 object-contain" 
                          />
                        </div>
                        <div>
                          <span className="text-sm text-neutral-600 font-medium">
                            {item.type === "article" ? item.author : 
                            item.type === "webinar" ? item.presenter : 
                            item.instructor}
                          </span>
                          <p className="text-xs text-neutral-500">
                            {item.type === "article" ? item.authorTitle : 
                            item.type === "webinar" ? item.presenterTitle : 
                            item.instructorTitle}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <h3 className="text-lg font-bold text-neutral-800 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4 text-sm text-neutral-500 mt-auto">
                      {item.type === "course" && (
                        <>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-neutral-400" />
                            <span>{item.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-neutral-400" />
                            <span>{(item.views || 0).toLocaleString('hu-HU')} megtekintés</span>
                          </div>
                        </>
                      )}
                      
                      {item.type === "article" && (
                        <>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-neutral-400" />
                            <span>{item.readTime} olvasás</span>
                          </div>
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-1 text-neutral-400" />
                            <span>{item.likes} kedvelés</span>
                          </div>
                        </>
                      )}
                      
                      {item.type === "webinar" && (
                        <>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-neutral-400" />
                            <span>{item.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-neutral-400" />
                            <span>{item.registrations} résztvevő</span>
                          </div>
                        </>
                      )}
                      
                      {item.type === "video" && (
                        <>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-neutral-400" />
                            <span>{item.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1 text-neutral-400" />
                            <span>{item.likes} kedvelés</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100">
                      <Badge className={
                        item.category === "Mesterséges Intelligencia" ? "bg-violet-100 text-violet-800" : 
                        item.category === "Adatvizualizáció" ? "bg-blue-100 text-blue-800" :
                        item.category === "Üzleti Elemzés" ? "bg-amber-100 text-amber-800" :
                        item.category === "Fenntarthatóság" ? "bg-green-100 text-green-800" :
                        item.category === "Digitális Marketing" ? "bg-pink-100 text-pink-800" :
                        item.category === "Kiberbiztonság" ? "bg-red-100 text-red-800" :
                        item.category === "Frontend Fejlesztés" ? "bg-indigo-100 text-indigo-800" :
                        "bg-teal-100 text-teal-800"
                      }>
                        {item.category}
                      </Badge>
                      
                      {item.type === "course" && (
                        <Link href={`/course/${item.id}`}>
                          <Button variant="outline" className="text-primary border-primary hover:bg-primary/5">
                            Részletek
                          </Button>
                        </Link>
                      )}
                      
                      {item.type === "article" && (
                        <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                          Olvasás <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                      
                      {item.type === "webinar" && (
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                          Regisztráció
                        </Button>
                      )}
                      
                      {item.type === "video" && (
                        <Button className="bg-rose-600 hover:bg-rose-700 text-white">
                          Lejátszás <Play className="ml-1 h-3 w-3 fill-white" />
                        </Button>
                      )}
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
                setActiveCategory(null);
                setSearchQuery("");
                setActiveTab("osszes");
              }}>
                Összes tartalom megtekintése
              </Button>
            </div>
          )}
        </div>
        
        {/* Weekly Highlights Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Heti kiemelt tartalmak</h2>
            <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5">
              Összes megtekintése <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-gradient-to-r from-neutral-50 to-white p-8 rounded-xl border border-neutral-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2">
                <div className="relative h-80 md:h-full rounded-xl overflow-hidden group">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&h=500&auto=format&fit=crop" 
                    alt="Startup Weekend" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <Badge className="bg-amber-400 text-amber-900 mb-3">
                      <Award className="h-3 w-3 mr-1" />
                      Kiemelt esemény
                    </Badge>
                    <h3 className="text-2xl font-bold text-white mb-2">Startup Weekend Budapest 2025</h3>
                    <p className="text-white/80 mb-4">Csatlakozzon a legnagyobb hazai startup eseményhez, ahol 54 óra alatt ötletből vállalkozás születik.</p>
                    <div className="flex items-center text-white/80 text-sm mb-4">
                      <span className="flex items-center mr-4">
                        <Calendar className="h-4 w-4 mr-1" />
                        2025. június 15-17.
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        250+ résztvevő
                      </span>
                    </div>
                    <Button className="bg-white text-primary hover:bg-white/90">
                      Részletek
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                  <Badge className="bg-blue-100 text-blue-800 mb-2">Új kurzus</Badge>
                  <h3 className="font-bold text-lg mb-2">Python a Mesterséges Intelligenciában</h3>
                  <p className="text-neutral-600 text-sm mb-3">Fedezze fel a Python nyelv erejét a modern MI alkalmazások fejlesztésében.</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={bmeImage} 
                        alt="BME"
                        className="w-6 h-6 object-contain mr-2" 
                      />
                      <span className="text-xs text-neutral-500">BME</span>
                    </div>
                    <div className="flex items-center text-amber-500">
                      <Star className="h-4 w-4 fill-amber-500 mr-1" />
                      <span className="font-medium">4.9</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                  <Badge className="bg-green-100 text-green-800 mb-2">Különleges ajánlat</Badge>
                  <h3 className="font-bold text-lg mb-2">Adattudományi Szakirány - 30% kedvezmény</h3>
                  <p className="text-neutral-600 text-sm mb-3">Kezdje el az adattudományi szakirányt most különleges kedvezménnyel.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600 font-bold">Csak 10 napig!</span>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      Kedvezmény
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                  <Badge className="bg-purple-100 text-purple-800 mb-2">Népszerű cikk</Badge>
                  <h3 className="font-bold text-lg mb-2">A Top 5 Karrierlehetőség az Adattudományban</h3>
                  <p className="text-neutral-600 text-sm mb-3">Milyen lehetőségeket kínál az adattudomány a magyar munkaerőpiacon?</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-neutral-400 mr-1" />
                      <span className="text-xs text-neutral-500">5 perc olvasás</span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-purple-600 hover:text-purple-700 p-0">
                      Olvasás <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-amber-500 to-rose-500 rounded-xl p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Maradjon naprakész a legújabb trendekről</h2>
            <p className="text-white/90 mb-8">
              Iratkozzon fel hírlevelünkre és értesüljön elsőként a legfrissebb kurzusokról, 
              szakmai cikkekről és webinárokról.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <Input
                type="email"
                placeholder="Email címe"
                className="bg-white/20 backdrop-blur-sm text-white placeholder:text-white/70 border-white/30 focus:border-white"
              />
              <Button className="bg-white text-primary hover:bg-white/90 shadow-lg">
                Feliratkozás
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingPage;