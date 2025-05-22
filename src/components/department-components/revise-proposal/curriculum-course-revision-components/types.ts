export interface CourseFormErrors {
  course_id: string;
  course_category_id: string;
  semester_id: string;
  unit: string;
}

export interface NewCourseFormData {
  course_id: string;
  course_category_id: string;
  category_code: string;
  semester_id: string;
  unit: string;
}

export interface NewManualCourseFormData {
  code: string;
  descriptive_title: string;
  course_category_id: string;
  category_code: string;
  semester_id: string;
  unit: string;
}

export interface EditCourseFormData {
  id: number | string;
  course_id: number;
  course_category_id: number | string;
  category_code: string;
  semester_id: number;
  unit: string;
}

export interface CourseCategory {
  id: number | string;
  name: string;
  code: string;
}

export interface CurriculumCourse {
  id: number | string;
  course_id: number;
  course_category_id: number | string;
  category_code: string;
  semester_id: number;
  unit: string;
  course_code?: string;
  course_title?: string;
}

export interface SemesterData {
  id: number;
  year: number;
  sem: string;
  display?: string;
}
