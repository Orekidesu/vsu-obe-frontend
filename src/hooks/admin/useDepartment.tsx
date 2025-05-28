import useApi from "@/hooks/useApi";
import { Department } from "@/types/model/Department";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { APIError } from "@/app/utils/errorHandler";
import { useAuth } from "@/hooks/useAuth";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

interface DeleteDepartmentContext {
  previousDepartments?: Department[];
}

interface useDepartmentsOptions {
  role?: "admin" | "dean";
}

const useDepartments = (options: useDepartmentsOptions = {}) => {
  const api = useApi();
  const queryClient = useQueryClient();

  const { session } = useAuth();

  const role =
    options.role || ((session as Session)?.Role === "Admin" ? "admin" : "dean");

  // fetch programs
  const endpoint = `${role}/departments`;

  const {
    data: departments,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await api.get<{ data: Department[] }>(endpoint);
      const responseData = response.data.data;
      return responseData;
    },
  });

  const getErrorMessage = (error: APIError, defaultMessage: string): string => {
    return error?.response?.data?.message || error?.message || defaultMessage;
  };

  // create department

  const createDepartment = useMutation<void, APIError, Partial<Department>>({
    mutationFn: async (newDepartment: Partial<Department>) => {
      const response = await api.post("admin/departments", newDepartment);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error, "Failed to create Department"));
    },
  });

  // update a department
  const updateDepartment = useMutation<
    void,
    APIError,
    { id: number; updatedData: Partial<Department> }
  >({
    mutationFn: async ({ id, updatedData }) => {
      const response = await api.put(`admin/departments/${id}`, updatedData);
      const responseData = response.data;
      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error, "Failed to updated Department"));
    },
  });

  // delete a department

  const deleteDepartment = useMutation<
    void,
    APIError,
    number,
    DeleteDepartmentContext
  >({
    mutationFn: async (id) => {
      await api.delete(`admin/departments/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["departments"] });

      const previousDepartments = queryClient.getQueryData<Department[]>([
        "departments",
      ]);

      queryClient.setQueryData<Department[]>(["departments"], (old) =>
        old ? old.filter((department) => department.id !== id) : []
      );

      return { previousDepartments };
    },
    onError: (error, id, context) => {
      if (context?.previousDepartments) {
        queryClient.setQueryData(["departments"], context.previousDepartments);
      }
      throw new Error(getErrorMessage(error, "Failed to delete department"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    departments,
    isLoading,
    error,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
};

export default useDepartments;
