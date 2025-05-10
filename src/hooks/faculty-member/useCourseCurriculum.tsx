import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CurriculumCourseResponse } from "@/types/model/CurriculumCourse";
import {
  CourseDetailsPayload,
  CourseDetailsResponse,
} from "@/app/utils/faculty/curriculumCourseDetailsPayload";
import { APIError } from "@/app/utils/errorHandler";
import useApi from "../useApi";

interface UseCourseCurriculumOptions {
  onSuccess?: (data: CourseDetailsResponse) => void;
  onError?: (error: unknown) => void;
  includeOutcomes?: boolean;
}

const useCurriculumCourses = (options?: UseCourseCurriculumOptions) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const includeOutcomes = options?.includeOutcomes || false;

  const getErrorMessage = (error: APIError, defaultMessage: string): string => {
    return error?.response?.data?.message || error?.message || defaultMessage;
  };

  // Fetch curriculum courses
  const {
    data: curriculumCourses,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["curriculum-courses", { includeOutcomes }],
    queryFn: async () => {
      const url = includeOutcomes
        ? "faculty/curriculum-courses?include_outcomes=true"
        : "faculty/curriculum-courses";

      const response = await api.get<{ data: CurriculumCourseResponse[] }>(url);
      return response.data.data;
    },
  });

  // Get a single curriculum course by ID
  const getCurriculumCourse = (
    id: number,
    includeOutcomes: boolean = false
  ) => ({
    queryKey: ["curriculum-course", id, { includeOutcomes }],
    queryFn: async () => {
      const url = includeOutcomes
        ? `faculty/curriculum-courses/${id}?include_outcomes=true`
        : `faculty/curriculum-courses/${id}`;

      const response = await api.get<{ data: CurriculumCourseResponse }>(url);
      return response.data.data;
    },
    enabled: !!id,
  });

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
      queryClient.invalidateQueries({ queryKey: ["curriculum-courses"] });

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
    isLoading,
    error,
    getCurriculumCourse,
    submitFullCurriculumCourseDetails,
  };
};

export default useCurriculumCourses;
