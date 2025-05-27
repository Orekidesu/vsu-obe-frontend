// Types for department (program-level) revisions

import { RawCourseOutcome } from "../types";

export interface DepartmentRevision {
  id: number;
  section: string;
  details: string;
  created_at: string;
  version: number;
}

// Types for course revisions
export interface CourseRevision {
  id: number;
  section: string;
  details: string;
  created_at: string;
}

// Course data structure
export interface CourseData {
  id: number;
  curriculum: {
    id: number;
    name: string;
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
  units: string;
  is_in_revision: boolean;
  is_completed: boolean;
  course_outcomes?: RawCourseOutcome[]; // This could be defined in more detail if needed
}

// Course with revisions
export interface CourseWithRevisions {
  curriculum_course_id: number;
  course_code: string;
  course_title: string;
  revisions: CourseRevision[];
  courseData?: CourseData;
}

// Complete revision data structure
export interface RevisionData {
  program_proposal_id: number;
  version: number;
  department_revisions: DepartmentRevision[];
  committee_revisions: CourseWithRevisions[];
  message: string;
}
