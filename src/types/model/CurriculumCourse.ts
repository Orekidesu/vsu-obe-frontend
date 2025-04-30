import { Course } from "./Course";
import { CourseCategory } from "./CourseCategory";

interface Semester {
  id: number;
  year: number;
  sem: string;
}

interface Curriculum {
  id: number;
  name: string;
  program: string;
}

export interface CurriculumCourseResponse {
  id: number;
  course: Course;
  curriculum: Curriculum;
  course_category: CourseCategory;
  semester: Semester;
  units: number;
}
