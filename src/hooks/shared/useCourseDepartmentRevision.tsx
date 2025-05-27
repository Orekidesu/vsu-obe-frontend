import { useQuery } from "@tanstack/react-query";
import { BothLevelRevisionData } from "@/types/model/BothLevelRevisions";
import { APIError } from "@/app/utils/errorHandler";
import useApi from "../useApi";
import { useAuth } from "@/hooks/useAuth";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

interface UseDeanRevisionOptions {
  enabled?: boolean;
  role?: "dean";
}

const useCourseDepartmentRevision = (
  proposalId: number | undefined,
  options: UseDeanRevisionOptions = {}
) => {
  const api = useApi();
  const { session } = useAuth();

  const role =
    options.role || ((session as Session)?.Role === "Dean" ? "dean" : "dean");

  const {
    data: revisionData,
    error,
    isLoading,
  } = useQuery<BothLevelRevisionData, APIError>({
    queryKey: ["programProposalRevisions", proposalId, role],
    queryFn: async () => {
      if (!proposalId) {
        throw new Error("Proposal ID is required");
      }
      const response = await api.get<BothLevelRevisionData>(
        `${role}/program-proposals/${proposalId}/revisions`
      );
      return response.data;
    },
    enabled: !!proposalId && options.enabled !== false,
  });

  return {
    revisionData,
    error,
    isLoading,
  };
};

export default useCourseDepartmentRevision;
