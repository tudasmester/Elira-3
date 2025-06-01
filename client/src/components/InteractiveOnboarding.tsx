import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, Star, Target, BookOpen, Users, Award, 
  CheckCircle, ArrowRight, ArrowLeft, Zap, Gift,
  Heart, MessageCircle, Calendar, Search
} from "lucide-react";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";

interface InteractiveOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  points: number;
  completed: boolean;
  interactive: boolean;
  target?: string;
}

const InteractiveOnboarding: React.FC<InteractiveOnboardingProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const { toast } = useToast();

  const onboardingSteps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Üdvözöljük az Elira platformon!",
      description: "Kezdjük el a kalandot! Ismerkedjen meg a platform alapjaival és szerezzen pontokat minden elvégzett feladatért.",
      icon: <Trophy className="h-8 w-8 text-yellow-500" />,
      action: "Kezdés",
      points: 50,
      completed: false,
      interactive: false,
    },
    {
      id: "profile_setup",
      title: "Profil személyre szabása",
      description: "Töltse ki profil adatait és válasszon profilképet. Ez segít mások megtalálni és felismerni Önt a közösségben.",
      icon: <Users className="h-8 w-8 text-blue-500" />,
      action: "Profil szerkesztése",
      points: 100,
      completed: false,
      interactive: true,
      target: ".profile-section",
    },
    {
      id: "first_search",
      title: "Első kurzus keresés",
      description: "Próbálja ki a keresőfunkciót! Keressen egy olyan kurzust, ami érdekli Önt.",
      icon: <Search className="h-8 w-8 text-green-500" />,
      action: "Kurzus keresése",
      points: 75,
      completed: false,
      interactive: true,
      target: ".search-section",
    },
    {
      id: "first_favorite",
      title: "Kedvenc kurzus hozzáadása",
      description: "Jelölje meg első kedvenc kurzusát! A kedvencek segítenek követni az érdekes tartalmakat.",
      icon: <Heart className="h-8 w-8 text-red-500" />,
      action: "Kedvenc hozzáadása",
      points: 75,
      completed: false,
      interactive: true,
      target: ".favorites-button",
    },
    {
      id: "community_intro",
      title: "Csatlakozás a közösséghez",
      description: "Fedezze fel a közösségi funkciókat! Ismerkedjen meg más tanulókkal és oszd meg tapasztalatait.",
      icon: <MessageCircle className="h-8 w-8 text-purple-500" />,
      action: "Közösség felfedezése",
      points: 100,
      completed: false,
      interactive: true,
      target: ".community-section",
    },
    {
      id: "calendar_setup",
      title: "Tanulási naptár beállítása",
      description: "Állítsa be tanulási céljait és naptárát. Rendszeres tanulás a siker kulcsa!",
      icon: <Calendar className="h-8 w-8 text-indigo-500" />,
      action: "Naptár beállítása",
      points: 125,
      completed: false,
      interactive: true,
      target: ".calendar-section",
    },
    {
      id: "achievement_unlocked",
      title: "Első eredmény feloldva!",
      description: "Gratulálunk! Sikeresen elvégezte az alapvető beállításokat. Itt az ideje, hogy elkezdje első kurzusát!",
      icon: <Award className="h-8 w-8 text-gold-500" />,
      action: "Eredmények megtekintése",
      points: 200,
      completed: false,
      interactive: false,
    },
  ];

  const [steps, setSteps] = useState(onboardingSteps);

  const calculateLevel = (points: number) => {
    return Math.floor(points / 250) + 1;
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
    });
    
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const completeStep = (stepId: string) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1 || steps[stepIndex].completed) return;

    const updatedSteps = [...steps];
    updatedSteps[stepIndex].completed = true;
    setSteps(updatedSteps);

    const stepPoints = updatedSteps[stepIndex].points;
    const newTotalPoints = totalPoints + stepPoints;
    const newLevel = calculateLevel(newTotalPoints);

    setTotalPoints(newTotalPoints);
    setCompletedTasks([...completedTasks, stepId]);

    if (newLevel > userLevel) {
      setUserLevel(newLevel);
      toast({
        title: `Szint emelkedés! 🎉`,
        description: `Elérte a ${newLevel}. szintet! Fantasztikus munka!`,
      });
      triggerCelebration();
    } else {
      toast({
        title: `+${stepPoints} pont! ⭐`,
        description: updatedSteps[stepIndex].title + " elvégezve!",
      });
    }

    // Auto advance to next step
    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 1500);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      triggerCelebration();
      setTimeout(() => {
        onComplete();
        onClose();
      }, 2000);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  const completedStepsCount = steps.filter(step => step.completed).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header with Progress */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Interaktív Bemutató</h2>
                  <p className="text-sm text-gray-500">
                    {currentStep + 1}. lépés a {steps.length}-ból
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{totalPoints}</div>
                  <div className="text-xs text-gray-500">pont</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userLevel}</div>
                  <div className="text-xs text-gray-500">szint</div>
                </div>
              </div>
            </div>
            
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Elkezdve</span>
              <span>{completedStepsCount}/{steps.length} befejezve</span>
            </div>
          </div>

          {/* Current Step Content */}
          <div className="p-6">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 border-blue-100">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-full p-4">
                      {steps[currentStep].icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
                  <CardDescription className="text-lg leading-relaxed">
                    {steps[currentStep].description}
                  </CardDescription>
                  
                  <div className="flex justify-center items-center space-x-2 mt-4">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      +{steps[currentStep].points} pont
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  {steps[currentStep].interactive && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Interaktív feladat</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Ezt a lépést a platform megfelelő részén kell elvégeznie. 
                        Kattintson a gombra az útmutatásért!
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="flex items-center"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Előző
                    </Button>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => completeStep(steps[currentStep].id)}
                        disabled={steps[currentStep].completed}
                        className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        {steps[currentStep].completed ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Kész
                          </>
                        ) : (
                          <>
                            {steps[currentStep].action}
                            <Target className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={nextStep}
                        className="flex items-center"
                        variant={currentStep === steps.length - 1 ? "default" : "outline"}
                      >
                        {currentStep === steps.length - 1 ? "Befejezés" : "Következő"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements Preview */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3 flex items-center">
                <Gift className="mr-2 h-4 w-4" />
                Elért eredmények
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ 
                      scale: step.completed ? 1 : 0.8, 
                      opacity: step.completed ? 1 : 0.5 
                    }}
                    className={`p-2 rounded-lg text-center border ${
                      step.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="text-xs font-medium truncate">{step.title}</div>
                    <div className={`text-xs ${
                      step.completed ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      +{step.points} pont
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Celebration Overlay */}
          <AnimatePresence>
            {showCelebration && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 bg-black/20 flex items-center justify-center"
              >
                <div className="bg-white rounded-lg p-8 text-center shadow-2xl">
                  <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Fantasztikus! 🎉
                  </h3>
                  <p className="text-gray-600">
                    Szint emelkedés! Folytatja a nagyszerű munkát!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InteractiveOnboarding;