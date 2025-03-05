"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { User } from "@/types/model/User";
import { useUserApi } from "@/app/api/admin/userApi";

const useUsers = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword,
  } = useUserApi();

  // Fetch paginated users
  const { data, error, isLoading } = useQuery({
    queryKey: ["users", page, itemsPerPage],
    queryFn: () => getUsers(page, itemsPerPage),
    staleTime: 1000 * 60 * 5,
  });

  const users = data?.data || [];
  // console.log("Users data:", users);
  const pagination = data?.meta || {}; //
  const totalUsers = pagination.total || 0;
  const totalPages = pagination.last_page || 1;
  const startIndex = pagination.from || 0;
  const endIndex = pagination.to || 0;

  // Create User
  const createUserMutation = useMutation({
    mutationFn: async (newUser: Partial<User>) => createUser(newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // Update User
  const updateUserMutation = useMutation({
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
  });

  // Get single User
  const getUser = async (id: number) => {
    return await getUserById(id);
  };

  // Delete User
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // Reset Password
  const resetUserPasswordMutation = useMutation({
    mutationFn: async (id: number) => resetUserPassword(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    users,
    totalUsers,
    totalPages,
    startIndex,
    endIndex,
    isLoading,
    error,
    page,
    setPage, // ✅ Expose setPage to update currentPage from components
    getUser,
    createUser: createUserMutation,
    updateUser: updateUserMutation,
    deleteUser: deleteUserMutation,
    resetUserPassword: resetUserPasswordMutation,
  };
};

export default useUsers;
