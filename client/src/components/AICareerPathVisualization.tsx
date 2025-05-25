import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  BrainCircuit, 
  Zap, 
  BarChart, 
  Award, 
  BookOpen, 
  Briefcase,
  ArrowRight,
  Star,
  TrendingUp,
  ArrowUpRight
} from "lucide-react";
import { useLocation } from "wouter";

// Career path data (this would normally come from an API connected to OpenAI)
const careerPathsData = {
  dataScience: {
    title: "Adattudós",
    description: "Ismerje meg az adatelemzés és a gépi tanulás világát",
    currentLevel: "Kezdő",
    levels: [
      {
        level: "Kezdő",
        skills: ["Python alapok", "Adatelemzési alapok", "Statisztikai alapismeretek"],
        courses: [
          { id: 101, title: "Bevezetés a Python programozásba", university: "BME", duration: "6 hét" },
          { id: 102, title: "Adatelemzés alapjai", university: "Corvinus", duration: "8 hét" }
        ],
        salary: "500,000 - 700,000 Ft",
        demand: "Magas"
      },
      {
        level: "Középhaladó",
        skills: ["Adattisztítás", "Gépi tanulás alapok", "SQL", "Adatvizualizáció"],
        courses: [
          { id: 201, title: "Adattisztítás és -előkészítés", university: "ELTE", duration: "5 hét" },
          { id: 202, title: "Gépi tanulás alapjai", university: "BME", duration: "10 hét" }
        ],
        salary: "800,000 - 1,100,000 Ft",
        demand: "Nagyon magas"
      },
      {
        level: "Haladó",
        skills: ["Mély tanulás", "Natural Language Processing", "Big Data technológiák"],
        courses: [
          { id: 301, title: "Mély tanulás és neurális hálózatok", university: "BME", duration: "12 hét" },
          { id: 302, title: "Nagy adathalmazok kezelése", university: "Corvinus", duration: "8 hét" }
        ],
        salary: "1,200,000 - 1,800,000 Ft",
        demand: "Kiemelkedő"
      }
    ],
    relatedRoles: ["Adatelemző", "Machine Learning mérnök", "Business Intelligence elemző"],
    industries: ["Tech", "Pénzügy", "Egészségügy", "E-kereskedelem"],
    growthRate: "+35% évente",
    timeToAchieve: "1-2 év"
  },
  webDevelopment: {
    title: "Webfejlesztő",
    description: "Tanuljon meg modern weboldalakat és alkalmazásokat készíteni",
    currentLevel: "Kezdő",
    levels: [
      {
        level: "Kezdő",
        skills: ["HTML", "CSS", "JavaScript alapok", "Reszponzív design"],
        courses: [
          { id: 103, title: "Web fejlesztés alapjai", university: "BME", duration: "8 hét" },
          { id: 104, title: "JavaScript alapismeretek", university: "ELTE", duration: "6 hét" }
        ],
        salary: "450,000 - 650,000 Ft",
        demand: "Magas"
      },
      {
        level: "Középhaladó",
        skills: ["Frontend keretrendszerek (React)", "API integrációk", "Git verziókezelés"],
        courses: [
          { id: 203, title: "Modern frontend fejlesztés", university: "BME", duration: "10 hét" },
          { id: 204, title: "Verziókezelés és csapatmunka", university: "Corvinus", duration: "4 hét" }
        ],
        salary: "700,000 - 1,000,000 Ft",
        demand: "Nagyon magas"
      },
      {
        level: "Haladó",
        skills: ["Fullstack fejlesztés", "Teljesítményoptimalizálás", "Biztonság", "DevOps alapok"],
        courses: [
          { id: 303, title: "Fullstack alkalmazásfejlesztés", university: "ELTE", duration: "12 hét" },
          { id: 304, title: "Web alkalmazások biztonsága", university: "BME", duration: "6 hét" }
        ],
        salary: "900,000 - 1,500,000 Ft",
        demand: "Kiemelkedő"
      }
    ],
    relatedRoles: ["Frontend fejlesztő", "Fullstack fejlesztő", "UX/UI fejlesztő"],
    industries: ["Tech", "Marketing", "E-kereskedelem", "Média"],
    growthRate: "+25% évente",
    timeToAchieve: "1-1.5 év"
  },
  digitalMarketing: {
    title: "Digitális marketing szakértő",
    description: "Fejlessze digitális marketing készségeit és növelje vállalkozások online jelenlétét",
    currentLevel: "Kezdő",
    levels: [
      {
        level: "Kezdő",
        skills: ["Marketing alapelvek", "Social media alapok", "Tartalommarketing"],
        courses: [
          { id: 105, title: "Digitális marketing alapjai", university: "Corvinus", duration: "6 hét" },
          { id: 106, title: "Közösségi média marketing", university: "BME", duration: "5 hét" }
        ],
        salary: "400,000 - 600,000 Ft",
        demand: "Közepes"
      },
      {
        level: "Középhaladó",
        skills: ["SEO", "Google Ads", "Analytics eszközök", "Email marketing"],
        courses: [
          { id: 205, title: "Keresőoptimalizálás (SEO)", university: "ELTE", duration: "7 hét" },
          { id: 206, title: "Google Ads és PPC kampányok", university: "Corvinus", duration: "6 hét" }
        ],
        salary: "600,000 - 900,000 Ft",
        demand: "Magas"
      },
      {
        level: "Haladó",
        skills: ["Marketing stratégia", "Konverziós ráta optimalizálás", "Marketing automatizáció"],
        courses: [
          { id: 305, title: "Digitális marketing stratégia", university: "Corvinus", duration: "8 hét" },
          { id: 306, title: "Marketing automatizáció", university: "BME", duration: "6 hét" }
        ],
        salary: "800,000 - 1,300,000 Ft",
        demand: "Nagyon magas"
      }
    ],
    relatedRoles: ["SEO specialista", "Social media menedzser", "PPC specialista"],
    industries: ["Marketing", "E-kereskedelem", "Média", "Szórakoztatóipar"],
    growthRate: "+20% évente",
    timeToAchieve: "1-1.5 év"
  }
};

const careerPathOptions = [
  { id: "dataScience", label: "Adattudós" },
  { id: "webDevelopment", label: "Webfejlesztő" },
  { id: "digitalMarketing", label: "Digitális marketing" }
];

interface AICareerPathVisualizationProps {
  initialCareerPath?: string;
}

const AICareerPathVisualization: React.FC<AICareerPathVisualizationProps> = ({ initialCareerPath = "dataScience" }) => {
  const [selectedCareer, setSelectedCareer] = useState(initialCareerPath);
  const [careerData, setCareerData] = useState(careerPathsData[selectedCareer as keyof typeof careerPathsData]);
  const [expandedLevel, setExpandedLevel] = useState<string | null>("Kezdő");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [, setLocation] = useLocation();
  const pathRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCareerData(careerPathsData[selectedCareer as keyof typeof careerPathsData]);
  }, [selectedCareer]);

  const handleCareerChange = (careerId: string) => {
    setIsAnalyzing(true);
    
    // Simulating AI processing time
    setTimeout(() => {
      setSelectedCareer(careerId);
      setIsAnalyzing(false);
      setExpandedLevel("Kezdő");
    }, 1500);
  };

  const handleLevelClick = (level: string) => {
    setExpandedLevel(expandedLevel === level ? null : level);
  };

  const scrollToPath = () => {
    pathRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-400/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <BrainCircuit className="w-4 h-4 mr-2" />
              AI-alapú karrier tervezés
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
              Fedezze fel karrierútját
            </h2>
            <p className="text-neutral-600 max-w-3xl mx-auto text-lg">
              Elemezze a lehetséges karrierutakat, szükséges készségeket és tanulási lehetőségeket AI segítségével
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12" ref={pathRef}>
          {/* Career path selector */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-100 p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4 text-neutral-800">Válasszon karrierutat</h3>
              
              <div className="space-y-3 mb-8">
                {careerPathOptions.map((career) => (
                  <motion.button
                    key={career.id}
                    onClick={() => handleCareerChange(career.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${
                      selectedCareer === career.id
                        ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200"
                        : "bg-white border border-neutral-200 hover:border-indigo-200"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-medium">{career.label}</span>
                    {selectedCareer === career.id && (
                      <div className="h-6 w-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
                <div className="flex items-center mb-3">
                  <Zap className="h-5 w-5 text-indigo-600 mr-2" />
                  <h4 className="font-medium text-indigo-900">AI-alapú elemzés</h4>
                </div>
                <p className="text-sm text-neutral-600 mb-3">
                  Mesterséges intelligencia elemzi a karrierutakat és azonosítja a legjobb képzéseket az Ön céljaihoz.
                </p>
                <Button 
                  onClick={() => setLocation("/career-assessment")}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  Személyes karrierértékelés
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Career path visualization */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden border border-indigo-100 shadow-xl"
            >
              {isAnalyzing ? (
                <div className="p-12 flex flex-col items-center justify-center min-h-[600px]">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-6"></div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-2">AI elemzi a karrierutat...</h3>
                  <p className="text-neutral-600 text-center max-w-md">
                    Azonosítjuk a szükséges készségeket, kurzusokat és karrierlehetőségeket
                  </p>
                </div>
              ) : (
                <>
                  {/* Career header */}
                  <div className="p-6 md:p-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{careerData.title}</h3>
                        <p className="text-indigo-100">{careerData.description}</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1 text-green-300" />
                        <span className="text-sm font-medium">{careerData.growthRate}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-indigo-200 mb-1">Karrierút ideje</div>
                        <div className="font-medium">{careerData.timeToAchieve}</div>
                      </div>
                      <div>
                        <div className="text-xs text-indigo-200 mb-1">Népszerű iparágak</div>
                        <div className="font-medium">{careerData.industries.slice(0, 2).join(", ")}</div>
                      </div>
                      <div>
                        <div className="text-xs text-indigo-200 mb-1">Kapcsolódó munkakörök</div>
                        <div className="font-medium">{careerData.relatedRoles.slice(0, 2).join(", ")}</div>
                      </div>
                      <div>
                        <div className="text-xs text-indigo-200 mb-1">Jelenlegi szint</div>
                        <div className="font-medium">{careerData.currentLevel}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Career path levels */}
                  <div className="p-6 md:p-8">
                    <h4 className="text-lg font-semibold mb-6 text-neutral-800">Karrierút lépései</h4>
                    
                    <div className="space-y-6">
                      {careerData.levels.map((level, index) => (
                        <div 
                          key={level.level}
                          className="relative"
                        >
                          {/* Connection line */}
                          {index < careerData.levels.length - 1 && (
                            <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-indigo-100 z-0"></div>
                          )}
                          
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className={`relative z-10 border rounded-xl overflow-hidden shadow-sm transition-all ${
                              expandedLevel === level.level 
                                ? "border-indigo-300 bg-white" 
                                : "border-neutral-200 bg-white hover:border-indigo-200"
                            }`}
                          >
                            {/* Level header */}
                            <div 
                              className={`p-4 flex items-center cursor-pointer ${
                                expandedLevel === level.level 
                                  ? "bg-gradient-to-r from-indigo-50 to-purple-50" 
                                  : "bg-white"
                              }`}
                              onClick={() => handleLevelClick(level.level)}
                            >
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
                                expandedLevel === level.level
                                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                                  : "bg-indigo-100 text-indigo-600"
                              }`}>
                                <span>{index + 1}</span>
                              </div>
                              
                              <div className="flex-1">
                                <h5 className="font-semibold text-neutral-800">{level.level} szint</h5>
                                <div className="flex items-center text-sm text-neutral-500">
                                  <span className="mr-3">{level.skills.length} készség</span>
                                  <span>{level.courses.length} kurzus</span>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-sm text-neutral-600 mb-1">Átlagfizetés</div>
                                <div className="text-indigo-600 font-medium">{level.salary}</div>
                              </div>
                              
                              <ChevronRight className={`ml-3 h-5 w-5 text-neutral-400 transition-transform ${
                                expandedLevel === level.level ? "rotate-90" : ""
                              }`} />
                            </div>
                            
                            {/* Expanded level details */}
                            {expandedLevel === level.level && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="border-t border-neutral-100 p-4"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Skills */}
                                  <div>
                                    <h6 className="font-medium text-neutral-800 mb-3 flex items-center">
                                      <Award className="h-4 w-4 mr-2 text-indigo-500" />
                                      Szükséges készségek
                                    </h6>
                                    <div className="space-y-2">
                                      {level.skills.map((skill) => (
                                        <div 
                                          key={skill}
                                          className="flex items-center p-2 bg-gradient-to-r from-indigo-50 to-white rounded-lg"
                                        >
                                          <Star className="h-4 w-4 text-amber-500 mr-2" />
                                          <span className="text-neutral-700">{skill}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {/* Recommended courses */}
                                  <div>
                                    <h6 className="font-medium text-neutral-800 mb-3 flex items-center">
                                      <BookOpen className="h-4 w-4 mr-2 text-indigo-500" />
                                      Ajánlott kurzusok
                                    </h6>
                                    <div className="space-y-3">
                                      {level.courses.map((course) => (
                                        <motion.div
                                          key={course.id}
                                          whileHover={{ y: -2 }}
                                          className="p-3 border border-indigo-100 rounded-lg bg-white hover:shadow-md transition-all cursor-pointer"
                                          onClick={() => setLocation(`/course/${course.id}`)}
                                        >
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <h6 className="font-medium text-neutral-800">{course.title}</h6>
                                              <div className="flex items-center text-sm text-neutral-500 mt-1">
                                                <span>{course.university}</span>
                                                <span className="mx-2">•</span>
                                                <span>{course.duration}</span>
                                              </div>
                                            </div>
                                            <ArrowUpRight className="h-4 w-4 text-indigo-500" />
                                          </div>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="mt-6 pt-4 border-t border-neutral-100">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center text-neutral-700">
                                      <Briefcase className="h-4 w-4 mr-2 text-indigo-500" />
                                      <span>Munkaerőpiaci kereslet: </span>
                                      <span className="font-medium ml-1 text-indigo-700">{level.demand}</span>
                                    </div>
                                    <Button
                                      size="sm"
                                      onClick={() => setLocation(`/career-paths/${selectedCareer}/${level.level.toLowerCase()}`)}
                                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200"
                                    >
                                      Részletek
                                      <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
            
            <div className="mt-6">
              <Button
                onClick={() => setLocation(`/career-paths/${selectedCareer}`)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                Teljes karrier útmutató megtekintése
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AICareerPathVisualization;