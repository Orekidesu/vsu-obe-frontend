import { useQuery } from "@tanstack/react-query";
import { CurriculumCourseResponse } from "@/types/model/CurriculumCourse";
import useApi from "../useApi";

const useCurriculumCourses = () => {
  const api = useApi();

  // /fetch course categories
  const {
    data: curriculumCourses,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["curriculum-courses"],
    queryFn: async () => {
      const response = await api.get<{ data: CurriculumCourseResponse[] }>(
        "faculty/curriculum-courses"
      );

      return response.data.data;
    },
  });

  return {
    curriculumCourses,
    error,
    isLoading,
  };
};

export default useCurriculumCourses;
