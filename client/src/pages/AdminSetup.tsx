import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Lock, User } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export default function AdminSetup() {
  const [adminSecret, setAdminSecret] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const setupAdminMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error('You must be logged in to setup admin access');
      }

      const response = await apiRequest('POST', '/api/admin/setup-admin', {
        userId: user.id,
        adminSecret: adminSecret
      });

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Admin access granted!",
        description: "You now have administrator privileges.",
      });
      
      // Redirect to admin panel
      window.location.href = '/admin';
    },
    onError: (error: Error) => {
      toast({
        title: "Setup failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You must be logged in to access admin setup.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="w-full"
            >
              <User className="h-4 w-4 mr-2" />
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <CardTitle className="text-2xl">Admin Setup</CardTitle>
          <CardDescription>
            Enter the admin setup secret to gain administrator privileges for your Academion platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Current User</span>
            </div>
            <p className="text-sm text-blue-700">
              {user.email || user.firstName || 'Logged in user'}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              ID: {user.id}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminSecret" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Admin Setup Secret
            </Label>
            <Input
              id="adminSecret"
              type="password"
              placeholder="Enter admin setup secret..."
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && adminSecret.trim()) {
                  setupAdminMutation.mutate();
                }
              }}
            />
          </div>

          <Button
            onClick={() => setupAdminMutation.mutate()}
            disabled={!adminSecret.trim() || setupAdminMutation.isPending}
            className="w-full"
          >
            {setupAdminMutation.isPending ? (
              "Setting up admin access..."
            ) : (
              "Grant Admin Access"
            )}
          </Button>

          <div className="text-center text-sm text-gray-600">
            <p>This will grant administrator privileges to your account.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}