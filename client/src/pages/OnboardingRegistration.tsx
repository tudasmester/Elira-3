import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, BookOpen, Trophy, Users, ArrowRight, Sparkles, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function OnboardingRegistration() {
  const [location, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration form state
  const [registrationData, setRegistrationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  
  // Onboarding preferences state
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [learningStyle, setLearningStyle] = useState("");

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

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/auth/onboarding-register", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Store token and navigate to dashboard
      localStorage.setItem('token', data.token);
      toast({
        title: "Sikeresen regisztrált!",
        description: "Üdvözöljük az Academion platformon!",
      });
      // Force page reload to update auth state
      window.location.href = '/dashboard';
    },
    onError: (error: any) => {
      toast({
        title: "Regisztráció sikertelen",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return registrationData.firstName && registrationData.lastName && 
               registrationData.email && registrationData.password && 
               registrationData.password === registrationData.confirmPassword &&
               registrationData.password.length >= 6;
      case 2:
        return selectedInterests.length > 0;
      case 3:
        return selectedGoals.length > 0;
      case 4:
        return experienceLevel && learningStyle;
      default:
        return false;
    }
  };

  const handleComplete = () => {
    if (!validateStep()) {
      toast({
        title: "Kérjük töltse ki az összes mezőt",
        description: "Az előlépéshez minden lépést ki kell töltenie.",
        variant: "destructive",
      });
      return;
    }

    const completeRegistrationData = {
      ...registrationData,
      interests: selectedInterests,
      goals: selectedGoals,
      experienceLevel,
      learningStyle,
    };

    registerMutation.mutate(completeRegistrationData);
  };

  const progressValue = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Üdvözöljük az Academion-ban!</h1>
              <p className="text-neutral-600 mt-1">Hozzuk létre személyre szabott tanulási élményét</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-neutral-500">Lépés {currentStep} / 4</div>
              <Progress value={progressValue} className="w-32 mt-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "Alapadatok"}
                {currentStep === 2 && "Érdeklődési területek"}
                {currentStep === 3 && "Tanulási célok"}
                {currentStep === 4 && "Tanulási stílus"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Hozza létre fiókját néhány alapvető információval"}
                {currentStep === 2 && "Válassza ki azokat a területeket, amelyek érdeklik"}
                {currentStep === 3 && "Mit szeretne elérni a tanulással?"}
                {currentStep === 4 && "Segítsen nekünk megérteni, hogyan tanul leghatékonyabban"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 1: Registration Form */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Keresztnév *</Label>
                      <Input
                        id="firstName"
                        value={registrationData.firstName}
                        onChange={(e) => setRegistrationData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="János"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Vezetéknév *</Label>
                      <Input
                        id="lastName"
                        value={registrationData.lastName}
                        onChange={(e) => setRegistrationData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Kovács"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email cím *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={registrationData.email}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="kovacs.janos@email.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefonszám (opcionális)</Label>
                    <Input
                      id="phone"
                      value={registrationData.phone}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+36 30 123 4567"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Jelszó *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={registrationData.password}
                        onChange={(e) => setRegistrationData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Minimum 6 karakter"
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
                  
                  <div>
                    <Label htmlFor="confirmPassword">Jelszó megerősítése *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={registrationData.confirmPassword}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Írja be újra a jelszót"
                    />
                    {registrationData.password && registrationData.confirmPassword && 
                     registrationData.password !== registrationData.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">A jelszavak nem egyeznek</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Interests */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {interests.map((interest) => (
                      <motion.div
                        key={interest.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Badge
                          variant={selectedInterests.includes(interest.id) ? "default" : "outline"}
                          className={`w-full p-3 cursor-pointer justify-start text-sm h-auto ${
                            selectedInterests.includes(interest.id) 
                              ? "bg-blue-600 text-white hover:bg-blue-700" 
                              : "hover:bg-blue-50"
                          }`}
                          onClick={() => handleInterestToggle(interest.id)}
                        >
                          <span className="mr-2">{interest.icon}</span>
                          {interest.label}
                          {selectedInterests.includes(interest.id) && (
                            <CheckCircle className="ml-auto h-4 w-4" />
                          )}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-sm text-neutral-500">
                    Válasszon legalább egy érdeklődési területet
                  </p>
                </div>
              )}

              {/* Step 3: Goals */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {goals.map((goal) => (
                      <motion.div
                        key={goal.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Badge
                          variant={selectedGoals.includes(goal.id) ? "default" : "outline"}
                          className={`w-full p-3 cursor-pointer justify-start text-sm h-auto ${
                            selectedGoals.includes(goal.id) 
                              ? "bg-blue-600 text-white hover:bg-blue-700" 
                              : "hover:bg-blue-50"
                          }`}
                          onClick={() => handleGoalToggle(goal.id)}
                        >
                          <span className="mr-2">{goal.icon}</span>
                          {goal.label}
                          {selectedGoals.includes(goal.id) && (
                            <CheckCircle className="ml-auto h-4 w-4" />
                          )}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-sm text-neutral-500">
                    Válasszon legalább egy tanulási célt
                  </p>
                </div>
              )}

              {/* Step 4: Learning Style */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="experienceLevel">Tapasztalati szint</Label>
                    <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Válassza ki tapasztalati szintjét" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Kezdő - Új vagyok ezeken a területeken</SelectItem>
                        <SelectItem value="intermediate">Haladó - Van némi tapasztalatom</SelectItem>
                        <SelectItem value="advanced">Szakértő - Széles tapasztalattal rendelkezem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="learningStyle">Tanulási stílus</Label>
                    <Select value={learningStyle} onValueChange={setLearningStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Hogyan tanul leghatékonyabban?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visual">Vizuális - Képek, diagramok, videók</SelectItem>
                        <SelectItem value="auditory">Auditív - Előadások, podcastok, beszélgetések</SelectItem>
                        <SelectItem value="hands-on">Gyakorlati - Projektek, kísérletek, gyakorlás</SelectItem>
                        <SelectItem value="reading">Olvasás - Szövegek, dokumentációk, könyvek</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={currentStep === 1 ? () => navigate('/auth') : handleBack}
                  disabled={registerMutation.isPending}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {currentStep === 1 ? 'Vissza a bejelentkezéshez' : 'Vissza'}
                </Button>
                
                {currentStep < 4 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!validateStep() || registerMutation.isPending}
                  >
                    Tovább
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleComplete}
                    disabled={!validateStep() || registerMutation.isPending}
                  >
                    {registerMutation.isPending ? 'Regisztráció...' : 'Befejezés'}
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Benefits */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="mr-2" />
                  Személyre szabott tanulás
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Az Ön válaszai alapján személyre szabott kurzusajánlásokat kapunk
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 text-blue-600" />
                  Minőségi oktatás
                </CardTitle>
                <CardDescription>
                  Magyarország vezető egyetemeinek kurzusai egy helyen
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 text-yellow-500" />
                  Tanúsítványok
                </CardTitle>
                <CardDescription>
                  Szerezzen elismert tanúsítványokat a befejezett kurzusokért
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 text-green-600" />
                  Közösség
                </CardTitle>
                <CardDescription>
                  Csatlakozzon hasonlóan gondolkodó tanulók közösségéhez
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}