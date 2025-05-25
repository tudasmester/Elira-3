import React, { useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { courses } from "@/data/courses";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronLeft, ChevronRight, BookOpen, Video, FileText, 
  Play, CheckCircle, Clock, Award, HelpCircle, DownloadCloud,
  ClipboardList, BookmarkCheck, BarChart, FileQuestion
} from "lucide-react";

const CourseLearn: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id || "1");
  const [, navigate] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Find the course with the matching ID
  const course = courses.find(course => course.id === courseId);
  
  // Active module and lesson state
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [userProgress, setUserProgress] = useState(0);
  
  // Check if user is enrolled in this course
  const { 
    data: enrollmentData,
    isLoading: isEnrollmentLoading
  } = useQuery({
    queryKey: [`/api/enrollments/check/${courseId}`],
    enabled: isAuthenticated && !!courseId,
    retry: false
  });
  
  const isEnrolled = enrollmentData?.isEnrolled || false;
  
  // If user is not authenticated or not enrolled, redirect to course detail page
  if (!authLoading && (!isAuthenticated || !isEnrolled)) {
    navigate(`/courses/${courseId}`);
    return null;
  }
  
  if (!course) {
    return <div className="max-w-7xl mx-auto py-16 px-4 text-center">Kurzus nem található</div>;
  }
  
  // Course modules and lessons data
  // In a real application, this would come from the API based on the course ID
  const courseModules = [
    {
      id: 1,
      title: "Bevezetés és alapfogalmak",
      description: "A modul áttekintést nyújt a kurzus témájáról és bemutatja az alapvető fogalmakat.",
      lessons: [
        {
          id: 1,
          title: "A terület áttekintése és történelmi fejlődése",
          description: "Ebben a leckében megismerkedünk a terület történelmi fejlődésével és főbb mérföldköveivel.",
          duration: 20,
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          content: `
# A terület áttekintése és történelmi fejlődése

A kurzus első leckéje bemutatja a szakterület kialakulását és fejlődését az elmúlt évtizedekben. Megismerjük azokat a kulcsfontosságú eseményeket és személyeket, amelyek és akik formálták a szakterületet.

## Történelmi fejlődés

A szakterület gyökerei a 20. század közepéig nyúlnak vissza, amikor az első kezdetleges módszerek és elméletek megjelentek. Azóta jelentős fejlődésen ment keresztül, különösen az utóbbi évtizedekben a technológiai fejlődés hatására.

## Kulcsszereplők

Számos kiemelkedő kutató és szakember járult hozzá a terület fejlődéséhez. Munkásságuk ma is alapvető fontosságú a szakterület megértéséhez.

## Gyakorlati alkalmazások

A terület számos gyakorlati alkalmazása forradalmasította a mindennapi életet és a munkát. Ezeket a gyakorlati alkalmazásokat fogjuk részletesen megvizsgálni a kurzus során.
          `
        },
        {
          id: 2,
          title: "Kulcsfogalmak és definíciók tisztázása",
          description: "Ebben a leckében meghatározzuk a terület legfontosabb fogalmait és definícióit.",
          duration: 25,
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          content: `
# Kulcsfogalmak és definíciók tisztázása

Ebben a leckében megismerkedünk a szakterület legfontosabb fogalmaival és definícióival. Ezek a fogalmak alapvető fontosságúak a szakterület megértéséhez és a további leckék elsajátításához.

## Alapfogalmak

A szakterület több alapvető fogalomra épül, amelyek megértése elengedhetetlen a témában való elmélyüléshez. Ezek a fogalmak alkotják a szakterület elméleti alapját.

## Terminológia

A megfelelő szaknyelv ismerete nélkülözhetetlen a hatékony kommunikációhoz és a szakirodalom megértéséhez. Ebben a részben a leggyakrabban használt szakkifejezéseket tisztázzuk.

## Definíciók

A pontos definíciók segítenek elkerülni a félreértéseket és megalapozzák a további tanulmányainkat. Minden definíciót példákkal illusztrálunk a jobb megértés érdekében.
          `
        },
        {
          id: 3,
          title: "A modul gyakorlati alkalmazásai a való életben",
          description: "Ebben a leckében valós példákon keresztül mutatjuk be a terület gyakorlati alkalmazásait.",
          duration: 30,
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          content: `
# A modul gyakorlati alkalmazásai a való életben

Ebben a leckében a szakterület gyakorlati alkalmazásait vizsgáljuk valós példákon keresztül. Megmutatjuk, hogyan alkalmazzák a szakemberek a tanult módszereket és technikákat a mindennapi munkájuk során.

## Esettanulmányok

Több esettanulmányon keresztül bemutatjuk, hogyan alkalmazták sikeresen a módszereket különböző helyzetekben és környezetekben.

## Iparági alkalmazások

A különböző iparágakban más-más módon hasznosítják a szakterület eredményeit. Megvizsgáljuk, hogyan adaptálták a módszereket különböző szektorokban.

## Innovatív megoldások

A szakterület folyamatosan fejlődik, és új, innovatív megoldások jelennek meg. Bemutatjuk a legújabb trendeket és fejlesztéseket.
          `
        }
      ]
    },
    {
      id: 2,
      title: "Alapvető koncepciók és technikák",
      description: "Ebben a modulban megismerkedünk az alapvető technikákkal és módszerekkel.",
      lessons: [
        {
          id: 4,
          title: "Az alapelvek részletes vizsgálata",
          description: "Ebben a leckében részletesen megvizsgáljuk a terület alapelveit.",
          duration: 35,
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          content: `
# Az alapelvek részletes vizsgálata

Ebben a leckében mélyebben megvizsgáljuk a szakterület alapelveit, amelyek meghatározzák a módszerek és technikák alkalmazását.

## Elméleti alapok

Az elméleti alapok megértése elengedhetetlen a gyakorlati alkalmazások sikeres végrehajtásához. Részletesen áttekintjük az elméleti hátteret.

## Alapelvek alkalmazása

Az alapelvek nem önmagukban állnak, hanem egy összefüggő rendszert alkotnak. Megvizsgáljuk, hogyan kapcsolódnak egymáshoz és hogyan támogatják egymást.

## Kritikai értékelés

Nem minden alapelv egyformán érvényes minden helyzetben. Kritikusan értékeljük az alapelveket, és megvizsgáljuk korlátaikat és alkalmazhatóságukat különböző körülmények között.
          `
        },
        {
          id: 5,
          title: "Gyakorlati készségek fejlesztése valós feladatokon",
          description: "Ebben a leckében gyakorlati feladatokon keresztül fejlesztjük készségeinket.",
          duration: 40,
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          content: `
# Gyakorlati készségek fejlesztése valós feladatokon

Ebben a leckében a hangsúlyt a gyakorlati készségek fejlesztésére helyezzük valós feladatokon keresztül. A gyakorlati tapasztalat elengedhetetlen a szakterület professzionális szintű elsajátításához.

## Gyakorlati feladatok

Több gyakorlati feladaton keresztül alkalmazzuk a tanult elméleti ismereteket. Minden feladat egy-egy valós probléma megoldására koncentrál.

## Képességfejlesztés

A rendszeres gyakorlás és a visszajelzések alapján történő korrekció a szakmai fejlődés kulcsa. Bemutatjuk, hogyan építhető fel egy hatékony gyakorlási rutint.

## Projektmunka

A komplex projektek révén fejleszthetjük a problémamegoldó képességünket és a kreativitásunkat. A projektmunka során a teljes folyamatot végigjárjuk a tervezéstől a megvalósításig.
          `
        }
      ]
    },
    {
      id: 3,
      title: "Haladó megközelítések",
      description: "Ebben a modulban haladó technikákat és módszereket sajátítunk el.",
      lessons: [
        {
          id: 6,
          title: "Komplex forgatókönyvek elemzése és megoldása",
          description: "Ebben a leckében komplex problémákat elemzünk és oldunk meg.",
          duration: 45,
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          content: `
# Komplex forgatókönyvek elemzése és megoldása

Ebben a leckében komplex forgatókönyveket és problémákat elemzünk, amelyek több tényező együttes figyelembevételét igénylik. Megtanuljuk, hogyan bonthatók le a komplex problémák kezelhetőbb részekre.

## Rendszerszemlélet

A komplex problémák megértéséhez rendszerszemléletre van szükség. Megvizsgáljuk, hogyan függnek össze a különböző elemek és hogyan hatnak egymásra.

## Elemzési módszerek

Több elemzési módszert mutatunk be, amelyek segítenek a komplex problémák strukturálásában és megértésében. Ezeket a módszereket gyakorlati példákon keresztül illusztráljuk.

## Problémamegoldási stratégiák

A komplex problémák megoldása stratégiai gondolkodást igényel. Bemutatjuk a leghatékonyabb stratégiákat és azok alkalmazási területeit.
          `
        },
        {
          id: 7,
          title: "Speciális technikák és stratégiák",
          description: "Ebben a leckében speciális technikákat és stratégiákat ismerünk meg.",
          duration: 35,
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          content: `
# Speciális technikák és stratégiák

Ebben a leckében olyan speciális technikákat és stratégiákat mutatunk be, amelyek különösen hatékonyak bizonyos típusú problémák megoldásában. Ezek a technikák kiegészítik az alapvető módszereket és bővítik a szakember eszköztárát.

## Innovatív módszerek

Az innovatív módszerek gyakran új perspektívát kínálnak és kreatív megoldásokhoz vezetnek. Bemutatjuk a legújabb innovatív módszereket és alkalmazásukat.

## Adaptív stratégiák

A változó körülményekhez való alkalmazkodás kulcsfontosságú a hosszú távú sikerhez. Megvizsgáljuk, hogyan fejleszthetők ki adaptív stratégiák, amelyek rugalmasan reagálnak a változásokra.

## Hibrid megközelítések

A különböző módszerek és technikák kombinálása gyakran a legjobb megoldásokhoz vezet. Bemutatjuk, hogyan hozhatók létre hatékony hibrid megközelítések, amelyek egyesítik a különböző módszerek előnyeit.
          `
        }
      ]
    }
  ];
  
  // Current active module and lesson
  const activeModule = courseModules[activeModuleIndex];
  const activeLesson = activeModule?.lessons[activeLessonIndex];
  
  // Calculate total lessons for progress bar
  const totalLessons = courseModules.reduce((acc, module) => acc + module.lessons.length, 0);
  
  // Handle module and lesson navigation
  const goToNextLesson = () => {
    // Mark current lesson as completed if not already
    if (!completedLessons.includes(activeLesson.id)) {
      const newCompletedLessons = [...completedLessons, activeLesson.id];
      setCompletedLessons(newCompletedLessons);
      
      // Update progress
      const newProgress = Math.round((newCompletedLessons.length / totalLessons) * 100);
      setUserProgress(newProgress);
    }
    
    // Check if there are more lessons in the current module
    if (activeLessonIndex < activeModule.lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    } else {
      // Move to the next module if available
      if (activeModuleIndex < courseModules.length - 1) {
        setActiveModuleIndex(activeModuleIndex + 1);
        setActiveLessonIndex(0);
      }
    }
  };
  
  const goToPreviousLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(activeLessonIndex - 1);
    } else {
      // Move to the previous module if available
      if (activeModuleIndex > 0) {
        setActiveModuleIndex(activeModuleIndex - 1);
        // Go to the last lesson of the previous module
        setActiveLessonIndex(courseModules[activeModuleIndex - 1].lessons.length - 1);
      }
    }
  };
  
  const goToLesson = (moduleIndex: number, lessonIndex: number) => {
    setActiveModuleIndex(moduleIndex);
    setActiveLessonIndex(lessonIndex);
  };
  
  // Mark lesson as completed
  const markLessonCompleted = () => {
    if (!completedLessons.includes(activeLesson.id)) {
      const newCompletedLessons = [...completedLessons, activeLesson.id];
      setCompletedLessons(newCompletedLessons);
      
      // Update progress
      const newProgress = Math.round((newCompletedLessons.length / totalLessons) * 100);
      setUserProgress(newProgress);
      
      toast({
        title: "Lecke teljesítve",
        description: "Sikeresen teljesítetted ezt a leckét!",
        variant: "default",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Course header */}
      <div className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Button 
                variant="ghost" 
                className="hover:bg-white/10 text-white mb-2 px-0"
                onClick={() => navigate(`/courses/${courseId}`)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Vissza a kurzus oldalára
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
              <div className="flex items-center mt-2">
                <img 
                  src={course.universityLogo} 
                  alt={course.university} 
                  className="h-8 w-8 object-contain bg-white rounded-full mr-2" 
                />
                <span className="text-white/90 text-sm">{course.university}</span>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-64">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/90">Haladás:</span>
                <span className="text-white font-bold">{userProgress}%</span>
              </div>
              <Progress value={userProgress} className="h-2 bg-white/20" />
              <div className="mt-2 text-white/80 text-sm">
                {completedLessons.length} / {totalLessons} lecke teljesítve
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course content */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Module and lesson navigation */}
        <div className="lg:w-1/4 lg:max-w-xs">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm sticky top-8">
            <div className="p-4 border-b border-neutral-200">
              <h2 className="font-bold text-lg text-neutral-800">Kurzus tartalma</h2>
              <p className="text-neutral-500 text-sm mt-1">
                {totalLessons} lecke • {courseModules.length} modul
              </p>
            </div>
            
            <div className="divide-y divide-neutral-100 max-h-[calc(100vh-200px)] overflow-y-auto">
              {courseModules.map((module, moduleIndex) => (
                <div key={module.id} className="p-4">
                  <div className="flex items-center mb-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      module.lessons.every(lesson => completedLessons.includes(lesson.id))
                        ? "bg-green-100 text-green-600"
                        : module.lessons.some(lesson => completedLessons.includes(lesson.id))
                          ? "bg-blue-100 text-blue-600" 
                          : "bg-neutral-100 text-neutral-600"
                    }`}>
                      {module.lessons.every(lesson => completedLessons.includes(lesson.id))
                        ? <CheckCircle className="h-4 w-4" />
                        : moduleIndex + 1
                      }
                    </div>
                    <h3 className="font-medium text-neutral-800">{module.title}</h3>
                  </div>
                  
                  <div className="pl-9 space-y-2">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <button
                        key={lesson.id}
                        onClick={() => goToLesson(moduleIndex, lessonIndex)}
                        className={`flex items-center w-full text-left py-2 px-3 rounded-lg text-sm ${
                          moduleIndex === activeModuleIndex && lessonIndex === activeLessonIndex
                            ? "bg-primary/10 text-primary font-medium"
                            : completedLessons.includes(lesson.id)
                              ? "bg-green-50 text-green-700"
                              : "hover:bg-neutral-50 text-neutral-600"
                        }`}
                      >
                        <div className="mr-2 flex-shrink-0">
                          {completedLessons.includes(lesson.id) 
                            ? <CheckCircle className="h-4 w-4 text-green-500" /> 
                            : <Play className="h-4 w-4" />
                          }
                        </div>
                        <span className="line-clamp-2">{lesson.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main content - Lesson content */}
        <div className="lg:w-3/4">
          {activeLesson && (
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
              {/* Lesson header */}
              <div className="p-6 border-b border-neutral-100">
                <div className="flex items-center text-neutral-500 text-sm mb-2">
                  <span>Modul {activeModuleIndex + 1}</span>
                  <span className="mx-2">•</span>
                  <span>Lecke {activeLessonIndex + 1}</span>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{activeLesson.duration} perc</span>
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold text-neutral-800 mb-3">
                  {activeLesson.title}
                </h1>
                
                <p className="text-neutral-600">
                  {activeLesson.description}
                </p>
              </div>
              
              {/* Lesson tabs - Video, Content, Resources, Quiz */}
              <Tabs defaultValue="content" className="w-full">
                <div className="px-6 border-b border-neutral-100">
                  <TabsList className="grid w-full max-w-lg grid-cols-4 mt-2">
                    <TabsTrigger value="video" className="flex items-center">
                      <Video className="h-4 w-4 mr-2" />
                      Videó
                    </TabsTrigger>
                    <TabsTrigger value="content" className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Anyag
                    </TabsTrigger>
                    <TabsTrigger value="resources" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Források
                    </TabsTrigger>
                    <TabsTrigger value="quiz" className="flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Kvíz
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                {/* Video content */}
                <TabsContent value="video" className="p-6">
                  <div className="aspect-video bg-neutral-900 rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center text-white">
                      <Play className="h-16 w-16 mx-auto mb-4 cursor-pointer hover:text-primary transition-colors" />
                      <p className="max-w-md mx-auto">
                        Itt található a lecke videóanyaga. Kattints a lejátszás gombra a megtekintéshez.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={goToPreviousLesson}
                      disabled={activeModuleIndex === 0 && activeLessonIndex === 0}
                      className="flex items-center"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Előző lecke
                    </Button>
                    
                    <Button 
                      onClick={goToNextLesson}
                      className="flex items-center"
                    >
                      Következő lecke
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </TabsContent>
                
                {/* Lesson content */}
                <TabsContent value="content" className="p-6">
                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ 
                      __html: activeLesson.content
                        .split('\n')
                        .map(line => {
                          if (line.startsWith('# ')) {
                            return `<h1>${line.substring(2)}</h1>`;
                          } else if (line.startsWith('## ')) {
                            return `<h2>${line.substring(3)}</h2>`;
                          } else if (line.startsWith('### ')) {
                            return `<h3>${line.substring(4)}</h3>`;
                          } else if (line.trim() === '') {
                            return '<br />';
                          }
                          return `<p>${line}</p>`;
                        })
                        .join('')
                    }} />
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={goToPreviousLesson}
                      disabled={activeModuleIndex === 0 && activeLessonIndex === 0}
                      className="flex items-center"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Előző lecke
                    </Button>
                    
                    {completedLessons.includes(activeLesson.id) ? (
                      <Button 
                        onClick={goToNextLesson}
                        className="flex items-center"
                      >
                        Következő lecke
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                        onClick={markLessonCompleted}
                        className="flex items-center bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Lecke teljesítése
                      </Button>
                    )}
                  </div>
                </TabsContent>
                
                {/* Resources */}
                <TabsContent value="resources" className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-neutral-800 mb-4">Letölthető anyagok</h3>
                    
                    <div className="space-y-3">
                      {[
                        { title: "Lecke jegyzet", type: "PDF", size: "1.2 MB" },
                        { title: "Gyakorló feladatok", type: "PDF", size: "0.8 MB" },
                        { title: "Esettanulmány", type: "PDF", size: "2.4 MB" }
                      ].map((resource, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between bg-neutral-50 hover:bg-neutral-100 p-4 rounded-lg border border-neutral-200 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="bg-primary/10 p-2 rounded-lg mr-4">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium text-neutral-800">{resource.title}</h4>
                              <p className="text-sm text-neutral-500">{resource.type} • {resource.size}</p>
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="sm" className="flex items-center">
                            <DownloadCloud className="h-4 w-4 mr-2" />
                            Letöltés
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-neutral-800 mb-4">További források</h3>
                    
                    <div className="space-y-3">
                      {[
                        { title: "Szakirodalom - Alapművek", description: "A terület legfontosabb alapművei" },
                        { title: "Kapcsolódó videók", description: "További videók a témában" },
                        { title: "Gyakorlati példák gyűjteménye", description: "Valós példák és esetek gyűjteménye" }
                      ].map((resource, index) => (
                        <div 
                          key={index}
                          className="bg-neutral-50 hover:bg-neutral-100 p-4 rounded-lg border border-neutral-200 transition-colors"
                        >
                          <h4 className="font-medium text-neutral-800">{resource.title}</h4>
                          <p className="text-sm text-neutral-600 mt-1">{resource.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={goToPreviousLesson}
                      disabled={activeModuleIndex === 0 && activeLessonIndex === 0}
                      className="flex items-center"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Előző lecke
                    </Button>
                    
                    <Button 
                      onClick={goToNextLesson}
                      className="flex items-center"
                    >
                      Következő lecke
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </TabsContent>
                
                {/* Quiz */}
                <TabsContent value="quiz" className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-neutral-800 mb-2">Lecke kvíz</h3>
                    <p className="text-neutral-600 mb-6">
                      Teszteld tudásodat az ebben a leckében tanultakból! A teszt teljesítéséhez legalább 70%-os eredmény szükséges.
                    </p>
                    
                    <div className="space-y-6">
                      {[
                        {
                          question: "Mi a terület egyik legfontosabb alapelve?",
                          options: [
                            "A rendszerszemléletű megközelítés",
                            "Az egyéni fejlődés elsőbbsége",
                            "Az elméleti alapok teljes mellőzése",
                            "A történeti szemlélet hiánya"
                          ],
                          correctIndex: 0
                        },
                        {
                          question: "Melyik állítás igaz a tárgyalt módszertanra vonatkozóan?",
                          options: [
                            "Kizárólag elméleti megalapozottsággal rendelkezik",
                            "Nincs gyakorlati alkalmazása",
                            "Ötvözi az elméleti megalapozottságot és a gyakorlati alkalmazhatóságot",
                            "Csak speciális esetekben alkalmazható"
                          ],
                          correctIndex: 2
                        },
                        {
                          question: "Mi jellemzi a terület fejlődését az elmúlt évtizedekben?",
                          options: [
                            "Stagnálás és az érdeklődés csökkenése",
                            "Jelentős fejlődés, különösen a technológiai innovációk hatására",
                            "Teljes elutasítás a szakmai közösség részéről",
                            "A régi módszerekhez való ragaszkodás"
                          ],
                          correctIndex: 1
                        }
                      ].map((quizItem, qIndex) => (
                        <div key={qIndex} className="bg-neutral-50 p-5 rounded-lg border border-neutral-200">
                          <h4 className="font-medium text-neutral-800 mb-4">
                            {qIndex + 1}. {quizItem.question}
                          </h4>
                          
                          <div className="space-y-2">
                            {quizItem.options.map((option, oIndex) => (
                              <div 
                                key={oIndex}
                                className="flex items-center p-3 bg-white hover:bg-neutral-100 rounded-lg border border-neutral-200 cursor-pointer transition-colors"
                              >
                                <div className="w-6 h-6 rounded-full border-2 border-neutral-300 flex items-center justify-center mr-3 flex-shrink-0">
                                  {String.fromCharCode(65 + oIndex)}
                                </div>
                                <span className="text-neutral-700">{option}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4 py-6">
                    <ClipboardList className="h-5 w-5 mr-2" />
                    Válaszok ellenőrzése
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseLearn;