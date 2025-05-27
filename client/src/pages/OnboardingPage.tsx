import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, BookOpen, Trophy, Users, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function OnboardingPage() {
  const [location, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const interests = [
    { id: "web-development", label: "Webfejlesztés", icon: "💻" },
    { id: "data-science", label: "Adattudomány", icon: "📊" },
    { id: "digital-marketing", label: "Digitális marketing", icon: "📱" },
    { id: "business", label: "Üzleti készségek", icon: "💼" },
    { id: "design", label: "Dizájn", icon: "🎨" },
    { id: "language", label: "Nyelvek", icon: "🌍" },
    { id: "healthcare", label: "Egészségügy", icon: "🏥" },
    { id: "finance", label: "Pénzügyek", icon: "💰" },
  ];

  const goals = [
    { id: "career-change", label: "Karrierváltás", icon: "🚀" },
    { id: "skill-upgrade", label: "Készségfejlesztés", icon: "📈" },
    { id: "new-hobby", label: "Új hobbi", icon: "🎯" },
    { id: "certification", label: "Bizonyítvány szerzése", icon: "🏆" },
    { id: "promotion", label: "Előlépés", icon: "⬆️" },
    { id: "business-start", label: "Vállalkozás indítása", icon: "💡" },
  ];

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate('/');
    }
  };

  const skipOnboarding = () => {
    navigate('/');
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const progressValue = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Üdvözöljük az Academion-ban!</h1>
              <p className="text-neutral-600 mt-1">Állítsuk össze a személyre szabott tanulási útját</p>
            </div>
            <Button variant="ghost" onClick={skipOnboarding} className="text-neutral-500 hover:text-neutral-700">
              Kihagyás
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
              <span>Lépés {currentStep} / 3</span>
              <span>{Math.round(progressValue)}% kész</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <Card className="max-w-3xl mx-auto">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Mik az érdeklődési területei?</CardTitle>
                <CardDescription className="text-lg">
                  Válassza ki azokat a témákat, amelyek érdekes számára. Ez segít személyre szabni a kurzus-ajánlásainkat.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {interests.map((interest) => (
                    <motion.div
                      key={interest.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedInterests.includes(interest.id)
                            ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                            : 'hover:border-neutral-300 hover:shadow-md'
                        }`}
                        onClick={() => handleInterestToggle(interest.id)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl mb-2">{interest.icon}</div>
                          <div className="text-sm font-medium">{interest.label}</div>
                          {selectedInterests.includes(interest.id) && (
                            <CheckCircle className="h-4 w-4 text-blue-600 mx-auto mt-2" />
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-8 flex justify-center">
                  <Button 
                    onClick={nextStep}
                    disabled={selectedInterests.length === 0}
                    size="lg"
                    className="px-8"
                  >
                    Folytatás
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="max-w-3xl mx-auto">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Mik a tanulási céljai?</CardTitle>
                <CardDescription className="text-lg">
                  Mondja el, mit szeretne elérni a tanulással. Ez segít a megfelelő kurzusok ajánlásában.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {goals.map((goal) => (
                    <motion.div
                      key={goal.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedGoals.includes(goal.id)
                            ? 'ring-2 ring-green-500 bg-green-50 border-green-200'
                            : 'hover:border-neutral-300 hover:shadow-md'
                        }`}
                        onClick={() => handleGoalToggle(goal.id)}
                      >
                        <CardContent className="p-4 flex items-center">
                          <div className="text-2xl mr-4">{goal.icon}</div>
                          <div className="flex-1">
                            <div className="font-medium">{goal.label}</div>
                          </div>
                          {selectedGoals.includes(goal.id) && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-8 flex justify-center">
                  <Button 
                    onClick={nextStep}
                    disabled={selectedGoals.length === 0}
                    size="lg"
                    className="px-8"
                  >
                    Folytatás
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="max-w-3xl mx-auto">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Minden készen áll!</CardTitle>
                <CardDescription className="text-lg">
                  Köszönjük, hogy csatlakozott hozzánk! Az Ön preferenciái alapján személyre szabott kurzus-ajánlásokat készítettünk.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-lg mb-4">Az Ön tanulási profilja:</h3>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-neutral-700 mb-2">Érdeklődési területek:</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {selectedInterests.map(interestId => {
                        const interest = interests.find(i => i.id === interestId);
                        return (
                          <Badge key={interestId} variant="secondary" className="bg-blue-100 text-blue-800">
                            {interest?.icon} {interest?.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-neutral-700 mb-2">Tanulási célok:</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {selectedGoals.map(goalId => {
                        const goal = goals.find(g => g.id === goalId);
                        return (
                          <Badge key={goalId} variant="secondary" className="bg-green-100 text-green-800">
                            {goal?.icon} {goal?.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium">500+ Kurzus</h4>
                    <p className="text-sm text-neutral-600">Szakértők által készített tartalmak</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Trophy className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-medium">Bizonyítványok</h4>
                    <p className="text-sm text-neutral-600">Hivatalosan elismert végzések</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium">Közösség</h4>
                    <p className="text-sm text-neutral-600">50,000+ aktív diák</p>
                  </div>
                </div>

                <Button 
                  onClick={nextStep}
                  size="lg"
                  className="px-12 py-3 text-lg"
                >
                  Kezdjük el a tanulást!
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}