import { useQuery } from "@tanstack/react-query";
import { CourseCategory } from "@/types/model/CourseCategory";
import useApi from "../useApi";

const useCourseCategories = () => {
  const api = useApi();

  // /fetch course categories
  const {
    data: courseCategories,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["course-categories"],
    queryFn: async () => {
      const response = await api.get<{ data: CourseCategory[] }>(
        "department/course-categories"
      );

      return response.data.data;
    },
  });

  return {
    courseCategories,
    error,
    isLoading,
  };
};

export default useCourseCategories;
