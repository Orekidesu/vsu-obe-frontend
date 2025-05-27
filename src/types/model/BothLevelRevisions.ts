// Import any necessary types

// Types for department (program-level) revisions
export interface DepartmentRevision {
  id: number;
  section: string;
  details: string;
  created_at: string;
  version: number;
}

// Types for individual course revisions
export interface CourseRevision {
  id: number;
  section: string;
  details: string;
  created_at: string;
}

// Course with revisions structure
export interface CourseWithRevisions {
  curriculum_course_id: number;
  course_code: string;
  course_title: string;
  revisions: CourseRevision[];
}

// Complete revision data structure that matches your provided JSON example
export interface BothLevelRevisionData {
  program_proposal_id: number;
  version: number;
  department_revisions: DepartmentRevision[];
  committee_revisions: CourseWithRevisions[];
  message: string;
}
