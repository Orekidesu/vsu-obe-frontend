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
  units: number;
  course_outcomes?: CourseOutcome[]; // Optional field that only appears with include_outcomes=true
}
