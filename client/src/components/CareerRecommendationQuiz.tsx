import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Check, 
  ChevronRight, 
  ArrowRight, 
  RotateCcw, 
  X, 
  LineChart,
  BarChart,
  Code,
  Shield,
  PenTool,
  TrendingUp,
  Users
} from 'lucide-react';
import { Link } from 'wouter';
import { careerPaths, careerCategories } from '@/data/careers';

// Quiz questions
const questions = [
  {
    id: 1,
    question: 'Milyen tevékenységet végez a legszívesebben?',
    options: [
      { id: 'a', text: 'Adatok elemzése és mintázatok keresése', categories: ['tech'], skills: ['Analitikus gondolkodás', 'Adatelemzés'] },
      { id: 'b', text: 'Kreatív tartalmak készítése és tervezése', categories: ['design', 'marketing'], skills: ['Kreativitás', 'Vizuális gondolkodás'] },
      { id: 'c', text: 'Emberekkel való kommunikáció és segítségnyújtás', categories: ['business', 'education'], skills: ['Kommunikáció', 'Empátia'] },
      { id: 'd', text: 'Technikai problémák megoldása és kódolás', categories: ['tech'], skills: ['Problémamegoldás', 'Programozás'] },
    ]
  },
  {
    id: 2,
    question: 'Melyik környezetben dolgozna legszívesebben?',
    options: [
      { id: 'a', text: 'Startupban, gyors tempóban, változatos feladatokkal', categories: ['tech', 'marketing'], skills: ['Alkalmazkodóképesség', 'Multitasking'] },
      { id: 'b', text: 'Nagyvállalatnál, biztos pozícióban, stabil karrierúttal', categories: ['business', 'finance'], skills: ['Rendszerezett munkavégzés', 'Csapatmunka'] },
      { id: 'c', text: 'Szabadúszóként, rugalmas időbeosztással', categories: ['design', 'marketing'], skills: ['Önálló munkavégzés', 'Időmenedzsment'] },
      { id: 'd', text: 'Oktatási vagy kutatási intézményben', categories: ['education', 'tech'], skills: ['Tudományos gondolkodás', 'Kutatói készségek'] },
    ]
  },
  {
    id: 3,
    question: 'Mi motiválja leginkább a munkájában?',
    options: [
      { id: 'a', text: 'Magas fizetés és anyagi biztonság', categories: ['finance', 'tech'], skills: ['Célorientáltság', 'Tárgyalóképesség'] },
      { id: 'b', text: 'Kreativitás és önkifejezés lehetősége', categories: ['design', 'marketing'], skills: ['Kreativitás', 'Innovatív gondolkodás'] },
      { id: 'c', text: 'Társadalmi hatás és mások segítése', categories: ['education', 'healthcare'], skills: ['Empátia', 'Szociális érzékenység'] },
      { id: 'd', text: 'Technológiai innovációk és fejlődés', categories: ['tech'], skills: ['Innovatív gondolkodás', 'Technológiai affinitás'] },
    ]
  },
  {
    id: 4,
    question: 'Melyik készségét tartja a legerősebbnek?',
    options: [
      { id: 'a', text: 'Logikus gondolkodás és problémamegoldás', categories: ['tech', 'finance'], skills: ['Logikus gondolkodás', 'Problémamegoldás'] },
      { id: 'b', text: 'Kommunikáció és emberekkel való bánásmód', categories: ['business', 'education'], skills: ['Kommunikáció', 'Interperszonális készségek'] },
      { id: 'c', text: 'Kreativitás és vizuális gondolkodás', categories: ['design', 'marketing'], skills: ['Kreativitás', 'Vizuális gondolkodás'] },
      { id: 'd', text: 'Szervezés és projektmenedzsment', categories: ['business'], skills: ['Szervezőkészség', 'Projektmenedzsment'] },
    ]
  },
  {
    id: 5,
    question: 'Hol látja magát 5 év múlva?',
    options: [
      { id: 'a', text: 'Vezetői pozícióban, csapatot irányítva', categories: ['business'], skills: ['Vezetői készségek', 'Stratégiai gondolkodás'] },
      { id: 'b', text: 'Elismert szakértőként a saját területén', categories: ['tech', 'design'], skills: ['Szakmai tudás', 'Folyamatos tanulás'] },
      { id: 'c', text: 'Sikeres vállalkozóként', categories: ['business', 'marketing'], skills: ['Vállalkozói szemlélet', 'Kockázatvállalás'] },
      { id: 'd', text: 'Nemzetközi munkakörnyezetben dolgozva', categories: ['tech', 'finance'], skills: ['Nyelvtudás', 'Kulturális nyitottság'] },
    ]
  }
];

interface QuizResults {
  categories: { [key: string]: number };
  skills: { [key: string]: number };
}

const CareerRecommendationQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [results, setResults] = useState<QuizResults>({
    categories: {},
    skills: {}
  });
  const [recommendedCareers, setRecommendedCareers] = useState<any[]>([]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const handleAnswer = (optionId: string) => {
    const newAnswers = [...answers, optionId];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate results
      calculateResults(newAnswers);
      setShowResults(true);
    }
  };

  const calculateResults = (userAnswers: string[]) => {
    const categoryScores: { [key: string]: number } = {};
    const skillScores: { [key: string]: number } = {};
    
    // Process all answers
    userAnswers.forEach((answerId, index) => {
      const question = questions[index];
      const selectedOption = question.options.find(option => option.id === answerId);
      
      if (selectedOption) {
        // Add points to categories
        selectedOption.categories.forEach(category => {
          categoryScores[category] = (categoryScores[category] || 0) + 1;
        });
        
        // Add points to skills
        selectedOption.skills.forEach(skill => {
          skillScores[skill] = (skillScores[skill] || 0) + 1;
        });
      }
    });
    
    setResults({
      categories: categoryScores,
      skills: skillScores
    });

    // Find recommended careers based on category scores
    findRecommendedCareers(categoryScores);
  };

  const findRecommendedCareers = (categoryScores: { [key: string]: number }) => {
    // Sort categories by score
    const sortedCategories = Object.entries(categoryScores)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
    
    if (sortedCategories.length > 0) {
      // Find careers that match top categories
      const topCategory = sortedCategories[0];
      const secondCategory = sortedCategories[1] || topCategory;
      
      const matched = careerPaths.filter(career => 
        career.category === topCategory || career.category === secondCategory
      );
      
      // Sort by trending and popular
      const sorted = [...matched].sort((a, b) => {
        if (a.isTrending && !b.isTrending) return -1;
        if (!a.isTrending && b.isTrending) return 1;
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return 0;
      });
      
      setRecommendedCareers(sorted.slice(0, 3));
    } else {
      // Fallback to some popular careers
      setRecommendedCareers(
        careerPaths
          .filter(career => career.isPopular)
          .slice(0, 3)
      );
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setResults({
      categories: {},
      skills: {}
    });
    setRecommendedCareers([]);
  };

  const progress = quizStarted 
    ? Math.round(((currentQuestion) / questions.length) * 100)
    : 0;

  // Sort skills by score for display
  const topSkills = Object.entries(results.skills)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill, score]) => ({ skill, score }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-neutral-200 p-5">
        <h3 className="text-xl font-bold text-neutral-900">Karrier Ajánló Kvíz</h3>
        <p className="text-neutral-600 mt-1">
          Válaszoljon 5 egyszerű kérdésre, és megmutatjuk, mely karrierutak illenek Önhöz a legjobban.
        </p>
      </div>
      
      {/* Progress bar */}
      {quizStarted && (
        <div className="px-5 pt-5">
          <div className="flex justify-between text-sm text-neutral-500 mb-2">
            <span>{currentQuestion + 1}/{questions.length} kérdés</span>
            <span>{progress}% teljesítve</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      {/* Quiz content */}
      <div className="p-5">
        <AnimatePresence mode="wait">
          {!quizStarted && !showResults && (
            <motion.div
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-8"
            >
              <div className="mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Fedezze fel a legmegfelelőbb karrierutat</h3>
                <p className="text-neutral-600">
                  Kvízünk segít azonosítani készségeit és érdeklődési körét, hogy a legjobb karrierlehetőségeket ajánlhassuk.
                </p>
              </div>
              <Button 
                onClick={startQuiz}
                className="bg-primary hover:bg-primary/90 text-white"
                size="lg"
              >
                Kvíz indítása
              </Button>
            </motion.div>
          )}
          
          {quizStarted && !showResults && (
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              <h4 className="text-lg font-semibold text-neutral-900 mb-5">
                {questions[currentQuestion].question}
              </h4>
              
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    className="w-full text-left p-4 rounded-lg border border-neutral-200 hover:border-primary/50 hover:bg-primary/5 transition-colors flex items-start"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-neutral-300 flex-shrink-0 mr-3 mt-0.5"></div>
                    <span className="text-neutral-700">{option.text}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          
          {showResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Eredmények készen állnak</h3>
                <p className="text-neutral-600">
                  Válaszai alapján a következő karrierutak lehetnek megfelelőek az Ön számára.
                </p>
              </div>
              
              {/* Top skills */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-neutral-900 mb-3">Az Ön erősségei</h4>
                <div className="flex flex-wrap gap-2">
                  {topSkills.map((item, index) => (
                    <Badge 
                      key={index} 
                      className="bg-primary/10 text-primary hover:bg-primary/20 py-1.5 px-3 text-sm"
                    >
                      {item.skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Recommended careers */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-neutral-900 mb-4">Ajánlott karrierutak</h4>
                <div className="space-y-4">
                  {recommendedCareers.map((career) => (
                    <div 
                      key={career.id}
                      className="border border-neutral-200 rounded-lg p-4 hover:border-primary/30 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-primary/10 mr-3">
                            {career.iconType === 'lineChart' && <LineChart className={career.iconColor} />}
                            {career.iconType === 'barChart' && <BarChart className={career.iconColor} />}
                            {career.iconType === 'code' && <Code className={career.iconColor} />}
                            {career.iconType === 'shield' && <Shield className={career.iconColor} />}
                            {career.iconType === 'penTool' && <PenTool className={career.iconColor} />}
                            {career.iconType === 'trendingUp' && <TrendingUp className={career.iconColor} />}
                            {career.iconType === 'users' && <Users className={career.iconColor} />}
                          </div>
                          <h5 className="font-semibold text-lg text-neutral-900">
                            {career.title}
                          </h5>
                        </div>
                        <Badge className={
                          careerCategories[career.category]?.color || 'bg-neutral-100 text-neutral-800'
                        }>
                          {careerCategories[career.category]?.name || career.category}
                        </Badge>
                      </div>
                      
                      <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                        {career.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-neutral-500">
                          <span className="font-medium">{career.timeToComplete}</span> képzési idő
                        </div>
                        <Link href={`/career/${career.id}`}>
                          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                            Részletek
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={resetQuiz}
                  className="text-neutral-600"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Újrakezdés
                </Button>
                
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Összes karrierút böngészése
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CareerRecommendationQuiz;