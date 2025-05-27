import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, GraduationCap, Target, Brain, Users, Code, BookOpen, Briefcase, Palette, TrendingUp, Lightbulb, Monitor, Headphones, Users2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface OnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  interests: string[];
  goals: string[];
  experienceLevel: string;
  learningStyle: string[];
}

const interestOptions = [
  { id: 'tech', label: 'Technológia', icon: Code, color: 'bg-blue-500' },
  { id: 'business', label: 'Üzleti tudományok', icon: Briefcase, color: 'bg-green-500' },
  { id: 'design', label: 'Design & Kreativitás', icon: Palette, color: 'bg-purple-500' },
  { id: 'marketing', label: 'Marketing', icon: TrendingUp, color: 'bg-orange-500' },
  { id: 'education', label: 'Oktatás', icon: GraduationCap, color: 'bg-red-500' },
  { id: 'science', label: 'Természettudományok', icon: Lightbulb, color: 'bg-yellow-500' },
];

const goalOptions = [
  { id: 'career', label: 'Karrierváltás', icon: Target, color: 'bg-blue-500' },
  { id: 'skills', label: 'Készségfejlesztés', icon: Brain, color: 'bg-green-500' },
  { id: 'certification', label: 'Képesítés megszerzése', icon: GraduationCap, color: 'bg-purple-500' },
  { id: 'hobby', label: 'Hobby & Érdeklődés', icon: Palette, color: 'bg-orange-500' },
];

const experienceLevels = [
  { id: 'beginner', label: 'Kezdő', description: 'Új vagyok ezen a területen', icon: '🌱' },
  { id: 'intermediate', label: 'Haladó', description: 'Van némi tapasztalatom', icon: '🚀' },
  { id: 'advanced', label: 'Szakértő', description: 'Mélyebb tudást szeretnék', icon: '🎯' },
];

const learningStyleOptions = [
  { id: 'visual', label: 'Vizuális', icon: Monitor, color: 'bg-blue-500' },
  { id: 'auditory', label: 'Auditív', icon: Headphones, color: 'bg-green-500' },
  { id: 'hands-on', label: 'Gyakorlati', icon: Users2, color: 'bg-purple-500' },
];

export default function OnboardingRegistrationClean() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    interests: [],
    goals: [],
    experienceLevel: '',
    learningStyle: [],
  });

  const handleInterestToggle = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleGoalToggle = (goalId: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(id => id !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handleLearningStyleToggle = (styleId: string) => {
    setFormData(prev => ({
      ...prev,
      learningStyle: prev.learningStyle.includes(styleId)
        ? prev.learningStyle.filter(id => id !== styleId)
        : [...prev.learningStyle, styleId]
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/onboarding-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          interests: JSON.stringify(formData.interests),
          goals: JSON.stringify(formData.goals),
          learningStyle: JSON.stringify(formData.learningStyle),
        }),
      });

      if (response.ok) {
        toast({
          title: "Sikeres regisztráció!",
          description: "Üdvözöljük az Academion-ban!",
        });
        setLocation('/dashboard');
      } else {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Hiba történt",
        description: "Kérjük, próbálja újra később.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.password;
      case 2:
        return formData.interests.length > 0;
      case 3:
        return formData.goals.length > 0;
      case 4:
        return formData.experienceLevel && formData.learningStyle.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Academion</h1>
        </div>

        {/* Main Card */}
        <Card className="w-full bg-white border border-neutral-200 shadow-lg rounded-2xl overflow-hidden">
          <div className="p-12">
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                      Hozza létre fiókját
                    </h2>
                    <p className="text-neutral-600">
                      Kezdjük el személyre szabott tanulási utját
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Keresztnév</Label>
                        <Input
                          id="firstName"
                          placeholder="János"
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Vezetéknév</Label>
                        <Input
                          id="lastName"
                          placeholder="Kovács"
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="h-12"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email cím</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="kovacs.janos@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Jelszó</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Biztonságos jelszó"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="h-12 pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Interests */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                      Mi érdekli Önt?
                    </h2>
                    <p className="text-neutral-600">
                      Válassza ki az érdeklődési területeit
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {interestOptions.map((interest) => (
                      <Card
                        key={interest.id}
                        className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                          formData.interests.includes(interest.id)
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                        onClick={() => handleInterestToggle(interest.id)}
                      >
                        <div className="text-center">
                          <div className={`w-12 h-12 ${interest.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                            <interest.icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-neutral-900">{interest.label}</h3>
                        </div>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Goals */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                      Mi a fő célja?
                    </h2>
                    <p className="text-neutral-600">
                      Segítünk elérni az Ön céljait
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {goalOptions.map((goal) => (
                      <Card
                        key={goal.id}
                        className={`p-8 cursor-pointer transition-all duration-300 hover:scale-105 border-2 min-h-[120px] flex items-center ${
                          formData.goals.includes(goal.id)
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                        onClick={() => handleGoalToggle(goal.id)}
                      >
                        <div className="flex items-center space-x-4 w-full">
                          <div className={`w-12 h-12 ${goal.color} rounded-xl flex items-center justify-center`}>
                            <goal.icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-900">{goal.label}</h3>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Experience & Learning Style */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                      Személyre szabás
                    </h2>
                    <p className="text-neutral-600">
                      Végső simítások az ideális élményért
                    </p>
                  </div>

                  <div className="space-y-8">
                    {/* Experience Level */}
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Tapasztalati szint</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {experienceLevels.map((level) => (
                          <Card
                            key={level.id}
                            className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                              formData.experienceLevel === level.id
                                ? 'border-blue-500 bg-blue-50 shadow-lg'
                                : 'border-neutral-200 bg-white hover:border-neutral-300'
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, experienceLevel: level.id }))}
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-2">{level.icon}</div>
                              <h4 className="font-semibold text-neutral-900 text-sm mb-1">{level.label}</h4>
                              <p className="text-xs text-neutral-600">{level.description}</p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Learning Style */}
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Tanulási stílus</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {learningStyleOptions.map((style) => (
                          <Card
                            key={style.id}
                            className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                              formData.learningStyle.includes(style.id)
                                ? 'border-blue-500 bg-blue-50 shadow-lg'
                                : 'border-neutral-200 bg-white hover:border-neutral-300'
                            }`}
                            onClick={() => handleLearningStyleToggle(style.id)}
                          >
                            <div className="text-center">
                              <div className={`w-8 h-8 ${style.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                                <style.icon className="h-4 w-4 text-white" />
                              </div>
                              <h4 className="font-semibold text-neutral-900 text-sm">{style.label}</h4>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-12">
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="px-6"
                >
                  Vissza
                </Button>
              ) : (
                <div></div>
              )}

              <Button
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                className="px-8 bg-neutral-900 hover:bg-neutral-800 text-white"
              >
                {isLoading ? "Betöltés..." : currentStep === 4 ? "Fiók létrehozása" : "Folytatás"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}