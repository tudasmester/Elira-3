import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImageUrl?: string;
}

export function useAuth() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      localStorage.removeItem('auth_token');
      queryClient.setQueryData(["/api/auth/user"], null);
      queryClient.invalidateQueries();
      toast({
        title: "Sikeres kijelentkezés",
        description: "Viszlát!",
      });
      navigate('/');
    },
    onError: () => {
      toast({
        title: "Hiba történt",
        description: "Kérjük, próbáld újra",
        variant: "destructive",
      });
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    isLoggingOut: logoutMutation.isPending,
  };
}