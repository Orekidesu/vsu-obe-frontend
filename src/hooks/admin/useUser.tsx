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

  // Fetch all users at once
  const { data, error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
    staleTime: 1000 * 60 * 5, //  Cache users for 5 minutes
  });

  // Ensure users is always an array
  const users = data?.data ?? [];

  //  Compute pagination in React (since API is no longer paginating)
  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalUsers);

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

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => deleteUser(id),

    //  Optimistically update UI before API response
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      // Snapshot previous users before deletion
      const previousUsers = queryClient.getQueryData<{ data: User[] }>([
        "users",
      ]);

      // Optimistically remove user from the UI
      queryClient.setQueryData(["users"], (oldData: any) => {
        return {
          ...oldData,
          data: oldData.data.filter((user: User) => user.id !== id),
        };
      });

      return { previousUsers };
    },

    //  Rollback on error
    onError: (error, id, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
    },

    //  Refetch to ensure data consistency
    onSettled: () => {
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
