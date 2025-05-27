import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Eye, EyeOff, Chrome } from "lucide-react";
import { FaFacebook, FaApple } from "react-icons/fa";
import { apiRequest } from "@/lib/queryClient";

interface AuthFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  verificationCode: string;
}

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("email-login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [userId, setUserId] = useState("");
  
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    verificationCode: "",
  });

  // Check for OAuth callback success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const authStatus = urlParams.get('auth');
    
    if (token && authStatus === 'success') {
      localStorage.setItem('auth_token', token);
      toast({
        title: "Sikeres bejelentkezés!",
        description: "Üdvözlünk az Academion-ban!",
      });
      navigate('/');
    }
  }, [navigate, toast]);

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('auth_token', data.token);
        toast({
          title: "Sikeres bejelentkezés!",
          description: `Üdvözlünk, ${data.user.firstName}!`,
        });
        navigate('/');
      } else {
        toast({
          title: "Bejelentkezési hiba",
          description: data.message || "Hibás email vagy jelszó",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hiba történt",
        description: "Kérjük, próbáld újra később",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/auth/register", {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('auth_token', data.token);
        toast({
          title: "Sikeres regisztráció!",
          description: "Üdvözöljük az Academion-ban!",
        });
        navigate('/onboarding');
      } else {
        toast({
          title: "Regisztrációs hiba",
          description: data.message || "Hiba történt a regisztráció során",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hiba történt",
        description: "Kérjük, próbáld újra később",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = activeTab === "phone-login" ? "/api/auth/phone/login" : "/api/auth/phone/register";
      const payload = activeTab === "phone-login" 
        ? { phone: formData.phone }
        : { phone: formData.phone, firstName: formData.firstName, lastName: formData.lastName };

      const response = await apiRequest("POST", endpoint, payload);
      const data = await response.json();
      
      if (response.ok) {
        setPendingVerification(true);
        setUserId(data.userId);
        toast({
          title: "Kód elküldve",
          description: "Ellenőrzési kód került kiküldésre SMS-ben",
        });
      } else {
        toast({
          title: "Hiba",
          description: data.message || "Hiba történt",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hiba történt",
        description: "Kérjük, próbáld újra később",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/auth/phone/verify", {
        phone: formData.phone,
        code: formData.verificationCode,
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('auth_token', data.token);
        toast({
          title: "Sikeres bejelentkezés!",
          description: `Üdvözlünk, ${data.user.firstName}!`,
        });
        navigate('/');
      } else {
        toast({
          title: "Hibás kód",
          description: data.message || "Hibás vagy lejárt ellenőrzési kód",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hiba történt",
        description: "Kérjük, próbáld újra később",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    window.location.href = `/auth/${provider}`;
  };

  if (pendingVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Telefonszám ellenőrzés</CardTitle>
            <CardDescription className="text-center">
              Ellenőrzési kód került kiküldésre a(z) {formData.phone} számra
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePhoneVerification} className="space-y-4">
              <div>
                <Label htmlFor="verificationCode">Ellenőrzési kód</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  placeholder="123456"
                  value={formData.verificationCode}
                  onChange={(e) => handleInputChange("verificationCode", e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Ellenőrzés..." : "Ellenőrzés"}
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setPendingVerification(false);
                  setFormData(prev => ({ ...prev, verificationCode: "" }));
                }}
              >
                Vissza
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Auth Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Csatlakozz az Academion-hoz</CardTitle>
            <CardDescription>
              Válaszd ki a bejelentkezési módot
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email-login">Email</TabsTrigger>
                <TabsTrigger value="phone-login">Telefon</TabsTrigger>
              </TabsList>
              
              {/* Email Login */}
              <TabsContent value="email-login" className="space-y-4">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email cím</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Jelszó</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Bejelentkezés..." : "Bejelentkezés"}
                  </Button>
                </form>
                
                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => setActiveTab("email-register")}
                    className="text-sm"
                  >
                    Nincs még fiókod? Regisztrálj
                  </Button>
                </div>
              </TabsContent>
              
              {/* Phone Login */}
              <TabsContent value="phone-login" className="space-y-4">
                <form onSubmit={handlePhoneAuth} className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Telefonszám</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+36 20 123 4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Kód küldése..." : "Ellenőrzési kód küldése"}
                  </Button>
                </form>
                
                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => setActiveTab("phone-register")}
                    className="text-sm"
                  >
                    Nincs még fiókod? Regisztrálj telefonszámmal
                  </Button>
                </div>
              </TabsContent>
              
              {/* Email Register */}
              <TabsContent value="email-register" className="space-y-4">
                <form onSubmit={handleEmailRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="firstName">Keresztnév</Label>
                      <Input
                        id="firstName"
                        placeholder="János"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Vezetéknév</Label>
                      <Input
                        id="lastName"
                        placeholder="Kovács"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email-reg">Email cím</Label>
                    <Input
                      id="email-reg"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password-reg">Jelszó</Label>
                    <div className="relative">
                      <Input
                        id="password-reg"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Regisztráció..." : "Regisztrálás"}
                  </Button>
                </form>
                
                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => setActiveTab("email-login")}
                    className="text-sm"
                  >
                    Van már fiókod? Jelentkezz be
                  </Button>
                </div>
              </TabsContent>
              
              {/* Phone Register */}
              <TabsContent value="phone-register" className="space-y-4">
                <form onSubmit={handlePhoneAuth} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="firstName-phone">Keresztnév</Label>
                      <Input
                        id="firstName-phone"
                        placeholder="János"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName-phone">Vezetéknév</Label>
                      <Input
                        id="lastName-phone"
                        placeholder="Kovács"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone-reg">Telefonszám</Label>
                    <Input
                      id="phone-reg"
                      type="tel"
                      placeholder="+36 20 123 4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Regisztráció..." : "Regisztrálás telefonszámmal"}
                  </Button>
                </form>
                
                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => setActiveTab("phone-login")}
                    className="text-sm"
                  >
                    Van már fiókod? Jelentkezz be
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6">
              <Separator className="my-4" />
              <p className="text-center text-sm text-gray-600 mb-4">Vagy jelentkezz be közösségi fiókkal</p>
              
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin("google")}
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Google fiókkal
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin("facebook")}
                >
                  <FaFacebook className="w-4 h-4 mr-2 text-blue-600" />
                  Facebook fiókkal
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin("apple")}
                >
                  <FaApple className="w-4 h-4 mr-2" />
                  Apple fiókkal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Right side - Hero Section */}
        <div className="hidden lg:block">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Üdvözlünk az Academion-ban
            </h1>
            <p className="text-xl text-gray-600 max-w-md mx-auto">
              Fedezd fel a legjobb online kurzusokat magyar egyetemektől és oktatóktól
            </p>
            
            <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">Prémium oktatási tartalmak</span>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">Interaktív tanulási élmény</span>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">Személyre szabott tanulás</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}