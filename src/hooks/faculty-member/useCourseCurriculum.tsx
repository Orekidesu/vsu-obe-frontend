import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CurriculumCourseResponse } from "@/types/model/CurriculumCourse";
import {
  CourseDetailsPayload,
  CourseDetailsResponse,
} from "@/app/utils/faculty/curriculumCourseDetailsPayload";
import { APIError } from "@/app/utils/errorHandler";
import useApi from "../useApi";

import { useAuth } from "@/hooks/useAuth";
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

interface UseCourseCurriculumOptions {
  onSuccess?: (data: CourseDetailsResponse) => void;
  onError?: (error: unknown) => void;
  includeOutcomes?: boolean;
  role?: "faculty" | "department" | "dean";
}

const useCurriculumCourses = (options?: UseCourseCurriculumOptions) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const includeOutcomes = options?.includeOutcomes || false;

  const role =
    options?.role ||
    ((session as Session)?.Role === "Faculty_Member"
      ? "faculty"
      : (session as Session)?.Role === "Department"
        ? "department"
        : "dean");

  // Base endpoint
  const endpoint = `${role}/curriculum-courses`;

  const getErrorMessage = (error: APIError, defaultMessage: string): string => {
    return error?.response?.data?.message || error?.message || defaultMessage;
  };

  // Fetch curriculum courses
  const {
    data: curriculumCourses,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["curriculum-courses", role, { includeOutcomes }],
    queryFn: async () => {
      const url = includeOutcomes
        ? `${endpoint}?include_outcomes=true`
        : endpoint;

      const response = await api.get<{ data: CurriculumCourseResponse[] }>(url);
      return response.data.data;
    },
  });

  // Get a single curriculum course by ID
  const getCurriculumCourse = (
    id: number,
    includeOutcomes: boolean = false
  ) => ({
    queryKey: ["curriculum-course", role, id, { includeOutcomes }],
    queryFn: async () => {
      const url = includeOutcomes
        ? `${endpoint}/${id}?include_outcomes=true`
        : `${endpoint}/${id}`;

      const response = await api.get<{ data: CurriculumCourseResponse }>(url);
      return response.data.data;
    },
    enabled: !!id,
  });

  const getCurriculumCourseFromCache = (id: number) => {
    return {
      queryKey: ["curriculum-courses", role, { includeOutcomes }],
      queryFn: async () => {
        const url = includeOutcomes
          ? `${endpoint}?include_outcomes=true`
          : endpoint;
        const response = await api.get<{ data: CurriculumCourseResponse[] }>(
          url
        );
        return response.data.data;
      },
      select: (data: CurriculumCourseResponse[] | undefined) =>
        data?.find((course) => course.id === id),
      enabled: !!id,
    };
  };

  // Submit full curriculum course details
  const submitFullCurriculumCourseDetails = useMutation<
    CourseDetailsResponse,
    APIError,
    CourseDetailsPayload
  >({
    mutationFn: async (courseDetails: CourseDetailsPayload) => {
      const response = await api.post<CourseDetailsResponse>(
        "faculty/curriculum-courses/submit",
        courseDetails
      );
      return response.data;
    },
    onSuccess: (responseData) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["curriculum-courses"], role });

      // Call the optional success callback if provided
      if (options?.onSuccess) {
        options.onSuccess(responseData);
      }
    },
    onError: (error) => {
      console.error("Error submitting course details:", error);

      // Call the optional error callback if provided
      if (options?.onError) {
        options.onError(error);
      } else {
        throw new Error(
          getErrorMessage(error, "Failed to submit course details")
        );
      }
    },
  });

  return {
    curriculumCourses,
    getCurriculumCourseFromCache,
    isLoading,
    error,
    getCurriculumCourse,
    submitFullCurriculumCourseDetails,
  };
};

export default useCurriculumCourses;
