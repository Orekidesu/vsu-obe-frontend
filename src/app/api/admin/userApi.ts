import useApi from "@/hooks/useApi";
import { User } from "@/types/model/User";

export const useUserApi = () => {
  const api = useApi();

  return {
    getUsers: async () => {
      const response = await api.get<{ data: User[] }>("admin/users");
      return response.data;
    },

    getUserById: async (id: number) => {
      const response = await api.get<{ data: User }>(`admin/users/${id}`);
      return response.data.data;
    },

    createUser: async (newUser: Partial<User>) => {
      const response = await api.post("admin/users", newUser);
      return response.data;
    },

    updateUser: async (id: number, updatedData: Partial<User>) => {
      const response = await api.put(`admin/users/${id}`, updatedData);
      return response.data;
    },

    deleteUser: async (id: number) => {
      await api.delete(`admin/users/${id}`);
    },

    resetUserPassword: async (id: number) => {
      const response = await api.post(`admin/users/${id}/reset-password`);
      return response.data;
    },
  };
};
