import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Phone, Eye, EyeOff, Chrome, UserPlus } from "lucide-react";
import { FaFacebook, FaApple } from "react-icons/fa";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

interface LoginFormData {
  email: string;
  password: string;
  phone: string;
  verificationCode: string;
}

export default function AuthPageLogin() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("email-login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    phone: "",
    verificationCode: "",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Check for OAuth callback success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const authStatus = urlParams.get('auth');
    
    if (token && authStatus === 'success') {
      localStorage.setItem('auth_token', token);
      toast({
        title: "Sikeres bejelentkezés!",
        description: "Üdvözöljük vissza!",
      });
      navigate('/dashboard');
    } else if (authStatus === 'error') {
      toast({
        title: "Bejelentkezési hiba",
        description: "Kérjük próbálja újra.",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailLogin = async () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Hiányos adatok",
        description: "Kérjük töltse ki az összes mezőt",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        toast({
          title: "Sikeres bejelentkezés!",
          description: "Üdvözöljük vissza!",
        });
        // Force page reload to update auth state
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      toast({
        title: "Bejelentkezési hiba",
        description: error.message || "Hibás email vagy jelszó",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async () => {
    if (!formData.phone) {
      toast({
        title: "Hiányos adatok",
        description: "Kérjük adja meg telefonszámát",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/phone/login", {
        phone: formData.phone,
      });

      const data = await response.json();
      
      if (data.success) {
        setPendingVerification(true);
        toast({
          title: "Ellenőrző kód elküldve",
          description: "Kérjük adja meg a telefonszámára küldött kódot",
        });
      }
    } catch (error: any) {
      toast({
        title: "Hiba történt",
        description: error.message || "Nem sikerült elküldeni az ellenőrző kódot",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneVerification = async () => {
    if (!formData.verificationCode) {
      toast({
        title: "Hiányos adatok",
        description: "Kérjük adja meg az ellenőrző kódot",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/phone/verify", {
        phone: formData.phone,
        code: formData.verificationCode,
      });

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        toast({
          title: "Sikeres bejelentkezés!",
          description: "Üdvözöljük vissza!",
        });
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      toast({
        title: "Ellenőrzési hiba",
        description: error.message || "Hibás ellenőrző kód",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Hero Content */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Üdvözöljük vissza az <span className="text-blue-600">Academion</span>-ban!
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              Folytassa tanulási útját Magyarország vezető online oktatási platformján.
              Szakértői kurzusok, személyre szabott ajánlások és élő közösség várja.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Személyre szabott</h3>
                  <p className="text-sm text-neutral-600">Kurzusajánlások</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Chrome className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Tanúsítványok</h3>
                  <p className="text-sm text-neutral-600">Elismert oklevelek</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Registration CTA */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-2">Még nincs fiókja?</h3>
                <p className="text-blue-100">Csatlakozzon most és kezdje el tanulási útját!</p>
              </div>
              <Button 
                variant="secondary" 
                onClick={() => navigate('/onboarding')}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Regisztráció
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Side - Login Form */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Bejelentkezés</CardTitle>
            <CardDescription>
              Válasszon bejelentkezési módot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email-login">Email</TabsTrigger>
                <TabsTrigger value="phone-login">Telefon</TabsTrigger>
              </TabsList>

              {/* Email Login */}
              <TabsContent value="email-login" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email cím</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="kovacs.janos@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Jelszó</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Írja be jelszavát"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      disabled={isLoading}
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
                <Button 
                  className="w-full" 
                  onClick={handleEmailLogin}
                  disabled={isLoading}
                >
                  {isLoading ? "Bejelentkezés..." : "Bejelentkezés"}
                </Button>
              </TabsContent>

              {/* Phone Login */}
              <TabsContent value="phone-login" className="space-y-4 mt-6">
                {!pendingVerification ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefonszám</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+36 30 123 4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handlePhoneLogin}
                      disabled={isLoading}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      {isLoading ? "Küldés..." : "Ellenőrző kód küldése"}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="verificationCode">Ellenőrző kód</Label>
                      <Input
                        id="verificationCode"
                        type="text"
                        placeholder="123456"
                        value={formData.verificationCode}
                        onChange={(e) => handleInputChange("verificationCode", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handlePhoneVerification}
                      disabled={isLoading}
                    >
                      {isLoading ? "Ellenőrzés..." : "Ellenőrzés"}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => setPendingVerification(false)}
                      disabled={isLoading}
                    >
                      Vissza
                    </Button>
                  </>
                )}
              </TabsContent>
            </Tabs>

            {/* Social Login */}
            <div className="mt-6">
              <div className="text-center">
                <Link href="/password-reset">
                  <Button variant="ghost" className="text-sm text-blue-600 hover:text-blue-700">
                    Elfelejtette jelszavát?
                  </Button>
                </Link>
              </div>
              
              <Separator className="my-4" />
              <p className="text-center text-sm text-neutral-600 mb-4">
                Vagy folytassa közösségi fiókkal
              </p>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleOAuthLogin('google')}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Chrome className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleOAuthLogin('facebook')}
                  disabled={isLoading}
                  className="w-full"
                >
                  <FaFacebook className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleOAuthLogin('apple')}
                  disabled={isLoading}
                  className="w-full"
                >
                  <FaApple className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}