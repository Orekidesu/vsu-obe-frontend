"use client";

import { useQuery } from "@tanstack/react-query";
import { CurriculumCoursePOResponse } from "@/types/model/CurriculumCoursePO";
// import { APIError } from "@/app/utils/errorHandler";
import useApi from "../useApi";

const useCoursePO = (curriculumCourseId?: number) => {
  const api = useApi();
  const {
    data: coursePOs,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["course-program-outcomes", curriculumCourseId],
    queryFn: async () => {
      if (!curriculumCourseId) {
        throw new Error("Curriculum course ID is required");
      }

      const response = await api.get<CurriculumCoursePOResponse>(
        `faculty/curriculum-courses/${curriculumCourseId}/program-outcomes`
      );

      return response.data;
    },
    enabled: !!curriculumCourseId, // Only run if curriculumCourseId is provided
  });

  return {
    coursePOs: coursePOs?.data || [],
    isLoading,
    error,
  };
};

export default useCoursePO;
