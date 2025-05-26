import { useQuery } from "@tanstack/react-query";
import { CourseRevisionData } from "@/types/model/CommitteeRevision";
import { APIError } from "@/app/utils/errorHandler";
import useApi from "../useApi";
import { useAuth } from "@/hooks/useAuth";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

interface UseCourseRevisionOptions {
  enabled?: boolean;
  role?: "dean" | "faculty";
}

const useCourseRevision = (
  curriculumCourseId: number | undefined,
  options: UseCourseRevisionOptions = {}
) => {
  const api = useApi();
  const { session } = useAuth();

  const role =
    options.role ||
    ((session as Session)?.Role === "Faculty_Member" ? "faculty" : "dean");

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
        `${role}/curriculum-courses/${curriculumCourseId}/revisions`
      );
      return response.data;
    },
    enabled: !!curriculumCourseId && options.enabled !== false,
  });

  return {
    revisionData,
    error,
    isLoading,
  };
};

export default useCourseRevision;
