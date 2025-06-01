import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { ArrowLeft, Mail, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'wouter';

export default function PasswordReset() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Check for reset token in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    if (resetToken) {
      setToken(resetToken);
      setStep('reset');
    }
  }, []);

  const handleRequestReset = async () => {
    if (!email) {
      toast({
        title: "Hiányzó email",
        description: "Kérjük adja meg email címét",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/forgot-password", { email });
      
      toast({
        title: "Email elküldve",
        description: "Ellenőrizze postaládáját a jelszó visszaállítási útmutatóért",
      });
    } catch (error: any) {
      toast({
        title: "Hiba történt",
        description: error.message || "Nem sikerült elküldeni a visszaállítási emailt",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Hiányzó adatok",
        description: "Kérjük töltse ki az összes mezőt",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Jelszavak nem egyeznek",
        description: "A két jelszó nem egyezik meg",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Túl rövid jelszó",
        description: "A jelszónak legalább 6 karakter hosszúnak kell lennie",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/reset-password", {
        token,
        newPassword
      });
      
      toast({
        title: "Jelszó visszaállítva",
        description: "A jelszava sikeresen megváltozott. Most bejelentkezhet az új jelszavával.",
      });
      
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Hiba történt",
        description: error.message || "Nem sikerült visszaállítani a jelszót",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                {step === 'request' ? (
                  <Mail className="h-6 w-6 text-blue-600" />
                ) : (
                  <Lock className="h-6 w-6 text-blue-600" />
                )}
              </div>
            </div>
            <CardTitle className="text-2xl">
              {step === 'request' ? 'Jelszó visszaállítása' : 'Új jelszó beállítása'}
            </CardTitle>
            <CardDescription>
              {step === 'request' 
                ? 'Adja meg email címét és küldünk egy visszaállítási linket'
                : 'Adjon meg egy új, biztonságos jelszót'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {step === 'request' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email cím</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="kovacs.janos@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleRequestReset}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Küldés...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Visszaállítási link küldése
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Új jelszó</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Legalább 6 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Jelszó megerősítése</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Írja be újra az új jelszót"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleResetPassword}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Beállítás...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Jelszó beállítása
                    </>
                  )}
                </Button>
              </>
            )}
            
            <div className="text-center">
              <Link href="/auth">
                <Button variant="ghost" className="text-sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Vissza a bejelentkezéshez
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}