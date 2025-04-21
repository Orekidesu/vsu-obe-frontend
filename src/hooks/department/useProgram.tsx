import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Program, ProgramResponse } from "@/types/model/Program";
import { APIError } from "@/app/utils/errorHandler";
import useApi from "../useApi";

interface DeleteProgramContext {
  previousPrograms?: Program[];
}

const usePrograms = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  // fetch programs

  const {
    data: programs,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const response = await api.get<{ data: ProgramResponse[] }>(
        "department/programs"
      );

      return response.data.data;
    },
  });

  const getErrorMessage = (error: APIError, defaultMessage: string): string => {
    return error?.response?.data?.message || error?.message || defaultMessage;
  };

  // Create Program
  const createProgram = useMutation<void, APIError, Partial<Program>>({
    mutationFn: async (newProgram: Partial<Program>) => {
      const response = await api.post("department/programs", newProgram);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error, "Failed to create Program"));
    },
  });

  const getProgram = (id: number) => ({
    queryKey: ["program", id],
    queryFn: async () => {
      const response = await api.get<{ data: ProgramResponse }>(
        `department/programs/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });

  // update Program

  const updateProgram = useMutation<
    void,
    APIError,
    { id: number; updatedData: Partial<Program> }
  >({
    mutationFn: async ({ id, updatedData }) => {
      const response = await api.put(`department/programs/${id}`, updatedData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error, "Failed to update Program"));
    },
  });

  // Delete Department
  const deleteProgram = useMutation<
    void,
    APIError,
    number,
    DeleteProgramContext
  >({
    mutationFn: async (id) => {
      await api.delete(`department/programs/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["programs"] });

      const previousPrograms = queryClient.getQueryData<Program[]>([
        "programs",
      ]);

      queryClient.setQueryData<Program[]>(["programs"], (old) =>
        old ? old.filter((program) => program.id !== id) : []
      );

      return { previousPrograms };
    },
    onError: (error, id, context) => {
      if (context?.previousPrograms) {
        queryClient.setQueryData(["programs"], context.previousPrograms);
      }
      throw new Error(getErrorMessage(error, "Failed to delete course"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });

  return {
    programs,
    isLoading,
    error,
    createProgram,
    getProgram,
    updateProgram,
    deleteProgram,
  };
};

export default usePrograms;
