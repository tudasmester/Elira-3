import React, { useState } from "react";
import { useParams, Link as RouterLink } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Star,
  Award,
  Book,
  BookOpen,
  GraduationCap,
  Briefcase,
  Building,
  Share2,
  Download,
  FileText,
  BarChart3,
  BrainCircuit,
  LayoutGrid,
  MoveRight,
  CheckCircle,
  LucideIcon,
} from "lucide-react";
import { degrees } from "@/data/degrees";
import { universities } from "@/data/universities";

// Define degree levels for display
const degreeLevels = [
  { name: "Alapképzés (BA/BSc)", slug: "bachelor" },
  { name: "Mesterképzés (MA/MSc)", slug: "master" },
  { name: "Doktori képzés (PhD)", slug: "phd" },
  { name: "Szakirányú továbbképzés", slug: "specialization" },
  { name: "Felsőoktatási szakképzés", slug: "advanced-vocational" }
];

// Define career paths based on degree type
const careerPaths = {
  "bachelor": [
    { title: "Rendszermérnök", salary: "600,000 - 900,000 Ft/hó", icon: <LayoutGrid className="h-5 w-5 text-primary" /> },
    { title: "Junior fejlesztő", salary: "550,000 - 800,000 Ft/hó", icon: <FileText className="h-5 w-5 text-primary" /> },
    { title: "Üzleti elemző", salary: "500,000 - 750,000 Ft/hó", icon: <BarChart3 className="h-5 w-5 text-primary" /> },
    { title: "IT projektmenedzser", salary: "700,000 - 1,000,000 Ft/hó", icon: <LayoutGrid className="h-5 w-5 text-primary" /> }
  ],
  "master": [
    { title: "Senior adattudós", salary: "900,000 - 1,400,000 Ft/hó", icon: <BrainCircuit className="h-5 w-5 text-primary" /> },
    { title: "IT vezető", salary: "1,200,000 - 1,800,000 Ft/hó", icon: <Building className="h-5 w-5 text-primary" /> },
    { title: "Kutatásfejlesztési szakértő", salary: "800,000 - 1,300,000 Ft/hó", icon: <Book className="h-5 w-5 text-primary" /> },
    { title: "Vállalati stratégiai tanácsadó", salary: "1,000,000 - 1,500,000 Ft/hó", icon: <Briefcase className="h-5 w-5 text-primary" /> }
  ],
  "phd": [
    { title: "Egyetemi oktató", salary: "800,000 - 1,200,000 Ft/hó", icon: <GraduationCap className="h-5 w-5 text-primary" /> },
    { title: "Kutatásvezető", salary: "1,200,000 - 2,000,000 Ft/hó", icon: <Book className="h-5 w-5 text-primary" /> },
    { title: "Innovációs igazgató", salary: "1,500,000 - 2,500,000 Ft/hó", icon: <BrainCircuit className="h-5 w-5 text-primary" /> },
    { title: "Nemzetközi tanácsadó", salary: "1,800,000 - 3,000,000 Ft/hó", icon: <Building className="h-5 w-5 text-primary" /> }
  ],
  "specialization": [
    { title: "Szakmai projektmenedzser", salary: "700,000 - 1,100,000 Ft/hó", icon: <LayoutGrid className="h-5 w-5 text-primary" /> },
    { title: "Területi vezető", salary: "800,000 - 1,300,000 Ft/hó", icon: <Building className="h-5 w-5 text-primary" /> },
    { title: "Agilis coach", salary: "900,000 - 1,400,000 Ft/hó", icon: <Users className="h-5 w-5 text-primary" /> }
  ],
  "advanced-vocational": [
    { title: "Asszisztens", salary: "400,000 - 600,000 Ft/hó", icon: <FileText className="h-5 w-5 text-primary" /> },
    { title: "Adminisztratív vezető", salary: "450,000 - 700,000 Ft/hó", icon: <LayoutGrid className="h-5 w-5 text-primary" /> },
    { title: "Ügyfélkapcsolati munkatárs", salary: "380,000 - 580,000 Ft/hó", icon: <Users className="h-5 w-5 text-primary" /> }
  ]
};

// Mock testimonials data
const testimonials = [
  {
    id: 1,
    name: "Nagy Péter",
    role: "Végzett hallgató, jelenleg: Senior fejlesztő",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    comment: "A képzés gyakorlatorientált megközelítése lehetővé tette számomra, hogy valós projekteken dolgozzak már az egyetem alatt. A megszerzett készségeket közvetlenül tudtam alkalmazni a munkahelyemen.",
    rating: 5
  },
  {
    id: 2,
    name: "Kovács Eszter",
    role: "Végzett hallgató, jelenleg: Adatelemző",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    comment: "Kiváló alapokat kaptam az adatelemzéshez és a mesterséges intelligencia alkalmazásához. Az oktatók szakmai felkészültsége és támogatása kiemelkedő volt az egész képzés során.",
    rating: 5
  },
  {
    id: 3,
    name: "Tóth Gábor",
    role: "Jelenlegi hallgató, 4. félév",
    avatar: "https://randomuser.me/api/portraits/men/62.jpg",
    comment: "Az online kurzusok rugalmassága lehetővé teszi számomra, hogy munka mellett is eredményesen tanuljak. A szakmai közösség és a networking lehetőségek különösen értékesek.",
    rating: 4
  }
];

// Mock program structure
const programStructure = [
  {
    id: "year-1",
    title: "1. év",
    semesters: [
      {
        id: "semester-1",
        title: "1. félév",
        courses: [
          { name: "Bevezetés a szakterületbe", credits: 5, type: "Kötelező" },
          { name: "Alapozó matematika", credits: 6, type: "Kötelező" },
          { name: "Programozási alapok", credits: 7, type: "Kötelező" },
          { name: "Szakmai angol", credits: 4, type: "Kötelező" },
          { name: "Digitális eszközök", credits: 4, type: "Kötelező" }
        ]
      },
      {
        id: "semester-2",
        title: "2. félév",
        courses: [
          { name: "Adatstruktúrák és algoritmusok", credits: 7, type: "Kötelező" },
          { name: "Objektumorientált programozás", credits: 6, type: "Kötelező" },
          { name: "Adatbázisrendszerek", credits: 5, type: "Kötelező" },
          { name: "Operációs rendszerek", credits: 4, type: "Kötelező" },
          { name: "Statisztika és valószínűségszámítás", credits: 5, type: "Kötelező" }
        ]
      }
    ]
  },
  {
    id: "year-2",
    title: "2. év",
    semesters: [
      {
        id: "semester-3",
        title: "3. félév",
        courses: [
          { name: "Szoftvertechnológia", credits: 6, type: "Kötelező" },
          { name: "Hálózatok", credits: 5, type: "Kötelező" },
          { name: "Mesterséges intelligencia alapjai", credits: 6, type: "Kötelező" },
          { name: "Webes technológiák", credits: 5, type: "Kötelező" },
          { name: "Számításelmélet", credits: 4, type: "Kötelező" }
        ]
      },
      {
        id: "semester-4",
        title: "4. félév",
        courses: [
          { name: "Adatbányászat", credits: 6, type: "Kötelező" },
          { name: "Gépi tanulás", credits: 6, type: "Kötelező" },
          { name: "Felhő alapú rendszerek", credits: 5, type: "Kötelező" },
          { name: "Szakterületi választható tárgy I.", credits: 4, type: "Választható" },
          { name: "Szakterületi választható tárgy II.", credits: 4, type: "Választható" }
        ]
      }
    ]
  },
  {
    id: "year-3",
    title: "3. év",
    semesters: [
      {
        id: "semester-5",
        title: "5. félév",
        courses: [
          { name: "Komplex projektmunka", credits: 10, type: "Kötelező" },
          { name: "Informatikai rendszerek", credits: 5, type: "Kötelező" },
          { name: "Szakdolgozati szeminárium I.", credits: 5, type: "Kötelező" },
          { name: "Szakterületi választható tárgy III.", credits: 4, type: "Választható" },
          { name: "Szakterületi választható tárgy IV.", credits: 4, type: "Választható" }
        ]
      },
      {
        id: "semester-6",
        title: "6. félév",
        courses: [
          { name: "Szakmai gyakorlat", credits: 15, type: "Kötelező" },
          { name: "Szakdolgozati szeminárium II.", credits: 10, type: "Kötelező" },
          { name: "Szakterületi választható tárgy V.", credits: 4, type: "Választható" }
        ]
      }
    ]
  }
];

// Mock admission requirements
const admissionRequirements = {
  bachelor: [
    { requirement: "Érettségi bizonyítvány", description: "Sikeres középiskolai érettségi" },
    { requirement: "Felvételi pontszám", description: "Minimum 280 pont a 500 pontos rendszerben" },
    { requirement: "Nyelvi követelmény", description: "Középfokú angol nyelvvizsga ajánlott" },
    { requirement: "Emelt szintű érettségi", description: "Matematika vagy informatika tárgyból előnyt jelent" }
  ],
  master: [
    { requirement: "BSc/BA diploma", description: "Kapcsolódó területen szerzett alapdiploma" },
    { requirement: "Átlag", description: "Minimum 3.0 GPA (4.0-es skálán) az alapképzésen" },
    { requirement: "Nyelvi követelmény", description: "B2 szintű angol nyelvtudás igazolása" },
    { requirement: "Motivációs levél", description: "A szakmai célok és motiváció bemutatása" },
    { requirement: "Szakmai önéletrajz", description: "Korábbi tanulmányok és tapasztalatok részletezése" }
  ],
  phd: [
    { requirement: "Mesterdiploma", description: "Kapcsolódó területen szerzett mesterdiploma" },
    { requirement: "Kutatási terv", description: "Részletes kutatási terv benyújtása" },
    { requirement: "Publikációk", description: "Korábbi publikációk vagy kutatási tapasztalat" },
    { requirement: "Szakmai ajánlások", description: "Két akadémiai ajánlás korábbi oktatóktól" },
    { requirement: "Nyelvi követelmény", description: "C1 szintű angol nyelvtudás igazolása" },
    { requirement: "Felvételi interjú", description: "Személyes interjú a potenciális témavezetővel" }
  ],
  specialization: [
    { requirement: "Felsőfokú végzettség", description: "Bármely területen szerzett felsőfokú végzettség" },
    { requirement: "Szakmai tapasztalat", description: "Legalább 2 év kapcsolódó szakmai tapasztalat" },
    { requirement: "Motivációs levél", description: "A szakmai célok és motiváció bemutatása" }
  ],
  "advanced-vocational": [
    { requirement: "Érettségi bizonyítvány", description: "Sikeres középiskolai érettségi" },
    { requirement: "Felvételi beszélgetés", description: "Rövid szakmai orientációs beszélgetés" },
    { requirement: "Jelentkezési lap", description: "Kitöltött és határidőre beadott jelentkezési lap" }
  ]
};

// Custom hook for rendering stars
const useStarRating = () => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return renderStars;
};

const DegreeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const degreeId = parseInt(id || "1");
  const [activeTab, setActiveTab] = useState("overview");
  const renderStars = useStarRating();
  
  // Find the degree and related university
  const degree = degrees.find(d => d.id === degreeId);
  const university = degree ? universities.find(u => u.id === degree.universityId) : null;
  
  // If degree not found, show error message
  if (!degree || !university) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center p-8 rounded-lg bg-white shadow-sm border border-neutral-100 max-w-lg">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">Diploma program nem található</h1>
          <p className="text-neutral-600 mb-6">
            A keresett diplomaprogram nem található vagy eltávolításra került.
          </p>
          <RouterLink href="/degrees">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Vissza az összes programhoz
            </Button>
          </RouterLink>
        </div>
      </div>
    );
  }

  // Get degree level name
  const degreeLevel = degreeLevels.find(level => level.slug === degree.level)?.name;
  
  // Get career options based on degree level
  const careerOptions = careerPaths[degree.level as keyof typeof careerPaths] || [];
  
  // Get admission requirements based on degree level
  const admissionReqs = admissionRequirements[degree.level as keyof typeof admissionRequirements] || [];

  return (
    <div className="bg-gradient-to-b from-neutral-50 to-white min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${degree.imageUrl})`, opacity: 0.7 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-7xl mx-auto px-4 py-12 text-white">
            <div className="mb-4">
              <RouterLink href="/degrees">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Vissza az összes diplomához
                </Button>
              </RouterLink>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white rounded-full p-1 flex-shrink-0">
                <img 
                  src={university.logoUrl} 
                  alt={university.name} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-medium text-white/90">{university.name}</h3>
                <div className="flex items-center">
                  {renderStars(degree.rating)}
                  <span className="ml-2 text-white/90">{degree.rating} / 5.0 ({degree.studentCount} hallgató)</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight max-w-4xl">
              {degree.name}
            </h1>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <Badge 
                className={`
                  ${degree.level === 'bachelor' ? 'bg-blue-500' : ''}
                  ${degree.level === 'master' ? 'bg-purple-500' : ''}
                  ${degree.level === 'phd' ? 'bg-orange-500' : ''}
                  ${degree.level === 'specialization' ? 'bg-green-500' : ''}
                  ${degree.level === 'advanced-vocational' ? 'bg-cyan-500' : ''}
                  text-white px-3 py-1 text-sm
                `}
              >
                <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
                {degreeLevel}
              </Badge>
              
              <Badge className="bg-white/20 text-white px-3 py-1 text-sm">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                {degree.duration}
              </Badge>
              
              <Badge className="bg-white/20 text-white px-3 py-1 text-sm">
                <Award className="h-3.5 w-3.5 mr-1.5" />
                {degree.credits} kredit
              </Badge>
              
              <Badge className="bg-white/20 text-white px-3 py-1 text-sm">
                <Users className="h-3.5 w-3.5 mr-1.5" />
                {degree.studentCount} hallgató
              </Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-primary hover:bg-primary/90 text-white py-6 font-medium text-lg">
                Jelentkezés most
              </Button>
              <Button variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 py-6 font-medium text-lg">
                Tanácsadás kérése
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start mb-8 overflow-x-auto flex-nowrap">
                <TabsTrigger value="overview" className="px-5">Áttekintés</TabsTrigger>
                <TabsTrigger value="curriculum" className="px-5">Tanterv</TabsTrigger>
                <TabsTrigger value="admissions" className="px-5">Felvételi</TabsTrigger>
                <TabsTrigger value="career" className="px-5">Karrierlehetőségek</TabsTrigger>
                <TabsTrigger value="testimonials" className="px-5">Vélemények</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab Content */}
              <TabsContent value="overview" className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white p-8 rounded-xl border border-neutral-100 shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-neutral-800 mb-4">A programról</h2>
                  <p className="text-neutral-700 mb-6 text-lg leading-relaxed">
                    {degree.description}
                  </p>
                  
                  <h3 className="text-xl font-bold text-neutral-800 mb-4">Főbb tantárgyak</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {degree.subjects.map((subject, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-700">{subject}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold text-neutral-800 mb-4">Mit kínálunk?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-3 rounded-lg mr-4">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-800 mb-1">Gyakorlatorientált képzés</h4>
                        <p className="text-neutral-600 text-sm">Valós projektek és esettanulmányok a munkaerőpiaci felkészüléshez</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-3 rounded-lg mr-4">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-800 mb-1">Elismert oktatók</h4>
                        <p className="text-neutral-600 text-sm">Szakmailag elismert, tapasztalt oktatói gárda</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-3 rounded-lg mr-4">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-800 mb-1">Karriertámogatás</h4>
                        <p className="text-neutral-600 text-sm">Állásbörzék, karriertanácsadás és vállalati kapcsolatok</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-3 rounded-lg mr-4">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-800 mb-1">Rugalmas időbeosztás</h4>
                        <p className="text-neutral-600 text-sm">Online tananyagok és változatos órarend a munka melletti tanuláshoz</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-white p-8 rounded-xl border border-neutral-100 shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-neutral-800 mb-6">Program részletek</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                    <div>
                      <h3 className="text-lg font-medium text-neutral-800 mb-3">Program típus</h3>
                      <p className="text-neutral-700">{degreeLevel}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-neutral-800 mb-3">Időtartam</h3>
                      <p className="text-neutral-700">{degree.duration}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-neutral-800 mb-3">Kreditérték</h3>
                      <p className="text-neutral-700">{degree.credits} ECTS kredit</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-neutral-800 mb-3">Nyelv</h3>
                      <p className="text-neutral-700">Magyar (egyes kurzusok angol nyelven)</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-neutral-800 mb-3">Jelentkezési határidő</h3>
                      <p className="text-neutral-700">Őszi félév: Július 15. / Tavaszi félév: December 15.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-neutral-800 mb-3">Kezdési időpontok</h3>
                      <p className="text-neutral-700">Szeptember (őszi félév) / Február (tavaszi félév)</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-neutral-800 mb-3">Képzési forma</h3>
                      <p className="text-neutral-700">Nappali és levelező</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-neutral-800 mb-3">Tandíj/félév</h3>
                      <p className="text-neutral-700 font-bold">{degree.price.toLocaleString('hu-HU')} Ft</p>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
              
              {/* Curriculum Tab Content */}
              <TabsContent value="curriculum" className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white p-8 rounded-xl border border-neutral-100 shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-neutral-800 mb-6">Tanterv felépítése</h2>
                  <p className="text-neutral-700 mb-8">
                    A képzés {degree.duration} alatt teljesíthető, összesen {degree.credits} kredit értékben. A tantervben szereplő tárgyak elméleti és gyakorlati ismereteket egyaránt tartalmaznak, a munkaerőpiaci igényekre fókuszálva.
                  </p>
                  
                  <Accordion type="single" collapsible className="space-y-4">
                    {programStructure.map((year) => (
                      <AccordionItem key={year.id} value={year.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                        <AccordionTrigger className="px-6 py-4 hover:bg-neutral-50 transition-colors">
                          <span className="text-lg font-medium text-neutral-800">{year.title}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 pt-2">
                          <div className="space-y-6">
                            {year.semesters.map((semester) => (
                              <div key={semester.id}>
                                <h4 className="font-medium text-neutral-800 mb-3 flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                                  {semester.title}
                                </h4>
                                <div className="bg-neutral-50 rounded-lg overflow-hidden">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="bg-neutral-100">
                                        <th className="py-3 px-4 text-left text-sm font-medium text-neutral-700">Tantárgy</th>
                                        <th className="py-3 px-4 text-center text-sm font-medium text-neutral-700">Kredit</th>
                                        <th className="py-3 px-4 text-right text-sm font-medium text-neutral-700">Típus</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200">
                                      {semester.courses.map((course, index) => (
                                        <tr key={index} className="hover:bg-neutral-100 transition-colors">
                                          <td className="py-3 px-4 text-sm text-neutral-800">{course.name}</td>
                                          <td className="py-3 px-4 text-center text-sm text-neutral-800">{course.credits}</td>
                                          <td className="py-3 px-4 text-right text-sm">
                                            <Badge variant={course.type === "Kötelező" ? "default" : "outline"} className={course.type === "Kötelező" ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}>
                                              {course.type}
                                            </Badge>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-white p-8 rounded-xl border border-neutral-100 shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-neutral-800 mb-6">Szakdolgozat és záróvizsga</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-neutral-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-neutral-800 mb-3 flex items-center">
                        <FileText className="h-5 w-5 text-primary mr-2" />
                        Szakdolgozat
                      </h3>
                      <p className="text-neutral-700 text-sm">
                        A képzés során a hallgatók szakdolgozatot készítenek, amely a szakterület egy aktuális problémáját dolgozza fel. A szakdolgozat elkészítése során a hallgatók témavezetői támogatást kapnak.
                      </p>
                    </div>
                    
                    <div className="bg-neutral-50 p-6 rounded-lg">
                      <h3 className="text-lg font-medium text-neutral-800 mb-3 flex items-center">
                        <Award className="h-5 w-5 text-primary mr-2" />
                        Záróvizsga
                      </h3>
                      <p className="text-neutral-700 text-sm">
                        A záróvizsga a szakdolgozat megvédéséből és szóbeli vizsgából áll. A sikeres záróvizsga a diploma megszerzésének feltétele.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button className="bg-primary hover:bg-primary/90">
                      Részletes tanterv letöltése
                      <Download className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>
              
              {/* Admissions Tab Content */}
              <TabsContent value="admissions" className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white p-8 rounded-xl border border-neutral-100 shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-neutral-800 mb-4">Felvételi követelmények</h2>
                  <p className="text-neutral-700 mb-8">
                    A {degree.name} programra való jelentkezéshez az alábbi követelményeknek kell megfelelni:
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    {admissionReqs.map((req, index) => (
                      <div key={index} className="flex border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors">
                        <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full mr-4">
                          <CheckCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-neutral-800 mb-1">{req.requirement}</h3>
                          <p className="text-neutral-600 text-sm">{req.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold text-neutral-800 mb-4">Jelentkezési folyamat</h3>
                  <div className="relative before:absolute before:left-8 before:top-4 before:h-[calc(100%-2rem)] before:w-[1px] before:bg-neutral-200 space-y-8 mb-8">
                    {[
                      { title: "Online jelentkezés", description: "Töltse ki az online jelentkezési űrlapot és csatolja a szükséges dokumentumokat." },
                      { title: "Dokumentumok ellenőrzése", description: "Az egyetem ellenőrzi a beküldött dokumentumokat és visszajelzést küld." },
                      { title: "Felvételi elbeszélgetés", description: "Sikeres dokumentáció esetén felvételi elbeszélgetésre kerül sor." },
                      { title: "Döntés és beiratkozás", description: "Pozitív döntés esetén beiratkozás és a félév kezdése." },
                    ].map((step, index) => (
                      <div key={index} className="flex">
                        <div className="relative flex-shrink-0 z-10">
                          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white font-bold text-lg">
                            {index + 1}
                          </div>
                        </div>
                        <div className="ml-6 pt-4">
                          <h4 className="font-medium text-neutral-800 text-lg mb-2">{step.title}</h4>
                          <p className="text-neutral-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-neutral-50 p-6 rounded-lg">
                    <h3 className="font-medium text-neutral-800 mb-3">Fontos határidők</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-700">Őszi félévre jelentkezés:</span>
                        <span className="font-medium text-neutral-800">Július 15.</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-700">Tavaszi félévre jelentkezés:</span>
                        <span className="font-medium text-neutral-800">December 15.</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-700">Felvételi elbeszélgetések:</span>
                        <span className="font-medium text-neutral-800">Folyamatosan</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-gradient-to-r from-primary to-primary/80 p-8 rounded-xl text-white"
                >
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-6 md:mb-0">
                      <h2 className="text-2xl font-bold mb-2">Kérdése van a jelentkezéssel kapcsolatban?</h2>
                      <p className="text-white/90">
                        Segítünk eligazodni a felvételi folyamatban. Vegye fel velünk a kapcsolatot!
                      </p>
                    </div>
                    <Button className="bg-white text-primary hover:bg-white/90 whitespace-nowrap">
                      Kapcsolatfelvétel
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>
              
              {/* Career Tab Content */}
              <TabsContent value="career" className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white p-8 rounded-xl border border-neutral-100 shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-neutral-800 mb-4">Karrierlehetőségek</h2>
                  <p className="text-neutral-700 mb-8">
                    A {degree.name} program elvégzése után az alábbi karrierlehetőségek nyílnak meg:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {careerOptions.map((career, index) => (
                      <div key={index} className="bg-neutral-50 rounded-lg p-6 transition-transform hover:-translate-y-1 duration-300">
                        <div className="flex items-center mb-4">
                          {career.icon}
                          <h3 className="font-medium text-neutral-800 ml-3">{career.title}</h3>
                        </div>
                        <div className="bg-white py-2 px-4 rounded-lg inline-block">
                          <span className="text-neutral-600 text-sm">Átlagos fizetés:</span>
                          <span className="ml-2 font-medium text-neutral-800">{career.salary}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold text-neutral-800 mb-4">Megszerezhető készségek</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {[
                      "Problémamegoldás", 
                      "Elemző gondolkodás", 
                      "Csapatmunka", 
                      "Projektmenedzsment", 
                      "Kommunikációs készség",
                      "Időmenedzsment",
                      "Kreativitás",
                      "Kritikus gondolkodás",
                      "Szakmai eszközök használata"
                    ].map((skill, index) => (
                      <div key={index} className="bg-neutral-50 rounded-lg px-4 py-3 text-neutral-700 flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        {skill}
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold text-neutral-800 mb-4">Karriertámogatás</h3>
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="bg-primary/10 p-3 rounded-lg mr-4">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-neutral-800 mb-1">Karrier tanácsadás</h4>
                        <p className="text-neutral-600 text-sm">Személyre szabott karriertervezés és tanácsadás a hallgatók számára</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="bg-primary/10 p-3 rounded-lg mr-4">
                        <Building className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-neutral-800 mb-1">Vállalati kapcsolatok</h4>
                        <p className="text-neutral-600 text-sm">Széles körű partnerkapcsolatok vezető hazai és nemzetközi vállalatokkal</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="bg-primary/10 p-3 rounded-lg mr-4">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-neutral-800 mb-1">Karrierrendezvények</h4>
                        <p className="text-neutral-600 text-sm">Rendszeres állásbörzék, karriernapok és networking események</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-white p-8 rounded-xl border border-neutral-100 shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-neutral-800 mb-6">Végzettjeink elhelyezkedése</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-neutral-50 p-6 rounded-lg text-center">
                      <div className="text-3xl font-bold text-primary mb-2">92%</div>
                      <p className="text-neutral-700">A végzettjeink 92%-a talál állást a diplomaszerzést követő 3 hónapon belül</p>
                    </div>
                    
                    <div className="bg-neutral-50 p-6 rounded-lg text-center">
                      <div className="text-3xl font-bold text-primary mb-2">85%</div>
                      <p className="text-neutral-700">A végzettjeink 85%-a szakirányú területen helyezkedik el</p>
                    </div>
                    
                    <div className="bg-neutral-50 p-6 rounded-lg text-center">
                      <div className="text-3xl font-bold text-primary mb-2">76%</div>
                      <p className="text-neutral-700">A végzettjeink 76%-a vezetői pozícióba kerül 5 éven belül</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button className="bg-primary hover:bg-primary/90">
                      Végzettjeink történetei
                      <MoveRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>
              
              {/* Testimonials Tab Content */}
              <TabsContent value="testimonials" className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white p-8 rounded-xl border border-neutral-100 shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-neutral-800 mb-8">Hallgatói vélemények</h2>
                  
                  <div className="space-y-6 mb-8">
                    {testimonials.map((testimonial) => (
                      <motion.div
                        key={testimonial.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * testimonial.id }}
                        className="bg-neutral-50 p-6 rounded-xl"
                      >
                        <div className="flex items-center mb-4">
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.name} 
                            className="w-12 h-12 rounded-full object-cover mr-4"
                          />
                          <div>
                            <h3 className="font-medium text-neutral-800">{testimonial.name}</h3>
                            <p className="text-neutral-500 text-sm">{testimonial.role}</p>
                          </div>
                          <div className="ml-auto">
                            {renderStars(testimonial.rating)}
                          </div>
                        </div>
                        <p className="text-neutral-700 italic">"{testimonial.comment}"</p>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="bg-neutral-50 p-6 rounded-xl">
                    <h3 className="font-medium text-neutral-800 mb-4">További vélemények</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <div className="text-3xl font-bold text-primary">{degree.rating}</div>
                          <div className="ml-2">
                            {renderStars(Math.round(degree.rating))}
                            <p className="text-neutral-500 text-sm">{degree.studentCount} hallgatói értékelés alapján</p>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="text-primary border-primary hover:bg-primary/5">
                        Összes vélemény
                        <MoveRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-white p-8 rounded-xl border border-neutral-100 shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-neutral-800 mb-6">Kérdezze meg hallgatóinkat</h2>
                  <p className="text-neutral-700 mb-6">
                    Szeretne többet megtudni a képzésről jelenlegi vagy végzett hallgatóinktól? Csatlakozzon virtuális információs napunkhoz!
                  </p>
                  
                  <div className="bg-neutral-50 p-6 rounded-lg mb-6">
                    <h3 className="font-medium text-neutral-800 mb-3">Következő virtuális információs napok</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-neutral-700">Június 15. (kedd) 17:00</span>
                        <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/5">
                          Regisztráció
                        </Button>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-700">Július 10. (szombat) 10:00</span>
                        <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/5">
                          Regisztráció
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button className="bg-primary hover:bg-primary/90">
                      Virtuális campus túra
                      <MoveRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm"
              >
                <h3 className="text-lg font-bold text-neutral-800 mb-4">Tandíj információk</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Félév díja:</span>
                    <span className="font-bold text-neutral-800 text-lg">{degree.price.toLocaleString('hu-HU')} Ft</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Teljes képzés díja:</span>
                    <span className="font-medium text-neutral-800">
                      {(degree.price * (degree.duration.split(' ')[0] as unknown as number)).toLocaleString('hu-HU')} Ft
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Beiratkozási díj:</span>
                    <span className="font-medium text-neutral-800">20,000 Ft</span>
                  </div>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-neutral-800 mb-2">Finanszírozási lehetőségek</h4>
                  <ul className="space-y-2 text-neutral-700 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      Diákhitel konstrukciók
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      Részletfizetési lehetőség
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      Vállalati támogatási programok
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      Tanulmányi ösztöndíjak
                    </li>
                  </ul>
                </div>
                
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Jelentkezés most
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm"
              >
                <h3 className="text-lg font-bold text-neutral-800 mb-4">Kapcsolatfelvétel</h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-medium text-neutral-800 mb-1">Képzési kapcsolattartó</h4>
                    <p className="text-neutral-600 text-sm">Dr. Kovács Andrea</p>
                    <p className="text-neutral-600 text-sm">kovacs.andrea@egyetem.hu</p>
                    <p className="text-neutral-600 text-sm">+36 1 234 5678</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-neutral-800 mb-1">Tanulmányi osztály</h4>
                    <p className="text-neutral-600 text-sm">Hétfő-péntek: 9:00-15:00</p>
                    <p className="text-neutral-600 text-sm">tanulmanyi@egyetem.hu</p>
                    <p className="text-neutral-600 text-sm">+36 1 234 5679</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Visszahívást kérek
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm"
              >
                <h3 className="text-lg font-bold text-neutral-800 mb-4">Dokumentumok</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                    <FileText className="h-5 w-5 text-primary mr-3" />
                    <span className="text-neutral-700">Részletes tanterv</span>
                    <Download className="h-4 w-4 text-neutral-400 ml-auto" />
                  </a>
                  <a href="#" className="flex items-center p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                    <FileText className="h-5 w-5 text-primary mr-3" />
                    <span className="text-neutral-700">Jelentkezési útmutató</span>
                    <Download className="h-4 w-4 text-neutral-400 ml-auto" />
                  </a>
                  <a href="#" className="flex items-center p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                    <FileText className="h-5 w-5 text-primary mr-3" />
                    <span className="text-neutral-700">Képzési tájékoztató</span>
                    <Download className="h-4 w-4 text-neutral-400 ml-auto" />
                  </a>
                  <a href="#" className="flex items-center p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                    <FileText className="h-5 w-5 text-primary mr-3" />
                    <span className="text-neutral-700">Ösztöndíj lehetőségek</span>
                    <Download className="h-4 w-4 text-neutral-400 ml-auto" />
                  </a>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-neutral-50 p-6 rounded-xl border border-neutral-100"
              >
                <h3 className="text-lg font-bold text-neutral-800 mb-3">Ossza meg másokkal</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Megosztás
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Mentés
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Similar Programs Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-neutral-800 mb-8">Hasonló képzési programok</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {degrees
              .filter(d => d.id !== degree.id && d.level === degree.level)
              .slice(0, 3)
              .map((relatedDegree) => {
                const relatedUniversity = universities.find(u => u.id === relatedDegree.universityId);
                
                return (
                  <motion.div
                    key={relatedDegree.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100 flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="relative h-40">
                      <img 
                        src={relatedDegree.imageUrl} 
                        alt={relatedDegree.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent"></div>
                      
                      <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                        <div className="flex items-center mb-2">
                          <div className="flex-shrink-0 w-6 h-6 mr-2 rounded-full overflow-hidden bg-white p-1">
                            <img 
                              src={relatedUniversity?.logoUrl} 
                              alt={relatedUniversity?.name} 
                              className="w-full h-full object-contain" 
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {relatedUniversity?.name}
                          </span>
                        </div>
                        
                        <h3 className="font-bold text-base">
                          {relatedDegree.name}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="p-4 flex-grow flex flex-col">
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4 text-xs">
                        <div className="flex items-center text-neutral-600">
                          <Calendar className="h-3 w-3 mr-1 text-neutral-400" />
                          <span>{relatedDegree.duration}</span>
                        </div>
                        <div className="flex items-center text-neutral-600">
                          <Award className="h-3 w-3 mr-1 text-neutral-400" />
                          <span>{relatedDegree.credits} kredit</span>
                        </div>
                        <div className="flex items-center text-neutral-600">
                          <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
                          <span>{relatedDegree.rating}</span>
                        </div>
                        <div className="flex items-center text-neutral-600">
                          <Users className="h-3 w-3 mr-1 text-neutral-400" />
                          <span>{relatedDegree.studentCount} hallgató</span>
                        </div>
                      </div>
                      
                      <div className="mt-auto pt-3 border-t border-neutral-100 flex items-center justify-between">
                        <div className="font-medium text-neutral-900">
                          {relatedDegree.price.toLocaleString('hu-HU')} Ft
                        </div>
                        <RouterLink href={`/degree/${relatedDegree.id}`}>
                          <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/5">
                            Részletek
                          </Button>
                        </RouterLink>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Kezdje el a tanulmányait az Academion platformon
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
              Rugalmas tanulási lehetőség Magyarország vezető egyetemeinek kurzusaival. 
              Jelentkezzen most, és induljon el a karrierje felé!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-primary hover:bg-white/90 font-medium text-lg py-6 px-8">
                Jelentkezés
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 font-medium text-lg py-6 px-8">
                Tanácsadás kérése
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DegreeDetail;