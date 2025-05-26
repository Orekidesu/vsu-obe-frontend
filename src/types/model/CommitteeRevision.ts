// Section types for course revisions
export type CourseRevisionSectionType =
  | "course_outcomes"
  | "abcd"
  | "cpa"
  | "po_mappings"
  | "tla_tasks"
  | "tla_assessment_method";

// Individual revision item
export interface CourseRevisionItem {
  id: number;
  section: CourseRevisionSectionType;
  details: string;
  created_at: string;
  version: number;
}

// Overall revision data structure
export interface CourseRevisionData {
  curriculum_course_id: number;
  version: number;
  revisions: CourseRevisionItem[];
  message: string;
}
