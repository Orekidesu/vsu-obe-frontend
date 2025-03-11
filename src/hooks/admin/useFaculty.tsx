import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "../useApi";
import { Faculty } from "@/types/model/Faculty";

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

  // Create Faculty
  const createFaculty = useMutation({
    mutationFn: async (newFaculty: Partial<Faculty>) => {
      const response = await api.post("admin/faculties", newFaculty);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
    onError: (error: any) => {
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to create faculty"
        );
      } else {
        console.error(error);
      }
    },
  });

  // Update Faculty
  const updateFaculty = useMutation({
    mutationFn: async ({
      id,
      updatedData,
    }: {
      id: number;
      updatedData: Partial<Faculty>;
    }) => {
      const response = await api.put(`admin/faculties/${id}`, updatedData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
    onError: (error: any) => {
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "failed to update faculty"
        );
      } else {
        console.error(error);
      }
    },
  });

  // Delete Faculty
  const deleteFaculty = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`admin/faculties/${id}`);
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["faculties"] });

      const previousFaculties = queryClient.getQueryData<Faculty[]>([
        "faculties",
      ]);

      queryClient.setQueryData<Faculty[]>(["faculties"], (old) =>
        old ? old.filter((faculty) => faculty.id !== id) : []
      );

      return { previousFaculties };
    },
    onError: (error: any, id: number, context: any) => {
      if (context?.previousFaculties) {
        queryClient.setQueryData(["faculties"], context.previousFaculties);
      }
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to delete faculty"
        );
      } else {
        console.error(error);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
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
