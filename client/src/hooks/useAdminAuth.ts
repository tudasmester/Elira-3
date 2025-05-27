import { useQuery } from "@tanstack/react-query";

export function useAdminAuth() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/admin/check"],
    retry: false,
  });

  return {
    isAdmin: data?.isAdmin || false,
    user: data?.user,
    isLoading,
    error,
  };
}