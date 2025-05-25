import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  BrainCircuit, 
  Lightbulb, 
  Rocket, 
  Target, 
  User, 
  Book, 
  Code, 
  Briefcase, 
  PieChart, 
  HeartHandshake,
  Microscope,
  Palette,
  Megaphone,
  Building,
  LucideIcon,
  ArrowRight,
  Check,
  Sparkles,
  Star,
  GraduationCap
} from "lucide-react";

// Interface for the final results
interface CareerAssessmentResult {
  topCareerPaths: string[];
  skillStrengths: {
    category: string;
    score: number;
  }[];
  personalityTraits: string[];
  learningStylePreference: string;
  recommendedCourses: {
    id: number;
    title: string;
    description: string;
    university: string;
  }[];
  developmentSuggestions: string[];
}

// Questions with their types and possible answers
interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'slider' | 'multi-select';
  category: 'personality' | 'skills' | 'interests' | 'values' | 'learning-style';
  options?: {
    id: string;
    text: string;
    icon?: React.ReactNode;
    category?: string;
  }[];
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

interface StageConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

// Predefined career areas with icons
const careerAreas = [
  { id: 'tech', name: 'Technológia', icon: <Code className="h-5 w-5" />, color: 'text-blue-600' },
  { id: 'business', name: 'Üzleti élet', icon: <Briefcase className="h-5 w-5" />, color: 'text-emerald-600' },
  { id: 'analytics', name: 'Analitika', icon: <PieChart className="h-5 w-5" />, color: 'text-purple-600' },
  { id: 'social', name: 'Szociális terület', icon: <HeartHandshake className="h-5 w-5" />, color: 'text-pink-600' },
  { id: 'science', name: 'Tudomány', icon: <Microscope className="h-5 w-5" />, color: 'text-teal-600' },
  { id: 'art', name: 'Művészet és dizájn', icon: <Palette className="h-5 w-5" />, color: 'text-amber-600' },
  { id: 'media', name: 'Média és kommunikáció', icon: <Megaphone className="h-5 w-5" />, color: 'text-red-600' },
  { id: 'management', name: 'Vezetés és menedzsment', icon: <Building className="h-5 w-5" />, color: 'text-indigo-600' },
];

// Stages of the assessment
const stages: StageConfig[] = [
  { 
    id: 'intro', 
    title: 'Kezdő lépések', 
    description: 'Ismerd meg a folyamatot és kezdd el a karrierfeltárást',
    icon: <Rocket className="h-6 w-6" />,
    color: 'bg-blue-500'
  },
  { 
    id: 'personality', 
    title: 'Személyiséged', 
    description: 'Fedezd fel, milyen típusú munkakörnyezet illik hozzád',
    icon: <User className="h-6 w-6" />,
    color: 'bg-purple-500'
  },
  { 
    id: 'skills', 
    title: 'Készségeid', 
    description: 'Azonosítsd meglévő és fejlesztendő készségeidet',
    icon: <Target className="h-6 w-6" />,
    color: 'bg-emerald-500'
  },
  { 
    id: 'interests', 
    title: 'Érdeklődési köreid', 
    description: 'Fedezd fel, mely területek iránt érdeklődsz leginkább',
    icon: <Lightbulb className="h-6 w-6" />,
    color: 'bg-amber-500'
  },
  { 
    id: 'values', 
    title: 'Értékrended', 
    description: 'Határozd meg, mi fontos számodra a karrieredben',
    icon: <HeartHandshake className="h-6 w-6" />,
    color: 'bg-red-500'
  },
  { 
    id: 'learning', 
    title: 'Tanulási stílusod', 
    description: 'Ismerd meg, hogyan tanulsz a leghatékonyabban',
    icon: <Book className="h-6 w-6" />,
    color: 'bg-teal-500'
  },
  { 
    id: 'results', 
    title: 'Eredmények', 
    description: 'Fedezd fel a számodra legmegfelelőbb karrierutakat',
    icon: <BrainCircuit className="h-6 w-6" />,
    color: 'bg-indigo-500'
  }
];

// Questionnaire items
const questions: Question[] = [
  // Personality questions
  {
    id: 'work-environment',
    question: 'Milyen munkakörnyezetben érzed magad a legkomfortosabban?',
    type: 'multiple-choice',
    category: 'personality',
    options: [
      { id: 'structured', text: 'Strukturált, világos elvárásokkal és rutinokkal', category: 'analytical' },
      { id: 'flexible', text: 'Rugalmas, változatos feladatokkal és kihívásokkal', category: 'creative' },
      { id: 'collaborative', text: 'Csapatmunka, sok interakcióval és együttműködéssel', category: 'social' },
      { id: 'independent', text: 'Önálló munka, nagy fokú autonómiával', category: 'independent' }
    ]
  },
  {
    id: 'work-pressure',
    question: 'Hogyan kezeled a munkahelyi nyomást és határidőket?',
    type: 'multiple-choice',
    category: 'personality',
    options: [
      { id: 'planned', text: 'Előre tervezek és strukturáltan haladok', category: 'analytical' },
      { id: 'adaptive', text: 'Rugalmasan alkalmazkodom a változó helyzetekhez', category: 'adaptable' },
      { id: 'pressure', text: 'A nyomás alatt jobban teljesítek', category: 'pressure-driven' },
      { id: 'balanced', text: 'Egyensúlyra törekszem és elkerülöm a túlzott stresszt', category: 'balanced' }
    ]
  },
  {
    id: 'decision-making',
    question: 'Hogyan hozol döntéseket a munkád során?',
    type: 'multiple-choice',
    category: 'personality',
    options: [
      { id: 'logical', text: 'Logikus elemzéssel és adatok alapján', category: 'analytical' },
      { id: 'intuitive', text: 'Ösztönösen, megérzéseimre hallgatva', category: 'intuitive' },
      { id: 'collaborative', text: 'Másokkal konzultálva, közös megbeszélés alapján', category: 'collaborative' },
      { id: 'values', text: 'Értékrendem és etikai alapelveim mentén', category: 'principled' }
    ]
  },
  
  // Skills assessment
  {
    id: 'technical-skills',
    question: 'Értékeld technikai/műszaki készségeidet',
    type: 'slider',
    category: 'skills',
    min: 1,
    max: 10,
    minLabel: 'Kezdő',
    maxLabel: 'Szakértő'
  },
  {
    id: 'communication-skills',
    question: 'Értékeld kommunikációs készségeidet',
    type: 'slider',
    category: 'skills',
    min: 1,
    max: 10,
    minLabel: 'Fejlesztendő',
    maxLabel: 'Kiváló'
  },
  {
    id: 'analytical-skills',
    question: 'Értékeld analitikus/elemző készségeidet',
    type: 'slider',
    category: 'skills',
    min: 1,
    max: 10,
    minLabel: 'Alapszintű',
    maxLabel: 'Fejlett'
  },
  {
    id: 'leadership-skills',
    question: 'Értékeld vezetői készségeidet',
    type: 'slider',
    category: 'skills',
    min: 1,
    max: 10,
    minLabel: 'Kezdő',
    maxLabel: 'Tapasztalt'
  },
  {
    id: 'creative-skills',
    question: 'Értékeld kreatív készségeidet',
    type: 'slider',
    category: 'skills',
    min: 1,
    max: 10,
    minLabel: 'Mérsékelt',
    maxLabel: 'Kiemelkedő'
  },
  
  // Interests
  {
    id: 'interest-areas',
    question: 'Mely szakmai területek iránt érdeklődsz leginkább? (Válassz maximum hármat)',
    type: 'multi-select',
    category: 'interests',
    options: [
      { id: 'tech', text: 'Technológia és informatika', icon: <Code className="h-5 w-5" /> },
      { id: 'business', text: 'Üzlet és menedzsment', icon: <Briefcase className="h-5 w-5" /> },
      { id: 'data', text: 'Adatelemzés és kutatás', icon: <PieChart className="h-5 w-5" /> },
      { id: 'design', text: 'Dizájn és kreativitás', icon: <Palette className="h-5 w-5" /> },
      { id: 'health', text: 'Egészségügy és jólét', icon: <HeartHandshake className="h-5 w-5" /> },
      { id: 'education', text: 'Oktatás és képzés', icon: <Book className="h-5 w-5" /> },
      { id: 'marketing', text: 'Marketing és kommunikáció', icon: <Megaphone className="h-5 w-5" /> },
      { id: 'science', text: 'Tudomány és kutatás', icon: <Microscope className="h-5 w-5" /> }
    ]
  },
  {
    id: 'daily-activities',
    question: 'Milyen típusú tevékenységeket végeznél szívesen a mindennapi munkád során?',
    type: 'multi-select',
    category: 'interests',
    options: [
      { id: 'problem-solving', text: 'Problémák megoldása és kihívások leküzdése' },
      { id: 'creating', text: 'Új dolgok létrehozása és tervezése' },
      { id: 'analyzing', text: 'Adatok elemzése és következtetések levonása' },
      { id: 'helping', text: 'Mások segítése és támogatása' },
      { id: 'organizing', text: 'Folyamatok szervezése és rendszerezése' },
      { id: 'presenting', text: 'Prezentálás és ötletek kommunikálása' },
      { id: 'innovating', text: 'Innoválás és új megközelítések kidolgozása' },
      { id: 'leading', text: 'Csapatok vezetése és mentorálása' }
    ]
  },
  
  // Values
  {
    id: 'career-values',
    question: 'Mi a legfontosabb számodra a karrieredben?',
    type: 'multiple-choice',
    category: 'values',
    options: [
      { id: 'stability', text: 'Stabilitás és biztonság', category: 'security' },
      { id: 'growth', text: 'Növekedés és fejlődési lehetőségek', category: 'growth' },
      { id: 'impact', text: 'Társadalmi hatás és értékteremtés', category: 'impact' },
      { id: 'balance', text: 'Munka-magánélet egyensúly', category: 'balance' },
      { id: 'autonomy', text: 'Autonómia és függetlenség', category: 'independence' },
      { id: 'recognition', text: 'Elismerés és megbecsülés', category: 'recognition' }
    ]
  },
  {
    id: 'motivation',
    question: 'Mi motivál téged leginkább a munkádban?',
    type: 'multiple-choice',
    category: 'values',
    options: [
      { id: 'achievement', text: 'Célok elérése és eredmények felmutatása', category: 'achievement' },
      { id: 'relationships', text: 'Kapcsolatok építése és csapatmunka', category: 'relationships' },
      { id: 'learning', text: 'Folyamatos tanulás és fejlődés', category: 'learning' },
      { id: 'creativity', text: 'Kreativitás és önkifejezés', category: 'creativity' },
      { id: 'leadership', text: 'Vezetés és mások inspirálása', category: 'leadership' },
      { id: 'financial', text: 'Anyagi biztonság és juttatások', category: 'financial' }
    ]
  },
  
  // Learning style
  {
    id: 'learning-preference',
    question: 'Hogyan tanulsz a leghatékonyabban?',
    type: 'multiple-choice',
    category: 'learning-style',
    options: [
      { id: 'visual', text: 'Vizuálisan, ábrák és diagramok segítségével', category: 'visual' },
      { id: 'auditory', text: 'Hallás útján, előadások és beszélgetések révén', category: 'auditory' },
      { id: 'reading', text: 'Olvasás és szövegek feldolgozása által', category: 'reading' },
      { id: 'practical', text: 'Gyakorlati tapasztalatszerzés és kísérletezés által', category: 'kinesthetic' }
    ]
  },
  {
    id: 'learning-pace',
    question: 'Milyen tanulási ütemet preferálsz?',
    type: 'multiple-choice',
    category: 'learning-style',
    options: [
      { id: 'structured', text: 'Strukturált, fokozatos haladás világos útmutatással', category: 'structured' },
      { id: 'self-paced', text: 'Önálló, saját tempójú tanulás rugalmas időbeosztással', category: 'self-paced' },
      { id: 'intensive', text: 'Intenzív, mélyreható tanulás rövid időszak alatt', category: 'intensive' },
      { id: 'collaborative', text: 'Kollaboratív tanulás másokkal együttműködve', category: 'collaborative' }
    ]
  }
];

// Mock courses for recommendations
const courses = [
  {
    id: 1,
    title: "Programozási alapok: JavaScript",
    description: "Ismerkedj meg a webfejlesztés alapjaival és a JavaScript programozási nyelvvel",
    university: "BME",
    categories: ["tech", "data"]
  },
  {
    id: 2,
    title: "Adatelemzés Python-nal",
    description: "Sajátítsd el az adatelemzés alapjait a Python programozási nyelv segítségével",
    university: "ELTE",
    categories: ["data", "tech"]
  },
  {
    id: 3,
    title: "Üzleti stratégia alapjai",
    description: "Ismerd meg az üzleti stratégia alapelveit és alkalmazását a gyakorlatban",
    university: "Corvinus Egyetem",
    categories: ["business", "management"]
  },
  {
    id: 4,
    title: "Digitális marketing mesterkurzus",
    description: "Tanulj hatékony digitális marketing stratégiákat és eszközöket",
    university: "BME",
    categories: ["marketing", "business"]
  },
  {
    id: 5,
    title: "UX/UI tervezés alapjai",
    description: "Sajátítsd el a felhasználói élmény és felület tervezés alapelveit",
    university: "MOME",
    categories: ["design", "tech"]
  },
  {
    id: 6,
    title: "Projektmenedzsment módszertanok",
    description: "Ismerd meg a modern projektmenedzsment módszertanokat és alkalmazásukat",
    university: "Corvinus Egyetem",
    categories: ["business", "management"]
  },
  {
    id: 7,
    title: "Adatvizualizáció és BI eszközök",
    description: "Tanulj hatékony adatvizualizációs technikákat és üzleti intelligencia eszközöket",
    university: "BME",
    categories: ["data", "business"]
  },
  {
    id: 8,
    title: "Mesterséges intelligencia alapjai",
    description: "Ismerkedj meg a mesterséges intelligencia és gépi tanulás alapelveivel",
    university: "ELTE",
    categories: ["tech", "data", "science"]
  }
];

const CareerQuestionnaire: React.FC = () => {
  const { toast } = useToast();
  const [currentStage, setCurrentStage] = useState<string>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [result, setResult] = useState<CareerAssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stageQuestions, setStageQuestions] = useState<Question[]>([]);
  
  // Calculate current progress
  const currentStageIndex = stages.findIndex(s => s.id === currentStage);
  const totalStages = stages.length - 1; // Exclude intro and results stages
  const progress = (currentStageIndex / totalStages) * 100;
  
  // Set up questions for the current stage
  useEffect(() => {
    if (currentStage === 'personality') {
      setStageQuestions(questions.filter(q => q.category === 'personality'));
    } else if (currentStage === 'skills') {
      setStageQuestions(questions.filter(q => q.category === 'skills'));
    } else if (currentStage === 'interests') {
      setStageQuestions(questions.filter(q => q.category === 'interests'));
    } else if (currentStage === 'values') {
      setStageQuestions(questions.filter(q => q.category === 'values'));
    } else if (currentStage === 'learning') {
      setStageQuestions(questions.filter(q => q.category === 'learning-style'));
    } else {
      setStageQuestions([]);
    }
    
    setCurrentQuestionIndex(0);
  }, [currentStage]);
  
  // Handle question answer
  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  // Move to next question or stage
  const handleNext = () => {
    const currentQuestion = stageQuestions[currentQuestionIndex];
    
    // Check if question is answered
    if (currentQuestion && !answers[currentQuestion.id]) {
      toast({
        title: "Kérjük, válaszolj a kérdésre",
        description: "A folytatáshoz szükséges válaszolnod a jelenlegi kérdésre.",
        variant: "destructive"
      });
      return;
    }
    
    // If there are more questions in this stage
    if (currentQuestionIndex < stageQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Move to next stage
      const nextStageIndex = currentStageIndex + 1;
      if (nextStageIndex < stages.length) {
        setCurrentStage(stages[nextStageIndex].id);
      }
    }
  };
  
  // Move to previous question or stage
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      // Move to previous stage
      const prevStageIndex = currentStageIndex - 1;
      if (prevStageIndex >= 0) {
        setCurrentStage(stages[prevStageIndex].id);
        // Set to last question of previous stage
        const prevStageQuestions = questions.filter(q => q.category === stages[prevStageIndex].id);
        setCurrentQuestionIndex(prevStageQuestions.length - 1);
      }
    }
  };
  
  // Handle completion of questionnaire
  const handleComplete = () => {
    setIsLoading(true);
    
    // Analyze answers and generate results
    setTimeout(() => {
      // Ideally this would be an API call to process the answers
      // For now, we'll generate some mock results
      
      // Calculate top career areas based on interests and skills
      const interestAreas = answers['interest-areas'] || [];
      const dailyActivities = answers['daily-activities'] || [];
      
      // Map interests to career paths
      const techScore = answers['technical-skills'] || 0;
      const analyticScore = answers['analytical-skills'] || 0;
      const creativeScore = answers['creative-skills'] || 0;
      const communicationScore = answers['communication-skills'] || 0;
      const leadershipScore = answers['leadership-skills'] || 0;
      
      let topCareerPaths: string[] = [];
      
      // Based on interests and skills, determine top career paths
      if (interestAreas.includes('tech') && techScore > 6) {
        topCareerPaths.push('Szoftverfejlesztő');
      }
      
      if (interestAreas.includes('data') && analyticScore > 6) {
        topCareerPaths.push('Adattudós');
      }
      
      if (interestAreas.includes('design') && creativeScore > 6) {
        topCareerPaths.push('UX/UI Designer');
      }
      
      if (interestAreas.includes('business') && leadershipScore > 6) {
        topCareerPaths.push('Projektmenedzser');
      }
      
      if (interestAreas.includes('marketing') && communicationScore > 6) {
        topCareerPaths.push('Digitális marketing szakértő');
      }
      
      // If not enough career paths, add some based on highest skills
      if (topCareerPaths.length < 3) {
        const skills = [
          { name: 'Szoftverfejlesztő', score: techScore },
          { name: 'Adatelemzés szakértő', score: analyticScore },
          { name: 'UX/UI Designer', score: creativeScore },
          { name: 'Projektmenedzser', score: leadershipScore },
          { name: 'Marketing szakértő', score: communicationScore }
        ].sort((a, b) => b.score - a.score);
        
        for (const skill of skills) {
          if (!topCareerPaths.includes(skill.name) && topCareerPaths.length < 3) {
            topCareerPaths.push(skill.name);
          }
        }
      }
      
      // Identify skill strengths
      const skillStrengths = [
        { category: 'Technikai', score: techScore },
        { category: 'Analitikus', score: analyticScore },
        { category: 'Kreatív', score: creativeScore },
        { category: 'Kommunikációs', score: communicationScore },
        { category: 'Vezetői', score: leadershipScore }
      ].sort((a, b) => b.score - a.score);
      
      // Determine personality traits
      const personality = answers['work-environment'] || '';
      const decisionMaking = answers['decision-making'] || '';
      const workPressure = answers['work-pressure'] || '';
      
      let personalityTraits: string[] = [];
      
      if (personality === 'structured') personalityTraits.push('Strukturált');
      if (personality === 'flexible') personalityTraits.push('Rugalmas');
      if (personality === 'collaborative') personalityTraits.push('Csapatjátékos');
      if (personality === 'independent') personalityTraits.push('Önálló');
      
      if (decisionMaking === 'logical') personalityTraits.push('Analitikus gondolkodó');
      if (decisionMaking === 'intuitive') personalityTraits.push('Intuitív');
      if (decisionMaking === 'collaborative') personalityTraits.push('Konzultatív');
      if (decisionMaking === 'values') personalityTraits.push('Értékvezérelt');
      
      if (workPressure === 'planned') personalityTraits.push('Tervező');
      if (workPressure === 'adaptive') personalityTraits.push('Adaptív');
      if (workPressure === 'pressure') personalityTraits.push('Nyomás alatt teljesítő');
      if (workPressure === 'balanced') personalityTraits.push('Egyensúlykereső');
      
      // Learning style preference
      const learningPreference = answers['learning-preference'] || '';
      let learningStylePreference = '';
      
      if (learningPreference === 'visual') learningStylePreference = 'Vizuális tanuló';
      if (learningPreference === 'auditory') learningStylePreference = 'Auditív tanuló';
      if (learningPreference === 'reading') learningStylePreference = 'Olvasás útján tanuló';
      if (learningPreference === 'practical') learningStylePreference = 'Gyakorlati tanuló';
      
      // Recommend courses based on career paths and interests
      const relevantCategories = interestAreas;
      let recommendedCourses = courses
        .filter(course => {
          return course.categories.some(category => relevantCategories.includes(category));
        })
        .slice(0, 3);
      
      // Development suggestions based on skills and interests
      let developmentSuggestions: string[] = [];
      
      // Find lowest scoring skills
      const lowestSkills = [
        { name: 'technikai', score: techScore },
        { name: 'analitikus', score: analyticScore },
        { name: 'kreatív', score: creativeScore },
        { name: 'kommunikációs', score: communicationScore },
        { name: 'vezetői', score: leadershipScore }
      ].sort((a, b) => a.score - b.score);
      
      // Add suggestions for lowest scoring skills
      if (lowestSkills[0].score < 5) {
        developmentSuggestions.push(`Fejleszd ${lowestSkills[0].name} készségeidet releváns kurzusok és gyakorlati projektek által`);
      }
      
      if (lowestSkills[1].score < 6) {
        developmentSuggestions.push(`Erősítsd ${lowestSkills[1].name} képességeidet, amelyek fontosak lehetnek a jövőbeli karrieredben`);
      }
      
      // Add suggestion based on learning style
      developmentSuggestions.push(`A ${learningStylePreference.toLowerCase()} típusodnak megfelelően válassz olyan tanulási módszereket, amelyek illeszkednek a stílusodhoz`);
      
      // Set the result
      setResult({
        topCareerPaths,
        skillStrengths: skillStrengths.slice(0, 3),
        personalityTraits,
        learningStylePreference,
        recommendedCourses,
        developmentSuggestions
      });
      
      setIsLoading(false);
      setCurrentStage('results');
    }, 2000);
  };
  
  // Start the assessment
  const startAssessment = () => {
    setCurrentStage('personality');
  };
  
  // Restart the assessment
  const restartAssessment = () => {
    setAnswers({});
    setResult(null);
    setCurrentStage('intro');
    setCurrentQuestionIndex(0);
  };
  
  // Render intro screen
  const renderIntroScreen = () => (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-8 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="mb-6 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
              <BrainCircuit className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-2">Karrier Felfedező Kaland</h2>
          <p className="text-neutral-600 text-center mb-8">
            Fedezze fel az Önnek leginkább megfelelő karrierutat interaktív kérdőívünk segítségével. 
            Személyre szabott ajánlásokat kap készségei, érdeklődési körei és személyisége alapján.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-center mb-2">Fedezze fel készségeit</h3>
              <p className="text-sm text-neutral-500 text-center">
                Azonosítsa erősségeit és fejlesztendő területeit
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3">
                <Lightbulb className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-center mb-2">Találja meg karrierútját</h3>
              <p className="text-sm text-neutral-500 text-center">
                Fedezze fel, mely karrierutak illenek Önhöz leginkább
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-center mb-2">Kapjon személyre szabott tervet</h3>
              <p className="text-sm text-neutral-500 text-center">
                Ajánlott kurzusok és fejlesztési stratégiák a sikerhez
              </p>
            </div>
          </div>
          
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-8">
            <h3 className="font-medium text-indigo-800 mb-2 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-indigo-600" />
              A teszt menete
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">1</div>
                <p className="text-neutral-600">A teszt kb. <strong>5-10 percet</strong> vesz igénybe, és <strong>15 kérdésből</strong> áll</p>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">2</div>
                <p className="text-neutral-600">Válaszoljon őszintén a kérdésekre, nincsenek jó vagy rossz válaszok</p>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">3</div>
                <p className="text-neutral-600">Az eredményt a végén részletes jelentés formájában kapja meg</p>
              </li>
            </ul>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={startAssessment}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Teszt indítása
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
  
  // Render assessment questions
  const renderQuestions = () => {
    const currentQuestion = stageQuestions[currentQuestionIndex];
    if (!currentQuestion) return null;
    
    const currentStageConfig = stages.find(s => s.id === currentStage);
    
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div 
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-neutral-100">
            <div className="flex items-center mb-4">
              {currentStageConfig && (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white mr-3 ${currentStageConfig.color}`}>
                  {currentStageConfig.icon}
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{currentStageConfig?.title}</h3>
                <p className="text-sm text-neutral-500">{currentStageConfig?.description}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Haladás</span>
                <span>{currentQuestionIndex + 1}/{stageQuestions.length} kérdés</span>
              </div>
              <Progress value={(currentQuestionIndex + 1) / stageQuestions.length * 100} className="h-2" />
            </div>
          </div>
          
          <div className="p-6">
            <h4 className="text-xl font-medium mb-6">{currentQuestion.question}</h4>
            
            {currentQuestion.type === 'multiple-choice' && (
              <RadioGroup
                value={answers[currentQuestion.id] || ''}
                onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
                className="space-y-3"
              >
                {currentQuestion.options?.map((option) => (
                  <div 
                    key={option.id} 
                    className={`flex items-center space-x-2 p-3 rounded-lg border ${
                      answers[currentQuestion.id] === option.id 
                        ? 'bg-indigo-50 border-indigo-200' 
                        : 'border-neutral-200 hover:bg-neutral-50'
                    } cursor-pointer transition-colors`}
                    onClick={() => handleAnswer(currentQuestion.id, option.id)}
                  >
                    <RadioGroupItem value={option.id} id={option.id} className="text-indigo-600" />
                    <Label 
                      htmlFor={option.id} 
                      className={`flex-1 cursor-pointer ${answers[currentQuestion.id] === option.id ? 'text-indigo-800 font-medium' : ''}`}
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {currentQuestion.type === 'slider' && (
              <div className="py-6">
                <div className="mb-10 pt-4">
                  <Slider
                    defaultValue={[answers[currentQuestion.id] || currentQuestion.min || 1]}
                    min={currentQuestion.min || 1}
                    max={currentQuestion.max || 10}
                    step={1}
                    onValueChange={(values) => handleAnswer(currentQuestion.id, values[0])}
                  />
                  <div className="flex justify-between mt-2 text-sm text-neutral-500">
                    <span>{currentQuestion.minLabel || 'Minimális'}</span>
                    <span>{currentQuestion.maxLabel || 'Maximális'}</span>
                  </div>
                </div>
                <div className="text-center font-medium text-lg mt-6">
                  {answers[currentQuestion.id] || ''}
                </div>
              </div>
            )}
            
            {currentQuestion.type === 'multi-select' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentQuestion.options?.map((option) => {
                    const isSelected = (answers[currentQuestion.id] || []).includes(option.id);
                    return (
                      <div 
                        key={option.id}
                        className={`p-3 rounded-lg border ${
                          isSelected 
                            ? 'bg-indigo-50 border-indigo-200' 
                            : 'border-neutral-200 hover:bg-neutral-50'
                        } cursor-pointer transition-colors flex items-start`}
                        onClick={() => {
                          const currentSelections = answers[currentQuestion.id] || [];
                          let newSelections;
                          
                          if (isSelected) {
                            newSelections = currentSelections.filter((id: string) => id !== option.id);
                          } else {
                            // Limit to max 3 selections
                            if (currentSelections.length < 3) {
                              newSelections = [...currentSelections, option.id];
                            } else {
                              newSelections = currentSelections;
                              toast({
                                title: "Maximum 3 választás",
                                description: "Kérjük, maximum 3 opciót válassz.",
                                variant: "destructive"
                              });
                            }
                          }
                          
                          handleAnswer(currentQuestion.id, newSelections);
                        }}
                      >
                        <Checkbox
                          checked={isSelected}
                          className="mr-3 mt-0.5 text-indigo-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center">
                            {option.icon && <span className="mr-2 text-indigo-600">{option.icon}</span>}
                            <span className={isSelected ? 'font-medium text-indigo-800' : ''}>{option.text}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {currentQuestion.id === 'interest-areas' && (
                  <p className="text-sm text-neutral-500 mt-2">Válassz maximum 3 területet, amelyek leginkább érdekelnek.</p>
                )}
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStageIndex === 1 && currentQuestionIndex === 0}
            >
              Vissza
            </Button>
            
            {currentStageIndex === stages.length - 2 && currentQuestionIndex === stageQuestions.length - 1 ? (
              <Button
                onClick={handleComplete}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                {isLoading ? (
                  <>Elemzés folyamatban...</>
                ) : (
                  <>
                    Befejezés és eredmények
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Következő
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    );
  };
  
  // Render results screen
  const renderResults = () => {
    if (!result) return null;
    
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-8 bg-gradient-to-r from-indigo-50 to-purple-50 text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto flex items-center justify-center mb-4"
            >
              <Sparkles className="h-10 w-10 text-white" />
            </motion.div>
            
            <h2 className="text-3xl font-bold mb-2">Karrierértékelésed eredménye</h2>
            <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
              A válaszaid alapján azonosítottuk azokat a karrierutakat, amelyek legjobban illeszkednek készségeidhez, 
              érdeklődési köreidhez és személyiségedhez.
            </p>
          </div>
          
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Target className="mr-3 h-6 w-6 text-indigo-600" />
                Ajánlott karrierutak
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.topCareerPaths.map((career, index) => (
                  <motion.div
                    key={career}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white border border-indigo-100 rounded-xl p-5 shadow-sm"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                        {index === 0 ? (
                          <Star className="h-5 w-5" />
                        ) : (
                          <Check className="h-5 w-5" />
                        )}
                      </div>
                      <h4 className="font-semibold text-lg">{career}</h4>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-neutral-500">Illeszkedés</span>
                        <span className="font-medium text-indigo-700">
                          {index === 0 ? '98%' : index === 1 ? '85%' : '75%'}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 h-2 rounded-full">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" 
                          style={{ width: index === 0 ? '98%' : index === 1 ? '85%' : '75%' }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-neutral-600">
                      {index === 0 ? (
                        <p>Kiváló illeszkedés a készségeid és érdeklődési köreid alapján.</p>
                      ) : (
                        <p>Jó egyezés a személyiséged és értékrended alapján.</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <Separator className="my-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <User className="mr-3 h-6 w-6 text-purple-600" />
                  Személyiséged és tanulási stílusod
                </h3>
                
                <Card className="border-purple-100">
                  <CardHeader>
                    <CardTitle className="text-lg">Személyiség jellemzők</CardTitle>
                    <CardDescription>A munkastílusodat meghatározó tulajdonságok</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {result.personalityTraits.map((trait) => (
                        <Badge key={trait} variant="secondary" className="bg-purple-100 text-purple-800 py-1">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h4 className="font-medium mb-2 text-purple-800">Tanulási stílus preferencia</h4>
                      <p className="text-neutral-700">
                        <span className="font-medium">{result.learningStylePreference}</span> – 
                        A leghatékonyabban akkor tanulsz, amikor a tananyag illeszkedik ehhez a tanulási stílushoz.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Target className="mr-3 h-6 w-6 text-emerald-600" />
                  Erősségeid
                </h3>
                
                <Card className="border-emerald-100">
                  <CardHeader>
                    <CardTitle className="text-lg">Kiemelkedő készségeid</CardTitle>
                    <CardDescription>A karrieredben hasznosítható erősségek</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.skillStrengths.map((skill) => (
                        <div key={skill.category}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-neutral-700">{skill.category} készségek</span>
                            <span className="text-sm font-medium text-emerald-700">{skill.score}/10</span>
                          </div>
                          <div className="w-full bg-neutral-100 h-2 rounded-full">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full" 
                              style={{ width: `${skill.score * 10}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Separator className="my-8" />
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <GraduationCap className="mr-3 h-6 w-6 text-blue-600" />
                Ajánlott kurzusok
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.recommendedCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-white border border-blue-100 rounded-xl overflow-hidden shadow-sm"
                  >
                    <div className="p-4 border-b border-blue-50 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <h4 className="font-semibold text-lg mb-1">{course.title}</h4>
                      <p className="text-sm text-neutral-500">{course.university}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-neutral-600 mb-4">{course.description}</p>
                      <Button variant="outline" size="sm" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
                        Kurzus megtekintése
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <Separator className="my-8" />
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Lightbulb className="mr-3 h-6 w-6 text-amber-600" />
                Fejlesztési javaslatok
              </h3>
              
              <Card className="border-amber-100">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {result.developmentSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                        className="flex items-start bg-amber-50 p-4 rounded-lg"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mr-3 flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-neutral-700">{suggestion}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-center mt-10">
              <Button
                onClick={restartAssessment}
                variant="outline"
                className="mr-4"
              >
                Teszt újraindítása
              </Button>
              
              <Button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                Mentés és megosztás
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };
  
  return (
    <div className="py-12">
      {currentStage !== 'intro' && currentStage !== 'results' && (
        <div className="max-w-5xl mx-auto mb-8 px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Karrier Felfedező Teszt</h2>
            <div className="text-sm text-neutral-500">Lépés: {currentStageIndex}/{totalStages}</div>
          </div>
          
          <div className="w-full bg-neutral-100 h-2 rounded-full mb-8">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex overflow-x-auto pb-4 mb-2 no-scrollbar">
            <div className="flex space-x-1 min-w-max">
              {stages.slice(1, -1).map((stage, index) => {
                const isActive = currentStage === stage.id;
                const isPast = stages.findIndex(s => s.id === currentStage) > index + 1;
                const stageNumber = index + 1;
                
                return (
                  <div
                    key={stage.id}
                    className={`flex items-center ${isPast || isActive ? 'text-indigo-600' : 'text-neutral-400'}`}
                  >
                    {index > 0 && (
                      <div 
                        className={`h-px w-4 ${isPast ? 'bg-indigo-400' : 'bg-neutral-300'}`}
                      ></div>
                    )}
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        isActive 
                          ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500' 
                          : isPast 
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {isPast ? <Check className="h-4 w-4" /> : stageNumber}
                    </div>
                    <div className="ml-2 whitespace-nowrap text-sm font-medium">
                      {stage.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        {currentStage === 'intro' && renderIntroScreen()}
        {currentStage !== 'intro' && currentStage !== 'results' && renderQuestions()}
        {currentStage === 'results' && renderResults()}
      </AnimatePresence>
    </div>
  );
};

export default CareerQuestionnaire;