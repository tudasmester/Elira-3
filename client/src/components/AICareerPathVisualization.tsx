import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Code,
  GraduationCap,
  HelpCircle,
  Lightbulb,
  LineChart,
  Loader2,
  LucideIcon,
  Map,
  Sparkles,
  Target,
  TrendingUp,
  Award
} from "lucide-react";

interface CareerPathInfo {
  title: string;
  description: string;
  keySkills: string[];
  learningPath: {
    beginner: string[];
    intermediate: string[];
    advanced: string[];
  };
  salaryRange: {
    entry: string;
    mid: string;
    senior: string;
  };
  demandTrend: string;
  recommendedCourses: {
    title: string;
    provider: string;
    level: string;
  }[];
  relatedCareers: string[];
}

interface SkillsAnalysis {
  matchScore: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}

interface CareerRecommendation {
  careers: string[];
  explanation: string;
}

interface AICareerPathVisualizationProps {
  initialCareerPath?: string;
}

// Predefined career paths
const popularCareerPaths = [
  {
    id: "adattudos",
    name: "Adattudós",
    icon: <LineChart className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "szoftverfejleszto",
    name: "Szoftverfejlesztő",
    icon: <Code className="h-5 w-5" />,
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: "uzleti-elemzo",
    name: "Üzleti elemző",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "bg-green-100 text-green-800",
  },
  {
    id: "projektmenedzser",
    name: "Projektmenedzser",
    icon: <Briefcase className="h-5 w-5" />,
    color: "bg-amber-100 text-amber-800",
  },
  {
    id: "ux-designer",
    name: "UX Designer",
    icon: <Sparkles className="h-5 w-5" />,
    color: "bg-pink-100 text-pink-800",
  },
];

// Helper component for section headers
const SectionHeader = ({ 
  icon, 
  title, 
  subtitle 
}: { 
  icon: React.ReactNode; 
  title: string; 
  subtitle?: string;
}) => (
  <div className="flex items-start mb-4">
    <div className="mr-3 p-2 rounded-lg bg-indigo-100 text-indigo-700">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>
      {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
    </div>
  </div>
);

// Progress stages component
const ProgressStages = ({ 
  stages, 
  currentStage 
}: { 
  stages: string[]; 
  currentStage: number;
}) => (
  <div className="mb-6">
    <div className="w-full bg-neutral-100 h-2 rounded-full mb-2">
      <div 
        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all" 
        style={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }}
      ></div>
    </div>
    <div className="flex justify-between">
      {stages.map((stage, idx) => (
        <div 
          key={idx} 
          className={`text-xs font-medium ${idx <= currentStage ? 'text-indigo-700' : 'text-neutral-400'}`}
        >
          {stage}
        </div>
      ))}
    </div>
  </div>
);

// Learning path stage component
const LearningPathStage = ({ 
  title, 
  items, 
  icon 
}: { 
  title: string; 
  items: string[]; 
  icon: React.ReactNode;
}) => (
  <div className="mb-6">
    <div className="flex items-center mb-2">
      {icon}
      <h4 className="font-medium ml-2 text-neutral-800">{title}</h4>
    </div>
    <ul className="space-y-2 pl-10">
      {items.map((item, idx) => (
        <motion.li 
          key={idx} 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="flex items-start"
        >
          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
          <span className="text-neutral-700">{item}</span>
        </motion.li>
      ))}
    </ul>
  </div>
);

// Skill match visualization component
const SkillMatch = ({ matchScore }: { matchScore: number }) => {
  const getColor = (score: number) => {
    if (score < 30) return "text-red-500";
    if (score < 60) return "text-amber-500";
    return "text-green-500";
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-neutral-700">Készség egyezés</span>
        <span className={`text-sm font-bold ${getColor(matchScore)}`}>{matchScore}%</span>
      </div>
      <div className="w-full bg-neutral-100 rounded-full h-2.5">
        <div 
          className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" 
          style={{ width: `${matchScore}%` }}
        ></div>
      </div>
    </div>
  );
};

const AICareerPathVisualization: React.FC<AICareerPathVisualizationProps> = ({ initialCareerPath }) => {
  const { careerId } = useParams<{ careerId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // State for different modes
  const [activeTab, setActiveTab] = useState<string>("explore");
  const [currentStage, setCurrentStage] = useState<number>(0);
  
  // State for career path info
  const [selectedCareer, setSelectedCareer] = useState<string>(careerId || initialCareerPath || "");
  const [careerInfo, setCareerInfo] = useState<CareerPathInfo | null>(null);
  const [loadingCareerInfo, setLoadingCareerInfo] = useState<boolean>(false);
  
  // State for skill analysis
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState<string>("");
  const [skillsAnalysis, setSkillsAnalysis] = useState<SkillsAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);
  
  // State for career recommendation
  const [interests, setInterests] = useState<string[]>([]);
  const [currentInterest, setCurrentInterest] = useState<string>("");
  const [background, setBackground] = useState<string>("");
  const [recommendations, setRecommendations] = useState<CareerRecommendation | null>(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(false);

  // Load career info when career ID changes
  useEffect(() => {
    if (careerId || initialCareerPath) {
      const careerToLoad = careerId || initialCareerPath;
      setSelectedCareer(careerToLoad || "");
      fetchCareerInfo(careerToLoad || "");
    }
  }, [careerId, initialCareerPath]);

  // Fetch career path information
  const fetchCareerInfo = async (career: string) => {
    if (!career) return;

    setLoadingCareerInfo(true);
    try {
      const response = await fetch(`/api/career-paths/${encodeURIComponent(career)}`);
      if (!response.ok) {
        throw new Error("Nem sikerült betölteni a karrierút információkat");
      }
      
      const data = await response.json();
      setCareerInfo(data);
      
      // If the URL doesn't already contain the career ID, update it
      if (!careerId && career) {
        setLocation(`/career-paths/${encodeURIComponent(career)}`);
      }
    } catch (error) {
      console.error("Error fetching career info:", error);
      toast({
        title: "Hiba történt",
        description: "Nem sikerült betölteni a karrierút információkat. Kérjük, próbálja újra később.",
        variant: "destructive",
      });
    } finally {
      setLoadingCareerInfo(false);
    }
  };

  // Submit skills for analysis
  const submitSkillsAnalysis = async () => {
    if (!selectedCareer || userSkills.length === 0) {
      toast({
        title: "Hiányzó adatok",
        description: "Kérjük, válasszon karrierutat és adjon meg legalább egy készséget.",
        variant: "destructive",
      });
      return;
    }

    setLoadingAnalysis(true);
    try {
      const response = await fetch("/api/career-paths/skills-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentSkills: userSkills,
          targetCareer: selectedCareer
        }),
      });
      
      if (!response.ok) {
        throw new Error("Nem sikerült elvégezni a készségelemzést");
      }
      
      const data = await response.json();
      setSkillsAnalysis(data);
    } catch (error) {
      console.error("Error analyzing skills:", error);
      toast({
        title: "Hiba történt",
        description: "Nem sikerült elvégezni a készségelemzést. Kérjük, próbálja újra később.",
        variant: "destructive",
      });
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // Submit interests for recommendations
  const submitCareerRecommendations = async () => {
    if (interests.length === 0 || !background) {
      toast({
        title: "Hiányzó adatok",
        description: "Kérjük, adjon meg legalább egy érdeklődési kört és háttérinformációt.",
        variant: "destructive",
      });
      return;
    }

    setLoadingRecommendations(true);
    try {
      const response = await fetch("/api/career-paths/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests,
          skills: userSkills,
          background
        }),
      });
      
      if (!response.ok) {
        throw new Error("Nem sikerült generálni karrierút ajánlásokat");
      }
      
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast({
        title: "Hiba történt",
        description: "Nem sikerült generálni karrierút ajánlásokat. Kérjük, próbálja újra később.",
        variant: "destructive",
      });
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Add skill to the list
  const addSkill = () => {
    if (currentSkill.trim() && !userSkills.includes(currentSkill.trim())) {
      setUserSkills([...userSkills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  // Add interest to the list
  const addInterest = () => {
    if (currentInterest.trim() && !interests.includes(currentInterest.trim())) {
      setInterests([...interests, currentInterest.trim()]);
      setCurrentInterest("");
    }
  };

  // Remove skill from the list
  const removeSkill = (skill: string) => {
    setUserSkills(userSkills.filter(s => s !== skill));
  };

  // Remove interest from the list
  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
              AI-alapú karriertervezés
            </span>
          </h2>
          <p className="text-lg text-neutral-600 text-center max-w-3xl mx-auto">
            Fedezze fel részletesen a különböző karrierutakat, elemezze készségeit és kapjon 
            személyre szabott ajánlásokat a jövőbeni szakmai fejlődéséhez.
          </p>
        </div>

        <Tabs 
          defaultValue={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 max-w-2xl mx-auto mb-8">
            <TabsTrigger value="explore">Karrierutak felfedezése</TabsTrigger>
            <TabsTrigger value="skills">Készség elemzés</TabsTrigger>
            <TabsTrigger value="recommend">Személyes ajánlások</TabsTrigger>
          </TabsList>

          {/* Career Path Exploration Tab */}
          <TabsContent value="explore">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Career Selection Panel */}
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Válasszon karrierutat</CardTitle>
                  <CardDescription>
                    Fedezze fel a különböző karrierlehetőségeket és a hozzájuk vezető utakat
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="font-medium text-sm mb-2 text-neutral-700">Népszerű karrierutak</div>
                    <div className="space-y-2">
                      {popularCareerPaths.map((career) => (
                        <button
                          key={career.id}
                          onClick={() => {
                            setSelectedCareer(career.name);
                            fetchCareerInfo(career.name);
                          }}
                          className={`w-full flex items-center p-3 rounded-lg text-left transition duration-200 ${
                            selectedCareer === career.name
                              ? "bg-indigo-50 border border-indigo-200"
                              : "bg-white border border-neutral-200 hover:bg-neutral-50"
                          }`}
                        >
                          <div className={`p-2 rounded-full mr-3 ${career.color.split(" ")[0]}`}>
                            {career.icon}
                          </div>
                          <div>
                            <div className="font-medium">{career.name}</div>
                          </div>
                          <ChevronRight className="ml-auto h-5 w-5 text-neutral-400" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-neutral-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-neutral-500">vagy keresés</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Select
                      onValueChange={(value) => {
                        setSelectedCareer(value);
                        fetchCareerInfo(value);
                      }}
                      value={selectedCareer}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Karrierút keresése" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Adattudós">Adattudós</SelectItem>
                        <SelectItem value="Szoftverfejlesztő">Szoftverfejlesztő</SelectItem>
                        <SelectItem value="Projektmenedzser">Projektmenedzser</SelectItem>
                        <SelectItem value="UX Designer">UX Designer</SelectItem>
                        <SelectItem value="Üzleti elemző">Üzleti elemző</SelectItem>
                        <SelectItem value="Marketing specialista">Marketing specialista</SelectItem>
                        <SelectItem value="Mesterséges intelligencia mérnök">MI mérnök</SelectItem>
                        <SelectItem value="DevOps mérnök">DevOps mérnök</SelectItem>
                        <SelectItem value="Kiberbiztonségi szakértő">Kiberbiztonségi szakértő</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Career Information Panel */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {loadingCareerInfo ? (
                      <div className="flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Karrierút információk betöltése...
                      </div>
                    ) : (
                      careerInfo?.title || "Válasszon karrierutat"
                    )}
                  </CardTitle>
                  <CardDescription>
                    {!loadingCareerInfo && careerInfo?.demandTrend}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingCareerInfo ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
                      <p className="text-neutral-600">Karrierút információk betöltése...</p>
                    </div>
                  ) : careerInfo ? (
                    <div>
                      <div className="mb-8">
                        <SectionHeader
                          icon={<Briefcase className="h-5 w-5" />}
                          title="Karrierút áttekintés"
                          subtitle="Átfogó leírás a karrierútról és annak perspektíváiról"
                        />
                        <p className="text-neutral-700 mb-4">{careerInfo.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-neutral-50 p-4 rounded-lg">
                            <div className="text-sm text-neutral-500 mb-1">Junior fizetés</div>
                            <div className="font-semibold text-lg">{careerInfo.salaryRange.entry}</div>
                          </div>
                          <div className="bg-neutral-50 p-4 rounded-lg">
                            <div className="text-sm text-neutral-500 mb-1">Medior fizetés</div>
                            <div className="font-semibold text-lg">{careerInfo.salaryRange.mid}</div>
                          </div>
                          <div className="bg-neutral-50 p-4 rounded-lg">
                            <div className="text-sm text-neutral-500 mb-1">Senior fizetés</div>
                            <div className="font-semibold text-lg">{careerInfo.salaryRange.senior}</div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <SectionHeader
                          icon={<Target className="h-5 w-5" />}
                          title="Kulcskészségek"
                          subtitle="A sikerhez szükséges legfontosabb készségek"
                        />
                        <div className="flex flex-wrap gap-2 mb-4">
                          {careerInfo.keySkills.map((skill, idx) => (
                            <Badge key={idx} className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mb-8">
                        <SectionHeader
                          icon={<Map className="h-5 w-5" />}
                          title="Tanulási útvonal"
                          subtitle="Fejlődési lépések a karrierúton való előrehaladáshoz"
                        />
                        
                        <ProgressStages 
                          stages={["Kezdő", "Középhaladó", "Haladó"]}
                          currentStage={currentStage}
                        />
                        
                        <div className="space-y-4">
                          <LearningPathStage 
                            title="Kezdő szint" 
                            items={careerInfo.learningPath.beginner}
                            icon={<div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium">1</div>}
                          />
                          
                          <LearningPathStage 
                            title="Középhaladó szint" 
                            items={careerInfo.learningPath.intermediate}
                            icon={<div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium">2</div>}
                          />
                          
                          <LearningPathStage 
                            title="Haladó szint" 
                            items={careerInfo.learningPath.advanced}
                            icon={<div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium">3</div>}
                          />
                        </div>
                      </div>

                      <div className="mb-8">
                        <SectionHeader
                          icon={<GraduationCap className="h-5 w-5" />}
                          title="Ajánlott kurzusok"
                          subtitle="Képzések, amelyek segítenek a szükséges készségek megszerzésében"
                        />
                        
                        <div className="space-y-3">
                          {careerInfo.recommendedCourses.map((course, idx) => (
                            <div key={idx} className="flex items-start p-3 border border-neutral-200 rounded-lg">
                              <div className="p-2 rounded-full bg-green-100 text-green-700 mr-3">
                                <Award className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-neutral-800">{course.title}</div>
                                <div className="text-sm text-neutral-500">{course.provider}</div>
                              </div>
                              <Badge className="ml-2 bg-blue-100 text-blue-800">{course.level}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {careerInfo.relatedCareers.length > 0 && (
                        <div>
                          <SectionHeader
                            icon={<Briefcase className="h-5 w-5" />}
                            title="Kapcsolódó karrierutak"
                            subtitle="További karrierlehetőségek, amelyek érdekelhetik"
                          />
                          
                          <div className="flex flex-wrap gap-2">
                            {careerInfo.relatedCareers.map((career, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setSelectedCareer(career);
                                  fetchCareerInfo(career);
                                }}
                                className="inline-flex items-center px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-800 hover:bg-neutral-200 transition duration-200"
                              >
                                {career}
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <HelpCircle className="h-16 w-16 text-neutral-300 mb-4" />
                      <h3 className="text-xl font-medium text-neutral-700 mb-2">Válasszon karrierutat</h3>
                      <p className="text-neutral-500 max-w-md">
                        Válasszon egyet a népszerű karrierutak közül, vagy keressen specifikus karrierlehetőséget
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Skills Analysis Tab */}
          <TabsContent value="skills">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Skills Input Panel */}
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Készségek elemzése</CardTitle>
                  <CardDescription>
                    Elemezze meglévő készségeit egy adott karrierúthoz viszonyítva
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Válasszon karrierutat
                    </label>
                    <Select
                      onValueChange={(value) => setSelectedCareer(value)}
                      value={selectedCareer}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Karrierút kiválasztása" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Adattudós">Adattudós</SelectItem>
                        <SelectItem value="Szoftverfejlesztő">Szoftverfejlesztő</SelectItem>
                        <SelectItem value="Projektmenedzser">Projektmenedzser</SelectItem>
                        <SelectItem value="UX Designer">UX Designer</SelectItem>
                        <SelectItem value="Üzleti elemző">Üzleti elemző</SelectItem>
                        <SelectItem value="Marketing specialista">Marketing specialista</SelectItem>
                        <SelectItem value="Mesterséges intelligencia mérnök">MI mérnök</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Adja meg jelenlegi készségeit
                    </label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        placeholder="Pl. Python programozás"
                        onKeyPress={(e) => e.key === "Enter" && addSkill()}
                      />
                      <Button 
                        type="button" 
                        onClick={addSkill}
                        size="sm"
                        className="shrink-0"
                      >
                        Hozzáadás
                      </Button>
                    </div>
                    
                    {userSkills.length > 0 && (
                      <div className="mt-4">
                        <div className="text-sm font-medium text-neutral-700 mb-2">Megadott készségek:</div>
                        <div className="flex flex-wrap gap-2">
                          {userSkills.map((skill, idx) => (
                            <Badge 
                              key={idx} 
                              className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 cursor-pointer"
                              onClick={() => removeSkill(skill)}
                            >
                              {skill} ✕
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={submitSkillsAnalysis} 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    disabled={loadingAnalysis || userSkills.length === 0 || !selectedCareer}
                  >
                    {loadingAnalysis ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Elemzés...
                      </>
                    ) : (
                      <>Készségek elemzése</>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Skills Analysis Results Panel */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Készség elemzés eredménye</CardTitle>
                  <CardDescription>
                    Értékelés és ajánlások a karriercéljaihoz
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingAnalysis ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
                      <p className="text-neutral-600">Készségek elemzése folyamatban...</p>
                    </div>
                  ) : skillsAnalysis ? (
                    <div>
                      <div className="mb-8">
                        <SectionHeader
                          icon={<Target className="h-5 w-5" />}
                          title={`Készség elemzés: ${selectedCareer}`}
                          subtitle="Az Ön készségeinek megfelelése a választott karrierúthoz"
                        />
                        
                        <SkillMatch matchScore={skillsAnalysis.matchScore} />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h4 className="font-medium text-neutral-800 mb-2 flex items-center">
                              <CheckCircle2 className="h-5 w-5 text-green-500 mr-1" />
                              Erősségek
                            </h4>
                            <ul className="space-y-2">
                              {skillsAnalysis.strengths.map((strength, idx) => (
                                <motion.li 
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="bg-green-50 border border-green-100 rounded-md p-2 text-green-800"
                                >
                                  {strength}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-neutral-800 mb-2 flex items-center">
                              <HelpCircle className="h-5 w-5 text-amber-500 mr-1" />
                              Fejlesztendő területek
                            </h4>
                            <ul className="space-y-2">
                              {skillsAnalysis.gaps.map((gap, idx) => (
                                <motion.li 
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="bg-amber-50 border border-amber-100 rounded-md p-2 text-amber-800"
                                >
                                  {gap}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mt-8">
                          <h4 className="font-medium text-neutral-800 mb-3 flex items-center">
                            <Lightbulb className="h-5 w-5 text-blue-500 mr-1" />
                            Fejlődési javaslatok
                          </h4>
                          <ul className="space-y-3">
                            {skillsAnalysis.recommendations.map((recommendation, idx) => (
                              <motion.li 
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-blue-50 border border-blue-100 rounded-md p-3 text-blue-800"
                              >
                                {recommendation}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-center">
                        <Button
                          onClick={() => setActiveTab("explore")}
                          variant="outline"
                          className="mr-2"
                        >
                          Karrierút részletek megtekintése
                        </Button>
                        <Button
                          onClick={() => setActiveTab("recommend")}
                        >
                          Személyes ajánlások kérése
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Target className="h-16 w-16 text-neutral-300 mb-4" />
                      <h3 className="text-xl font-medium text-neutral-700 mb-2">Készség elemzés</h3>
                      <p className="text-neutral-500 max-w-md">
                        Adja meg jelenlegi készségeit és válasszon karrierutat a készségek elemzéséhez
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Career Recommendation Tab */}
          <TabsContent value="recommend">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recommendation Input Panel */}
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Karrierút ajánlások</CardTitle>
                  <CardDescription>
                    Személyre szabott karrierút javaslatok az Ön érdeklődési köre és háttere alapján
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Érdeklődési körök
                    </label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={currentInterest}
                        onChange={(e) => setCurrentInterest(e.target.value)}
                        placeholder="Pl. adatelemzés"
                        onKeyPress={(e) => e.key === "Enter" && addInterest()}
                      />
                      <Button 
                        type="button" 
                        onClick={addInterest}
                        size="sm"
                        className="shrink-0"
                      >
                        Hozzáadás
                      </Button>
                    </div>
                    
                    {interests.length > 0 && (
                      <div className="mt-4">
                        <div className="text-sm font-medium text-neutral-700 mb-2">Megadott érdeklődési körök:</div>
                        <div className="flex flex-wrap gap-2">
                          {interests.map((interest, idx) => (
                            <Badge 
                              key={idx} 
                              className="bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer"
                              onClick={() => removeInterest(interest)}
                            >
                              {interest} ✕
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {userSkills.length > 0 && (
                    <div className="mb-6">
                      <div className="text-sm font-medium text-neutral-700 mb-2">Felhasználható készségek:</div>
                      <div className="flex flex-wrap gap-2">
                        {userSkills.map((skill, idx) => (
                          <Badge 
                            key={idx} 
                            className="bg-indigo-100 text-indigo-800"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Háttér információk
                    </label>
                    <Textarea
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      placeholder="Röviden írja le tanulmányi és szakmai hátterét, valamint karriercéljait..."
                      rows={4}
                    />
                  </div>

                  <Button 
                    onClick={submitCareerRecommendations} 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    disabled={loadingRecommendations || interests.length === 0 || !background}
                  >
                    {loadingRecommendations ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Ajánlások generálása...
                      </>
                    ) : (
                      <>Karrierút ajánlások kérése</>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Recommendation Results Panel */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Személyre szabott ajánlások</CardTitle>
                  <CardDescription>
                    Az Ön profiljához illeszkedő karrierlehetőségek
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingRecommendations ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
                      <p className="text-neutral-600">Személyre szabott ajánlások generálása...</p>
                    </div>
                  ) : recommendations ? (
                    <div>
                      <div className="mb-8">
                        <SectionHeader
                          icon={<Sparkles className="h-5 w-5" />}
                          title="Ajánlott karrierutak"
                          subtitle="Az Ön profiljához legjobban illeszkedő karrierlehetőségek"
                        />
                        
                        <p className="text-neutral-700 mb-6">{recommendations.explanation}</p>
                        
                        <div className="space-y-4">
                          {recommendations.careers.map((career, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="p-4 border border-indigo-100 rounded-lg bg-gradient-to-r from-indigo-50 to-transparent"
                            >
                              <div className="flex items-center mb-2">
                                <Briefcase className="h-5 w-5 text-indigo-600 mr-2" />
                                <h4 className="font-medium text-lg text-neutral-800">{career}</h4>
                              </div>
                              <div className="flex mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mr-2 text-indigo-600 border-indigo-200"
                                  onClick={() => {
                                    setSelectedCareer(career);
                                    fetchCareerInfo(career);
                                    setActiveTab("explore");
                                  }}
                                >
                                  Részletek megtekintése
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-indigo-600 hover:bg-indigo-700"
                                  onClick={() => {
                                    setSelectedCareer(career);
                                    setActiveTab("skills");
                                  }}
                                >
                                  Készségek elemzése
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="flex flex-col items-center text-center">
                        <Lightbulb className="h-8 w-8 text-amber-500 mb-3" />
                        <h4 className="font-medium text-lg text-neutral-800 mb-2">Következő lépések</h4>
                        <p className="text-neutral-600 mb-4 max-w-md">
                          Fedezze fel részletesebben a javasolt karrierutakat, elemezze készségeit és 
                          tekintse meg a kapcsolódó kurzusajánlatokat.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                          <Button
                            onClick={() => setActiveTab("explore")}
                            variant="outline"
                          >
                            Karrierutak felfedezése
                          </Button>
                          <Button
                            onClick={() => setActiveTab("skills")}
                          >
                            Készségek elemzése
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Sparkles className="h-16 w-16 text-neutral-300 mb-4" />
                      <h3 className="text-xl font-medium text-neutral-700 mb-2">Karrierút ajánlások</h3>
                      <p className="text-neutral-500 max-w-md">
                        Adja meg érdeklődési köreit és háttér információit a személyre szabott ajánlásokhoz
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default AICareerPathVisualization;