import useApi from "@/hooks/useApi";
import { User } from "@/types/model/User";

export const useUserApi = (role = "admin") => {
  const api = useApi();
  const baseEndpoint = `${role}/users`;

  return {
    getUsers: async () => {
      const response = await api.get<{ data: User[] }>(baseEndpoint);
      return response.data;
    },

    getUserById: async (id: number) => {
      const response = await api.get<{ data: User }>(`${baseEndpoint}/${id}`);
      return response.data.data;
    },

    createUser: async (newUser: Partial<User>) => {
      const response = await api.post(baseEndpoint, newUser);
      return response.data;
    },

    updateUser: async (id: number, updatedData: Partial<User>) => {
      const response = await api.put(`${baseEndpoint}/${id}`, updatedData);
      return response.data;
    },

    deleteUser: async (id: number) => {
      await api.delete(`${baseEndpoint}/${id}`);
    },

    resetUserPassword: async (id: number) => {
      const response = await api.post(`${baseEndpoint}/${id}/reset-password`);
      return response.data;
    },
  };
};
