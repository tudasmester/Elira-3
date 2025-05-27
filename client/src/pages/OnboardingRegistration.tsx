import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  Code, 
  Briefcase, 
  PaintBucket, 
  Calculator, 
  Globe, 
  Heart, 
  Trophy,
  Target,
  Rocket,
  Clock,
  Users,
  BookOpen,
  Video,
  FileText,
  UserPlus,
  Eye,
  EyeOff
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

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
  { id: "programming", label: "Programozás", icon: Code, color: "bg-blue-500" },
  { id: "business", label: "Üzleti ismeretek", icon: Briefcase, color: "bg-green-500" },
  { id: "design", label: "Design", icon: PaintBucket, color: "bg-purple-500" },
  { id: "data", label: "Adatelemzés", icon: Calculator, color: "bg-orange-500" },
  { id: "marketing", label: "Marketing", icon: Globe, color: "bg-pink-500" },
  { id: "health", label: "Egészségügy", icon: Heart, color: "bg-red-500" }
];

const goalOptions = [
  { id: "career", label: "Karrierváltás", icon: Trophy, color: "bg-amber-500" },
  { id: "skills", label: "Készségfejlesztés", icon: Target, color: "bg-cyan-500" },
  { id: "promotion", label: "Előléptetés", icon: Rocket, color: "bg-emerald-500" },
  { id: "hobby", label: "Hobbiból tanulás", icon: Heart, color: "bg-rose-500" }
];

const experienceLevels = [
  { id: "beginner", label: "Kezdő", description: "Új vagyok ezen a területen", icon: "🌱" },
  { id: "intermediate", label: "Középhaladó", description: "Van már némi tapasztalatom", icon: "🌿" },
  { id: "advanced", label: "Haladó", description: "Sokat tudok már", icon: "🌳" }
];

const learningStyleOptions = [
  { id: "visual", label: "Vizuális tanulás", icon: Eye, color: "bg-indigo-500" },
  { id: "video", label: "Videós oktatás", icon: Video, color: "bg-red-500" },
  { id: "reading", label: "Olvasás", icon: FileText, color: "bg-blue-500" },
  { id: "practice", label: "Gyakorlati feladatok", icon: Target, color: "bg-green-500" },
  { id: "group", label: "Csoportos tanulás", icon: Users, color: "bg-purple-500" },
  { id: "self", label: "Önálló tanulás", icon: BookOpen, color: "bg-orange-500" }
];

export default function OnboardingRegistration() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    interests: [],
    goals: [],
    experienceLevel: "",
    learningStyle: []
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/onboarding-register", formData);
      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        toast({
          title: "Sikeres regisztráció!",
          description: "Üdvözöljük az Academion közösségében!",
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Regisztrációs hiba",
        description: error.message || "Valami hiba történt",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const progressValue = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-neutral-200/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Academion</h1>
                <p className="text-neutral-600 text-sm">Személyre szabott tanulási élmény</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-neutral-500 mb-2">Lépés {currentStep} / 4</div>
              <Progress value={progressValue} className="w-40" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Registration */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <UserPlus className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-neutral-900 mb-4">Csatlakozzon hozzánk!</h2>
                  <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                    Kezdje el személyre szabott tanulási útját néhány alapvető információval
                  </p>
                </motion.div>
              </div>

              <Card className="p-8 shadow-2xl border-0 bg-white/70 backdrop-blur-sm">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-neutral-700 font-medium">Keresztnév</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="János"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="h-12 border-neutral-300 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-neutral-700 font-medium">Vezetéknév</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Kovács"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="h-12 border-neutral-300 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email" className="text-neutral-700 font-medium">Email cím</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="kovacs.janos@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="h-12 border-neutral-300 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="password" className="text-neutral-700 font-medium">Jelszó</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Biztonságos jelszó"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="h-12 border-neutral-300 focus:border-blue-500 transition-colors pr-12"
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
              </Card>
            </motion.div>
          )}

          {/* Step 2: Interests */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-neutral-900 mb-4">Mi érdekli?</h2>
                  <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                    Válassza ki azokat a területeket, amelyek leginkább felkeltik érdeklődését
                  </p>
                </motion.div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {interestOptions.map((interest, index) => (
                  <motion.div
                    key={interest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2 border-2 aspect-square flex items-center justify-center ${
                        formData.interests.includes(interest.id)
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl ring-4 ring-blue-200/50'
                          : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-xl hover:bg-gray-50'
                      }`}
                      onClick={() => handleInterestToggle(interest.id)}
                    >
                      <div className="text-center">
                        <div className={`w-20 h-20 ${interest.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-transform duration-300 ${
                          formData.interests.includes(interest.id) ? 'scale-110' : ''
                        }`}>
                          <interest.icon className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="font-bold text-neutral-900 text-lg">{interest.label}</h3>
                      </div>
                    </Card>
                  </motion.div>
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
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-neutral-900 mb-4">Mik a céljai?</h2>
                  <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                    Mit szeretne elérni a tanulással? Válassza ki célkitűzéseit
                  </p>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {goalOptions.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2 border-2 min-h-[140px] flex items-center ${
                        formData.goals.includes(goal.id)
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl ring-4 ring-blue-200/50'
                          : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-xl hover:bg-gray-50'
                      }`}
                      onClick={() => handleGoalToggle(goal.id)}
                    >
                      <div className="flex items-center space-x-6 w-full">
                        <div className={`w-20 h-20 ${goal.color} rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 ${
                          formData.goals.includes(goal.id) ? 'scale-110' : ''
                        }`}>
                          <goal.icon className="h-10 w-10 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-neutral-900">{goal.label}</h3>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
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
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <BookOpen className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-neutral-900 mb-4">Hogyan tanul?</h2>
                  <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                    Segítsen megértenünk tapasztalati szintjét és tanulási stílusát
                  </p>
                </motion.div>
              </div>

              <div className="space-y-8">
                {/* Experience Level */}
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-6 text-center">Tapasztalati szint</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {experienceLevels.map((level, index) => (
                      <motion.div
                        key={level.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card
                          className={`p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2 border-2 min-h-[180px] flex flex-col justify-center ${
                            formData.experienceLevel === level.id
                              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl ring-4 ring-blue-200/50'
                              : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-xl hover:bg-gray-50'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, experienceLevel: level.id }))}
                        >
                          <div className="text-center">
                            <div className="text-6xl mb-4 transition-transform duration-300">{level.icon}</div>
                            <h4 className="font-bold text-xl text-neutral-900 mb-3">{level.label}</h4>
                            <p className="text-neutral-600 leading-relaxed">{level.description}</p>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Learning Style */}
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-6 text-center">Tanulási stílus</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {learningStyleOptions.map((style, index) => (
                      <motion.div
                        key={style.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card
                          className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2 border-2 min-h-[140px] flex flex-col justify-center ${
                            formData.learningStyle.includes(style.id)
                              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl ring-4 ring-blue-200/50'
                              : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-xl hover:bg-gray-50'
                          }`}
                          onClick={() => handleLearningStyleToggle(style.id)}
                        >
                          <div className="text-center">
                            <div className={`w-16 h-16 ${style.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-transform duration-300 ${
                              formData.learningStyle.includes(style.id) ? 'scale-110' : ''
                            }`}>
                              <style.icon className="h-8 w-8 text-white" />
                            </div>
                            <h4 className="font-bold text-neutral-900">{style.label}</h4>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="h-12 px-8"
          >
            Vissza
          </Button>

          <div className="text-center">
            <p className="text-sm text-neutral-500 mb-2">
              Már van fiókja?{' '}
              <button
                onClick={() => navigate('/auth')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Bejelentkezés
              </button>
            </p>
          </div>

          <Button
            onClick={handleNext}
            disabled={!canProceed() || isLoading}
            className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {currentStep === 4 ? (isLoading ? "Fiók létrehozása..." : "Befejezés") : "Tovább"}
          </Button>
        </div>
      </div>
    </div>
  );
}