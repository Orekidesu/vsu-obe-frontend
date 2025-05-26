import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CourseRevisionData } from "@/types/model/CommitteeRevision";
import { CourseOutcomeSubmissionPayload } from "@/store/revision/course-revision-store";
import { APIError } from "@/app/utils/errorHandler";
import useApi from "../useApi";
import { useAuth } from "@/hooks/useAuth";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

interface UseCommitteeRevisionOptions {
  enabled?: boolean;
  role?: "dean" | "faculty_member";
}

/**
 * Hook to fetch and submit curriculum course revisions
 * @param curriculumCourseId - The ID of the curriculum course
 * @param options - Additional options (enabled, role)
 * @returns Revision data, error, loading state, and submission mutation
 */
const useCommitteeRevision = (
  curriculumCourseId: number | undefined,
  options: UseCommitteeRevisionOptions = {}
) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const role =
    options.role ||
    ((session as Session)?.Role === "Faculty_Member" ? "faculty" : "dean");

  const endpoint = `${role}/curriculum-courses`;

  const getErrorMessage = (error: APIError, defaultMessage: string): string => {
    return error?.response?.data?.message || error?.message || defaultMessage;
  };

  // Query to fetch revision data
  const {
    data: revisionData,
    error,
    isLoading,
  } = useQuery<CourseRevisionData, APIError>({
    queryKey: ["curriculumCourseRevisions", curriculumCourseId, role],
    queryFn: async () => {
      if (!curriculumCourseId) {
        throw new Error("Curriculum Course ID is required");
      }
      const response = await api.get<CourseRevisionData>(
        `${endpoint}/${curriculumCourseId}/revisions`
      );
      return response.data;
    },
    enabled: !!curriculumCourseId && options.enabled !== false,
  });

  // Mutation to submit revisions
  const submitRevisions = useMutation<
    void,
    APIError,
    CourseOutcomeSubmissionPayload
  >({
    mutationFn: async (revisionData: CourseOutcomeSubmissionPayload) => {
      if (!curriculumCourseId) {
        throw new Error("Curriculum Course ID is required");
      }

      const response = await api.patch(
        `${endpoint}/${curriculumCourseId}/revise`,
        revisionData
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ["curriculumCourseRevisions", curriculumCourseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["curriculum-course", role, curriculumCourseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["curriculum-courses"],
      });
    },
    onError: (error) => {
      throw new Error(
        getErrorMessage(error, "Failed to submit course revisions")
      );
    },
  });

  return {
    revisionData,
    error,
    isLoading,
    submitRevisions,
  };
};

export default useCommitteeRevision;
