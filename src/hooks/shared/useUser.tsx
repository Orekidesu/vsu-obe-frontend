"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { User } from "@/types/model/User";
import { useUserApi } from "@/app/api/admin/userApi";
import { useAuth } from "@/hooks/useAuth";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

interface UseUsersOptions {
  role?: "admin" | "department" | "dean" | "faculty";
}

const useUsers = (options: UseUsersOptions = {}) => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Get the user's role from session
  const userRole = (session as Session)?.Role;

  // Determine endpoint based on role hierarchy or use the provided role
  const role =
    options.role ||
    (() => {
      switch (userRole) {
        case "Admin":
          return "admin";
        case "Dean":
          return "dean";
        case "Department":
          return "department";
        case "Faculty":
          return "faculty";
        default:
          return "admin"; // Default fallback
      }
    })();

  // Get API functions with the correct role-based endpoint
  const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword,
  } = useUserApi(role);

  // Fetch all users at once
  const { data, error, isLoading } = useQuery({
    queryKey: ["users", role], // Include role in query key for proper caching
    queryFn: () => getUsers(),
    staleTime: 1000 * 60 * 5, // Cache users for 5 minutes
    enabled: !!session, // Only run query if session exists
  });

  // Ensure users is always an array
  const users = data?.data ?? [];

  // Compute pagination in React (since API is no longer paginating)
  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalUsers);

  // Create User
  const createUserMutation = useMutation({
    mutationFn: async (newUser: Partial<User>) => createUser(newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", role] });
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
      queryClient.invalidateQueries({ queryKey: ["users", role] });
    },
  });

  // Get single User
  const getUser = async (id: number) => {
    return await getUserById(id);
  };

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => deleteUser(id),

    // Optimistically update UI before API response
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["users", role] });

      // Snapshot previous users before deletion
      const previousUsers = queryClient.getQueryData<{ data: User[] }>([
        "users",
        role,
      ]);

      // Optimistically remove user from the UI
      queryClient.setQueryData<{ data: User[] } | undefined>(
        ["users", role],
        (oldData) => {
          if (!oldData) return undefined;

          return {
            ...oldData,
            data: oldData.data.filter((user) => user.id !== id),
          };
        }
      );

      return { previousUsers };
    },

    // Rollback on error
    onError: (error, id, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users", role], context.previousUsers);
      }
    },

    // Refetch to ensure data consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users", role] });
    },
  });

  // Reset Password
  const resetUserPasswordMutation = useMutation({
    mutationFn: async (id: number) => resetUserPassword(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", role] });
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
    setPage,
    getUser,
    createUser: createUserMutation,
    updateUser: updateUserMutation,
    deleteUser: deleteUserMutation,
    resetUserPassword: resetUserPasswordMutation,
    role, // Return the determined role for debugging or UI purposes
  };
};

export default useUsers;
