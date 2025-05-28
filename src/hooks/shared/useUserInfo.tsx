import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { APIError } from "@/app/utils/errorHandler";
import useApi from "../useApi";

interface UserInfo {
  First_Name: string;
  Last_Name: string;
  Email: string;
  Role: string;
}

const useUserInfo = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const getErrorMessage = (error: APIError, defaultMessage: string): string => {
    return error?.response?.data?.message || error?.message || defaultMessage;
  };

  // Get current user
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get<{ data: UserInfo }>("user");
      return response.data.data;
    },
  });

  // Change user information
  const updateUserInfo = useMutation<void, APIError, Partial<UserInfo>>({
    mutationFn: async (userData: Partial<UserInfo>) => {
      const response = await api.post("change-user-info", {
        first_name: userData.First_Name,
        last_name: userData.Last_Name,
        email: userData.Email,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      throw new Error(
        getErrorMessage(error, "Failed to update user information")
      );
    },
  });

  return {
    user,
    isLoading,
    error,
    updateUserInfo,
  };
};

export default useUserInfo;
