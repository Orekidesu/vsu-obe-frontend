"use client";
import { User } from "@/types/model/User";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserApi } from "@/app/api/admin/userApi";

const useUsers = () => {
  const queryClient = useQueryClient();
  const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword,
  } = useUserApi();

  // Get all users
  const {
    data: users,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5,
  });

  // Create User
  const createUserMutation = useMutation({
    mutationFn: async (newUser: Partial<User>) => createUser(newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      if (error.response?.data) {
        throw new Error(error.response.data.message) || "Failed to create user";
      } else {
        console.error(error);
      }
    },
  });
  // Update User
  const updateUserMutaion = useMutation({
    mutationFn: async ({
      id,
      updatedData,
    }: {
      id: number;
      updatedData: Partial<User>;
    }) => updateUser(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to update user");
      } else {
        console.error(error);
      }
    },
  });

  // get single User
  const getUser = async (id: number) => {
    return await getUserById(id);
  };

  // Delete User
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to delete user");
      } else {
        console.error(error);
      }
    },
  });

  // Reset Password

  const resetUserPasswordMutation = useMutation({
    mutationFn: async (id: number) => resetUserPassword(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to delete user");
      } else {
        console.error(error);
      }
    },
  });
  return {
    users,
    isLoading,
    error,
    getUser,
    createUser: createUserMutation,
    updateUser: updateUserMutaion,
    deleteUser: deleteUserMutation,
    resetUserPassword: resetUserPasswordMutation,
  };
};

export default useUsers;
