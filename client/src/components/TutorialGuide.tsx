import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ChevronRight, ChevronLeft, Sparkles, BookOpen, Target, Users, TrendingUp } from "lucide-react";

interface TutorialGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const tutorialSteps = [
  {
    id: 1,
    title: "Üdvözöljük az Academion-ban!",
    description: "Fedezze fel a személyre szabott tanulási élményt, amelyet az Ön preferenciái alapján hoztunk létre.",
    icon: Sparkles,
    color: "bg-blue-500",
    image: "🎉",
    tips: [
      "Dashboard áttekintése a személyes statisztikákkal",
      "Ajánlott kurzusok az Ön érdeklődési körei alapján",
      "Naprakész tanulási előrehaladás"
    ]
  },
  {
    id: 2,
    title: "Fedezze fel a kurzusokat",
    description: "Böngésszen a magyar egyetemek kurzusai között, és találja meg a tökéletes tanulási útvonalat.",
    icon: BookOpen,
    color: "bg-green-500",
    image: "📚",
    tips: [
      "Szűrje a kurzusokat kategória és szint szerint",
      "Tekintse meg a részletes kurzusleírásokat",
      "Iratkozzon fel a kedvenc kurzusaira"
    ]
  },
  {
    id: 3,
    title: "Kövesse nyomon a haladását",
    description: "Látja valós időben a tanulási statisztikáit és eredményeit a személyes dashboard-on.",
    icon: TrendingUp,
    color: "bg-purple-500",
    image: "📊",
    tips: [
      "Részletes tanulási analitika",
      "Elvégzett kurzusok és eredmények",
      "Személyre szabott fejlődési javaslatok"
    ]
  },
  {
    id: 4,
    title: "Csatlakozzon a közösséghez",
    description: "Kapcsolódjon más tanulókhoz, ossza meg tapasztalatait és tanuljon együtt.",
    icon: Users,
    color: "bg-orange-500",
    image: "👥",
    tips: [
      "Csatlakozzon tanulási csoportokhoz",
      "Ossza meg eredményeit",
      "Kapjon támogatást és motivációt"
    ]
  },
  {
    id: 5,
    title: "Készen áll a kezdésre!",
    description: "Most már minden eszköz a rendelkezésére áll a sikeres tanulási élményhez. Kezdje el felfedezni!",
    icon: Target,
    color: "bg-indigo-500",
    image: "🚀",
    tips: [
      "Válassza ki első kurzusát",
      "Állítsa be tanulási céljait",
      "Kezdje el személyre szabott útját"
    ]
  }
];

export default function TutorialGuide({ isOpen, onClose }: TutorialGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const currentStepData = tutorialSteps[currentStep];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl"
          >
            <Card className="bg-white border-0 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleComplete}
                  className="absolute top-4 right-4 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <div className="text-center">
                  <div className="text-6xl mb-4">{currentStepData.image}</div>
                  <motion.h2
                    key={currentStep}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl font-bold mb-2"
                  >
                    {currentStepData.title}
                  </motion.h2>
                  <motion.p
                    key={`desc-${currentStep}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg opacity-90 max-w-md mx-auto"
                  >
                    {currentStepData.description}
                  </motion.p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <motion.div
                  key={`content-${currentStep}`}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center">
                    <div className={`w-8 h-8 ${currentStepData.color} rounded-lg flex items-center justify-center mr-3`}>
                      <currentStepData.icon className="h-4 w-4 text-white" />
                    </div>
                    Főbb funkciók
                  </h3>
                  
                  <div className="space-y-3">
                    {currentStepData.tips.map((tip, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-neutral-700">{tip}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="px-8 pb-8">
                {/* Progress indicators */}
                <div className="flex justify-center space-x-2 mb-6">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index <= currentStep ? 'bg-blue-500' : 'bg-neutral-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex items-center space-x-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Előző</span>
                  </Button>

                  <span className="text-sm text-neutral-500">
                    {currentStep + 1} / {tutorialSteps.length}
                  </span>

                  <Button
                    onClick={handleNext}
                    className="bg-blue-500 hover:bg-blue-600 text-white flex items-center space-x-2"
                  >
                    <span>{currentStep === tutorialSteps.length - 1 ? 'Kezdés!' : 'Következő'}</span>
                    {currentStep === tutorialSteps.length - 1 ? (
                      <Sparkles className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}