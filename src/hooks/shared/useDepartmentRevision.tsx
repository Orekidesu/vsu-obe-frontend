import { useQuery } from "@tanstack/react-query";
import { DepartmentRevisionData } from "@/types/model/DepartmentRevision";
import { APIError } from "@/app/utils/errorHandler";
import useApi from "../useApi";
import { useAuth } from "@/hooks/useAuth";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

interface UseDepartmentRevisionOptions {
  enabled?: boolean;
  role?: "dean" | "department";
}

const useDepartmentRevision = (
  proposalId: number | undefined,
  options: UseDepartmentRevisionOptions = {}
) => {
  const api = useApi();
  const { session } = useAuth();

  const role =
    options.role ||
    ((session as Session)?.Role === "Department" ? "department" : "dean");

  const {
    data: revisionData,
    error,
    isLoading,
  } = useQuery<DepartmentRevisionData, APIError>({
    queryKey: ["programProposalRevisions", proposalId, role],
    queryFn: async () => {
      if (!proposalId) {
        throw new Error("Proposal ID is required");
      }
      const response = await api.get<DepartmentRevisionData>(
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

export default useDepartmentRevision;
