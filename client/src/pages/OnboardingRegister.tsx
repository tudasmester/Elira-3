import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, CheckCircle, Shield, AlertCircle, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const personalInfoSchema = z.object({
  firstName: z.string().min(2, "A keresztnév legalább 2 karakter kell legyen"),
  lastName: z.string().min(2, "A vezetéknév legalább 2 karakter kell legyen"),
  email: z.string().email("Érvényes email címet adjon meg"),
  password: z.string()
    .min(8, "A jelszó legalább 8 karakter kell legyen")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "A jelszónak tartalmaznia kell kis- és nagybetűt, valamint számot"),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, "El kell fogadnia a felhasználási feltételeket"),
}).refine(data => data.password === data.confirmPassword, {
  message: "A jelszavak nem egyeznek",
  path: ["confirmPassword"],
});

const preferencesSchema = z.object({
  interests: z.array(z.string()).min(1, "Válasszon legalább egy érdeklődési területet"),
  goals: z.array(z.string()).min(1, "Válasszon legalább egy célt"),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  learningStyle: z.enum(["visual", "auditory", "hands-on"]),
});

type PersonalInfo = z.infer<typeof personalInfoSchema>;
type Preferences = z.infer<typeof preferencesSchema>;

const interests = [
  { id: "technology", label: "Technológia" },
  { id: "business", label: "Üzlet" },
  { id: "design", label: "Design" },
  { id: "marketing", label: "Marketing" },
  { id: "data", label: "Adatelemzés" },
  { id: "programming", label: "Programozás" },
  { id: "ai", label: "Mesterséges intelligencia" },
  { id: "finance", label: "Pénzügy" },
];

const goals = [
  { id: "career_change", label: "Karrierváltás" },
  { id: "skill_improvement", label: "Készségfejlesztés" },
  { id: "certification", label: "Tanúsítvány megszerzése" },
  { id: "promotion", label: "Előléptetés" },
  { id: "entrepreneurship", label: "Vállalkozás indítása" },
  { id: "personal_growth", label: "Személyes fejlődés" },
];

// Password strength helper
const calculatePasswordStrength = (password: string): { score: number; feedback: string; color: string } => {
  let score = 0;
  let feedback = "Gyenge";
  
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  
  switch (score) {
    case 0:
    case 1:
      feedback = "Nagyon gyenge";
      break;
    case 2:
      feedback = "Gyenge";
      break;
    case 3:
      feedback = "Közepes";
      break;
    case 4:
      feedback = "Erős";
      break;
    case 5:
      feedback = "Nagyon erős";
      break;
  }
  
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];
  return { score, feedback, color: colors[score - 1] || colors[0] };
};

export default function OnboardingRegister() {
  const [step, setStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const personalForm = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const preferencesForm = useForm<Preferences>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      interests: [],
      goals: [],
      experienceLevel: "beginner",
      learningStyle: "visual",
    },
  });

  const handlePersonalInfoSubmit = (data: PersonalInfo) => {
    setPersonalInfo(data);
    setStep(2);
  };

  const handlePreferencesSubmit = async (preferences: Preferences) => {
    if (!personalInfo) return;

    setIsLoading(true);
    try {
      const registrationData = {
        ...personalInfo,
        interests: preferences.interests,
        goals: preferences.goals,
        experienceLevel: preferences.experienceLevel,
        learningStyle: preferences.learningStyle,
      };

      const response = await apiRequest("POST", "/api/auth/register", registrationData);
      const data = await response.json();

      // Store token and mark as new user for tour
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('elira_new_user', 'true');

      toast({
        title: "Sikeres regisztráció!",
        description: "Üdvözöljük az Elira platformon!",
      });

      // Navigate to dashboard
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Hiba történt",
        description: error.message || "Kérjük, próbálja újra később",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (step / 2) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Csatlakozzon az Elira-hoz
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Kezdje el tanulási útját a legjobb magyar egyetemi kurzusokkal
          </p>
        </div>

        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span className={step >= 1 ? "text-blue-600 dark:text-blue-400" : ""}>
              Személyes adatok
            </span>
            <span className={step >= 2 ? "text-blue-600 dark:text-blue-400" : ""}>
              Preferenciák
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3">
                      1
                    </span>
                    Személyes adatok
                  </CardTitle>
                  <CardDescription>
                    Adja meg alapvető információit a fiók létrehozásához
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={personalForm.handleSubmit(handlePersonalInfoSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Keresztnév</Label>
                        <Input
                          id="firstName"
                          {...personalForm.register("firstName")}
                          placeholder="János"
                        />
                        {personalForm.formState.errors.firstName && (
                          <p className="text-sm text-red-600 mt-1">
                            {personalForm.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Vezetéknév</Label>
                        <Input
                          id="lastName"
                          {...personalForm.register("lastName")}
                          placeholder="Kovács"
                        />
                        {personalForm.formState.errors.lastName && (
                          <p className="text-sm text-red-600 mt-1">
                            {personalForm.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email cím</Label>
                      <Input
                        id="email"
                        type="email"
                        {...personalForm.register("email")}
                        placeholder="janos.kovacs@email.hu"
                      />
                      {personalForm.formState.errors.email && (
                        <p className="text-sm text-red-600 mt-1">
                          {personalForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefonszám (opcionális)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...personalForm.register("phone")}
                        placeholder="+36 30 123 4567"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password">Jelszó</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            {...personalForm.register("password")}
                            placeholder="••••••••"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {personalForm.watch("password") && (
                          <div className="mt-2">
                            {(() => {
                              const strength = calculatePasswordStrength(personalForm.watch("password"));
                              return (
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Jelszó erőssége:</span>
                                    <span 
                                      className="text-xs font-medium"
                                      style={{ color: strength.color }}
                                    >
                                      {strength.feedback}
                                    </span>
                                  </div>
                                  <Progress 
                                    value={(strength.score / 5) * 100} 
                                    className="h-1"
                                    style={{ 
                                      background: `linear-gradient(to right, ${strength.color} ${(strength.score / 5) * 100}%, #e5e7eb ${(strength.score / 5) * 100}%)`
                                    }}
                                  />
                                </div>
                              );
                            })()}
                          </div>
                        )}
                        {personalForm.formState.errors.password && (
                          <p className="text-sm text-red-600 mt-1">
                            {personalForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Jelszó megerősítése</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            {...personalForm.register("confirmPassword")}
                            placeholder="••••••••"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {personalForm.formState.errors.confirmPassword && (
                          <p className="text-sm text-red-600 mt-1">
                            {personalForm.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <Checkbox
                        id="acceptTerms"
                        {...personalForm.register("acceptTerms")}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="acceptTerms" className="text-sm leading-relaxed cursor-pointer">
                          Elfogadom a{" "}
                          <a href="#" className="text-blue-600 hover:underline">
                            Felhasználási Feltételeket
                          </a>{" "}
                          és az{" "}
                          <a href="#" className="text-blue-600 hover:underline">
                            Adatvédelmi Szabályzatot
                          </a>
                        </Label>
                        {personalForm.formState.errors.acceptTerms && (
                          <p className="text-sm text-red-600 mt-1">
                            {personalForm.formState.errors.acceptTerms.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" className="flex items-center">
                        Tovább
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3">
                      2
                    </span>
                    Tanulási preferenciák
                  </CardTitle>
                  <CardDescription>
                    Segítsen nekünk személyre szabni az élményt
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={preferencesForm.handleSubmit(handlePreferencesSubmit)} className="space-y-6">
                    <div>
                      <Label className="text-base font-semibold">Érdeklődési területek</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Válassza ki azokat a területeket, amelyek érdeklik
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {interests.map((interest) => (
                          <div key={interest.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={interest.id}
                              {...preferencesForm.register("interests")}
                              value={interest.id}
                              onCheckedChange={(checked) => {
                                const currentInterests = preferencesForm.getValues("interests");
                                if (checked) {
                                  preferencesForm.setValue("interests", [...currentInterests, interest.id]);
                                } else {
                                  preferencesForm.setValue("interests", 
                                    currentInterests.filter(i => i !== interest.id)
                                  );
                                }
                              }}
                            />
                            <Label htmlFor={interest.id} className="text-sm">
                              {interest.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {preferencesForm.formState.errors.interests && (
                        <p className="text-sm text-red-600 mt-1">
                          {preferencesForm.formState.errors.interests.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-base font-semibold">Tanulási célok</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Mit szeretne elérni a tanulással?
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {goals.map((goal) => (
                          <div key={goal.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={goal.id}
                              {...preferencesForm.register("goals")}
                              value={goal.id}
                              onCheckedChange={(checked) => {
                                const currentGoals = preferencesForm.getValues("goals");
                                if (checked) {
                                  preferencesForm.setValue("goals", [...currentGoals, goal.id]);
                                } else {
                                  preferencesForm.setValue("goals", 
                                    currentGoals.filter(g => g !== goal.id)
                                  );
                                }
                              }}
                            />
                            <Label htmlFor={goal.id} className="text-sm">
                              {goal.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {preferencesForm.formState.errors.goals && (
                        <p className="text-sm text-red-600 mt-1">
                          {preferencesForm.formState.errors.goals.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-base font-semibold">Tapasztalati szint</Label>
                      <RadioGroup 
                        {...preferencesForm.register("experienceLevel")}
                        defaultValue="beginner"
                        className="mt-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="beginner" id="beginner" />
                          <Label htmlFor="beginner">Kezdő</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="intermediate" id="intermediate" />
                          <Label htmlFor="intermediate">Haladó</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="advanced" id="advanced" />
                          <Label htmlFor="advanced">Szakértő</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base font-semibold">Tanulási stílus</Label>
                      <RadioGroup 
                        {...preferencesForm.register("learningStyle")}
                        defaultValue="visual"
                        className="mt-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="visual" id="visual" />
                          <Label htmlFor="visual">Vizuális tanulás</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="auditory" id="auditory" />
                          <Label htmlFor="auditory">Auditív tanulás</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hands-on" id="hands-on" />
                          <Label htmlFor="hands-on">Gyakorlatias tanulás</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setStep(1)}
                        className="flex items-center"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Vissza
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="flex items-center"
                      >
                        {isLoading ? (
                          "Fiók létrehozása..."
                        ) : (
                          <>
                            Fiók létrehozása
                            <CheckCircle className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}