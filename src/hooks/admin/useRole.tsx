"use client";

import { useQuery } from "@tanstack/react-query";
import { useRoleApi } from "@/app/api/admin/roleApi";

const useRoles = () => {
  const { getRoles } = useRoleApi();

  const { data, error, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    staleTime: 1000 * 60 * 5,
  });

  const roles = data?.data ?? [];
  return {
    roles,
    error,
    isLoading,
  };
};

export default useRoles;
