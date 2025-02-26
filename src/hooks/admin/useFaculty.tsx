import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "../useApi";
import { Faculty } from "@/types/model/Faculty";
import localData from "../useLocalData";

const STORAGE_KEY = "faculty_data";

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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data.data));
      return response.data.data;
    },

    initialData: () => {
      const local = localData(STORAGE_KEY) || null;
      return local;
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
        console.error("Failed at creating faculty", error.response.data.errors);
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
    onSuccess: () => {
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
