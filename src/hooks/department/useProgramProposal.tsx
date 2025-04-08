import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgramProposal } from "@/types/model/ProgramProposal";
import { APIError } from "@/app/utils/errorHandler";
import useApi from "../useApi";

interface DeleteProgramProposalContext {
  previousProgramProposals?: ProgramProposal[];
}

const useProgramProposals = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  // fetch program proposals

  const {
    data: programProposals,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["program-proposals"],
    queryFn: async () => {
      const response = await api.get<{ data: ProgramProposal[] }>(
        "department/program-proposals"
      );

      return response.data.data;
    },
  });

  const getErrorMessage = (error: APIError, defaultMessage: string): string => {
    return error?.response?.data?.message || error?.message || defaultMessage;
  };

  // create program proposal
  const createProgramProposal = useMutation<
    void,
    APIError,
    Partial<ProgramProposal>
  >({
    mutationFn: async (newProgramProposal: Partial<ProgramProposal>) => {
      const response = await api.post(
        "department/program-proposals",
        newProgramProposal
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["program-proposals"] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error, "Failed to create proposal"));
    },
  });
  // update program proposal
  const updateProgramProposal = useMutation<
    void,
    APIError,
    { id: number; updatedData: Partial<ProgramProposal> }
  >({
    mutationFn: async ({ id, updatedData }) => {
      const response = await api.put(
        `department/program-proposals/${id}`,
        updatedData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["program-proposals"] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error, "Failed to update proposal"));
    },
  });

  // delete proposal
  const deleteProgramProposal = useMutation<
    void,
    APIError,
    number,
    DeleteProgramProposalContext
  >({
    mutationFn: async (id) => {
      await api.delete(`department/program-proposals/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["programs"] });

      const previousProgramProposals = queryClient.getQueryData<
        ProgramProposal[]
      >(["program-proposals"]);

      queryClient.setQueryData<ProgramProposal[]>(
        ["program-proposals"],
        (old) => (old ? old.filter((faculty) => faculty.id !== id) : [])
      );

      return { previousProgramProposals };
    },
    onError: (error, id, context) => {
      if (context?.previousProgramProposals) {
        queryClient.setQueryData(
          ["programs"],
          context.previousProgramProposals
        );
      }
      throw new Error(getErrorMessage(error, "Failed to delete faculty"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
  return {
    programProposals,
    isLoading,
    error,
    createProgramProposal,
    updateProgramProposal,
    deleteProgramProposal,
  };
};

export default useProgramProposals;
