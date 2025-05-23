import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Program, ProgramResponse } from "@/types/model/Program";
import { APIError } from "@/app/utils/errorHandler";
import useApi from "../useApi";
import { useAuth } from "@/hooks/useAuth";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

interface DeleteProgramContext {
  previousPrograms?: Program[];
}

interface useProgramOptions {
  role?: "dean" | "department";
}

const usePrograms = (options: useProgramOptions = {}) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const role =
    options.role ||
    ((session as Session)?.Role === "Department" ? "department" : "dean");

  // fetch programs
  const endpoint = `${role}/programs`;

  const {
    data: programs,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["programs", role],
    queryFn: async () => {
      const response = await api.get<{ data: ProgramResponse[] }>(endpoint);

      return response.data.data;
    },
  });

  const getErrorMessage = (error: APIError, defaultMessage: string): string => {
    return error?.response?.data?.message || error?.message || defaultMessage;
  };

  // Create Program
  const createProgram = useMutation<void, APIError, Partial<Program>>({
    mutationFn: async (newProgram: Partial<Program>) => {
      const response = await api.post(endpoint, newProgram);
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
        `${endpoint}/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });

  const getProgramFromCache = (id: number) => {
    return {
      queryKey: ["programs", role],
      select: (data: ProgramResponse[] | undefined) =>
        data?.find((program) => program.id === id),
      enabled: !!id,
    };
  };

  // update Program

  const updateProgram = useMutation<
    void,
    APIError,
    { id: number; updatedData: Partial<Program> }
  >({
    mutationFn: async ({ id, updatedData }) => {
      const response = await api.put(`${endpoint}/${id}`, updatedData);
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
      await api.delete(`${endpoint}/${id}`);
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
    getProgramFromCache,
    updateProgram,
    deleteProgram,
  };
};

export default usePrograms;
