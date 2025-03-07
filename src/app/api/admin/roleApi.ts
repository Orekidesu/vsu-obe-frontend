import useApi from "@/hooks/useApi";
import { Role } from "@/types/model/Role";

export const useRoleApi = () => {
  const api = useApi();

  return {
    getRoles: async () => {
      const response = await api.get<{ data: Role[] }>("admin/roles");
      return response.data;
    },
  };
};
