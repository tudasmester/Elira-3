import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { 
  User, Mail, Lock, Phone, Eye, EyeOff, CheckCircle, 
  AlertCircle, Star, BookOpen, Target, Heart, Users,
  Award, Zap, ArrowRight, ArrowLeft, GraduationCap,
  Briefcase, Calendar, Globe, UserCheck
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import confetti from "canvas-confetti";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  interests: string[];
  goals: string[];
  experienceLevel: string;
  fieldOfStudy: string;
  currentOccupation: string;
  learningPreference: string;
  timeCommitment: string;
  motivations: string;
  agreeToTerms: boolean;
  subscribeToNewsletter: boolean;
}

const OnboardingRegister: React.FC = () => {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    interests: [],
    goals: [],
    experienceLevel: "",
    fieldOfStudy: "",
    currentOccupation: "",
    learningPreference: "",
    timeCommitment: "",
    motivations: "",
    agreeToTerms: false,
    subscribeToNewsletter: true,
  });

  const steps: OnboardingStep[] = [
    {
      id: "basic",
      title: "Alapadatok",
      description: "Adja meg alapvető személyes információit",
      icon: <User className="h-5 w-5" />,
      completed: false,
    },
    {
      id: "preferences",
      title: "Tanulási preferenciák",
      description: "Személyre szabjuk a tapasztalatot",
      icon: <BookOpen className="h-5 w-5" />,
      completed: false,
    },
    {
      id: "goals",
      title: "Célok és motiváció",
      description: "Mit szeretne elérni a platformon?",
      icon: <Target className="h-5 w-5" />,
      completed: false,
    },
    {
      id: "completion",
      title: "Befejezés",
      description: "Utolsó lépések a regisztrációhoz",
      icon: <Award className="h-5 w-5" />,
      completed: false,
    },
  ];

  const availableInterests = [
    "Informatika", "Üzleti tudományok", "Mérnöki tudományok", "Orvostudomány",
    "Jog", "Természettudományok", "Társadalomtudományok", "Művészetek",
    "Pszichológia", "Marketing", "Pénzügyek", "Projektmenedzsment"
  ];

  const availableGoals = [
    "Készségfejlesztés", "Karrier váltás", "Előléptetés", "Új diploma megszerzése",
    "Hobbi", "Vállalkozás indítása", "Szakmai továbbképzés", "Személyes fejlődés"
  ];

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (value: string) => {
    setFormData(prev => ({ ...prev, password: value }));
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const getPasswordStrengthLabel = (strength: number): string => {
    if (strength === 0) return "Nincs jelszó";
    if (strength <= 25) return "Gyenge";
    if (strength <= 50) return "Közepes";
    if (strength <= 75) return "Jó";
    return "Erős";
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength <= 25) return "bg-red-500";
    if (strength <= 50) return "bg-yellow-500";
    if (strength <= 75) return "bg-blue-500";
    return "bg-green-500";
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0:
        return !!(
          formData.email &&
          formData.password &&
          formData.confirmPassword &&
          formData.firstName &&
          formData.lastName &&
          formData.password === formData.confirmPassword &&
          passwordStrength >= 75 &&
          formData.agreeToTerms
        );
      case 1:
        return !!(
          formData.interests.length > 0 &&
          formData.experienceLevel &&
          formData.fieldOfStudy
        );
      case 2:
        return !!(
          formData.goals.length > 0 &&
          formData.learningPreference &&
          formData.timeCommitment
        );
      default:
        return true;
    }
  };

  const registerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/auth/register", {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        interests: data.interests.join(", "),
        goals: data.goals.join(", "),
        experienceLevel: data.experienceLevel,
        fieldOfStudy: data.fieldOfStudy,
        currentOccupation: data.currentOccupation,
        learningPreference: data.learningPreference,
        timeCommitment: data.timeCommitment,
        motivations: data.motivations,
        subscribeToNewsletter: data.subscribeToNewsletter,
      });
      return response.json();
    },
    onSuccess: () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B']
      });
      
      toast({
        title: "Sikeres regisztráció! 🎉",
        description: "Üdvözöljük az Elira platformon!",
      });
      
      setTimeout(() => {
        setLocation("/");
      }, 2000);
    },
    onError: (error: Error) => {
      toast({
        title: "Regisztrációs hiba",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        registerMutation.mutate(formData);
      }
    } else {
      toast({
        title: "Hiányos adatok",
        description: "Kérjük, töltse ki az összes kötelező mezőt!",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Keresztnév *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Keresztnév"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Vezetéknév *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Vezetéknév"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail cím *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="pelda@email.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefonszám</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+36 30 123 4567"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Jelszó *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Minimum 8 karakter"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Jelszó erőssége:</span>
                    <span className={`font-medium ${
                      passwordStrength >= 75 ? 'text-green-600' : 
                      passwordStrength >= 50 ? 'text-blue-600' : 
                      passwordStrength >= 25 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {getPasswordStrengthLabel(passwordStrength)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Minimum 8 karakter
                    </div>
                    <div className={`flex items-center ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Kisbetű
                    </div>
                    <div className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Nagybetű
                    </div>
                    <div className={`flex items-center ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Szám
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Jelszó megerősítése *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Jelszó ismétlése"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className={`flex items-center text-sm ${
                  formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formData.password === formData.confirmPassword ? (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mr-1" />
                  )}
                  {formData.password === formData.confirmPassword ? 'A jelszavak egyeznek' : 'A jelszavak nem egyeznek'}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: !!checked }))}
                />
                <Label htmlFor="terms" className="text-sm">
                  Elfogadom az <a href="#" className="text-blue-600 hover:underline">Általános Szerződési Feltételeket</a> és az <a href="#" className="text-blue-600 hover:underline">Adatvédelmi Szabályzatot</a> *
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newsletter"
                  checked={formData.subscribeToNewsletter}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, subscribeToNewsletter: !!checked }))}
                />
                <Label htmlFor="newsletter" className="text-sm">
                  Szeretnék hírlevelet kapni az új kurzusokról és ajánlatokról
                </Label>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Érdeklődési területek *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableInterests.map((interest) => (
                  <div
                    key={interest}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        interests: prev.interests.includes(interest)
                          ? prev.interests.filter(i => i !== interest)
                          : [...prev.interests, interest]
                      }));
                    }}
                    className={`p-3 rounded-lg border cursor-pointer text-center text-sm transition-all ${
                      formData.interests.includes(interest)
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {interest}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Tapasztalati szint *</Label>
              <Select value={formData.experienceLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Válasszon tapasztalati szintet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Kezdő</SelectItem>
                  <SelectItem value="intermediate">Haladó</SelectItem>
                  <SelectItem value="advanced">Szakértő</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fieldOfStudy">Szakterület *</Label>
              <Input
                id="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={(e) => setFormData(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
                placeholder="pl. Informatika, Üzleti tudományok"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentOccupation">Jelenlegi foglalkozás</Label>
              <Input
                id="currentOccupation"
                value={formData.currentOccupation}
                onChange={(e) => setFormData(prev => ({ ...prev, currentOccupation: e.target.value }))}
                placeholder="pl. Szoftverfejlesztő, Diák, Vállalkozó"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Tanulási célok *</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableGoals.map((goal) => (
                  <div
                    key={goal}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        goals: prev.goals.includes(goal)
                          ? prev.goals.filter(g => g !== goal)
                          : [...prev.goals, goal]
                      }));
                    }}
                    className={`p-3 rounded-lg border cursor-pointer text-center text-sm transition-all ${
                      formData.goals.includes(goal)
                        ? 'bg-green-50 border-green-300 text-green-700'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {goal}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="learningPreference">Tanulási preferencia *</Label>
              <Select value={formData.learningPreference} onValueChange={(value) => setFormData(prev => ({ ...prev, learningPreference: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Hogyan szeretne tanulni?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self-paced">Saját tempóban</SelectItem>
                  <SelectItem value="structured">Strukturált ütemezés</SelectItem>
                  <SelectItem value="group">Csoportos tanulás</SelectItem>
                  <SelectItem value="mentored">Mentorált tanulás</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeCommitment">Heti időbeosztás *</Label>
              <Select value={formData.timeCommitment} onValueChange={(value) => setFormData(prev => ({ ...prev, timeCommitment: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Hány órát tud hetente tanulásra fordítani?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-3">1-3 óra/hét</SelectItem>
                  <SelectItem value="4-7">4-7 óra/hét</SelectItem>
                  <SelectItem value="8-15">8-15 óra/hét</SelectItem>
                  <SelectItem value="16+">16+ óra/hét</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivations">Mit motivál a tanulásban?</Label>
              <Textarea
                id="motivations"
                value={formData.motivations}
                onChange={(e) => setFormData(prev => ({ ...prev, motivations: e.target.value }))}
                placeholder="Ossza meg velünk, mi motiválja a tanulásban..."
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <UserCheck className="h-10 w-10 text-white" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Minden készen áll!</h3>
              <p className="text-gray-600">
                Készen áll a regisztráció befejezésére. Csatlakozzon a több ezer diákhoz, akik már fejlesztik tudásukat a platformunkon.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 space-y-4">
              <h4 className="font-semibold text-blue-900">Az Ön profilja:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Név:</span> {formData.firstName} {formData.lastName}
                </div>
                <div>
                  <span className="font-medium">E-mail:</span> {formData.email}
                </div>
                <div>
                  <span className="font-medium">Szakterület:</span> {formData.fieldOfStudy}
                </div>
                <div>
                  <span className="font-medium">Tapasztalat:</span> {formData.experienceLevel}
                </div>
                <div>
                  <span className="font-medium">Érdeklődési területek:</span> {formData.interests.slice(0, 2).join(", ")}
                  {formData.interests.length > 2 && ` (+${formData.interests.length - 2})`}
                </div>
                <div>
                  <span className="font-medium">Tanulási célok:</span> {formData.goals.slice(0, 2).join(", ")}
                  {formData.goals.length > 2 && ` (+${formData.goals.length - 2})`}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                Mi vár Önre a regisztráció után:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Személyre szabott kurzusajánlások
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Haladás követése és statisztikák
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Közösségi funkciók
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Tanúsítványok és eredmények
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Csatlakozzon az Elira közösséghez
            </h1>
            <p className="text-gray-600">
              Személyre szabott tanulási élmény a legnagyobb magyar egyetemekkel
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      index <= currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-1 mx-2 transition-all ${
                        index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Kezdés</span>
              <span>{Math.round(progressPercentage)}% kész</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-xl flex items-center justify-center">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  {steps[currentStep].icon}
                </div>
                {steps[currentStep].title}
              </CardTitle>
              <CardDescription className="text-base">
                {steps[currentStep].description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {renderStepContent()}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Előző
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!validateCurrentStep() || registerMutation.isPending}
                  className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {registerMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Regisztráció...
                    </>
                  ) : currentStep === steps.length - 1 ? (
                    <>
                      Regisztráció befejezése
                      <Zap className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Következő
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          Már van fiókja? <a href="/auth" className="text-blue-600 hover:underline font-medium">Bejelentkezés</a>
        </div>
      </div>
    </div>
  );
};

export default OnboardingRegister;