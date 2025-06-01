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
      // Clear all authentication data
      localStorage.removeItem('auth_token');
      localStorage.clear(); // Clear all localStorage to remove any cached auth data
      
      // Clear all queries and set user to null
      queryClient.clear();
      queryClient.setQueryData(["/api/auth/user"], null);
      
      toast({
        title: "Sikeres kijelentkezés",
        description: "Viszlát!",
      });
      
      // Navigate to home and force page reload to clear any remaining state
      navigate('/');
      window.location.reload();
    },
    onError: () => {
      // Even if backend fails, clear frontend state
      localStorage.removeItem('auth_token');
      queryClient.setQueryData(["/api/auth/user"], null);
      queryClient.clear();
      
      toast({
        title: "Kijelentkezés",
        description: "Sikeresen kijelentkeztél",
      });
      
      navigate('/');
      window.location.reload();
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