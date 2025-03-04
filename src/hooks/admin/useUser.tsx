import useApi from "@/hooks/useApi";
import { User } from "@/types/model/User";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useUsers = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const {
    data: users,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get<{ data: User[] }>("admin/users");

      const responseData = response.data.data;

      return responseData;
    },
  });
  // Create User
  const createUser = useMutation({
    mutationFn: async (newUser: Partial<User>) => {
      const response = await api.post("admin/users", newUser);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || "Failed to create user");
      } else {
        console.error(error);
      }
    },
  });
  // Update User

  // Show User

  // Delete User

  // Reset Password
};
