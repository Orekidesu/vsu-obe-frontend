export interface CourseDetailsFormat {
  id: number;
  curriculum: {
    id: number;
    name: string;
    program?: string;
  };
  course: {
    id: number;
    code: string;
    descriptive_title: string;
  };
  course_category: {
    id: number;
    name: string;
    code: string;
  };
  semester: {
    id: number;
    year: number;
    sem: string;
  };
  units: number | string;
  course_outcomes: Array<{
    id: number;
    name: string;
    statement: string;
  }>;
}
