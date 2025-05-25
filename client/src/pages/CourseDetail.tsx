import React, { useState } from "react";
import { useParams, useLocation } from "wouter";
import { courses } from "@/data/courses";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Clock, Users, Award, BookOpen, Star, 
  Check, PlayCircle, Download, GraduationCap, 
  ChevronDown, ChevronRight, Shield, BarChart4, Sparkles, 
  CalendarCheck, MessageCircle, Share2, BookOpenCheck, Eye
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CoursePreviewModal2 from "@/components/CoursePreviewModal2";

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id || "1");
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Find the course with the matching ID
  const course = courses.find(course => course.id === courseId);
  
  // Check if user is enrolled in this course
  interface EnrollmentResponse {
    isEnrolled: boolean;
  }
  
  const { 
    data: enrollmentData,
    isLoading: isEnrollmentLoading
  } = useQuery<EnrollmentResponse>({
    queryKey: [`/api/enrollments/check/${courseId}`],
    enabled: isAuthenticated && !!courseId,
    retry: false
  });
  
  const isEnrolled = enrollmentData?.isEnrolled || false;
  
  // Mutation for enrolling in a course
  const enrollMutation = useMutation({
    mutationFn: () => {
      return fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
        credentials: 'include'
      }).then(res => {
        if (!res.ok) throw new Error('Failed to enroll in course');
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/enrollments/check/${courseId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/enrollments/user'] });
      toast({
        title: "Sikeres beiratkozás",
        description: "Sikeresen beiratkozott a kurzusra.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Hiba történt",
        description: "Nem sikerült beiratkozni a kurzusra. Kérjük, próbálja újra később.",
        variant: "destructive",
      });
      console.error("Error enrolling in course:", error);
    }
  });
  
  // Handle enrollment button click
  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      toast({
        title: "Bejelentkezés szükséges",
        description: "A kurzusra való beiratkozáshoz kérjük, jelentkezzen be.",
        variant: "default",
      });
      navigate("/api/login");
      return;
    }
    
    enrollMutation.mutate();
  };
  
  if (!course) {
    return <div className="max-w-7xl mx-auto py-16 px-4 text-center">Kurzus nem található</div>;
  }

  const courseModules = [
    {
      week: 1,
      title: "Bevezetés és alapfogalmak",
      lessons: 5,
      duration: "1 óra 30 perc",
      topics: [
        "A terület áttekintése és történelmi fejlődése",
        "Kulcsfogalmak és definíciók tisztázása",
        "A modul gyakorlati alkalmazásai a való életben",
        "Problémamegoldási technikák és módszertanok",
        "Esettanulmány elemzés és tanulságok"
      ]
    },
    {
      week: 2,
      title: "Alapvető koncepciók és technikák",
      lessons: 7,
      duration: "2 óra 15 perc",
      topics: [
        "Az alapelvek részletes vizsgálata",
        "Gyakorlati készségek fejlesztése valós feladatokon",
        "Alapvető eszközök és módszerek megismerése",
        "Interaktív problémamegoldási gyakorlatok",
        "A hatékony alkalmazás legjobb gyakorlatai"
      ]
    },
    {
      week: 3,
      title: "Haladó megközelítések",
      lessons: 6,
      duration: "1 óra 45 perc",
      topics: [
        "Komplex forgatókönyvek elemzése és megoldása",
        "Speciális technikák és stratégiák",
        "Csoportos projektmunka és együttműködés",
        "Innovatív módszerek és alkalmazások",
        "Szakértői tippek és trükkök"
      ]
    },
    {
      week: 4,
      title: "Gyakorlati alkalmazások",
      lessons: 8,
      duration: "2 óra 30 perc",
      topics: [
        "Valós esettanulmányok részletes elemzése",
        "Iparág-specifikus alkalmazások és módszerek",
        "Gyakorlati projektek és feladatok",
        "Hatékonyságnövelő technikák",
        "Teljesítményértékelés és visszajelzés"
      ]
    },
    {
      week: 5,
      title: "Esettanulmányok és projektek",
      lessons: 4,
      duration: "3 óra",
      topics: [
        "Átfogó projektfeladat elkészítése",
        "Csoportos értékelés és visszajelzés",
        "A tanultak szintézise és integrálása",
        "Sikeres implementációs stratégiák",
        "Karrierlehetőségek és továbblépési irányok"
      ]
    }
  ];

  const learningOutcomes = [
    "A terület legfontosabb elméleti és gyakorlati alapjainak mély megértése",
    "Valós problémák hatékony és kreatív megoldásának képessége",
    "A legújabb szakmai technikák és módszerek magabiztos alkalmazása",
    "Gyakorlati készségek, amelyek azonnal használhatók a munkahelyen",
    "Világos fogalmi keretek és elméleti alapok elsajátítása",
    "Kritikus gondolkodás és elemzőképesség fejlesztése a szakterületen"
  ];

  const testimonials = [
    {
      name: "Kovács Péter",
      role: "Marketing menedzser",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      rating: 5,
      text: "Ez a kurzus teljesen átalakította a szakmai megközelítésemet. A gyakorlati feladatok és valós példák rendkívül hasznosak voltak. Már az első hét után tudtam alkalmazni a tanultakat a munkámban."
    },
    {
      name: "Szabó Anna",
      role: "Projekt koordinátor",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      rating: 5,
      text: "Kiváló oktatók, kiváló tartalom. A kurzus tökéletes egyensúlyt teremt az elméleti alapok és a gyakorlati alkalmazások között. Minden forintot megért, sőt többet is!"
    }
  ];

  const instructors = [
    {
      name: "Dr. Nagy Zoltán",
      title: "Vezető oktató, Professzor",
      bio: "Dr. Nagy Zoltán több mint 15 éves tapasztalattal rendelkezik a területen, és számos nemzetközileg elismert publikáció szerzője. Kutatási területei közé tartozik a módszertan fejlesztése és az innovatív oktatási technikák.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
    },
    {
      name: "Dr. Kovács Eszter",
      title: "Társoktató, Adjunktus",
      bio: "Dr. Kovács Eszter kutatási területe a modern módszertanok alkalmazása. Korábban vezető pozíciókat töltött be az iparágban, így egyedülálló rálátást nyújt a gyakorlati alkalmazásokra és a legújabb trendekre.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
    }
  ];

  const toggleModule = (index: number) => {
    if (expandedModule === index) {
      setExpandedModule(null);
    } else {
      setExpandedModule(index);
    }
  };

  const renderRatingStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
      />
    ));
  };

  return (
    <div className="bg-white">
      {/* Hero Section with Video Preview */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary overflow-hidden">
          <div className="absolute inset-0 bg-black/50"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30" 
            style={{ backgroundImage: `url(${course.imageUrl})` }}
          ></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
            <div className="md:w-1/2">
              <Link href="/">
                <Button variant="ghost" className="text-white hover:bg-white/20 mb-6 px-0">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Vissza a kurzusokhoz
                </Button>
              </Link>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="bg-primary-foreground text-primary mb-4">{course.category}</Badge>
                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
                  {course.title}
                </h1>
                
                <p className="text-white/90 text-lg md:text-xl mb-6 leading-relaxed">
                  {course.description}
                </p>
                
                <div className="flex items-center space-x-1 mb-6">
                  {renderRatingStars(4.8)}
                  <span className="text-white ml-2 font-medium">4.8</span>
                  <span className="text-white/70 ml-2">(1,284 értékelés)</span>
                </div>
                
                <div className="flex items-center mb-8">
                  <div className="bg-white p-2 rounded-full mr-3">
                    <img 
                      src={course.universityLogo} 
                      alt={course.university} 
                      className="h-10 w-10 object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-white font-medium">{course.university}</span>
                    <p className="text-white/70 text-sm">Hivatalos tanúsítvánnyal</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Clock className="h-5 w-5 mr-2 text-white/80" />
                    <span className="text-white">6-8 hét</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Users className="h-5 w-5 mr-2 text-white/80" />
                    <span className="text-white">152,483 tanuló</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Award className="h-5 w-5 mr-2 text-white/80" />
                    <span className="text-white">{course.level}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.03 }} 
                    whileTap={{ scale: 0.97 }}
                    className="flex-1"
                  >
                    <Button 
                      className="w-full bg-white hover:bg-white/90 text-primary py-6 text-lg font-medium shadow-lg"
                      onClick={handleEnrollClick}
                      disabled={enrollMutation.isPending || (!isAuthenticated && authLoading) || isEnrolled}
                    >
                      {enrollMutation.isPending ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-2">
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                          Beiratkozás...
                        </span>
                      ) : (
                        <>
                          <PlayCircle className="h-5 w-5 mr-2" />
                          {isEnrolled ? "Folytatás a tanfolyammal" : "Kezdje el ma"}
                        </>
                      )}
                    </Button>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.03 }} 
                    whileTap={{ scale: 0.97 }}
                    className="flex-1"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full border-white text-white hover:bg-white/20 py-6 text-lg font-medium"
                      onClick={() => setIsPreviewOpen(true)}
                    >
                      <Eye className="h-5 w-5 mr-2" />
                      Előnézet megtekintése
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:w-1/2 bg-gradient-to-tr from-black/20 to-black/40 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/20"
            >
              <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                <img 
                  src={course.imageUrl} 
                  alt={course.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-white/20 backdrop-blur-md p-4 rounded-full cursor-pointer"
                  >
                    <PlayCircle className="h-16 w-16 text-white" />
                  </motion.div>
                </div>
                {course.tags && course.tags.length > 0 && (
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <Badge key={index} className="bg-black/60 text-white backdrop-blur-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-white">
                      {course.isFree ? "Ingyenes" : "38,000 Ft"}
                    </span>
                    {!course.isFree && (
                      <span className="text-white/60 ml-2 line-through">54,000 Ft</span>
                    )}
                  </div>
                  {!course.isFree && (
                    <Badge className="bg-white/20 text-white">30% kedvezmény</Badge>
                  )}
                </div>
                
                <ul className="space-y-3 mb-5">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Teljes hozzáférés minden tananyaghoz</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">30+ gyakorlati feladat és projekt</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Életre szóló hozzáférés frissítésekkel</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Hivatalos tanúsítvány sikeres elvégzéskor</span>
                  </li>
                </ul>
                
                <div className="flex items-center justify-center gap-2 mb-5">
                  <Shield className="h-5 w-5 text-white/80" />
                  <span className="text-white/80 text-sm">30 napos pénzvisszafizetési garancia</span>
                </div>
                
                {isEnrolled && (
                  <div className="bg-green-500/20 backdrop-blur-sm p-4 rounded-lg border border-green-500/30 mb-5">
                    <div className="flex items-center">
                      <BookOpenCheck className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-white font-medium">Már beiratkozott erre a kurzusra</span>
                    </div>
                  </div>
                )}
                
                <motion.div 
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.97 }}
                >
                  {isEnrolled ? (
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-medium shadow-xl"
                      onClick={() => navigate("/dashboard")}
                    >
                      <BookOpenCheck className="h-5 w-5 mr-2" />
                      Folytatás a tanfolyammal
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-primary-foreground hover:bg-primary-foreground/90 text-primary py-6 text-lg font-medium shadow-xl"
                      onClick={handleEnrollClick}
                      disabled={enrollMutation.isPending || (!isAuthenticated && authLoading)}
                    >
                      {enrollMutation.isPending ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-2">
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                          Beiratkozás...
                        </span>
                      ) : (
                        <>Iratkozzon fel most</>
                      )}
                    </Button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Course Navigation Tabs */}
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto space-x-8 py-4">
            {[
              { id: "overview", label: "Áttekintés" },
              { id: "content", label: "Tananyag" },
              { id: "instructors", label: "Oktatók" },
              { id: "reviews", label: "Értékelések" },
              { id: "faq", label: "GYIK" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-medium text-lg whitespace-nowrap pb-2 px-1 border-b-2 ${
                  activeTab === tab.id 
                    ? "border-primary text-primary" 
                    : "border-transparent text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-16">
          <div className="lg:col-span-2">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                >
                  <div className="flex items-center mb-4">
                    <Sparkles className="h-6 w-6 text-primary mr-3" />
                    <h2 className="text-2xl font-bold text-neutral-800">Kiemelések</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {course.highlights ? (
                      course.highlights.map((item, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start bg-neutral-50 p-4 rounded-lg border border-neutral-100"
                        >
                          <div className="bg-primary/10 rounded-full p-2 text-primary mr-3 flex-shrink-0">
                            <Check className="h-5 w-5" />
                          </div>
                          <p className="text-neutral-700">{item}</p>
                        </motion.div>
                      ))
                    ) : (
                      learningOutcomes.map((item, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start bg-neutral-50 p-4 rounded-lg border border-neutral-100"
                        >
                          <div className="bg-primary/10 rounded-full p-2 text-primary mr-3 flex-shrink-0">
                            <Check className="h-5 w-5" />
                          </div>
                          <p className="text-neutral-700">{item}</p>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-12"
                >
                  <div className="flex items-center mb-6">
                    <BarChart4 className="h-6 w-6 text-primary mr-3" />
                    <h2 className="text-2xl font-bold text-neutral-800">Kurzus statisztikák</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Összesen", value: "11 óra", icon: <Clock className="h-8 w-8 text-primary" /> },
                      { label: "Modulok", value: "5 hét", icon: <CalendarCheck className="h-8 w-8 text-primary" /> },
                      { label: "Tanulók", value: "152,483", icon: <Users className="h-8 w-8 text-primary" /> },
                      { label: "Értékelés", value: "4.8/5", icon: <Star className="h-8 w-8 text-primary fill-primary" /> }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="bg-white p-5 rounded-lg border border-neutral-100 shadow-sm flex flex-col items-center justify-center text-center"
                      >
                        <div className="mb-3">
                          {stat.icon}
                        </div>
                        <p className="text-neutral-500 text-sm mb-1">{stat.label}</p>
                        <p className="text-neutral-900 font-bold text-xl">{stat.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-12"
                >
                  <div className="flex items-center mb-6">
                    <MessageCircle className="h-6 w-6 text-primary mr-3" />
                    <h2 className="text-2xl font-bold text-neutral-800">Amit mások mondanak</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {testimonials.map((testimonial, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm"
                      >
                        <div className="flex items-center mb-4">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name} 
                            className="w-12 h-12 rounded-full object-cover mr-4"
                          />
                          <div>
                            <p className="font-medium text-neutral-900">{testimonial.name}</p>
                            <p className="text-neutral-500 text-sm">{testimonial.role}</p>
                          </div>
                          <div className="ml-auto flex">
                            {renderRatingStars(testimonial.rating)}
                          </div>
                        </div>
                        <p className="text-neutral-700 italic">"{testimonial.text}"</p>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                      Összes értékelés megtekintése (1,284)
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === "content" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <BookOpen className="h-6 w-6 text-primary mr-3" />
                    <h2 className="text-2xl font-bold text-neutral-800">A kurzus tartalma</h2>
                  </div>
                  <div className="text-neutral-700">
                    <span className="font-medium">30 lecke</span> • <span>11 óra</span>
                  </div>
                </div>
                
                <div className="space-y-4 mb-12">
                  {courseModules.map((module, index) => (
                    <div 
                      key={index} 
                      className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm bg-white"
                    >
                      <div 
                        className={`flex justify-between items-center p-5 cursor-pointer hover:bg-neutral-50 transition-colors ${
                          expandedModule === index ? "bg-neutral-50" : ""
                        }`}
                        onClick={() => toggleModule(index)}
                      >
                        <div className="flex items-center">
                          <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-primary font-bold mr-4 flex-shrink-0">
                            {module.week}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-neutral-800">{module.title}</h3>
                            <div className="text-sm text-neutral-600 mt-1">
                              {module.lessons} lecke • {module.duration}
                            </div>
                          </div>
                        </div>
                        <div>
                          {expandedModule === index ? 
                            <ChevronDown className="h-6 w-6 text-neutral-500" /> : 
                            <ChevronRight className="h-6 w-6 text-neutral-500" />
                          }
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {expandedModule === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden border-t border-neutral-200"
                          >
                            <div className="p-5 bg-neutral-50">
                              <div className="space-y-4">
                                {module.topics.map((topic, i) => (
                                  <div key={i} className="flex items-center">
                                    <div className="text-primary mr-3 flex-shrink-0">
                                      <PlayCircle className="h-5 w-5" />
                                    </div>
                                    <div>
                                      <p className="text-neutral-800">Lecke {i + 1}: {topic}</p>
                                      <p className="text-xs text-neutral-500 mt-1">
                                        {Math.floor(10 + Math.random() * 20)} perc
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Instructors Tab */}
            {activeTab === "instructors" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center mb-6">
                  <Award className="h-6 w-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-neutral-800">Szakértő oktatók</h2>
                </div>
                
                <div className="space-y-8">
                  {instructors.map((instructor, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm flex flex-col md:flex-row gap-6"
                    >
                      <div className="md:w-1/4 flex justify-center">
                        <img 
                          src={instructor.image} 
                          alt={instructor.name} 
                          className="w-40 h-40 rounded-full object-cover"
                        />
                      </div>
                      <div className="md:w-3/4">
                        <h3 className="text-xl font-bold text-neutral-800 mb-1">{instructor.name}</h3>
                        <p className="text-primary font-medium mb-4">{instructor.title}</p>
                        <p className="text-neutral-700 leading-relaxed mb-4">{instructor.bio}</p>
                        <div className="flex gap-4">
                          <Button variant="outline" size="sm" className="rounded-full">
                            <Share2 className="h-4 w-4 mr-2" />
                            Kapcsolat
                          </Button>
                          <Button variant="ghost" size="sm" className="text-primary rounded-full">
                            További információ
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews Tab Content */}
            {activeTab === "reviews" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center mb-6">
                  <Star className="h-6 w-6 text-primary mr-3 fill-primary" />
                  <h2 className="text-2xl font-bold text-neutral-800">Hallgatói értékelések</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <div className="md:col-span-1 bg-white p-6 rounded-xl border border-neutral-100 shadow-sm flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-neutral-800 mb-2">4.8</div>
                    <div className="flex mb-4">
                      {renderRatingStars(5)}
                    </div>
                    <p className="text-neutral-600">Kurzus értékelés</p>
                  </div>
                  
                  <div className="md:col-span-2 bg-white p-6 rounded-xl border border-neutral-100 shadow-sm">
                    <h3 className="font-medium mb-4">Értékelések eloszlása</h3>
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center mb-2">
                        <div className="flex items-center w-24">
                          {renderRatingStars(rating)}
                        </div>
                        <div className="w-full ml-4">
                          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ 
                                width: `${rating === 5 ? 78 : rating === 4 ? 15 : rating === 3 ? 5 : rating === 2 ? 1.5 : 0.5}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-4 w-12 text-right text-neutral-600 text-sm">
                          {rating === 5 ? '78%' : rating === 4 ? '15%' : rating === 3 ? '5%' : rating === 2 ? '1.5%' : '0.5%'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6 mb-10">
                  {[...testimonials, ...testimonials].slice(0, 4).map((testimonial, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm"
                    >
                      <div className="flex items-center mb-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        <div>
                          <p className="font-medium text-neutral-900">{testimonial.name}</p>
                          <p className="text-neutral-500 text-sm">{testimonial.role}</p>
                        </div>
                        <div className="ml-auto flex">
                          {renderRatingStars(testimonial.rating)}
                        </div>
                      </div>
                      <p className="text-neutral-700 mb-3">{testimonial.text}</p>
                      <p className="text-neutral-500 text-sm">Közzétéve: 2023. szeptember 15.</p>
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-center">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Több értékelés betöltése
                  </Button>
                </div>
              </motion.div>
            )}

            {/* FAQ Tab Content */}
            {activeTab === "faq" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center mb-6">
                  <MessageCircle className="h-6 w-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold text-neutral-800">Gyakran Ismételt Kérdések</h2>
                </div>
                
                <div className="space-y-4 mb-10">
                  {[
                    {
                      question: "Mikor férhetek hozzá a kurzushoz a beiratkozás után?",
                      answer: "A beiratkozás után azonnal hozzáférhet a teljes kurzushoz. Minden tananyag, videó és letölthető erőforrás elérhető lesz az Ön számára."
                    },
                    {
                      question: "Mennyi ideig férhetek hozzá a kurzushoz?",
                      answer: "A kurzushoz való hozzáférés korlátlan időtartamú. Beiratkozás után életre szóló hozzáférést kap, beleértve az összes jövőbeli frissítést és kiegészítést is."
                    },
                    {
                      question: "Kapok tanúsítványt a kurzus elvégzése után?",
                      answer: "Igen, a kurzus sikeres elvégzése után hivatalos tanúsítványt kap, amelyet megoszthat a LinkedInen vagy csatolhat az önéletrajzához. Ez a tanúsítvány igazolja a megszerzett készségeket és ismereteket."
                    },
                    {
                      question: "Milyen előfeltételek szükségesek a kurzushoz?",
                      answer: "A kurzushoz alapvető témaismeretek és számítógépes jártasság szükséges. Minden egyéb szükséges háttérismeretet a kurzus során biztosítunk, így kezdők számára is ajánlott."
                    },
                    {
                      question: "Mi a pénzvisszafizetési garancia feltétele?",
                      answer: "A vásárlástól számított 30 napon belül 100%-os pénzvisszafizetési garanciát biztosítunk, ha a kurzus nem felel meg az elvárásainak. Egyszerűen vegye fel a kapcsolatot az ügyfélszolgálatunkkal, és visszatérítjük a teljes összeget."
                    }
                  ].map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm"
                    >
                      <h3 className="font-bold text-lg text-neutral-800 mb-3">{faq.question}</h3>
                      <p className="text-neutral-700">{faq.answer}</p>
                    </motion.div>
                  ))}
                </div>
                
                <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                  <h3 className="font-bold text-lg text-primary mb-3">További kérdése van?</h3>
                  <p className="text-neutral-700 mb-4">
                    Ha nem találja a választ a kérdésére, vegye fel a kapcsolatot oktatói csapatunkkal, akik készséggel állnak rendelkezésére.
                  </p>
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Kapcsolatfelvétel
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm mb-6"
              >
                <h3 className="text-lg font-bold mb-4 text-neutral-800">Kurzus összefoglaló</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Nyelv</span>
                    <span className="font-medium text-neutral-800">Magyar</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Feliratok</span>
                    <span className="font-medium text-neutral-800">Magyar, Angol</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Szint</span>
                    <span className="font-medium text-neutral-800">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Időigény</span>
                    <span className="font-medium text-neutral-800">6-8 hét, heti 4-6 óra</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Tanúsítvány</span>
                    <span className="font-medium text-neutral-800">Igen, átvihető</span>
                  </div>
                </div>
                
                <div className="border-t border-neutral-200 pt-4">
                  <h4 className="font-medium mb-3 text-neutral-800">
                    A kurzus tartalmaz:
                  </h4>
                  <ul className="space-y-2">
                    {[
                      { icon: <PlayCircle className="h-4 w-4" />, text: "11 óra on-demand videó" },
                      { icon: <BookOpen className="h-4 w-4" />, text: "30 lecke 5 modulban" },
                      { icon: <Download className="h-4 w-4" />, text: "15 letölthető erőforrás" },
                      { icon: <GraduationCap className="h-4 w-4" />, text: "Befejeztési tanúsítvány" },
                      { icon: <Clock className="h-4 w-4" />, text: "Korlátlan hozzáférés" }
                    ].map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-primary mr-3">{item.icon}</span>
                        <span className="text-neutral-700">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm mb-6"
              >
                <h3 className="text-lg font-bold mb-4 text-neutral-800">
                  <div className="flex items-center">
                    <Share2 className="h-5 w-5 text-primary mr-2" />
                    Ossza meg a kurzust
                  </div>
                </h3>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Twitter
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-primary to-primary/80 p-6 rounded-xl text-white shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 mr-3" />
                  <h3 className="text-lg font-bold">Csatlakozzon ma</h3>
                </div>
                
                <p className="mb-4 text-white/90">
                  Csatlakozzon több mint 150,000 tanulóhoz, akik már fejlesztik készségeiket ezzel a kurzussal!
                </p>
                
                <motion.div 
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.97 }}
                >
                  <Button className="w-full bg-white text-primary hover:bg-white/90 font-medium">
                    Iratkozzon fel most
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Preview Modal */}
      {course && (
        <CoursePreviewModal2
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          course={course}
        />
      )}
    </div>
  );
};

export default CourseDetail;