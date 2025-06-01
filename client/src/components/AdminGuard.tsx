import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Hozzáférés ellenőrzése...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle>Hozzáférés megtagadva</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Az admin felület eléréséhez be kell jelentkeznie.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth">
                Bejelentkezés
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is admin
  if (!user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <CardTitle>Nincs jogosultság</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Az admin felület csak adminisztrátorok számára érhető el.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                Vissza a főoldalra
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}