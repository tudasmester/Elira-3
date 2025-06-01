import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  BookOpen, 
  Trophy, 
  Users, 
  Star,
  Search,
  Filter,
  Heart,
  CheckCircle,
  Sparkles
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  targetElement?: string;
  position: "top" | "bottom" | "left" | "right" | "center";
  interactive?: {
    type: "click" | "hover" | "scroll";
    element: string;
    action: string;
  };
}

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const tourSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Üdvözöljük az Elira-ban! 🎉",
    description: "Fedezze fel Magyarország vezető online oktatási platformját! Irányítjuk végig a legfontosabb funkciókban.",
    icon: <Sparkles className="h-6 w-6 text-blue-500" />,
    position: "center"
  },
  {
    id: "navigation",
    title: "Navigáció",
    description: "A főmenüben megtalálja az összes kategóriát és funkcót. Próbálja ki!",
    icon: <BookOpen className="h-6 w-6 text-green-500" />,
    targetElement: "nav",
    position: "bottom",
    interactive: {
      type: "hover",
      element: "nav-item",
      action: "Vigye az egeret a menüelemekre!"
    }
  },
  {
    id: "search",
    title: "Keresés",
    description: "Találja meg a tökéletes kurzust a fejlett keresővel. Próbálja ki a keresést!",
    icon: <Search className="h-6 w-6 text-purple-500" />,
    targetElement: "search-bar",
    position: "bottom",
    interactive: {
      type: "click",
      element: "search-input",
      action: "Kattintson a keresőmezőre!"
    }
  },
  {
    id: "courses",
    title: "Kurzusok",
    description: "Böngésszen a legjobb magyar egyetemek kurzusai között. Kattintson egy kurzusra a részletekért!",
    icon: <Play className="h-6 w-6 text-orange-500" />,
    targetElement: "course-grid",
    position: "top",
    interactive: {
      type: "click",
      element: "course-card",
      action: "Kattintson egy kurzusra!"
    }
  },
  {
    id: "filters",
    title: "Szűrők",
    description: "Használja a szűrőket a kurzusok személyre szabásához. Próbálja ki a kategória szűrőt!",
    icon: <Filter className="h-6 w-6 text-red-500" />,
    targetElement: "filters",
    position: "right",
    interactive: {
      type: "click",
      element: "filter-button",
      action: "Válasszon egy kategóriát!"
    }
  },
  {
    id: "favorites",
    title: "Kedvencek",
    description: "Mentse el a kedvenc kurzusait későbbre. Kattintson a szív ikonra!",
    icon: <Heart className="h-6 w-6 text-pink-500" />,
    targetElement: "favorite-button",
    position: "left",
    interactive: {
      type: "click",
      element: "heart-icon",
      action: "Kattintson a szív ikonra!"
    }
  },
  {
    id: "achievements",
    title: "Eredmények",
    description: "Kövesse nyomon a tanulási előrehaladását és szerezzen kitüntetéseket!",
    icon: <Trophy className="h-6 w-6 text-yellow-500" />,
    targetElement: "achievements",
    position: "bottom"
  },
  {
    id: "community",
    title: "Közösség",
    description: "Csatlakozzon a tanulók közösségéhez és ossza meg tapasztalatait!",
    icon: <Users className="h-6 w-6 text-indigo-500" />,
    targetElement: "community",
    position: "top"
  },
  {
    id: "complete",
    title: "Készen áll! ✨",
    description: "Gratulálunk! Most már készen áll a tanulási út megkezdésére. Sok sikert!",
    icon: <CheckCircle className="h-6 w-6 text-green-600" />,
    position: "center"
  }
];

export default function OnboardingTour({ isOpen, onClose, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedInteractions, setCompletedInteractions] = useState<Set<string>>(new Set());
  const [isInteractionMode, setIsInteractionMode] = useState(false);

  const currentStepData = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  useEffect(() => {
    if (isOpen && currentStepData.interactive) {
      setIsInteractionMode(true);
      // Listen for interaction completion
      const handleInteraction = () => {
        setCompletedInteractions(prev => new Set([...prev, currentStepData.id]));
        setIsInteractionMode(false);
      };

      // Add event listeners based on interaction type
      if (currentStepData.interactive.type === "click") {
        const element = document.querySelector(`.${currentStepData.interactive.element}`);
        element?.addEventListener("click", handleInteraction);
        return () => element?.removeEventListener("click", handleInteraction);
      }
    }
  }, [currentStep, isOpen, currentStepData]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsInteractionMode(false);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setIsInteractionMode(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const getTooltipPosition = () => {
    const { position } = currentStepData;
    
    switch (position) {
      case "top":
        return "bottom-full mb-2";
      case "bottom":
        return "top-full mt-2";
      case "left":
        return "right-full mr-2";
      case "right":
        return "left-full ml-2";
      case "center":
      default:
        return "center";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Spotlight effect for targeted elements */}
        {currentStepData.targetElement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div 
              className="absolute inset-0" 
              style={{
                background: `radial-gradient(circle at center, transparent 100px, rgba(0,0,0,0.8) 200px)`
              }}
            />
          </motion.div>
        )}

        {/* Tour Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className={`absolute z-60 ${
            currentStepData.position === "center" 
              ? "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
              : getTooltipPosition()
          }`}
        >
          <Card className="w-80 shadow-2xl border-2 border-blue-200 bg-white/95 backdrop-blur">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {currentStepData.icon}
                  <Badge variant="secondary" className="text-xs">
                    {currentStep + 1} / {tourSteps.length}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <Progress value={progress} className="h-2" />
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {currentStepData.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {currentStepData.description}
                </p>

                {/* Interactive Element */}
                {currentStepData.interactive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        completedInteractions.has(currentStepData.id) 
                          ? "bg-green-500" 
                          : isInteractionMode 
                            ? "bg-blue-500 animate-pulse" 
                            : "bg-gray-300"
                      }`} />
                      <span className="text-sm text-blue-700">
                        {completedInteractions.has(currentStepData.id) 
                          ? "✓ Befejezve!" 
                          : currentStepData.interactive.action}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Vissza</span>
                </Button>

                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="text-gray-500"
                  >
                    Kihagyás
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleNext}
                    disabled={
                      currentStepData.interactive && 
                      !completedInteractions.has(currentStepData.id) && 
                      isInteractionMode
                    }
                    className="flex items-center space-x-1"
                  >
                    <span>
                      {currentStep === tourSteps.length - 1 ? "Befejezés" : "Tovább"}
                    </span>
                    {currentStep !== tourSteps.length - 1 && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Step Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex space-x-2 bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-lg">
            {tourSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: index === currentStep ? 1.2 : 1,
                  backgroundColor: index === currentStep ? "#3B82F6" : index < currentStep ? "#10B981" : "#E5E7EB"
                }}
                className="w-3 h-3 rounded-full cursor-pointer transition-all"
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>
        </motion.div>

        {/* Fun animations */}
        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute top-20 right-20"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-6xl"
            >
              🎉
            </motion.div>
          </motion.div>
        )}

        {currentStep === tourSteps.length - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: "-=100px"
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="absolute text-2xl"
              >
                {["✨", "🎉", "🎊", "⭐", "💫"][i % 5]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}