import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  BookOpen, 
  User, 
  Settings, 
  Award,
  CheckCircle,
  Target,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  target?: string;
  action?: string;
  tip?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Üdvözöljük az Elira platformon!',
    description: 'Kezdjük el a felfedezést! Ez a rövid túra segít megismerni a platform főbb funkcióit.',
    icon: Star,
    tip: 'A túra bármikor kihagyható és később újraindítható a beállításokban.'
  },
  {
    id: 'dashboard',
    title: 'Személyes műszerfal',
    description: 'Itt találja a beiratkozott kurzusait, haladását és személyre szabott ajánlásokat.',
    icon: BookOpen,
    target: '.dashboard-overview',
    tip: 'A műszerfal automatikusan frissül, ahogy halad a kurzusokban.'
  },
  {
    id: 'courses',
    title: 'Kurzusok böngészése',
    description: 'Fedezze fel a széles kurzuskínálatunkat kategóriák és szűrők szerint.',
    icon: Target,
    action: 'navigate-courses',
    tip: 'Használja a szűrőket, hogy megtalálja az Önnek legmegfelelőbb kurzusokat.'
  },
  {
    id: 'profile',
    title: 'Profil beállítások',
    description: 'Töltse ki profilját a személyre szabott kurzusajánlásokért.',
    icon: User,
    target: '.profile-section',
    tip: 'Minél részletesebb a profilja, annál jobb ajánlásokat kaphat.'
  },
  {
    id: 'certificates',
    title: 'Tanúsítványok és eredmények',
    description: 'Kövesse nyomon eredményeit és töltse le a megszerzett tanúsítványokat.',
    icon: Award,
    target: '.certificates-section',
    tip: 'A tanúsítványok LinkedIn profilján is megoszthatók.'
  },
  {
    id: 'complete',
    title: 'Kezdhet tanulni!',
    description: 'Minden felkészült! Ideje elkezdeni az első kurzust és elindulni a tanulási úton.',
    icon: CheckCircle,
    action: 'complete-tutorial'
  }
];

interface TutorialGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TutorialGuide({ isOpen, onClose }: TutorialGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsCompleted(false);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('tutorial_completed', 'true');
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('tutorial_skipped', 'true');
    onClose();
  };

  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Platform túra
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {currentStep + 1} / {tutorialSteps.length}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Progress value={progress} className="w-full h-2" />
        </DialogHeader>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-none">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <currentStepData.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <DialogDescription className="text-base leading-relaxed">
                    {currentStepData.description}
                  </DialogDescription>
                  
                  {currentStepData.tip && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Tipp:</strong> {currentStepData.tip}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Előző
            </Button>

            <div className="flex space-x-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              className="flex items-center"
            >
              {currentStep === tutorialSteps.length - 1 ? (
                <>
                  Befejezés
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Következő
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Quick action buttons for specific steps */}
          {currentStepData.action === 'navigate-courses' && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = '/courses';
                  handleComplete();
                }}
                className="w-full"
              >
                Kurzusok megtekintése
              </Button>
            </div>
          )}

          {currentStepData.action === 'complete-tutorial' && (
            <div className="text-center space-y-2">
              <Button
                onClick={() => {
                  window.location.href = '/courses';
                  handleComplete();
                }}
                className="w-full"
              >
                Első kurzus keresése
              </Button>
              <Button
                variant="outline"
                onClick={handleComplete}
                className="w-full"
              >
                Maradok a műszerfalon
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}