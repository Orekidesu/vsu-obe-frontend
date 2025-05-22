import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ProgramProposal,
  ProgramProposalResponse,
} from "@/types/model/ProgramProposal";
import { APIError } from "@/app/utils/errorHandler";
import useApi from "../useApi";
import { FullProgramProposalPayload } from "@/app/utils/department/programProposalPayload";
import { useAuth } from "@/hooks/useAuth";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";
import { ReviewProposalPayload } from "@/app/utils/dean/reviewProgramProposalPayload";
import { SubmitDepartmentRevisionsPayload } from "@/types/model/DepartmentRevision"; // Add this import

interface DeleteProgramProposalContext {
  previousProgramProposals?: ProgramProposal[];
}

interface useProgramOptions {
  role?: "dean" | "department";
}

const useProgramProposals = (options: useProgramOptions = {}) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const role =
    options.role ||
    ((session as Session)?.Role === "Department" ? "department" : "dean");

  // fetch programs
  const endpoint = `${role}/program-proposals`;

  // fetch program proposals

  const {
    data: programProposals,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["program-proposals", role],
    queryFn: async () => {
      const response = await api.get<{ data: ProgramProposalResponse[] }>(
        endpoint
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
      const response = await api.post(endpoint, newProgramProposal);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["program-proposals"] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error, "Failed to create proposal"));
    },
  });

  const getProgramProposal = (id: number) => ({
    queryKey: ["program-proposal", id],
    queryFn: async () => {
      const response = await api.get<{ data: ProgramProposalResponse }>(
        `${endpoint}/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });

  const getProgramProposalFromCache = (id: number) => {
    return {
      queryKey: ["program-proposals", role], // Match the exact key used in the main query
      queryFn: async () => {
        // We need to provide a query function even when reading from cache
        const response = await api.get<{ data: ProgramProposalResponse[] }>(
          endpoint
        );
        return response.data.data;
      },
      select: (data: ProgramProposalResponse[] | undefined) =>
        data?.find((proposal) => proposal.id === id),
      enabled: !!id,
    };
  };

  // update program proposal
  const updateProgramProposal = useMutation<
    void,
    APIError,
    { id: number; updatedData: Partial<ProgramProposal> }
  >({
    mutationFn: async ({ id, updatedData }) => {
      const response = await api.put(`${endpoint}/${id}`, updatedData);
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
      await api.delete(`${endpoint}/${id}`);
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

  const submitFullProgramProposal = useMutation<
    void,
    APIError,
    FullProgramProposalPayload
  >({
    mutationFn: async (proposalData: FullProgramProposalPayload) => {
      const response = await api.post(
        "department/program-proposals/full-submit",
        proposalData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["program-proposals"] });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
    onError: (error) => {
      throw new Error(
        getErrorMessage(error, "Failed to submit full program proposal")
      );
    },
  });

  const submitProposalReview = useMutation<
    void,
    APIError,
    { proposalId: number; reviewData: ReviewProposalPayload }
  >({
    mutationFn: async ({ proposalId, reviewData }) => {
      const response = await api.post(
        `department/program-proposals/${proposalId}/revise`,
        reviewData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["program-proposals"] });
    },
    onError: (error) => {
      throw new Error(
        getErrorMessage(error, "Failed to submit proposal review")
      );
    },
  });

  const submitDepartmentRevisions = useMutation<
    void,
    APIError,
    { proposalId: number; revisionData: SubmitDepartmentRevisionsPayload }
  >({
    mutationFn: async ({ proposalId, revisionData }) => {
      const response = await api.post(
        `${role}/program-proposals/${proposalId}/revision`,
        revisionData
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["program-proposals"] });
      queryClient.invalidateQueries({ queryKey: ["programProposalRevisions"] });
    },
    onError: (error) => {
      throw new Error(
        getErrorMessage(error, "Failed to submit proposal revisions")
      );
    },
  });

  return {
    programProposals,
    isLoading,
    submitFullProgramProposal,
    submitProposalReview,
    error,
    getProgramProposal,
    getProgramProposalFromCache,
    submitDepartmentRevisions,
    createProgramProposal,
    updateProgramProposal,
    deleteProgramProposal,
  };
};

export default useProgramProposals;
