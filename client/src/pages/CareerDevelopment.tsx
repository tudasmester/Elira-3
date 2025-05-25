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
  Zap
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

// Custom Code icon for frontend developer
function CodeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  );
}

// Define career paths
const careerPaths = [
  {
    id: 'data-analyst',
    title: 'Adatelemző',
    icon: <LineChart className="h-6 w-6 text-blue-500" />,
    description: 'Adatelemzők adatokat gyűjtenek, tisztítanak és értelmeznek, hogy támogassák az üzleti döntéshozatalt. Python, SQL és adatvizualizációs eszközök használatával dolgoznak.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    averageSalary: '800,000 - 1,200,000 Ft/hó',
    jobOutlook: 'Magas',
    growthRate: '+27%',
    timeToComplete: '6 hónap',
    difficulty: 'Közepes',
    rating: 4.8,
    students: 1250,
    isPopular: true,
    isTrending: true,
    category: 'tech',
    yearlyGrowth: [
      { year: 2022, jobs: 3200 },
      { year: 2023, jobs: 3800 },
      { year: 2024, jobs: 4500 },
      { year: 2025, jobs: 5200 },
    ],
    skills: ['SQL', 'Python', 'Excel', 'Adatvizualizáció', 'Statisztika', 'Tableau', 'R', 'Pandas'],
    recommendedCourses: [10, 11, 12, 13],
    topCompanies: ['OTP Bank', 'Vodafone', 'Mol Group', 'Telekom'],
    certifications: ['Microsoft Data Analyst', 'IBM Data Science', 'Google Data Analytics'],
    highlights: [
      'Az adatelemzők a legkeresettebb szakemberek közé tartoznak',
      'Rugalmas munkalehetőségek távmunkával is',
      'Számos iparágban szükség van adatelemzőkre',
      'A karrierváltók számára ideális kezdő pozíció'
    ]
  },
  {
    id: 'digital-marketer',
    title: 'Digitális Marketing Specialista',
    icon: <TrendingUp className="h-6 w-6 text-green-500" />,
    description: 'Digitális marketing szakemberek online kampányokat terveznek és hajtanak végre különböző platformokon, analitikával mérik a teljesítményt és optimalizálják a stratégiákat.',
    imageUrl: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    averageSalary: '700,000 - 1,100,000 Ft/hó',
    jobOutlook: 'Nagyon magas',
    growthRate: '+32%',
    timeToComplete: '5 hónap',
    difficulty: 'Kezdő-barát',
    rating: 4.7,
    students: 1850,
    isPopular: true,
    isTrending: true,
    category: 'marketing',
    yearlyGrowth: [
      { year: 2022, jobs: 2700 },
      { year: 2023, jobs: 3200 },
      { year: 2024, jobs: 4100 },
      { year: 2025, jobs: 4800 },
    ],
    skills: ['SEO', 'Google Analytics', 'Közösségi média', 'PPC hirdetések', 'Tartalommarketing', 'Email marketing', 'Konverzió optimalizálás', 'Copywriting'],
    recommendedCourses: [20, 21, 22, 23],
    topCompanies: ['Wavemaker', 'Google Hungary', 'GroupM', 'Httpool'],
    certifications: ['Google Ads', 'Facebook Blueprint', 'HubSpot Marketing'],
    highlights: [
      'A leggyorsabban növekvő karrierpálya Magyarországon',
      'Alacsony belépési küszöb karrierváltóknak',
      'Kreatív és adatvezérelt munka kombinációja',
      'Könnyen szerezhető nemzetközi tanúsítványok'
    ]
  },
  {
    id: 'ux-designer',
    title: 'UX/UI Designer',
    icon: <PenTool className="h-6 w-6 text-purple-500" />,
    description: 'UX/UI tervezők a felhasználói élményt és felületet tervezik, kutatást végeznek, prototípusokat készítenek, és a felhasználók visszajelzései alapján finomítják a termékeket.',
    imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    averageSalary: '800,000 - 1,300,000 Ft/hó',
    jobOutlook: 'Magas',
    growthRate: '+24%',
    timeToComplete: '7 hónap',
    difficulty: 'Közepes',
    rating: 4.9,
    students: 980,
    isPopular: true,
    isTrending: false,
    category: 'design',
    yearlyGrowth: [
      { year: 2022, jobs: 1800 },
      { year: 2023, jobs: 2100 },
      { year: 2024, jobs: 2400 },
      { year: 2025, jobs: 2800 },
    ],
    skills: ['Felhasználói kutatás', 'Wireframing', 'Prototyping', 'Figma', 'UI Design', 'Adobe XD', 'Interakciós design', 'Információs architektúra'],
    recommendedCourses: [30, 31, 32, 33],
    topCompanies: ['EPAM Systems', 'LogMeIn', 'Prezi', 'Emarsys'],
    certifications: ['Google UX Design Professional', 'Nielsen Norman Group UX Certification', 'Interaction Design Foundation'],
    highlights: [
      'Kreatív munka erős technikai háttérrel',
      'A hazai startupok egyik legkeresettebb pozíciója',
      'Portfólió-központú karrierlehetőségek',
      'Távmunka és nemzetközi lehetőségek'
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Kiberbiztonsági Specialista',
    icon: <Shield className="h-6 w-6 text-red-500" />,
    description: 'Kiberbiztonsági szakemberek védik a szervezetek rendszereit és adatait a digitális fenyegetésektől, biztonsági protokollokat fejlesztenek és incidenseket kezelnek.',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    averageSalary: '900,000 - 1,500,000 Ft/hó',
    jobOutlook: 'Nagyon magas',
    growthRate: '+35%',
    timeToComplete: '8 hónap',
    difficulty: 'Haladó',
    rating: 4.8,
    students: 720,
    isPopular: false,
    isTrending: true,
    category: 'tech',
    yearlyGrowth: [
      { year: 2022, jobs: 1200 },
      { year: 2023, jobs: 1500 },
      { year: 2024, jobs: 1900 },
      { year: 2025, jobs: 2300 },
    ],
    skills: ['Hálózati biztonság', 'Etikus hackelés', 'Incidenskezelés', 'Kockázatelemzés', 'Biztonsági eszközök', 'Penetrációs tesztelés', 'SIEM rendszerek', 'Kriptográfia'],
    recommendedCourses: [40, 41, 42, 43],
    topCompanies: ['Magyar Telekom', 'OTP Bank', 'Deloitte Hungary', 'IBM Hungary'],
    certifications: ['CompTIA Security+', 'Certified Ethical Hacker (CEH)', 'Certified Information Systems Security Professional (CISSP)'],
    highlights: [
      'A legmagasabb fizetések a tech szektorban',
      'Kritikus szakemberhiány az iparágban',
      'Védett szakma gazdasági visszaesések idején is',
      'Nemzetközi tanúsítványokkal globális karrierlehetőségek'
    ]
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    icon: <BarChart className="h-6 w-6 text-indigo-500" />,
    description: 'Az adattudósok fejlett analitikai, statisztikai és programozási ismeretekkel elemzik a komplex adatokat, hogy előrejelzéseket készítsenek és értéket teremtsenek a vállalatok számára.',
    imageUrl: 'https://images.unsplash.com/photo-1456428746267-a1756408f782?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    averageSalary: '1,000,000 - 1,700,000 Ft/hó',
    jobOutlook: 'Magas',
    growthRate: '+30%',
    timeToComplete: '9 hónap',
    difficulty: 'Haladó',
    rating: 4.9,
    students: 650,
    isPopular: false,
    isTrending: true,
    category: 'tech',
    yearlyGrowth: [
      { year: 2022, jobs: 900 },
      { year: 2023, jobs: 1100 },
      { year: 2024, jobs: 1350 },
      { year: 2025, jobs: 1700 },
    ],
    skills: ['Python', 'Gépi tanulás', 'Mély tanulás', 'Statisztika', 'TensorFlow', 'R', 'SQL', 'Big Data technológiák'],
    recommendedCourses: [50, 51, 52, 53],
    topCompanies: ['Morgan Stanley', 'Ericsson', 'Continental', 'Bosch'],
    certifications: ['IBM Data Science Professional', 'Microsoft Certified: Azure Data Scientist', 'Google Professional Data Engineer'],
    highlights: [
      'Az egyik legnagyobb presztízsű tech pozíció',
      'Mély matematikai és informatikai tudás kombinációja',
      'Kimagasló fizetések már junior szinten is',
      'Kutatás-fejlesztési projektek és innovatív technológiák'
    ]
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Fejlesztő',
    icon: <CodeIcon className="h-6 w-6 text-yellow-500" />,
    description: 'A frontend fejlesztők weboldalak és alkalmazások felhasználói felületét tervezik és fejlesztik modern technológiákkal, mint a React, Angular és Vue.js.',
    imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    averageSalary: '700,000 - 1,300,000 Ft/hó',
    jobOutlook: 'Magas',
    growthRate: '+23%',
    timeToComplete: '6 hónap',
    difficulty: 'Közepes',
    rating: 4.7,
    students: 1450,
    isPopular: true,
    isTrending: false,
    category: 'tech',
    yearlyGrowth: [
      { year: 2022, jobs: 2800 },
      { year: 2023, jobs: 3100 },
      { year: 2024, jobs: 3500 },
      { year: 2025, jobs: 3900 },
    ],
    skills: ['JavaScript', 'React', 'HTML', 'CSS', 'TypeScript', 'Reszponzív design', 'Git', 'Frontend tesztelés'],
    recommendedCourses: [60, 61, 62, 63],
    topCompanies: ['EPAM Systems', 'Cognizant', 'Accenture', 'Emarsys'],
    certifications: ['Meta Front-End Developer', 'JavaScript Institute Certification', 'W3Schools Front End Developer'],
    highlights: [
      'Ideális karrierváltási lehetőség kreatív embereknek',
      'A legkeresettebb fejlesztői pozíciók egyike Magyarországon',
      'Bőséges junior pozíciók karrierváltóknak',
      'Folyamatos szakmai fejlődési lehetőségek'
    ]
  }
];

const CareerDevelopment: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [previewCourse, setPreviewCourse] = useState<any | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);

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
  
  const toggleSavedCareer = (careerId: string) => {
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
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-primary/10 text-primary mb-4 px-3 py-1.5">
              <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
              Karrierutak
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
              Induljon el az <span className="text-primary">álomkarrierjének</span> útján
            </h1>
            <p className="text-neutral-600 text-lg md:text-xl max-w-3xl mx-auto mb-8">
              Fedezze fel a jövő legkeresettebb karrierútjait, és szerezze meg a szükséges készségeket 
              gyakorlati képzéseinken keresztül. Karrierváltást tervez? Segítünk az első lépésektől.
            </p>
          </motion.div>
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
                        return (
                          <Badge 
                            key={category} 
                            className={`cursor-pointer ${isSelected ? 'bg-primary text-white hover:bg-primary/90' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'}`}
                            onClick={() => toggleFilter('category', category)}
                          >
                            {category === 'tech' && 'Technológia'}
                            {category === 'marketing' && 'Marketing'}
                            {category === 'design' && 'Design'}
                            {category === 'business' && 'Üzlet'}
                            {category === 'education' && 'Oktatás'}
                            {!['tech', 'marketing', 'design', 'business', 'education'].includes(category) && category}
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
                <motion.div
                  key={career.id}
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
                          {career.icon}
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
                      onClick={() => toggleSavedCareer(career.id)}
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
                      <h4 className="font-semibold text-neutral-900 mb-2">Főbb előnyök:</h4>
                      <ul className="space-y-1">
                        {career.highlights.slice(0, 2).map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-neutral-600 text-sm">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
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
                      <Link href={`/career/${career.id}`}>
                        <Button className="bg-primary hover:bg-primary/90 text-white">
                          Részletek
                          <ChevronRight className="ml-1 h-4 w-4" />
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