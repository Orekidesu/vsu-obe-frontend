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

// Course outcome structure for extended response
export interface CourseOutcome {
  id: number;
  name: string;
  statement: string;
  abcd: {
    audience: string;
    behavior: string;
    condition: string;
    degree: string;
  };
  cpa: "C" | "P" | "A";
  po_mappings: Array<{
    po_id: number;
    po_name?: string; // Add this missing property
    po_statement?: string;
    ied: string;
  }>;
  tla_tasks: Array<{
    id: number;
    at_code: string;
    at_name: string;
    at_tool: string;
    weight: string;
  }>;
  tla_assessment_method: {
    teaching_methods: string[];
    learning_resources: string[];
  };
}

export interface CurriculumCourseResponse {
  id: number;
  course: Course;
  curriculum: Curriculum;
  course_category: CourseCategory;
  semester: Semester;
  units: number | string;
  is_in_revision: boolean;
  is_completed: boolean;
  course_outcomes?: CourseOutcome[]; // Optional field that only appears with include_outcomes=true
}
