import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ProgramProposal,
  ProgramProposalResponse,
} from "@/types/model/ProgramProposal";
import { APIError } from "@/app/utils/errorHandler";
import useApi from "../useApi";

interface DeleteProgramProposalContext {
  previousProgramProposals?: ProgramProposal[];
}
interface FullProgramProposalPayload {
  program: {
    name: string;
    abbreviation: string;
  };
  peos: Array<{ statement: string }>;
  peo_mission_mappings: Array<{ peo_index: number; mission_id: number }>;
  ga_peo_mappings: Array<{ peo_index: number; ga_id: number }>;
  pos: Array<{ name: string; statement: string }>;
  po_peo_mappings: Array<{ po_index: number; peo_index: number }>;
  po_ga_mappings: Array<{ po_index: number; ga_id: number }>;
  curriculum: { name: string };
  semesters: Array<{ year: number; sem: string }>;
  course_categories: Array<{ name: string; code: string }>;
  courses: Array<{ code: string; descriptive_title: string }>;
  curriculum_courses: Array<{
    course_code: string;
    category_code: string;
    semester_year: number;
    semester_name: string;
    units: number;
  }>;
  course_po_mappings: Array<{
    course_code: string;
    po_code: string;
    ird: string[];
  }>;
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
      const response = await api.get<{ data: ProgramProposalResponse[] }>(
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

  const getProgramProposal = (id: number) => ({
    queryKey: ["program-proposal", id],
    queryFn: async () => {
      const response = await api.get<{ data: ProgramProposalResponse }>(
        `department/program-proposals/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
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
  return {
    programProposals,
    isLoading,
    submitFullProgramProposal,
    error,
    getProgramProposal,
    createProgramProposal,
    updateProgramProposal,
    deleteProgramProposal,
  };
};

export default useProgramProposals;
