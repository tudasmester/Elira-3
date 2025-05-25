import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Star,
  DollarSign,
  Clock,
  TrendingUp,
  Award,
  Building,
  CheckCircle,
  BarChart,
  Heart,
  HeartOff,
  Share2,
  Bookmark,
  BookmarkCheck,
  Users,
  LineChart,
  Shield,
  PenTool,
  Code
} from "lucide-react";
import CoursePreviewModal from "@/components/CoursePreviewModal";
import { courses } from "@/data/courses";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

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

// For a real-time chart of the career growth
const GrowthChart = ({ data }: { data: { year: number; jobs: number }[] }) => {
  const maxJobs = Math.max(...data.map(d => d.jobs));
  
  return (
    <div className="w-full h-40 flex items-end justify-between gap-4 mt-4">
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <TooltipProvider>
            <div 
              className="w-16 bg-primary/80 hover:bg-primary transition-all rounded-t-md"
              style={{ 
                height: `${(item.jobs / maxJobs) * 100}%`,
                minHeight: '10%'
              }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full h-full cursor-pointer"></div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{item.year}: {item.jobs.toLocaleString('hu-HU')} állás</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          <span className="text-sm mt-2 text-neutral-500">{item.year}</span>
        </div>
      ))}
    </div>
  );
};

// For a grid of recommended courses
const RecommendedCourses = ({ courseIds }: { courseIds: number[] }) => {
  const recommendedCourses = courses.filter(course => courseIds.includes(course.id));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {recommendedCourses.map(course => (
        <div 
          key={course.id} 
          className="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-primary/30 hover:bg-neutral-100/50 transition-all"
        >
          <img 
            src={course.imageUrl} 
            alt={course.title} 
            className="w-20 h-20 object-cover rounded-md"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-neutral-900 mb-1">{course.title}</h4>
            <div className="flex items-center text-sm text-neutral-500 mb-2">
              <span>{course.university}</span>
              <span className="mx-2">•</span>
              <span>{course.level}</span>
            </div>
            <Link href={`/course/${course.id}`}>
              <Button variant="link" className="h-auto p-0 text-primary">Megnézem</Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

const CareerDetail: React.FC = () => {
  const [location] = useLocation();
  const careerId = location.split('/').pop() || '';
  
  const [career, setCareer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSaved, setIsSaved] = useState(false);
  const [previewCourse, setPreviewCourse] = useState<any | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [savedForLater, setSavedForLater] = useState(false);
  
  useEffect(() => {
    const loadCareer = async () => {
      try {
        const data = careerPaths.find(c => c.id === careerId);
        setCareer(data);
        
        // Check if career is saved in localStorage
        const savedCareers = localStorage.getItem('savedCareers');
        if (savedCareers) {
          const parsed = JSON.parse(savedCareers);
          setIsSaved(parsed.includes(careerId));
        }
      } catch (error) {
        console.error("Error loading career:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCareer();
  }, [careerId]);
  
  const handleSaveCareer = () => {
    const savedCareers = localStorage.getItem('savedCareers');
    let parsed = savedCareers ? JSON.parse(savedCareers) : [];
    
    if (isSaved) {
      parsed = parsed.filter((id: string) => id !== careerId);
    } else {
      parsed.push(careerId);
    }
    
    localStorage.setItem('savedCareers', JSON.stringify(parsed));
    setIsSaved(!isSaved);
  };
  
  const handleSaveForLater = () => {
    setSavedForLater(!savedForLater);
    // In a real app, you'd save this to the user's profile
  };
  
  const handleShareCareer = () => {
    if (navigator.share) {
      navigator.share({
        title: career?.title,
        text: `Nézd meg ezt a karrierutat: ${career?.title}`,
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('A link másolva a vágólapra!'))
        .catch(err => console.error('Error copying link:', err));
    }
  };
  
  const handlePreviewCourse = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setPreviewCourse(course);
      setIsPreviewOpen(true);
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent align-[-0.125em]"></div>
          <p className="mt-4 text-neutral-600">Betöltés...</p>
        </div>
      </div>
    );
  }
  
  if (!career) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Karrierút nem található</h2>
          <p className="text-neutral-600 mb-8">A keresett karrierút nem található.</p>
          <Link href="/careers">
            <Button>Vissza a karrierutakhoz</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const categoryInfo = careerCategories[career.category as keyof typeof careerCategories] || 
    { name: career.category, color: 'bg-neutral-100 text-neutral-800' };
    
  const difficultyInfo = difficultyLevels[career.difficulty as keyof typeof difficultyLevels] || 
    { name: career.difficulty, color: 'bg-neutral-100 text-neutral-800' };

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-neutral-500">
            <Link href="/careers" className="hover:text-primary">
              <span className="flex items-center">
                <ChevronLeft className="h-3 w-3 mr-1" />
                Karrierutak
              </span>
            </Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-800">{career.title}</span>
          </div>
        </div>
        
        {/* Hero Section */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100 mb-8">
          <div className="relative h-64 md:h-80">
            <img 
              src={career.imageUrl} 
              alt={career.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
            
            <div className="absolute top-4 left-4 flex space-x-2">
              <Badge className={categoryInfo.color}>
                {categoryInfo.name}
              </Badge>
              <Badge className={difficultyInfo.color}>
                {difficultyInfo.name}
              </Badge>
              {career.isTrending && (
                <Badge className="bg-amber-500/90 text-white border-none">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Feltörekvő
                </Badge>
              )}
            </div>
            
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white/80 hover:bg-white"
                onClick={handleSaveCareer}
              >
                {isSaved ? (
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                ) : (
                  <Heart className="h-4 w-4" />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white/80 hover:bg-white"
                onClick={handleShareCareer}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white/80 hover:bg-white"
                onClick={handleSaveForLater}
              >
                {savedForLater ? (
                  <BookmarkCheck className="h-4 w-4 text-primary fill-primary" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex items-center mb-3">
                <div className="p-3 rounded-full bg-white/90 mr-4">
                  {renderCareerIcon(career.iconType, career.iconColor)}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {career.title}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-white">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{career.rating} értékelés</span>
                    </div>
                    <div className="flex items-center text-white">
                      <Users className="h-4 w-4 mr-1 text-white/80" />
                      <span className="text-sm font-medium">{career.students.toLocaleString('hu-HU')} tanuló</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-neutral-200">
              <TabsList className="h-auto justify-start rounded-none border-b-0 bg-transparent p-0">
                <TabsTrigger 
                  value="overview" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-4 bg-transparent text-neutral-600 data-[state=active]:text-primary"
                >
                  Áttekintés
                </TabsTrigger>
                <TabsTrigger 
                  value="courses" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-4 bg-transparent text-neutral-600 data-[state=active]:text-primary"
                >
                  Ajánlott kurzusok
                </TabsTrigger>
                <TabsTrigger 
                  value="market" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-4 bg-transparent text-neutral-600 data-[state=active]:text-primary"
                >
                  Munkaerőpiac
                </TabsTrigger>
                <TabsTrigger 
                  value="certifications" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-4 bg-transparent text-neutral-600 data-[state=active]:text-primary"
                >
                  Tanúsítványok
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6 md:p-8">
              <TabsContent value="overview" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">A karrierút leírása</h2>
                    <p className="text-neutral-700 mb-6">
                      {career.description}
                    </p>
                    
                    <h3 className="text-xl font-bold text-neutral-900 mb-3">Kiemelt előnyök</h3>
                    <ul className="space-y-2 mb-6">
                      {career.highlights.map((highlight: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-neutral-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <h3 className="text-xl font-bold text-neutral-900 mb-3">Szükséges készségek</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {career.skills.map((skill: string, idx: number) => (
                        <Badge key={idx} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-bold text-neutral-900 mb-3">Vezető vállalatok</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {career.topCompanies.map((company: string, idx: number) => (
                        <div key={idx} className="flex items-center space-x-2 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                          <Building className="h-5 w-5 text-neutral-500" />
                          <span className="text-neutral-700 font-medium">{company}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200">
                      <h3 className="text-lg font-bold text-neutral-900 mb-4">Karrierút adatok</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm text-neutral-600 mb-1">
                            <span>Átlagos fizetés</span>
                          </div>
                          <div className="font-bold text-neutral-800 flex items-center">
                            <DollarSign className="h-5 w-5 text-green-600 mr-1" />
                            {career.averageSalary}
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm text-neutral-600 mb-1">
                            <span>Képzési idő</span>
                          </div>
                          <div className="font-bold text-neutral-800 flex items-center">
                            <Clock className="h-5 w-5 text-blue-600 mr-1" />
                            {career.timeToComplete}
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm text-neutral-600 mb-1">
                            <span>Munkaerőpiaci kilátások</span>
                          </div>
                          <div className="font-bold text-neutral-800 flex items-center">
                            <TrendingUp className="h-5 w-5 text-primary mr-1" />
                            {career.jobOutlook} 
                            <span className="ml-1 text-green-600">{career.growthRate}</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm text-neutral-600 mb-1">
                            <span>Nehézségi szint</span>
                          </div>
                          <div className="font-bold text-neutral-800">
                            {career.difficulty}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200">
                      <h3 className="text-lg font-bold text-neutral-900 mb-3">Ajánlott oktatási út</h3>
                      <p className="text-neutral-600 mb-4">
                        Segítünk, hogy magabiztosan elindulj a karrierutadon a szükséges készségek megszerzésével.
                      </p>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                        Személyre szabott tanulási terv
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="courses" className="m-0">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">Ajánlott kurzusok</h2>
                  <p className="text-neutral-700 mb-6">
                    Ezek a kurzusok segítenek elsajátítani a {career.title.toLowerCase()} karrierúthoz szükséges kulcsfontosságú készségeket.
                  </p>
                  
                  <RecommendedCourses courseIds={career.recommendedCourses} />
                  
                  <div className="mt-8 text-center">
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                      Összes kapcsolódó kurzus megtekintése
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="market" className="m-0">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">Munkaerőpiaci trendek</h2>
                  <p className="text-neutral-700 mb-6">
                    A {career.title} karrierút iránti kereslet az elmúlt években folyamatosan növekszik. Az alábbi grafikon mutatja a magyarországi pozíciók számának alakulását.
                  </p>
                  
                  <div className="bg-white p-5 rounded-xl border border-neutral-200 mb-8">
                    <h3 className="text-lg font-bold text-neutral-900 mb-3">Álláshelyek számának alakulása</h3>
                    <GrowthChart data={career.yearlyGrowth} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-5 rounded-xl border border-neutral-200">
                      <h3 className="text-lg font-bold text-neutral-900 mb-3">Fizetési tartomány</h3>
                      <p className="text-neutral-600 mb-3">
                        A fizetés a tapasztalattól és a konkrét pozíciótól függően változhat.
                      </p>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-neutral-600">Junior</span>
                            <span className="font-medium text-neutral-800">500,000 - 800,000 Ft/hó</span>
                          </div>
                          <Progress value={30} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-neutral-600">Medior</span>
                            <span className="font-medium text-neutral-800">{career.averageSalary}</span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-neutral-600">Senior</span>
                            <span className="font-medium text-neutral-800">1,200,000 - 1,800,000 Ft/hó</span>
                          </div>
                          <Progress value={90} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-5 rounded-xl border border-neutral-200">
                      <h3 className="text-lg font-bold text-neutral-900 mb-3">Leggyakoribb pozíciók</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center justify-between p-2 rounded hover:bg-neutral-50">
                          <span className="text-neutral-800">Junior {career.title}</span>
                          <Badge>500+ állás</Badge>
                        </li>
                        <li className="flex items-center justify-between p-2 rounded hover:bg-neutral-50">
                          <span className="text-neutral-800">Senior {career.title}</span>
                          <Badge>300+ állás</Badge>
                        </li>
                        <li className="flex items-center justify-between p-2 rounded hover:bg-neutral-50">
                          <span className="text-neutral-800">{career.title} Team Lead</span>
                          <Badge>100+ állás</Badge>
                        </li>
                        <li className="flex items-center justify-between p-2 rounded hover:bg-neutral-50">
                          <span className="text-neutral-800">Freelance {career.title}</span>
                          <Badge>200+ állás</Badge>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 mb-2">Álláskeresési segítség</h3>
                      <p className="text-neutral-600">
                        Személyre szabott álláskeresési tanácsadásunkkal és partneri kapcsolatainkkal segítünk az ideális pozíció megtalálásában.
                      </p>
                    </div>
                    <Button className="whitespace-nowrap bg-primary hover:bg-primary/90 text-white">
                      Karriertanácsadás
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="certifications" className="m-0">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">Ajánlott tanúsítványok</h2>
                  <p className="text-neutral-700 mb-6">
                    Ezek a nemzetközileg elismert tanúsítványok jelentősen növelhetik elhelyezkedési esélyeidet és fizetésedet.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {career.certifications.map((cert: string, idx: number) => (
                      <div key={idx} className="bg-white p-5 rounded-xl border border-neutral-200 flex flex-col">
                        <div className="mb-3">
                          <Award className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 mb-2">{cert}</h3>
                        <p className="text-neutral-600 text-sm flex-grow">
                          Növeld szakmai hitelességedet és tegyél szert értékes készségekre ezzel a tanúsítvánnyal.
                        </p>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-200">
                          <span className="text-sm text-neutral-500">Időtartam: 2-3 hónap</span>
                          <Button variant="outline" size="sm">Részletek</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-xl border border-primary/20">
                    <h3 className="text-lg font-bold text-neutral-900 mb-3">Miért fontosak a tanúsítványok?</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-700">Növelik a versenyelőnyödet az álláspiacon</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-700">Bizonyítják a szakmai tudásodat és elkötelezettségedet</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-700">Átlagosan 15-20%-kal magasabb fizetést eredményezhetnek</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-700">Naprakész, iparági sztenderdeknek megfelelő tudást biztosítanak</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        {/* Related Careers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Kapcsolódó karrierutak</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {careerPaths
              .filter(c => c.category === career.category && c.id !== career.id)
              .slice(0, 3)
              .map((relatedCareer) => (
                <Link key={relatedCareer.id} href={`/career/${relatedCareer.id}`}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-md hover:-translate-y-1 transition-all">
                    <div className="relative h-40">
                      <img 
                        src={relatedCareer.imageUrl} 
                        alt={relatedCareer.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-bold text-white">{relatedCareer.title}</h3>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-sm text-neutral-600">{relatedCareer.averageSalary}</span>
                        </div>
                        <Badge className={
                          careerCategories[relatedCareer.category as keyof typeof careerCategories]?.color || 
                          'bg-neutral-100 text-neutral-800'
                        }>
                          {careerCategories[relatedCareer.category as keyof typeof careerCategories]?.name || relatedCareer.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-primary text-white rounded-xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Indulj el ezen a karrierúton még ma!</h2>
            <p className="text-white/90 mb-8">
              Kezdd el a tanulást a szakértőink által összeállított személyre szabott képzési tervvel, 
              amely segít elsajátítani a {career.title.toLowerCase()} szakmához szükséges készségeket.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-neutral-100">
                Kezdd el most
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                Ingyenes karrierkonzultáció
              </Button>
            </div>
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

export default CareerDetail;