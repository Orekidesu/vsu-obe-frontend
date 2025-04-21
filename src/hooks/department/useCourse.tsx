import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { APIError } from "@/app/utils/errorHandler";
import { Course } from "@/types/model/Course";
import useApi from "../useApi";

interface DeleteCourseContext {
  previousCourses?: Course[];
}

const useCourses = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  // fetch courses

  const {
    data: courses,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await api.get<{ data: Course[] }>("department/courses");

      return response.data.data;
    },
  });

  const getErrorMessage = (error: APIError, defaultMessage: string): string => {
    return error?.response?.data?.message || error?.message || defaultMessage;
  };

  // Create Course
  const createCourse = useMutation<void, APIError, Partial<Course>>({
    mutationFn: async (newCourse: Partial<Course>) => {
      const response = await api.post("department/courses", newCourse);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error, "Failed to create Course"));
    },
  });

  // Update Course
  const updateCourse = useMutation<
    void,
    APIError,
    { id: number; updatedData: Partial<Course> }
  >({
    mutationFn: async ({ id, updatedData }) => {
      const response = await api.put(`department/courses/${id}`, updatedData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error, "Failed to update course"));
    },
  });

  // Delete Course
  const deleteCourse = useMutation<void, APIError, number, DeleteCourseContext>(
    {
      mutationFn: async (id) => {
        await api.delete(`department/courses/${id}`);
      },
      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: ["courses"] });

        const previousCourses = queryClient.getQueryData<Course[]>(["courses"]);

        queryClient.setQueryData<Course[]>(["courses"], (old) =>
          old ? old.filter((course) => course.id !== id) : []
        );

        return { previousCourses };
      },
      onError: (error, id, context) => {
        if (context?.previousCourses) {
          queryClient.setQueryData(["courses"], context.previousCourses);
        }
        throw new Error(getErrorMessage(error, "Failed to delete course"));
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["courses"] });
      },
    }
  );

  return {
    courses,
    isLoading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
  };
};

export default useCourses;
