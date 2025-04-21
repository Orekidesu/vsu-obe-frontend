import { Course } from "@/types/model/Course";

/**
 * Filters programs that belong to a specific department
 * @param courses Array of programs to filter
 * @param departmentId The ID of the department to filter by
 * @returns Filtered array of programs
 */

export const filterCoursesByDepartment = (
  courses: Course[] = [],
  departmentId?: number | null
): Course[] => {
  if (!departmentId) return [];
  return courses.filter((course) => course?.department?.id === departmentId);
};
