import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "../useApi";
import { Faculty } from "@/types/model/Faculty";
import { APIError } from "@/app/utils/errorHandler";

interface DeleteFacultyContext {
  previousFaculties?: Faculty[];
}

const useFaculties = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  // Fetch faculties
  const {
    data: faculties,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["faculties"],
    queryFn: async () => {
      const response = await api.get<{ data: Faculty[] }>("admin/faculties");

      return response.data.data;
    },
  });

  const getErrorMessage = (error: APIError, defaultMessage: string): string => {
    return error?.response?.data?.message || error?.message || defaultMessage;
  };

  // Create Faculty
  const createFaculty = useMutation<void, APIError, Partial<Faculty>>({
    mutationFn: async (newFaculty: Partial<Faculty>) => {
      const response = await api.post("admin/faculties", newFaculty);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error, "Failed to create Faculty"));
    },
  });

  // Update Faculty
  const updateFaculty = useMutation<
    void,
    APIError,
    { id: number; updatedData: Partial<Faculty> }
  >({
    mutationFn: async ({ id, updatedData }) => {
      const response = await api.put(`admin/faculties/${id}`, updatedData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error, "Failed to updated faculty"));
    },
  });

  // Delete Faculty
  const deleteFaculty = useMutation<
    void,
    APIError,
    number,
    DeleteFacultyContext
  >({
    mutationFn: async (id) => {
      await api.delete(`admin/faculties/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["faculties"] });

      const previousFaculties = queryClient.getQueryData<Faculty[]>([
        "faculties",
      ]);

      queryClient.setQueryData<Faculty[]>(["faculties"], (old) =>
        old ? old.filter((faculty) => faculty.id !== id) : []
      );

      return { previousFaculties };
    },
    onError: (error, id, context) => {
      if (context?.previousFaculties) {
        queryClient.setQueryData(["faculties"], context.previousFaculties);
      }
      throw new Error(getErrorMessage(error, "Failed to delete faculty"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    faculties,
    isLoading,
    error,
    createFaculty,
    updateFaculty,
    deleteFaculty,
  };
};

export default useFaculties;
